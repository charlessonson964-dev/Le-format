import subprocess
import pandas as pd
import csv
from PIL import Image
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF, renderPM
from pathlib import Path
from pdf2docx import Converter
import pdfplumber
import shutil
from pypdf import PdfReader

def _resolve_pandoc() -> str:
    """Jwenn chemen pandoc egzekutabl la, sinon ba yon erè klè."""
    pandoc_path = shutil.which("pandoc")
    if pandoc_path:
        return pandoc_path

    fallback = Path(r"C:\Users\true\AppData\Local\Pandoc\pandoc.exe")
    if fallback.exists():
        return str(fallback)

    raise RuntimeError(
        "Pandoc pa enstale. Enstale l nan https://pandoc.org/installing.html."
    )


def _resolve_pdflatex() -> str | None:
    """Jwenn pdflatex si li disponib (MiKTeX / TeX Live)."""
    return shutil.which("pdflatex")


def conv_pandoc(
    input_path: str,
    output_path: str,
    src: str = "",
    tgt: str = "",
) -> None:
    pandoc_path = _resolve_pandoc()
    tgt_ext = (tgt or Path(output_path).suffix).lower().lstrip(".")

    cmd = [pandoc_path, input_path, "-o", output_path]

    # Si se konvèsyon → PDF, mande pdflatex klèman epi valide l davans
    if tgt_ext == "pdf":
        pdflatex_path = _resolve_pdflatex()
        if not pdflatex_path:
            raise RuntimeError(
                "pdflatex pa jwenn sou sistèm nan. "
                "Enstale MiKTeX (https://miktex.org/download) oswa TeX Live, "
                "epi asire w 'pdflatex' disponib nan PATH. "
                "Apre sa, redemare backend la."
            )
        cmd[1:1] = ["--pdf-engine=pdflatex"]

    try:
        result = subprocess.run(
            cmd,
            check=True,
            timeout=60,
            capture_output=True,
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError("Pandoc pran twò lontan (>60s).")
    except subprocess.CalledProcessError as e:
        stderr = e.stderr.decode(errors="replace") if e.stderr else ""
        if "pdflatex" in stderr and "not found" in stderr:
            raise RuntimeError(
                "pdflatex pa jwenn pandan konvèsyon an. "
                "Enstale MiKTeX (https://miktex.org/download) epi redemare backend la. "
                f"Detay: {stderr.strip()}"
            )
        raise RuntimeError(stderr or "Pandoc echwe.")

def pdf_to_txt(src: str, dst: str) -> None:
    reader = PdfReader(src)
    text = "\n\n".join(page.extract_text() or "" for page in reader.pages)
    Path(dst).write_text(text, encoding="utf-8")

def conv_pdf_to_docx(input_path: str, output_path: str) -> None:
    cv = Converter(input_path)
    cv.convert(output_path)
    cv.close()


def conv_excel(input_path: str, output_path: str) -> None:
    src = Path(input_path).suffix.lower()
    dst = Path(output_path).suffix.lower()

    if src == ".csv":
        df = pd.read_csv(input_path)
    elif src == ".json":
        df = pd.read_json(input_path)
    elif src in (".xlsx", ".xls"):
        df = pd.read_excel(input_path)
    else:
        raise ValueError(f"Fòma sous '{src}' pa sipòte")

    if dst == ".csv":
        df.to_csv(output_path, index=False)
    elif dst == ".json":
        df.to_json(output_path, orient="records", indent=2, force_ascii=False)
    elif dst in (".xlsx", ".xls"):
        df.to_excel(output_path, index=False)
    else:
        raise ValueError(f"Fòma output '{dst}' pa sipòte")


def conv_image(input_path: str, output_path: str) -> None:
    dst = Path(output_path).suffix.lower()

    with Image.open(input_path) as img:

        if dst in (".jpg", ".jpeg"):
            img = img.convert("RGB")

        elif dst == ".png":
            img = img.convert("RGBA")

        img.save(output_path)


def pdf_to_csv(src: str, dst: str) -> None:
    rows = 0

    with open(dst, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)

        with pdfplumber.open(src) as pdf:
            for page in pdf.pages:

                tables = page.extract_tables()

                if tables:
                    for table in tables:
                        for row in table:
                            writer.writerow([cell or "" for cell in row])
                            rows += 1

                else:
                    text = page.extract_text()

                    if text:
                        for line in text.splitlines():
                            line = line.strip()
                            if line:
                                writer.writerow([line])
                                rows += 1

    if rows == 0:
        raise RuntimeError("Pa gen done ekstrè nan PDF la.")


def conv_svg(input_path: str, output_path: str) -> None:
    dst = Path(output_path).suffix.lower()

    drawing = svg2rlg(input_path)
    if not drawing:
        raise RuntimeError("SVG pa valid oswa vid")

    if dst == ".pdf":
        renderPDF.drawToFile(drawing, output_path)

    elif dst == ".png":
        renderPM.drawToFile(drawing, output_path, fmt="PNG")

    elif dst in (".jpg", ".jpeg"):
        temp_png = output_path + ".tmp.png"

        renderPM.drawToFile(drawing, temp_png, fmt="PNG")

        img = Image.open(temp_png).convert("RGB")
        img.save(output_path)

        Path(temp_png).unlink()

    else:
        raise ValueError(f"Format '{dst}' pa sipòte")