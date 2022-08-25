const path = require('node:path');
const childProcess = require('node:child_process');
const postal = require('node-postal');
const { parse: parseCsv } = require('csv/sync');
const fs = require('fs');

const useAddressParts = true;

class DeepParse {
    constructor() {
        const python = process.env.PYTHON;
        if (!python) {
            console.error('pass PYTHON=path/to/python into env');
            process.exit(-1);
        }

        this.process = childProcess.spawn(
            python,
            [path.join(__dirname, 'run.py')],
            {
                cwd: __dirname,
            },
        );
        this.idCounter = 0;
        this.idPromises = new Map();
        this.blocked = false;

        let readBuf = '';
        this.process.stdout.on('data', chunk => {
            const lines = chunk.toString('utf-8').split('\n');
            // first line is an incomplete tail
            lines[0] = readBuf + lines[0];
            // last line is an incomplete head
            readBuf = lines.pop();

            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    if (data === 'ready') {
                        console.log('deepparse ready :3');
                    } else {
                        const promise = this.idPromises.get(data.id);
                        if (!promise) throw new Error(`unknown id ${data.id}`);
                        promise.resolve(data.data);
                    }
                } catch (err) {
                    console.error('failed to parse a deepparse output line', err);
                }
            }
        });

        this.process.stderr.on('data', chunk => {
            console.log('[deepparse STDERR]', chunk.toString('utf-8'));
        });

        this.process.on('exit', () => {
            const err = new Error('deepparse process exited');
            for (const p of this.idPromises.values()) {
                p.reject(err);
            }
        });
    }
    nextId() {
        return (this.idCounter++).toString();
    }

    async waitForUnblock() {
        if (this.blocked) {
            console.log('deepparse STDIN is blocked! waiting for drain...');
            await new Promise(resolve => {
                this.process.stdin.once('drain', () => {
                    this.blocked = false;
                    resolve();
                });
            });
        }
    }

    async flush() {
        await this.waitForUnblock();
        this.blocked = !this.process.stdin.write('flush\n');
    }

    flushPending = 0;
    scheduledFlush = null;
    async scheduleFlush() {
        if (this.flushPending >= 128) {
            clearTimeout(this.scheduledFlush);
            await this.flush();
        }
        if (this.scheduledFlush) return;
        this.scheduledFlush = setTimeout(() => {
            this.scheduledFlush = null;
            this.flush();
        }, 50);
    }

    async parse(str) {
        await this.waitForUnblock();

        const id = this.nextId();
        const result = new Promise((resolve, reject) => {
            this.idPromises.set(id, { resolve, reject });
        });

        this.blocked = !this.process.stdin.write(`${id}:${str}\n`);
        this.flushPending++;
        await this.scheduleFlush();

        return await result;
    }

    async exit() {
        console.log('exiting deepparse…');
        await this.waitForUnblock();
        this.blocked = !this.process.stdin.write('exit\n');
    }
}

function stripRestoredStr(s) {
    return s.trim().replace(/^[,()\[\]\-]\s*|\s*[,()\[\]\-]+$/g, '');
}

function restoreLibPostalCapitalization(input, result) {
    const inputLower = input.toLowerCase();
    let index = 0;

    for (const item of result) {
        // find item in input string
        while (index < input.length) {
            if (inputLower[index] === item.value[0]) {
                const alphaOnly = inputLower.substr(index).replace(/[^\w]/g, '');
                const alphaOnlyValue = item.value.replace(/[^\w]/g, '');
                if (alphaOnly.startsWith(alphaOnlyValue)) {
                    // that's probably it
                    break;
                }
            }
            index++;
        }
        if (index === inputLower.length) {
            console.warn('could not restore libpostal capitalization properly for input ' + input);
            break;
        }

        item.index = index;
    }

    for (let i = 0; i < result.length; i++) {
        const item = result[i];
        const nextItem = result[i + 1];

        const endIndex = nextItem ? nextItem.index : input.length;
        item.srcValue = stripRestoredStr(input.substring(item.index, endIndex));
    }
}

function restoreDeepParseCapitalization(input, result) {
    const inputLower = input.toLowerCase();
    let index = 0;

    for (const item of result) {
        const [value] = item;

        // find item in input string
        while (index < input.length) {
            if (inputLower[index] === value[0]) {
                const alphaOnly = inputLower.substr(index).replace(/[^\w]/g, '');
                const alphaOnlyValue = value.replace(/[^\w]/g, '');
                if (alphaOnly.startsWith(alphaOnlyValue)) {
                    // that's probably it
                    break;
                }
            }
            index++;
        }
        if (index === inputLower.length) {
            console.warn('could not restore deepparse capitalization properly for input ' + input);
            break;
        }

        item.push(index);
    }

    for (let i = 0; i < result.length; i++) {
        const item = result[i];
        const nextItem = result[i + 1];

        const endIndex = nextItem ? nextItem[2] : input.length;
        item.push(stripRestoredStr(input.substring(item[2], endIndex)));
    }
}

const EMPTY = () => ({
    streetAddress: [[], []],
    postalCode: [[]],
    sortingCode: [[]],
    cityArea: [[]],
    city: [[]],
    countryArea: [[]],
});

const dp = new DeepParse();
async function parseAddress(id, country, str) {
    const postalResult = postal.parser.parse_address(str);
    const dpResult = await dp.parse(str);

    restoreLibPostalCapitalization(str, postalResult);
    restoreDeepParseCapitalization(str, dpResult);

    const a = EMPTY();
    for (const item of postalResult) {
        const { component } = item;
        const value = item.srcValue || item.value;

        switch (component) {
        case 'category':
        case 'near':
        case 'suburb':
        case 'country':
        case 'world_region':
            // ignore
            continue;
        case 'house':
            a.streetAddress[0].push(value);
            break;
        case 'house_number':
        case 'road':
        case 'unit':
        case 'level':
        case 'staircase':
        case 'entrance':
        case 'po_box':
            a.streetAddress[1].push(value);
            break;
        case 'postcode':
            a.postalCode[0].push(value);
            break;
        case 'city_district':
            a.cityArea[0].push(value);
            break;
        case 'city':
            a.city[0].push(value);
            break;
        case 'island':
        case 'state_district':
        case 'state':
        case 'country_region':
            a.countryArea[0].push(value);
            break;
        }
    }

    const b = EMPTY();
    const bConf = EMPTY();
    for (const k in bConf) bConf[k].splice(0); // we dont want the default arrays

    for (const [dpValue, [tag, prob], rIndex, rValue] of dpResult) {
        let id, index;
        switch (tag) {
        case 'StreetNumber':
        case 'StreetName':
        case 'Unit':
        case 'Orientation':
            id = 'streetAddress';
            index = 1;
            break;
        case 'Municipality':
            id = 'city';
            index = 0;
            break;
        case 'Province':
            id = 'countryArea';
            index = 0;
            break;
        case 'PostalCode':
            id = 'postalCode';
            index = 0;
            break;
        case 'GeneralDelivery':
            id = 'streetAddress';
            index = 0;
            break;
        }

        if (id) {
            b[id][index].push(rValue || dpValue);
            bConf[id].push(prob);
        }
    }

    for (const k in a) a[k] = a[k].map(i => i.join(' ')).filter(x => x).join(', ');
    for (const k in b) b[k] = b[k].map(i => i.join(' ')).filter(x => x).join(', ');
    for (const k in bConf) {
        if (bConf[k].length) {
            bConf[k] = bConf[k].reduce((a, b) => a + b, 0) / bConf[k].length;
        } else {
            bConf[k] = 0;
        }
    }
    b.confidence = bConf;

    return { id, full: str, country, a, b };
}

const inputItems = (() => {
    const data = parseCsv(fs.readFileSync('input.csv', 'utf-8'));
    return data.map(([id, str, country]) => ({ id, str, country }));
})();

const addressParts = useAddressParts ? (() => {
    const data = parseCsv(fs.readFileSync('addresses.csv', 'utf-8'));
    const index = {};
    for (const item of data) {
        index[item[0]] = {
            streetAddress: item[1],
            city: item[2],
            postalCode: item[4],
            sortingCode: '',
            cityArea: '',
            countryArea: '',
            country: item[3],
        };
    }
    return index;
})() : null;

async function main() {
    const outputFile = 'output.addrs';
    fs.writeFileSync(outputFile, '');
    const BATCH_SIZE = 128;
    for (let i = 0; i < inputItems.length; i += BATCH_SIZE) {
        console.log(`Processing ${i}/${inputItems.length}…`);
        const batchItems = [];
        for (let j = 0; j < BATCH_SIZE; j++) {
            const item = inputItems[i + j];
            if (!item) break;
            batchItems.push(parseAddress(item.id, item.country, item.str));
        }
        const batchResults = await Promise.all(batchItems);
        if (useAddressParts) {
            for (const item of batchResults) {
                item.chk = addressParts[item.id];
            }
        }
        fs.appendFileSync(outputFile, batchResults.map(item => JSON.stringify(item)).join('\n') + '\n');
    }
    console.log('Done!');
}
main().catch(err => {
    console.error(err);
}).finally(() => {
    dp.exit();
});
