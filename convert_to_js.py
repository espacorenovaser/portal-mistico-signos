import json

with open('signs_processed.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

js_content = f"window.SIGNS_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n"

with open('signs_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("signs_data.js criado com sucesso!")
