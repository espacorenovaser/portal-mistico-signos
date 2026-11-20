import os
import json
from pypdf import PdfReader

sign_files = {
    'aries': 'aries-o-desbravador-do-zodiaco.pdf',
    'touro': 'touro-o-guardiao-da-estabilidade.pdf',
    'gemeos': 'gemeos-o-comunicador-do-zodiaco.pdf',
    'cancer': 'cancer-o-guardiao-das-emocoes.pdf',
    'leao': 'leao-o-rei-do-zodiaco.pdf',
    'virgem': 'virgem-o-guardiao-das-emocoes.pdf',
    'libra': 'libra-a-harmonia-e-o-equilibrio.pdf',
    'escorpiao': 'escorpiao-o-mago-do-zodiaco.pdf',
    'sagitario': 'sagitario-o-explorador-do-zodiaco.pdf',
    'capricornio': 'capricornio-o-construtor-do-zodiaco.pdf',
    'aquario': 'aquario-o-visionario-do-zodiaco.pdf',
    'peixes': 'peixes-o-mistico-do-zodiaco.pdf'
}

data = {}

for sign, filename in sign_files.items():
    if not os.path.exists(filename):
        continue
    reader = PdfReader(filename)
    full_text = ""
    for page in reader.pages:
        t = page.extract_text()
        if t:
            full_text += t + "\n"

    data[sign] = {
        "filename": filename,
        "total_pages": len(reader.pages),
        "raw_text": full_text
    }

with open('signs_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Extraídos {len(data)} signos com sucesso para signs_data.json!")
