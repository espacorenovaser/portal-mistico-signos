import json
import re

with open('signs_data.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Metadata for each sign
metadata = {
    'aries': {'name': 'Áries', 'dates': '21 de março a 19 de abril', 'element': 'Fogo', 'planet': 'Marte', 'symbol': '♈', 'color': 'from-red-500 to-orange-500'},
    'touro': {'name': 'Touro', 'dates': '20 de abril a 20 de maio', 'element': 'Terra', 'planet': 'Vênus', 'symbol': '♉', 'color': 'from-emerald-500 to-teal-600'},
    'gemeos': {'name': 'Gêmeos', 'dates': '21 de maio a 20 de junho', 'element': 'Ar', 'planet': 'Mercúrio', 'symbol': '♊', 'color': 'from-yellow-400 to-amber-500'},
    'cancer': {'name': 'Câncer', 'dates': '21 de junho a 22 de julho', 'element': 'Água', 'planet': 'Lua', 'symbol': '♋', 'color': 'from-blue-400 to-indigo-500'},
    'leao': {'name': 'Leão', 'dates': '23 de julho a 22 de agosto', 'element': 'Fogo', 'planet': 'Sol', 'symbol': '♌', 'color': 'from-amber-500 to-red-500'},
    'virgem': {'name': 'Virgem', 'dates': '23 de agosto a 22 de setembro', 'element': 'Terra', 'planet': 'Mercúrio', 'symbol': '♍', 'color': 'from-green-600 to-emerald-700'},
    'libra': {'name': 'Libra', 'dates': '23 de setembro a 22 de outubro', 'element': 'Ar', 'planet': 'Vênus', 'symbol': '♎', 'color': 'from-pink-400 to-rose-500'},
    'escorpiao': {'name': 'Escorpião', 'dates': '23 de outubro a 21 de novembro', 'element': 'Água', 'planet': 'Plutão / Marte', 'symbol': '♏', 'color': 'from-purple-700 to-indigo-900'},
    'sagitario': {'name': 'Sagitário', 'dates': '22 de novembro a 21 de dezembro', 'element': 'Fogo', 'planet': 'Júpiter', 'symbol': '♐', 'color': 'from-violet-500 to-purple-600'},
    'capricornio': {'name': 'Capricórnio', 'dates': '22 de dezembro a 19 de janeiro', 'element': 'Terra', 'planet': 'Saturno', 'symbol': '♑', 'color': 'from-stone-600 to-neutral-800'},
    'aquario': {'name': 'Aquário', 'dates': '20 de janeiro a 18 de fevereiro', 'element': 'Ar', 'planet': 'Urano', 'symbol': '♒', 'color': 'from-cyan-400 to-blue-600'},
    'peixes': {'name': 'Peixes', 'dates': '19 de fevereiro a 20 de março', 'element': 'Água', 'planet': 'Netuno', 'symbol': '♓', 'color': 'from-teal-400 to-blue-700'}
}

processed = {}
for sign, info in raw_data.items():
    text = info['raw_text']
    meta = metadata.get(sign, {})

    processed[sign] = {
        'id': sign,
        'name': meta.get('name', sign.capitalize()),
        'dates': meta.get('dates', ''),
        'element': meta.get('element', ''),
        'planet': meta.get('planet', ''),
        'symbol': meta.get('symbol', ''),
        'color': meta.get('color', 'from-purple-500 to-indigo-600'),
        'summary': text[:600].replace('\n', ' '),
        'full_text': text
    }

with open('signs_processed.json', 'w', encoding='utf-8') as f:
    json.dump(processed, f, ensure_ascii=False, indent=2)

print("signs_processed.json criado com sucesso!")
