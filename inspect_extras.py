import os
from pypdf import PdfReader

extras = ['guia-de-compatilibidade.pdf', 'meu-mapa-de-afirmacoes-positivas.pdf', 'orientacoes-para-criacao-do-mapa.pdf']
for filename in extras:
    if os.path.exists(filename):
        reader = PdfReader(filename)
        print("="*60)
        print(f"EXTRA: {filename} ({len(reader.pages)} páginas)")
        print("="*60)
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                print(f"--- Pág {i+1} ---\n{text[:500]}\n")
