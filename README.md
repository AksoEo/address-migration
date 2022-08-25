# address migration tool
parses string addresses into a normalized format semi-automatically
using libpostal and deepparse

## Usage
input: a csv file like

```csv
id1, "Example Street 1, 12345 Place", FI
id2, "Example Street 2, 54321 Place", FR
id3, "Example Street 3, 12345 Place", DK
```

place this at `prep/input.csv`.

if available, also add a csv file like

```csv
id1, Example Street 1, Place, FI, 12345
id2, Example Street 2, Place, FR, 54321
id3, Example Street 3, Place, DK, 12345
```

and place it at `prep/addresses.csv`.
If this file does not exist, turn off useAddressParts in `prep/prep.js`.

To run prep.js:

```sh
# tested with: nodejs 18.7, python 3.10
# you will to have several gigabytes of RAM available!
cd prep
npm install
python -m venv venv
source venv/bin/activate # or activate.fish, etc.
pip install deepparse
env PYTHON=venv/bin/python node prep.js
```

This will create an `output.addrs` file with a JSON object on each line.
This file can be split at any line break.

This can then be loaded into the electron application, which will create
a sidecar file called `<filename>.addrs_res` with the user choices.

The electron application allows users to resolve conflicts between how the addresses were
interpreted by libpostal and deepparse.

To run the electron application, run `npm start` in the root of the repository.
To package it, run `npm run make`.
