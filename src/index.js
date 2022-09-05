import { html } from '../lib/preact/html.js';
import { createRef, render, Component } from '../lib/preact/preact.js';
import { useRef, useState } from '../lib/preact/hooks.js';
const { ipcRenderer } = require('electron');
import { DataFile } from './data.js';
import countryNamesEo from '../lib/country-names-eo.js';
import {
    normalizeAddress,
    formatAddress,
    getValidationRules,
} from '../lib/google-i18n-address/index.js';

const CONFIDENCE_THRESHOLD = 0.8;

const STRINGS = {
    remaining: n => `Restas ${n} adresoj nekonvertitaj`,
    skipped: n => `Preteriris ${n} adresojn`,
    converted: n => `Konvertis ${n} adresojn`,
    resultsTitle: 'Konvertita rezulto',
    hash: 'Haŝ-identigilo',
    skip: 'Preteriri',
    save: 'Konservi',
    inputFile: 'Dosiero kun originaj adresoj',
    openFile: 'Trovi…',
    outputFile: 'Dosiero kun rezultaj adresoj',
    jumpTo: 'Iri…',
    field: 'Kampo',
    fields: {
        streetAddress: 'Stratadreso',
        cityArea: 'Urboparto',
        city: 'Urbo',
        countryArea: 'Regiono',
        postalCode: 'Poŝtkodo',
        sortingCode: 'Ordigkodo',
        country: 'Lando',
    },
    formattedTitle: 'Formatita adreso',
    errors: {
        invalid: k => `${STRINGS.fields[k] || k} estas nevalida`,
        required: k => `${STRINGS.fields[k] || k} estas deviga`,
    },
    links: {
        title: 'Referencoj',
        osm: 'Serĉi per OSM',
        googleMaps: 'Serĉi per Google-Mapoj',
        wikiAddr: 'Vikipedio-artikolo pri adresaj formatoj (angla)',
        bitboostAddr: 'Artikolo pri UPU-adreso-formatado (angla)',
    },
};
const JUMP_KEYS = {
    '1': 'address.streetAddress',
    '2': 'address.cityArea',
    '3': 'address.city',
    '4': 'address.postalCode',
    '5': 'address.sortingCode',
    '6': 'address.countryArea',
};
const KEY_HINTS = {
    useA: ['⌃,', 'Kopii A'],
    useB: ['⌃.', 'Kopii B'],
    moveUp: ['↑', 'Supren'],
    moveDown: ['↓', 'Malsupren'],
    jumpTo: ['⌃', 'Ŝalti al…'],
    skip: ['⌃⌥→', 'Preteriri'],
    save: ['⌃⏎', 'Konservi'],
};
const KEY_HINT_SETS = {
    default: [
        'jumpTo',
        'skip',
        'save',
    ],
    addressFieldInput: [
        'useA', 'useB',
        'moveUp', 'moveDown',
        'jumpTo',
        'skip',
        'save',
    ],
};

const WIKIPEDIA_ADDR_FORMAT_LINKS = Object.fromEntries(Object.entries({
    ar: 'Argentina',
    au: 'Australia',
    at: 'Austria',
    bd: 'Bangladesh',
    by: 'Belarus',
    be: 'Belgium',
    br: 'Brazil',
    bg: 'Bulgaria',
    ca: 'Canada',
    cl: 'Chile',
    cn: 'China',
    co: 'Colombia',
    hr: 'Croatia',
    cz: 'Czech_Republic',
    dk: 'Denmark',
    ee: 'Estonia',
    fi: 'Finland',
    fr: 'France',
    de: 'Germany',
    gr: 'Greece',
    hk: 'Hong_Kong',
    hu: 'Hungary',
    is: 'Iceland',
    in: 'India',
    id: 'Indonesia',
    ir: 'Iran',
    iq: 'Iraq',
    ie: 'Ireland',
    il: 'Israel',
    it: 'Italy',
    jp: 'Japan',
    lv: 'Latvia',
    mo: 'Macao',
    my: 'Malaysia',
    mx: 'Mexico',
    nl: 'Netherlands',
    nz: 'New_Zealand',
    no: 'Norway',
    om: 'Oman',
    pk: 'Pakistan',
    pe: 'Peru',
    ph: 'Philippines',
    pl: 'Poland',
    pt: 'Portugal',
    qa: 'Qatar',
    ro: 'Romania',
    ru: 'Russia',
    sa: 'Saudi_Arabia',
    rs: 'Serbia',
    sg: 'Singapore',
    sk: 'Slovakia',
    si: 'Slovenia',
    kr: 'South_Korea',
    es: 'Spain',
    lk: 'Sri_Lanka',
    se: 'Sweden',
    ch: 'Switzerland',
    tw: 'Taiwan',
    th: 'Thailand',
    tr: 'Turkey',
    ua: 'Ukraine',
    ae: 'United_Arab_Emirates',
    gb: 'United_Kingdom',
    us: 'United_States',
    vn: 'Vietnam',
}).map(([k, v]) => [k, `https://en.wikipedia.org/wiki/Address#${v}`]));
const BITBOOST_ADDR_FORMAT_LINKS = Object.fromEntries(Object.entries({
    ar: 'argentina',
    au: 'australia',
    at: 'austria',
    be: 'belgium',
    br: 'brazil',
    ca: 'canada',
    cl: 'chile',
    cn: 'prc-china',
    cr: 'costa-rica',
    cz: 'czech-republic',
    dk: 'denmark',
    ee: 'estonia',
    fj: 'fiji',
    fi: 'finland',
    de: 'germany',
    gl: 'greenland',
    hk: 'hong_kong',
    is: 'iceland',
    in: 'india',
    id: 'indonesia',
    ie: 'ireland',
    il: 'israel',
    it: 'italy',
    jp: 'japan',
    lv: 'latvia',
    lu: 'luxembourg',
    my: 'malaysia',
    mx: 'mexico',
    nl: 'netherlands',
    nz: 'new_zealand',
    no: 'norway/norway.html',
    om: 'oman',
    pk: 'pakistan',
    pl: 'poland',
    pt: 'portugal',
    pr: 'puerto_rico',
    ro: 'romania',
    ru: 'russia',
    sg: 'singapore',
    za: 'south-africa',
    kr: 'south-korea',
    es: 'spain',
    se: 'sweden',
    ch: 'switzerland',
    tw: 'taiwan-republic-of-china-roc',
    ua: 'ukraine',
    gb: 'united-kingdom',
    us: 'united_states',
    uy: 'uruguay',
    ve: 'venezuela',
}).map(([k, v]) => [k, `https://www.bitboost.com/ref/international-address-formats/${v}`]));

function Confidence({ conf }) {
    if (conf === null) return null;
    const isUnderThreshold = conf < CONFIDENCE_THRESHOLD;

    return html`
        <span class="confidence-value ${isUnderThreshold ? 'is-under-threshold' : ''}">
            ${Math.round(conf * 100)}%
        </span>
    `;
}

function AddressFieldLine({ disabled, id, a, b, hasChk, chk, aConf, bConf, value, onChange, jumpName, valid, list }) {
    const inputRef = useRef();

    const onKeyDown = e => {
        if (!e.key) return;
        if (e.ctrlKey) {
            if (e.key === ',') {
                e.preventDefault();
                onChange(a);
            } else if (e.key === '.') {
                e.preventDefault();
                onChange(b);
            }
        } else if (e.key.startsWith('Arrow')) {
            const tr = e.target.parentNode?.parentNode;
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                let el = tr;
                while (el) {
                    el = el.previousElementSibling;
                    const input = el.querySelector('input');
                    if (input) {
                        input.focus();
                        break;
                    }
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                let el = tr;
                while (el) {
                    el = el.nextElementSibling;
                    const input = el.querySelector('input');
                    if (input) {
                        input.focus();
                        break;
                    }
                }
            }
        }
    };
    const onInput = e => {
        onChange(e.target.value);
    };

    let className = '';
    if (!disabled) {
        if ((!a || !b) && (a || b)) {
            className += ' is-missing-one';
        } else if (a !== b) {
            className += ' is-mismatched';
        }
    }
    if (!valid) className += ' invalid';
    if (disabled) className += ' is-disabled';
    if (value) className += ' has-value';

    return html`
        <tr class="address-field-line ${className}">
            <th class="field field-label">${STRINGS.fields[id]}</th>
            <td class="field field-input field-a">
                <div class="field-input-inner">
                    <span class="inner-copyable" onClick=${() => {
                        onChange(a);
                        inputRef.current?.focus();
                    }}>
                        ${a}
                    </span>
                    ${!!a && html`<${Confidence} conf=${aConf} />`}
                </div>
            </td>
            <td class="field field-input field-b">
                <div class="field-input-inner">
                    <span class="inner-copyable" onClick=${() => {
                        onChange(b);
                        inputRef.current?.focus();
                    }}>
                        ${b}
                    </span>
                    ${!!b && html`<${Confidence} conf=${bConf} />`}
                </div>
            </td>
            ${hasChk && html`<td class="field field-input field-c">
                <div class="field-input-inner">
                    <span class="inner-copyable" onClick=${() => {
                        onChange(chk);
                        inputRef.current?.focus();
                    }}>
                        ${chk}
                    </span>
                </div>
            </td>`}
            <td class="field field-value">
                ${(id === 'country' || disabled) ? html`
                    <span class="disabled-value">${value}</span>
                ` : html`
                    <input
                        ref=${inputRef}
                        list=${list}
                        value=${value || ''}
                        data-keybinds="addressFieldInput"
                        data-jump-name=${jumpName}
                        onKeyDown=${onKeyDown}
                        onInput=${onInput} />
                `}
            </td>
        </tr>
    `;
}

function ValidationResults({ validating, valid, formatted, error }) {
    let contents = null;
    if (validating) {
        contents = html`<span class="validation-loading"></span>`;
    } else if (valid) {
        contents = html`
            <div class="validation-formatted">
                <div class="formatted-title">
                    ${STRINGS.formattedTitle}
                </div>
                <div class="inner-address">
                    ${formatted.split('\n').map((x, i) => html`<div key=${i}>${x}</div>`)}
                </div>
            </div>
        `;
    } else if (valid === false) {
        const errors = [];
        if (error.errors) {
            for (const k in error.errors) {
                const type = error.errors[k];
                errors.push(html`<li key=${k}>${STRINGS.errors[type](k)}</li>`);
            }
        } else {
            errors.push(html`<li>${STRINGS.errors.unknown}</li>`);
        }

        contents = html`
            <ul class="validation-errors">
                ${errors}
            </ul>
        `;
    }

    return html`
        <div class="live-validation">
            ${contents}
        </div>
    `;
}

const ADDR_FIELDS = [
    'streetAddress',
    'cityArea',
    'city',
    'postalCode',
    'sortingCode',
    'countryArea',
];
class AddressEditor extends Component {
    state = {
        shownFields: ADDR_FIELDS,
        cityChoices: [],
        cityAreaChoices: [],
        countryAreaChoices: [],
        validating: false,
        valid: null,
        formatted: null,
        error: null,
    };
    node = createRef();
    cityChoicesId = 'cities-' + Math.random().toString(36);
    cityAreaChoicesId = 'city-areas-' + Math.random().toString(36);
    countryAreaChoicesId = 'country-areas-' + Math.random().toString(36);

    loadRules() {
        if (!this.props.input) {
            this.setState({ shownFields: ADDR_FIELDS });
            return;
        }
        getValidationRules({
            ...this.props.address,
            countryCode: this.props.input.country,
        }).then(result => {
            let shouldFilterFields = false;
            for (const k in this.props.address) {
                if (!result.allowedFields.includes(k)) {
                    shouldFilterFields = true;
                    break;
                }
            }
            if (shouldFilterFields) {
                const newAddress = {};
                for (const field of ADDR_FIELDS) {
                    if (!result.allowedFields.includes(field)) continue;
                    newAddress[field] = this.props.address[field];
                }
                this.props.onChange(newAddress);
            }

            this.setState({
                shownFields: result.allowedFields,
                cityChoices: [...new Set(result.cityChoices.flatMap(x => x))],
                cityAreaChoices: [...new Set(result.cityAreaChoices.flatMap(x => x))],
                countryAreaChoices: [...new Set(result.countryAreaChoices.flatMap(x => x))],
            });
        }).catch(() => {
            this.setState({ shownFields: ADDR_FIELDS });
        });
    }

    validationId = 0;
    validate() {
        const validationId = ++this.validationId;

        const address = {
            ...this.props.address,
            countryCode: this.props.input?.country,
        };

        normalizeAddress(address, 'eo-EO').then(result => {
            return formatAddress(result, 'eo-EO');
        }).then(result => {
            if (this.validationId !== validationId) return;
            this.setState({ validating: false, valid: true, formatted: result });
        }).catch(err => {
            if (this.validationId !== validationId) return;
            this.setState({ validating: false, valid: false, error: err });
        });
    }

    componentDidMount() {
        this.loadRules();
        this.validate();
    }

    componentDidUpdate(prevProps) {
        if (this.props.input !== prevProps.input) {
            this.loadRules();

            this.node.current?.querySelector('input')?.focus();
        }
        if (prevProps.address !== this.props.address) {
            this.loadRules();
            this.validate();
        }
    }

    render ({ input, address, onChange, onSave, onSkip }) {
        if (!input) return;

        const supplementalLinks = [
            {
                href: `https://www.openstreetmap.org/search?query=${encodeURIComponent(input.full.toLowerCase())}`,
                label: STRINGS.links.osm,
            },
            {
                href: `https://www.google.com/maps/search/${encodeURIComponent(input.full.toLowerCase())}`,
                label: STRINGS.links.googleMaps,
            },
        ];
        if (WIKIPEDIA_ADDR_FORMAT_LINKS[input.country]) {
            supplementalLinks.push({
                href: WIKIPEDIA_ADDR_FORMAT_LINKS[input.country],
                label: STRINGS.links.wikiAddr,
            });
        }
        if (BITBOOST_ADDR_FORMAT_LINKS[input.country]) {
            supplementalLinks.push({
                href: BITBOOST_ADDR_FORMAT_LINKS[input.country],
                label: STRINGS.links.bitboostAddr,
            });
        }

        const fields = [];
        for (const field of ADDR_FIELDS) {
            const valid = this.state.valid
                || !this.state.error?.errors
                || !(field in this.state.error.errors);

            let list = null;
            if (field === 'city') {
                list = this.cityChoicesId;
            } else if (field === 'cityArea') {
                list = this.cityAreaChoicesId;
            } else if (field === 'countryArea') {
                list = this.countryAreaChoicesId;
            }

            fields.push(html`
                <${AddressFieldLine}
                        key=${field}
                        disabled=${!this.state.shownFields.includes(field)}
                        jumpName=${`address.${field}`}
                        id=${field}
                        a=${input.a[field]}
                        b=${input.b[field]}
                        hasChk=${!!input.chk}
                        chk=${input.chk && input.chk[field]}
                        aConf=${input.a.confidence ? input.a.confidence[field] : null}
                        bConf=${input.b.confidence ? input.b.confidence[field] : null}
                        value=${address[field]}
                        list=${list}
                        valid=${valid}
                        onChange=${onChange && (value => {
                            onChange({
                                ...address,
                                [field]: value
                            });
                        })} />
            `);
        }

        const country = input.country.toLowerCase();

        return html`
            <div class="address-editor" ref=${this.node}>
                <div class="original-address">
                    ${input.full}
                </div>
                <table class="address-editor-table">
                    <thead>
                    <tr>
                        <td></td>
                        <th>A</th>
                        <th>B</th>
                        ${input.chk && html`<th>RO</th>`}
                        <th>${STRINGS.resultsTitle}</th>
                    </tr>
                    </thead>
                    <tbody>
                        ${fields}
                        <tr class="address-field-line">
                            <th class="field field-label">${STRINGS.fields.country}</th>
                            <td class="field">${countryNamesEo[country]}</td>
                            <td class="field">${countryNamesEo[country]}</td>
                            <td class="field">${input.chk && countryNamesEo[country]}</td>
                            <td class="field">
                                <span class="disabled-value">
                                    ${countryNamesEo[country]}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <${ValidationResults}
                    validating=${this.state.validating}
                    valid=${this.state.valid}
                    formatted=${this.state.formatted}
                    error=${this.state.error} />
                <datalist id=${this.cityChoicesId}>
                    ${this.state.cityChoices.map(item => html`<option key=${item} value=${item} />`)}
                </datalist>
                <datalist id=${this.cityAreaChoicesId}>
                    ${this.state.cityAreaChoices.map(item => html`<option key=${item} value=${item} />`)}
                </datalist>
                <datalist id=${this.countryAreaChoicesId}>
                    ${this.state.countryAreaChoices.map(item => html`<option key=${item} value=${item} />`)}
                </datalist>
                <div class="action-buttons">
                    <button id="skip-button" onClick=${onSkip}>${STRINGS.skip}</button>
                    <button id="save-button" disabled=${!this.state.valid} onClick=${onSave}>
                        ${STRINGS.save}
                    </button>
                </div>
                <div class="links-title">${STRINGS.links.title}</div>
                <ul class="supplemental-links">
                    ${supplementalLinks.map(({ href, label }, i) => html`
                        <li class="supp-link" key=${i}>
                            <a href=${href} target="_blank" rel="noopener noreferrer">${label}</a>
                        </li>
                    `)}
                </ul>
            </div>
        `;
    }
}

function FileLoader({ file, onFile }) {
    const loadFile = () => {
        const filePath = ipcRenderer.sendSync('load-file');
        if (!filePath) return;
        try {
            onFile(new DataFile(filePath));
        } catch (err) {
            alert('Could not read file\n\n' + err);
        }
    };

    return html`
        <div class="file-loader">
            ${STRINGS.inputFile}:
            <button onClick=${loadFile}>${STRINGS.openFile}</button>
            ${file?.filePath}
        </div>
    `;
}

class ProgressBar extends Component {
    canvas = createRef();

    componentDidMount() {
        this.renderCanvas();
    }

    renderCanvas() {
        const canvas = this.canvas.current;
        const dp = window.devicePixelRatio;
        canvas.width = canvas.offsetWidth * dp;
        canvas.height = canvas.offsetHeight * dp;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const PAD = 2 * dp;

        const file = this.props.file;
        if (!file) return;
        const cellWidth = (canvas.width - PAD * 2) / file.entries.length;
        let cursorIndex = null;
        for (let i = 0; i < file.entries.length; i++) {
            const id = file.entries[i].id;
            const result = file.resultEntries[id];
            if (result && result.skipped) {
                ctx.fillStyle = '#f93';
            } else if (result) {
                ctx.fillStyle = '#3d9';
            } else {
                ctx.fillStyle = '#aaa';
            }
            ctx.fillRect(PAD + cellWidth * i, PAD, cellWidth, canvas.height - PAD * 2);

            if (this.props.cursor === id) {
                cursorIndex = i;
            }
        }

        if (cursorIndex !== null) {
            ctx.lineWidth = PAD;
            ctx.strokeRect(PAD + cellWidth * cursorIndex, PAD, cellWidth, canvas.height - PAD * 2);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.file !== this.props.file || prevProps.cursor !== this.props.cursor) {
            this.renderCanvas();
        }
    }

    render() {
        return html`
            <canvas class="progress-bar" ref=${this.canvas}></canvas>
        `;
    }
}

function FileNavigation({ file, cursor, onSetCursor }) {
    const navigate = (delta) => {
        const entryIndex = file.entries.indexOf(file.entriesById[cursor]);
        if (entryIndex !== -1 && file.entries[entryIndex + delta]) {
            onSetCursor(file.entries[entryIndex + delta].id);
        }
    };
    const prevEntry = () => navigate(-1);
    const nextEntry = () => navigate(1);

    return html`
        <div class="file-navigation">
            <button onClick=${prevEntry}>←</button>
            <button onClick=${nextEntry}>→</button>
        </div>
    `;
}

class FileEditor extends Component {
    state = {
        addr: {},
        cursor: null,
    };

    componentDidMount() {
        this.loadAddr(this.props.file.findNextBlank());
    }

    loadAddr(cursor) {
        if (!cursor) {
            cursor = this.props.file.entries[0].id;
        }
        const entry = this.props.file.entriesById[cursor];
        const resultEntry = this.props.file.resultEntries[cursor];
        let addr;
        if (resultEntry) {
            if (!resultEntry.skipped) {
                addr = resultEntry.addr;
            }
        }

        if (!addr) {
            addr = {};
            for (const field of ADDR_FIELDS) {
                const a = entry.a[field];
                const b = entry.b[field];

                if (a === b) {
                    // both parsers in agreement
                    addr[field] = a;
                } else if (a && b && a !== b) {
                    // both parsers in disagreement
                    if (entry.chk) {
                        // check available
                        if (entry.chk[field] === a) addr[field] = a;
                        else if (entry.chk[field] === b) addr[field] = b;
                    }
                } else if (!a || !b) {
                    // only one parser has data
                    addr[field] = a || b;
                } else if (!a && !b && entry.chk) {
                    // only check available
                    addr[field] = entry.chk[field];
                }
            }
        }

        this.setState({
            cursor,
            addr,
        });
    }

    onSetCursor = cursor => this.loadAddr(cursor);
    onSetAddr = addr => this.setState({ addr });
    onSkip = () => {
        this.props.file.setSkipped(this.state.cursor);
        this.props.onSetFile(this.props.file.clone());
        this.loadAddr(this.props.file.findNextBlank());
    };
    onSave = () => {
        this.props.file.setResult(this.state.cursor, this.state.addr);
        this.props.onSetFile(this.props.file.clone());
        this.loadAddr(this.props.file.findNextBlank());
    };

    render ({ file }, { cursor, addr }) {
        let input = null;
        if (cursor) input = file.entriesById[cursor];

        return html`
            <div>
                <${ProgressBar} file=${file} cursor=${cursor} />
                <${FileNavigation} file=${file} cursor=${cursor} onSetCursor=${this.onSetCursor} />
                <${AddressEditor}
                    input=${input}
                    address=${addr}
                    onChange=${this.onSetAddr}
                    onSkip=${this.onSkip}
                    onSave=${this.onSave} />
            </div>
        `;
    }
}


let currentKeyHints = KEY_HINT_SETS.default;
const onKeyHintsUpdate = [];
class KeyHints extends Component {
    componentDidMount() {
        onKeyHintsUpdate.push(this);
    }
    componentWillUnmount() {
        onKeyHintsUpdate.splice(onKeyHintsUpdate.indexOf(this), 1);
    }
    onHintsUpdate = () => {
        this.forceUpdate();
    };

    render() {
        return html`
            <div class="key-hints">
                ${currentKeyHints.map((hint, i) => (
                    html`<div class="key-hint" key=${i}>
                        ${KEY_HINTS[hint][0].split('').map((char, i) => (
                            html`<kbd key=${i}>${char.toUpperCase()}</kbd>`
                        ))}
                        <span class="hint-label">${KEY_HINTS[hint][1]}</span>
                    </div>`
                ))}
            </div>
        `;
    }
}

window.addEventListener('focusin', e => {
    if (e.target.dataset.keybinds) {
        currentKeyHints = KEY_HINT_SETS[e.target.dataset.keybinds];
    } else {
        currentKeyHints = KEY_HINT_SETS.default;
    }
    for (const item of onKeyHintsUpdate) item.onHintsUpdate();
});
window.addEventListener('focusout', e => {
    currentKeyHints = KEY_HINT_SETS.default;
    for (const item of onKeyHintsUpdate) item.onHintsUpdate();
});

function Main() {
    const [file, setFile] = useState(null);

    return html`
        <div id="main">
            <div class="main-scroller">
                <${FileLoader} file=${file} onFile=${setFile} />
                ${file && html`<${FileEditor}
                    key=${file.filePath}
                    file=${file}
                    onSetFile=${setFile} />`}
            </div>
            <${KeyHints} />
        </div>
    `;
}
const container = document.createElement('div');
document.body.append(container);
render(html`<${Main} />`, container);

const jumpTargets = document.createElement('div');
jumpTargets.className = 'jump-targets-overlay';
document.body.append(jumpTargets);
let jumpTargetNodes = {};

const showJumpTargets = () => {
    jumpTargetNodes = {};
    for (const k in JUMP_KEYS) {
        const id = JUMP_KEYS[k];
        let node = document.querySelector(`[data-jump-name="${id}"]`);
        if (node) {
            const rect = node.getBoundingClientRect();
            const hint = document.createElement('div');
            hint.className = 'jump-hint';
            hint.textContent = k.toUpperCase();
            hint.style.left = rect.right + 'px';
            hint.style.top = (rect.top + rect.height / 2) + 'px';
            jumpTargets.append(hint);

            jumpTargetNodes[k] = {
                node,
                rect,
                hint,
            };
        }
    }
};
const hideJumpTargets = () => {
    jumpTargets.innerHTML = '';
};

window.addEventListener('keydown', e => {
    if (e.key === 'Control') {
        showJumpTargets();
    }
    if (e.ctrlKey && JUMP_KEYS[e.key]) {
        const target = document.querySelector(`[data-jump-name="${JUMP_KEYS[e.key]}"]`);
        if (target) {
            e.preventDefault();
            jumpTargetNodes[e.key].hint.classList.add('is-highlighted');

            if (target instanceof HTMLButtonElement) {
                target.click();
            } else {
                target.focus();
            }
        }
    }

    if (e.ctrlKey && e.altKey && e.key === 'ArrowRight') {
        document.querySelector('#skip-button')?.click();
    }
    if (e.ctrlKey && e.key === 'Enter') {
        document.querySelector('#save-button')?.click();
    }
});
window.addEventListener('keyup', e => {
    if (e.key === 'Control') {
        hideJumpTargets();
    }
    if (jumpTargetNodes[e.key]) {
        jumpTargetNodes[e.key].hint.classList.remove('is-highlighted');
    }
});
