import json
from serpapi import GoogleSearch

params = {
  "api_key": "YOUR_API_KEY",
  "engine": "google",
  "q": "dji",
  "gl": "us",
  "hl": "en",
  "tbm": "shop"
}

search = GoogleSearch(params)
results = search.get_dict()

for inline_result in results['inline_shopping_results']:
    print(json.dumps(inline_result, indent=2, ensure_ascii=False))

for shopping_result in results['shopping_results']:
    print(json.dumps(shopping_result, indent=2, ensure_ascii=False))
