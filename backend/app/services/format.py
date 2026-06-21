from app.services.converters import (
    conv_pandoc,
    conv_excel,
    conv_image,
    conv_svg,
    pdf_to_txt,
    conv_pdf_to_docx,
    pdf_to_csv,
)

SUPPORTED_CONVERSIONS = {
    "pdf→docx":  "PDF → Word",
    "pdf→txt":   "PDF → Texte",
    "pdf→csv":   "PDF → CSV",
    "docx→pdf":  "Word → PDF",
    "docx→txt":  "Word → Texte",
    "xlsx→csv":  "Excel → CSV",
    "xlsx→json": "Excel → JSON",
    "csv→xlsx":  "CSV → Excel",
    "csv→json":  "CSV → JSON",
    "json→csv":  "JSON → CSV",
    "png→jpg":   "PNG → JPG",
    "jpg→png":   "JPG → PNG",
    "jpeg→png":  "JPEG → PNG",
    "png→pdf":   "PNG → PDF",
    "jpg→pdf":   "JPG → PDF",
    "jpeg→pdf":  "JPEG → PDF",
    "svg→png":   "SVG → PNG",
    "svg→pdf":   "SVG → PDF",
}

_DISPATCH = {
    **{k: conv_pandoc for k in [
        "txt→pdf",  "txt→html", "txt→md",   "txt→docx",
        "md→html",  "md→txt",   "md→pdf",   "md→docx",
        "html→txt", "html→md",  "html→pdf",
        "docx→txt", "docx→html","docx→pdf", "docx→md",
        "pptx→pdf", "pptx→txt",
    ]},

    "pdf→txt": pdf_to_txt,
    "pdf→csv":  pdf_to_csv,
    "pdf→docx": conv_pdf_to_docx,

    **{k: conv_excel for k in [
    "csv→xlsx",
    "xlsx→csv",
    "csv→json",
    "json→csv",
    "csv→html",
    "json→html",
    "xlsx→html",
    "xlsx→json",
    "csv→txt",
    "csv→pdf",
    "json→txt",
    "xlsx→pdf",
]},
    **{k: conv_image for k in [
        "png→jpg", "jpg→png", "jpeg→png",
        "png→pdf", "jpg→pdf", "jpeg→pdf",
    ]},
    "svg→png": conv_svg,
    "svg→pdf": conv_svg,
}


def convert_file(
    input_path: str,
    output_path: str,
    src: str,
    tgt: str
) -> None:
    key = f"{src.lower().strip()}→{tgt.lower().strip()}"

    try:
        converter = _DISPATCH[key]
    except KeyError:
        raise ValueError(
            f"Konvèsyon '{key}' pa sipòte nan sistèm lan."
        )

    # Pase src/tgt pou conv_pandoc (ki bezwen yo pou detekte PDF engine)
    try:
        converter(input_path, output_path, src=src, tgt=tgt)
    except TypeError:
        # Lòt converters yo pa aksepte src/tgt → rele san paramèt sa yo
        converter(input_path, output_path)
