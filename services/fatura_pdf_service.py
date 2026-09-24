from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def gerar_pdf_fatura(dados: dict):
    buffer = BytesIO()

    pdf = canvas.Canvas(
        buffer,
        pagesize=A4
    )

    largura, altura = A4

    y = altura - 60

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(
        50,
        y,
        "EV ChargeOps - Fatura de Recarga"
    )

    y -= 40

    usuario = dados["usuario"]
    periodo = dados["periodo"]

    pdf.setFont("Helvetica", 11)

    pdf.drawString(
        50,
        y,
        f"Usuario: {usuario['nome']}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Email: {usuario['email']}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Periodo: {periodo['inicio']} ate {periodo['fim']}"
    )

    y -= 35

    pdf.setFont("Helvetica-Bold", 12)

    pdf.drawString(
        50,
        y,
        f"Total de sessoes: {dados['total_sessoes']}"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Consumo total: {dados['consumo_total_kwh']} kWh"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Tarifa media: R$ {dados['tarifa_media']:.2f}/kWh"
    )

    y -= 20

    pdf.drawString(
        50,
        y,
        f"Valor total: R$ {dados['valor_total']:.2f}"
    )

    y -= 40

    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(
        50,
        y,
        "Detalhamento das recargas"
    )

    y -= 25

    pdf.setFont("Helvetica", 9)

    for sessao in dados["sessoes"]:

        texto = (
            f"Sessao {sessao['sessao_id']} | "
            f"{sessao['inicio']} | "
            f"{sessao['consumo_kwh']} kWh | "
            f"R$ {sessao['valor']:.2f}"
        )

        pdf.drawString(
            50,
            y,
            texto
        )

        y -= 18

        if y < 60:
            pdf.showPage()
            y = altura - 60
            pdf.setFont("Helvetica", 9)

    pdf.save()

    buffer.seek(0)

    return buffer