import os
from pypdf import PdfReader

pdf_files = [f for f in os.listdir('.') if f.endswith('.pdf')]
for pdf in sorted(pdf_files):
    print("="*60)
    print(f"E-BOOK: {pdf}")
    print("="*60)
    try:
        reader = PdfReader(pdf)
        print(f"Total de páginas: {len(reader.pages)}")
        text_sample = ""
        for i in range(min(3, len(reader.pages))):
            text_sample += f"--- Página {i+1} ---\n" + reader.pages[i].extract_text() + "\n"
        print(text_sample[:1000])
    except Exception as e:
        print(f"Erro ao ler {pdf}: {e}")
    print("\n")
