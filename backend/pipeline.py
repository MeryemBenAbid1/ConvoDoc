import os
import re
import time
import win32com.client as win32

# --- WORD CONSTANTS ---
wdReadingOrderRtl = 1
wdReadingOrderLtr = 0
wdAlignParagraphRight = 2
wdAlignParagraphLeft = 0
wdAlignParagraphCenter = 1


def build_docx_pipeline(input_path: str, output_filename: str) -> str:
    """
    Uses Microsoft Word engine to convert PDF → DOCX
    Fixes Arabic RTL, alignment, and headers.
    Returns path to generated DOCX file.
    """

    # --- Paths ---
    os.makedirs("temp", exist_ok=True)
    output_path = os.path.abspath(os.path.join("temp", f"{output_filename}.docx"))
    pdf_path = os.path.abspath(input_path)

    word = None

    try:
        # --- Launch Word ---
        word = win32.Dispatch("Word.Application")
        word.Visible = False
        word.DisplayAlerts = False

        # --- Open PDF (Word converts internally) ---
        doc = word.Documents.Open(pdf_path, False, False, False)

        # Give Word time to fully convert
        time.sleep(5)

        arabic_pattern = re.compile(r'[\u0600-\u06FF]')

        count = doc.Paragraphs.Count

        for i in range(1, count + 1):
            try:
                para = doc.Paragraphs(i)
                text = para.Range.Text.strip()

                # Safety: skip empty / control paragraphs
                if not text:
                    continue

                if arabic_pattern.search(text):
                    para.Format.ReadingOrder = wdReadingOrderRtl

                    # Header detection
                    if len(text) < 60 and para.Range.Bold:
                        para.Format.Alignment = wdAlignParagraphCenter
                    else:
                        para.Format.Alignment = wdAlignParagraphRight
                else:
                    para.Format.ReadingOrder = wdReadingOrderLtr
                    para.Format.Alignment = wdAlignParagraphLeft

            except Exception:
                continue

        # --- Save as DOCX ---
        doc.SaveAs2(output_path, FileFormat=16)
        doc.Close()

        return output_path

    finally:
        if word:
            try:
                word.Quit()
            except:
                pass
