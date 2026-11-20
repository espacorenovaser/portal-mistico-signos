import json

with open('signs_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Vamos atualizar o app.js para injetar os textos reais extraídos dos e-books em vez de resumos genéricos.
print("Dados prontos para integração aprimorada.")
