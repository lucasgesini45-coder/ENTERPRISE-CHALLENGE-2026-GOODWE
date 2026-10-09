import hashlib
import json
import math
import os
import tempfile
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import RelatorioSEMS
from schemas.goodwe import ImportacaoGoodWeLote
from services.goodwe_service import importar_sessao_goodwe, importar_sessoes_lote, importar_csv_goodwe
from services.sems_service import carregar_relatorio_sems

router = APIRouter(prefix="/goodwe", tags=["GoodWe"])
MAX_UPLOAD = 5 * 1024 * 1024


def uploaded_path(arquivo):
    temp = tempfile.NamedTemporaryFile(delete=False, suffix=".csv")
    try:
        total = 0
        digest = hashlib.sha256()
        while chunk := arquivo.file.read(65536):
            total += len(chunk)
            if total > MAX_UPLOAD:
                raise HTTPException(413, "CSV excede 5 MB")
            digest.update(chunk)
            temp.write(chunk)
        temp.close()
        return temp.name, digest.hexdigest()
    except BaseException:
        temp.close()
        os.unlink(temp.name)
        raise


@router.post("/importar-sessao")
def importar_sessao(serial_number: str, inicio: datetime, fim: datetime,
    consumo_kwh: float, tarifa: float = 0, usuario_id: int | None = None,
    db: Session = Depends(get_db)):
    return importar_sessao_goodwe(db, serial_number, inicio, fim, consumo_kwh, usuario_id, tarifa)


@router.post("/importar-lote")
def importar_lote(dados: ImportacaoGoodWeLote, db: Session = Depends(get_db)):
    return importar_sessoes_lote(db, dados.sessoes)


@router.post("/importar-csv")
def importar_csv(arquivo: UploadFile = File(...), tarifa: float = 0, db: Session = Depends(get_db)):
    if not math.isfinite(tarifa) or tarifa < 0:
        raise HTTPException(422, "Tarifa inválida")
    path, _ = uploaded_path(arquivo)
    try:
        return importar_csv_goodwe(db, path, tarifa)
    except (ValueError, UnicodeError) as exc:
        raise HTTPException(422, "CSV inválido") from exc
    finally:
        os.unlink(path)
        arquivo.file.close()


@router.post("/importar-relatorio")
def importar_relatorio(arquivo: UploadFile = File(...), db: Session = Depends(get_db)):
    path, digest = uploaded_path(arquivo)
    try:
        previous = db.query(RelatorioSEMS).filter_by(sha256=digest).first()
        if previous:
            return {"id": previous.id, "duplicado": True, "faturavel": False}
        data = carregar_relatorio_sems(path)
        registro = RelatorioSEMS(sha256=digest, recebido_em=datetime.now(timezone.utc).replace(tzinfo=None), dados=json.dumps(data, allow_nan=False))
        db.add(registro)
        db.commit()
        db.refresh(registro)
        return {"id": registro.id, "duplicado": False, "faturavel": False, "status_atual": "DESCONHECIDO", "dados": data}
    except (ValueError, UnicodeError, IndexError, KeyError) as exc:
        raise HTTPException(422, "Relatório SEMS inválido: " + str(exc)) from exc
    finally:
        os.unlink(path)
        arquivo.file.close()


@router.get("/relatorios")
def relatorios(db: Session = Depends(get_db)):
    return {"relatorios": [{"id": r.id, "recebido_em": r.recebido_em, "faturavel": False,
        "status_atual": "DESCONHECIDO", "dados": json.loads(r.dados)} for r in db.query(RelatorioSEMS).order_by(RelatorioSEMS.id.desc()).limit(100)]}
