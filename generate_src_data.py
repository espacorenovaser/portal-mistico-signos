import json

with open('signs_processed.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for sign in data:
    data[sign]['price'] = 'R$ 37,00'

js_content = f"export const SIGNS_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n"

with open('src/signs_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("src/signs_data.js gerado com sucesso!")
