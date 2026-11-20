import json
import re

with open('signs_processed.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for sign, info in data.items():
    text = info['full_text']

    # Remove watermarks and purchase hashes
    text = re.sub(r'@magadasescolhas', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Adquirido por:.*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'[a-zA-Z0-9_\-\.]{30,}', '', text) # remove long token hashes

    # Clean up excess whitespace
    text = re.sub(r'\n\s*\n', '\n\n', text).strip()

    info['full_text'] = text
    info['summary'] = text[:400].replace('\n', ' ')

with open('signs_processed.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Re-generate signs_data.js
js_content = f"window.SIGNS_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
with open('signs_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Dados limpos de marcas d'água com sucesso!")
