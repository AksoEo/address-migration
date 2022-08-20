import sys
import json
from deepparse.parser import AddressParser

address_parser = AddressParser(model_type="fasttext_attention", device=0, attention_mechanism=True, verbose=False, cache_dir="deepparse_cache")

print('"ready"', file=sys.stdout)
sys.stdout.flush()

batch = []
for line in sys.stdin:
    input_line = line.rstrip()
    if input_line == 'exit':
        break
    elif input_line == 'flush':
        if not len(batch):
            continue

        parsed = address_parser(list(map(lambda x:x["str"], batch)), with_prob=True, batch_size=128)

        if type(parsed) != list:
            parsed = [parsed]

        for i, item in enumerate(parsed):
            in_id = batch[i]["id"]
            result = {
                "id": in_id,
                "data": item.address_parsed_components,
            }
            json.dump(result, sys.stdout)
            print(file=sys.stdout)

        sys.stdout.flush()
        batch = []
    elif len(input_line):
        [in_id, in_str] = input_line.split(":", 1)
        batch.append({ "id": in_id, "str": in_str })
