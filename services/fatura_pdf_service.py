from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)


def gerar_pdf_fatura(dados: dict):
    buffer = BytesIO()

    documento = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    elementos = []

    styles = getSampleStyleSheet()

    titulo_style = ParagraphStyle(
        "TituloEV",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=20,
        spaceAfter=8
    )

    subtitulo_style = ParagraphStyle(
        "SubtituloEV",
        parent=styles["Normal"],
        alignment=TA_CENTER,
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=20
    )

    usuario = dados["usuario"]
    periodo = dados["periodo"]
    numero_fatura = dados["numero_fatura"]

    data_emissao = dados["data_emissao"].strftime(
    "%d/%m/%Y %H:%M:%S"
    )

    # ==========================
    # CABECALHO
    # ==========================

    elementos.append(
        Paragraph(
            "EV ChargeOps",
            titulo_style
        )
    )

    elementos.append(
        Paragraph(
            "Fatura de Recarga de Veiculo Eletrico",
            subtitulo_style
        )
    )

    elementos.append(Spacer(1, 10))

    # ==========================
    # DADOS DO USUARIO
    # ==========================

    dados_usuario = [
    ["Numero da Fatura", numero_fatura],
    ["Data de Emissao", data_emissao],
    ["Usuario", usuario["nome"]],
    ["Email", usuario["email"]],
    [
        "Periodo",
        f"{periodo['inicio']} ate {periodo['fim']}"
    ]
]

    tabela_usuario = Table(
        dados_usuario,
        colWidths=[100, 390]
    )

    tabela_usuario.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (0, -1),
                colors.HexColor("#EEEEEE")
            ),
            (
                "FONTNAME",
                (0, 0),
                (0, -1),
                "Helvetica-Bold"
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),
            (
                "PADDING",
                (0, 0),
                (-1, -1),
                8
            )
        ])
    )

    elementos.append(tabela_usuario)

    elementos.append(Spacer(1, 20))

    # ==========================
    # RESUMO
    # ==========================

    resumo = [
        [
            "Total de Sessoes",
            "Consumo Total",
            "Tarifa Media",
            "Valor Total"
        ],
        [
            str(dados["total_sessoes"]),
            f"{dados['consumo_total_kwh']} kWh",
            f"R$ {dados['tarifa_media']:.2f}/kWh",
            f"R$ {dados['valor_total']:.2f}"
        ]
    ]

    tabela_resumo = Table(
        resumo,
        colWidths=[122, 122, 122, 122]
    )

    tabela_resumo.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#202020")
            ),
            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),
            (
                "ALIGN",
                (0, 0),
                (-1, -1),
                "CENTER"
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),
            (
                "PADDING",
                (0, 0),
                (-1, -1),
                8
            )
        ])
    )

    elementos.append(tabela_resumo)

    elementos.append(Spacer(1, 30))

    # ==========================
    # DETALHAMENTO
    # ==========================

    elementos.append(
        Paragraph(
            "Detalhamento das Recargas",
            styles["Heading2"]
        )
    )

    elementos.append(Spacer(1, 10))

    dados_tabela = [
    [
        "Sessao",
        "Carregador",
        "Serial",
        "Inicio",
        "Consumo",
        "Valor"
    ]
]

    for sessao in dados["sessoes"]:
        inicio = (
            sessao["inicio"].strftime("%d/%m/%Y %H:%M")
            if sessao["inicio"]
            else "-"
        )

        fim = (
            sessao["fim"].strftime("%d/%m/%Y %H:%M")
            if sessao["fim"]
            else "-"
        )

        dados_tabela.append([
            sessao["sessao_id"],
            sessao["carregador_nome"],
            sessao["serial_number"] or "-",
            inicio,
            f"{sessao['consumo_kwh']} kWh",
            f"R$ {sessao['valor']:.2f}"
        ])

    tabela_sessoes = Table(
        dados_tabela,
        repeatRows=1,
        colWidths=[
            40,
            85,
            100,
            110,
            75,
            70
        ]
    )

    tabela_sessoes.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#333333")
            ),
            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),
            (
                "ALIGN",
                (0, 0),
                (-1, -1),
                "CENTER"
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.4,
                colors.grey
            ),
            (
                "ROWBACKGROUNDS",
                (0, 1),
                (-1, -1),
                [
                    colors.white,
                    colors.HexColor("#F5F5F5")
                ]
            ),
            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                8
            ),
            (
                "PADDING",
                (0, 0),
                (-1, -1),
                6
            )
        ])
    )

    elementos.append(tabela_sessoes)

    elementos.append(Spacer(1, 25))

    # ==========================
    # TOTAL FINAL
    # ==========================

    total_final = Table(
        [
            [
                "VALOR TOTAL A PAGAR",
                f"R$ {dados['valor_total']:.2f}"
            ]
        ],
        colWidths=[300, 188]
    )

    total_final.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, -1),
                colors.HexColor("#202020")
            ),
            (
                "TEXTCOLOR",
                (0, 0),
                (-1, -1),
                colors.white
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, -1),
                "Helvetica-Bold"
            ),
            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                12
            ),
            (
                "ALIGN",
                (1, 0),
                (1, 0),
                "RIGHT"
            ),
            (
                "PADDING",
                (0, 0),
                (-1, -1),
                10
            )
        ])
    )

    elementos.append(total_final)

    elementos.append(Spacer(1, 30))

    # ==========================
    # RODAPE
    # ==========================

    elementos.append(
        Paragraph(
            "Documento gerado automaticamente pelo EV ChargeOps.",
            subtitulo_style
        )
    )

    documento.build(elementos)

    buffer.seek(0)

    return buffer