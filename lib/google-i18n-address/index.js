function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var imports = {
  "ac-ad-ae-af-ag-ai-al-am-ao-aq-ar-as-at-au-aw-ax-az-ba-bb-bd-be-bf-bg-bh-bi-bj-bl-bm-bn-bo-bq": function acAdAeAfAgAiAlAmAoAqArAsAtAuAwAxAzBaBbBdBeBfBgBhBiBjBlBmBnBoBq() {
    return import('./ac-ad-ae-af-ag-ai-al-am-ao-aq-ar-as-at-au-aw-ax-az-ba-bb-bd-be-bf-bg-bh-bi-bj-bl-bm-bn-bo-bq-7431a904.js');
  },
  "br": function br() {
    return import('./br-98af5f59.js');
  },
  "bs-bt-bv-bw-by-bz-ca-cc-cd-cf-cg-ch-ci-ck": function bsBtBvBwByBzCaCcCdCfCgChCiCk() {
    return import('./bs-bt-bv-bw-by-bz-ca-cc-cd-cf-cg-ch-ci-ck-83f3e131.js');
  },
  "cl": function cl() {
    return import('./cl-f3218e3c.js');
  },
  "cm": function cm() {
    return import('./cm-4d8ba001.js');
  },
  "cn": function cn() {
    return import('./cn-0a88e509.js');
  },
  "co-cr-cu-cv-cw-cx-cy-cz-de-dj-dk-dm-do-dz-ec-ee-eg-eh-er": function coCrCuCvCwCxCyCzDeDjDkDmDoDzEcEeEgEhEr() {
    return import('./co-cr-cu-cv-cw-cx-cy-cz-de-dj-dk-dm-do-dz-ec-ee-eg-eh-er-b740b239.js');
  },
  "es-et-fi-fj-fk-fm-fo-fr-ga-gb-gd-ge-gf-gg-gh-gi-gl-gm-gn-gp-gq-gr-gs-gt-gu-gw-gy": function esEtFiFjFkFmFoFrGaGbGdGeGfGgGhGiGlGmGnGpGqGrGsGtGuGwGy() {
    return import('./es-et-fi-fj-fk-fm-fo-fr-ga-gb-gd-ge-gf-gg-gh-gi-gl-gm-gn-gp-gq-gr-gs-gt-gu-gw-gy-f1352b60.js');
  },
  "hk": function hk() {
    return import('./hk-a5051265.js');
  },
  "hm-hn-hr-ht-hu-id-ie-il-im-in-io-iq-ir-is": function hmHnHrHtHuIdIeIlImInIoIqIrIs() {
    return import('./hm-hn-hr-ht-hu-id-ie-il-im-in-io-iq-ir-is-05042b8c.js');
  },
  "it-je-jm-jo-jp-ke-kg-kh-ki-km-kn-kp": function itJeJmJoJpKeKgKhKiKmKnKp() {
    return import('./it-je-jm-jo-jp-ke-kg-kh-ki-km-kn-kp-f625fba2.js');
  },
  "kr": function kr() {
    return import('./kr-fa739c2f.js');
  },
  "kw-ky-kz-la-lb-lc-li-lk-lr-ls-lt-lu-lv-ly-ma-mc-md-me-mf-mg-mh-mk-ml-mm-mn-mo-mp-mq-mr-ms-mt-mu-mv-mw-mx-my-mz-na-nc-ne-nf-ng-ni-nl-no-np-nr-nu-nz-om-pa-pe-pf-pg": function kwKyKzLaLbLcLiLkLrLsLtLuLvLyMaMcMdMeMfMgMhMkMlMmMnMoMpMqMrMsMtMuMvMwMxMyMzNaNcNeNfNgNiNlNoNpNrNuNzOmPaPePfPg() {
    return import('./kw-ky-kz-la-lb-lc-li-lk-lr-ls-lt-lu-lv-ly-ma-mc-md-me-mf-mg-mh-mk-ml-mm-mn-mo-mp-mq-mr-ms-mt-mu-mv-mw-mx-my-mz-na-nc-ne-nf-ng-ni-nl-no-np-nr-nu-nz-om-pa-pe-pf-pg-ca8623fd.js');
  },
  "ph-pk-pl-pm-pn-pr-ps-pt-pw-py-qa-re-ro-rs": function phPkPlPmPnPrPsPtPwPyQaReRoRs() {
    return import('./ph-pk-pl-pm-pn-pr-ps-pt-pw-py-qa-re-ro-rs-4320c9e2.js');
  },
  "ru-rw-sa-sb-sc-sd-se-sg-sh-si-sj-sk-sl-sm-sn": function ruRwSaSbScSdSeSgShSiSjSkSlSmSn() {
    return import('./ru-rw-sa-sb-sc-sd-se-sg-sh-si-sj-sk-sl-sm-sn-9b6f5838.js');
  },
  "so-sr-ss-st-sv-sx-sy-sz-ta-tc-td-tf-tg-th-tj-tk-tl-tm-tn-to-tr-tt-tv": function soSrSsStSvSxSySzTaTcTdTfTgThTjTkTlTmTnToTrTtTv() {
    return import('./so-sr-ss-st-sv-sx-sy-sz-ta-tc-td-tf-tg-th-tj-tk-tl-tm-tn-to-tr-tt-tv-7e10ad76.js');
  },
  "tw": function tw() {
    return import('./tw-602642dd.js');
  },
  "tz-ua-ug-um-us-uy-uz-va-vc-ve-vg-vi": function tzUaUgUmUsUyUzVaVcVeVgVi() {
    return import('./tz-ua-ug-um-us-uy-uz-va-vc-ve-vg-vi-1e328534.js');
  },
  "vn-vu-wf-ws-xk-ye-yt-za-zm-zw-zz": function vnVuWfWsXkYeYtZaZmZwZz() {
    return import('./vn-vu-wf-ws-xk-ye-yt-za-zm-zw-zz-04d1a6ad.js');
  }
};
function dataIndex (code) {
  var _loop = function _loop(key) {
    if (key.split('-').includes(code)) return {
      v: function v() {
        return imports[key]().then(function (x) {
          return x["default"];
        });
      }
    };
  };

  for (var key in imports) {
    var _ret = _loop(key);

    if (_typeof(_ret) === "object") return _ret.v;
  }
}

const VALID_COUNTRY_CODE = /^\w{2,3}$/;

const cachedValidationDataSubsets = {};

async function loadValidationData(countryCode = 'all') {
  if (!countryCode.match(VALID_COUNTRY_CODE)) {
    throw new Error(`${countryCode} is not a valid country code`);
  }
  if (!dataIndex.allowsAll && countryCode === 'all') {
    throw new Error('loading all countries is not allowed');
  }
  countryCode = countryCode.toUpperCase();
  if (!(countryCode in cachedValidationDataSubsets)) {
    const dataPromise = dataIndex(countryCode.toLowerCase());
    if (!dataPromise) throw new Error('no such country ' + countryCode);
    const data = await dataPromise();
    cachedValidationDataSubsets[countryCode] = data;
  }
  return cachedValidationDataSubsets[countryCode];
}

const FIELD_MAPPING = {
  A: 'streetAddress',
  C: 'city',
  D: 'cityArea',
  N: 'name',
  O: 'companyName',
  S: 'countryArea',
  X: 'sortingCode',
  Z: 'postalCode'
};

const KNOWN_FIELDS = Object.values(FIELD_MAPPING).concat(['countryCode']);

class ValidationRules {
  constructor ({
    countryCode,
    countryName,
    addressFormat,
    addressLatinFormat,
    allowedFields,
    requiredFields,
    upperFields,
    countryAreaType,
    countryAreaChoices,
    cityType,
    cityChoices,
    cityAreaType,
    cityAreaChoices,
    postalCodeType,
    postalCodeMatchers,
    postalCodeExamples,
    postalCodePrefix,
  }) {
    this.countryCode = countryCode;
    this.countryName = countryName;
    this.addressFormat = addressFormat;
    this.addressLatinFormat = addressLatinFormat;
    this.allowedFields = allowedFields;
    this.requiredFields = requiredFields;
    this.upperFields = upperFields;
    this.countryAreaType = countryAreaType;
    this.countryAreaChoices = countryAreaChoices;
    this.cityType = cityType;
    this.cityChoices = cityChoices;
    this.cityAreaType = cityAreaType;
    this.cityAreaChoices = cityAreaChoices;
    this.postalCodeType = postalCodeType;
    this.postalCodeMatchers = postalCodeMatchers;
    this.postalCodeExamples = postalCodeExamples;
    this.postalCodePrefix = postalCodePrefix;
  }
}

// polyfill
function* zip(a, b) {
  a = a[Symbol.iterator]();
  b = b[Symbol.iterator]();
  while (true) {
    let nextA = a.next();
    let nextB = b.next();
    if (nextA.done || nextB.done) break;
    yield [nextA.value, nextB.value];
  }
}

function makeChoices(rules, translated = false) {
  let subKeys = rules.sub_keys;
  if (!subKeys) return [];
  const choices = [];
  subKeys = subKeys.split(/~/g);
  const subNames = rules.sub_names;
  if (subNames) {
    choices.push(...[...zip(subKeys, subNames.split(/~/g))].filter(([k, v]) => v));
  } else if (!translated) {
    choices.push(...subKeys.map(x => [x, x]));
  }

  if (!translated) {
    const subLNames = rules.sub_lnames;
    if (subLNames) {
      choices.push(...[...zip(subKeys, subLNames.split(/~/g))].filter(([k, v]) => v));
    }
    const subLFNames = rules.sub_lfnames;
    if (subLFNames) {
      choices.push(...[...zip(subKeys, subLFNames.split(/~/g))].filter(([k, v]) => v));
    }
  }
  return choices;
}

function compactChoices(choices) {
  const valueMap = {};
  for (const [key, value] of choices) {
    if (!(key in valueMap)) {
      valueMap[key] = new Set();
    }
    valueMap[key].add(value);
  }
  const output = [];
  for (const key of Object.keys(valueMap).sort()) {
    for (const value of [...valueMap[key]].sort()) {
      output.push([key, value]);
    }
  }
  return output;
}

function matchChoices(value, choices) {
  if (value) {
    value = value.trim().toLowerCase();
  }
  for (const [name, label] of choices) {
    if (name.toLowerCase() === value || label.toLowerCase() === value) return name;
  }
  return null;
}

async function loadCountryData(countryCode) {
  let database = await loadValidationData('zz');
  let countryData = database.ZZ;

  if (countryCode) {
    countryCode = countryCode.toUpperCase();
    if (countryCode.toLowerCase() === 'zz') {
      throw new Error(`${countryCode} is not a valid country code`);
    }
    database = await loadValidationData(countryCode.toLowerCase());
    countryData = Object.assign({}, countryData, database[countryCode]);
  }

  return [countryData, database];
}

function* reFindIter(regex, string) {
  let match;
  while ((match = string.match(regex))) {
    yield match;
    string = string.substr(match.index + match[0].length);
  }
}

async function getValidationRules(address) {
  const countryCode = (address.countryCode || '').toUpperCase();
  const [countryData, database] = await loadCountryData(countryCode);
  const countryName = countryData.name || '';
  const addressFormat = countryData.fmt;
  const addressLatinFormat = countryData.lfmt || addressFormat;
  const formatFields = reFindIter(/%([ACDNOSXZ])/, addressFormat);
  const allowedFields = [];
  for (const m of formatFields) {
    allowedFields.push(FIELD_MAPPING[m[1]]);
  }
  const requiredFields = [];
  for (const f of countryData.require) {
    requiredFields.push(FIELD_MAPPING[f]);
  }
  const upperFields = [];
  for (const f of countryData.upper) {
    upperFields.push(FIELD_MAPPING[f]);
  }
  let languages = [null];
  if ('languages' in countryData) {
    languages = countryData.languages.split(/~/g);
  }

  const postalCodeMatchers = [];
  if (requiredFields.includes('postalCode')) {
    if ('zip' in countryData) {
      postalCodeMatchers.push(new RegExp(`^${countryData.zip}$`));
    }
  }
  let postalCodeExamples = [];
  if ('zipex' in countryData) {
    postalCodeExamples = countryData.zipex.split(/,/g)
  }

  let countryAreaChoices = [];
  let cityChoices = [];
  let cityAreaChoices = [];
  const countryAreaType = countryData.state_name_type;
  const cityType = countryData.locality_name_type;
  const cityAreaType = countryData.sublocality_name_type;
  const postalCodeType = countryData.zip_name_type;
  const postalCodePrefix = countryData.postprefix || '';
  // second level of data is for administrative areas
  let countryArea = null;
  let city = null;
  let cityArea = null;
  if (countryCode in database) {
    if ('sub_keys' in countryData) {
      for (const language of languages) {
        const isDefaultLanguage = language == null || language == countryData.lang;
        let matchedCountryArea = null;
        let matchedCity = null;
        let localizedCountryData;
        if (isDefaultLanguage) {
          localizedCountryData = database[countryCode];
        } else {
          localizedCountryData = database[`${countryCode}--${language}`];
        }
        let localizedCountryAreaChoices = makeChoices(localizedCountryData)

        countryAreaChoices.push(...localizedCountryAreaChoices);
        let existingChoice = countryArea != null;
        matchedCountryArea = matchChoices(address.countryArea, localizedCountryAreaChoices);
        countryArea = matchedCountryArea;

        if (matchedCountryArea) {
          // third level of data is for cities
          let countryAreaData;
          if (isDefaultLanguage) {
            countryAreaData = database[`${countryCode}/${countryArea}`];
          } else {
            countryAreaData = database[`${countryCode}/${countryArea}--${language}`];
          }

          if (!existingChoice) {
            if ('zip' in countryAreaData) {
              postalCodeMatchers.push(new RegExp('^' + countryAreaData.zip));
            }
            if ('zipex' in countryAreaData) {
              postalCodeExamples = countryAreaData.zipex.split(/,/g);
            }
          }

          if ('sub_keys' in countryAreaData) {
            let localizedCityChoices = makeChoices(countryAreaData);
            cityChoices.push(...localizedCityChoices);
            existingChoice = !!city;
            matchedCity = city = matchChoices(address.city, localizedCityChoices);
          }

          if (matchedCity) {
            // fourth level of data is for dependent sublocalities
            let cityData;
            if (isDefaultLanguage) {
              cityData = database[`${countryCode}/${countryArea}/${city}`];
            } else {
              cityData = database[`${countryCode}/${countryArea}/${city}--${language}`];
            }
            if (!existingChoice) {
              if ('zip' in cityData) {
                postalCodeMatchers.push(new RegExp('^' + cityData.zip));
              }
              if ('zipex' in cityData) {
                postalCodeExamples = cityData.zipex.split(/,/g);
              }
            }

            if ('sub_keys' in cityData) {
              let localizedCityAreaChoices = makeChoices(cityData)
              cityAreaChoices.push(...localizedCityAreaChoices);
              existingChoice = !!cityArea;
              let matchedCityArea = cityArea = matchChoices(address.cityArea, localizedCityAreaChoices);

              if (matchedCityArea) {
                let cityAreaData;
                if (isDefaultLanguage) {
                  cityAreaData = database[`${countryCode}/${countryArea}/${city}/${cityArea}`];
                } else {
                  cityAreaData = database[`${countryCode}/${countryArea}/${city}/${cityArea}--${language}`];
                }

                if (!existingChoice) {
                  if ('zip' in cityAreaData) {
                    postalCodeMatchers.push(new RegExp('^' + cityAreaData.zip));
                  }
                  if ('zipex' in cityAreaData) {
                    postalCodeExamples = cityAreaData.zipex.split(/,/g);
                  }
                }
              }
            }
          }
        }
      }
    }

    countryAreaChoices = compactChoices(countryAreaChoices);
    cityChoices = compactChoices(cityChoices);
    cityAreaChoices = compactChoices(cityAreaChoices);
  }

  return new ValidationRules({
    countryCode, countryName, addressFormat, addressLatinFormat,
    allowedFields, requiredFields, upperFields, countryAreaType,
    countryAreaChoices, cityType, cityChoices, cityAreaType,
    cityAreaChoices, postalCodeType, postalCodeMatchers,
    postalCodeExamples, postalCodePrefix,
  });
}

class InvalidAddress extends Error {
  constructor (message, errors, error) {
    super(message);
    this.errors = errors;
    this._error = error;
  }
}

function normalizeField(name, rules, data, choices, errors, formatLocale) {
  let value = data[name];
  if (rules.upperFields.includes(name) && value) {
    value = data[name] = value.toLocaleUpperCase(formatLocale);
  }
  if (!rules.allowedFields.includes(name)) data[name] = '';
  else if (!value && rules.requiredFields.includes(name)) {
    errors[name] = 'required';
  } else if (choices.length) {
    if (value || rules.requiredFields.includes(name)) {
      value = matchChoices(value, choices);
      if (value) data[name] = value;
      else errors[name] = 'invalid';
    }
  }

  if (!value) data[name] = '';
}

async function normalizeAddress(address, formatLocale) {
  const errors = {};
  let rules;
  try {
    rules = await getValidationRules(address);
  } catch (error) {
    errors.countryCode = 'invalid';
    throw new InvalidAddress('Invalid address', errors, error);
  }

  const cleanedData = Object.assign({}, address);
  const countryCode = cleanedData.countryCode;
  if (!countryCode) {
    errors.countryCode = 'required';
  } else {
    cleanedData.countryCode = countryCode.toLocaleUpperCase(formatLocale);
  }

  normalizeField('countryArea', rules, cleanedData, rules.countryAreaChoices, errors, formatLocale);
  normalizeField('city', rules, cleanedData, rules.cityChoices, errors, formatLocale);
  normalizeField('cityArea', rules, cleanedData, rules.cityAreaChoices, errors, formatLocale);
  normalizeField('postalCode', rules, cleanedData, [], errors, formatLocale);
  const postalCode = cleanedData.postalCode || '';
  if (rules.postalCodeMatchers.length && postalCode) {
    for (const matcher of rules.postalCodeMatchers) {
      if (!postalCode.match(matcher)) {
        errors.postalCode = 'invalid';
        break;
      }
    }
  }
  normalizeField('streetAddress', rules, cleanedData, [], errors, formatLocale);
  normalizeField('sortingCode', rules, cleanedData, [], errors, formatLocale);
  if (Object.keys(errors).length) {
    throw new InvalidAddress('Invalid address', errors);
  }

  return cleanedData;
}

function formatAddressLine(lineFormat, address, rules, formatLocale) {
  const getField = name => {
    let value = address[name] || '';
    if (rules.upperFields.includes(name)) {
      value = value.toLocaleUpperCase(formatLocale);
    }
    return value;
  };

  const replacements = {};

  for (const code in FIELD_MAPPING) {
    const fieldName = FIELD_MAPPING[code];
    replacements[`%${code}`] = getField(fieldName);
  }

  let fields = lineFormat.split(/(%.)/g);
  let fieldsp = [];
  for (const f of fields) {
    let s = replacements[f];
    if (s === undefined) s = f;
    fieldsp.push(s);
  }
  return fieldsp.join('').trim();
}

async function getFieldOrder(address, latin = false) {
  /*
   Returns expected order of address form fields as a list of lists.
   Example for PL:
   >>> getFieldOrder({ countryCode: 'PL' })
   [['name'], ['company_name'], ['street_address'], ['postal_code', 'city']]
   */

  const rules = await getValidationRules(address);
  const addressFormat = latin ? rules.addressLatinFormat : rules.addressFormat;
  const addressLines = addressFormat.split(/%n/g);

  const replacements = {};

  for (const code in FIELD_MAPPING) {
    const fieldName = FIELD_MAPPING[code];
    replacements[`%${code}`] = fieldName;
  }

  const allLines = [];
  for (const line of addressLines) {
    const fields = line.split(/(%.)/g);
    let singleLine = [];
    for (const field of fields) {
      singleLine.push(replacements[field]);
    }
    singleLine = singleLine.filter(x => x);
    allLines.push(singleLine);
  }
  return allLines;
}

async function formatAddress(address, latin = false, formatLocale, countryOverride) {
  const rules = await getValidationRules(address);
  const addressFormat = latin ? rules.addressLatinFormat : rules.addressFormat;
  const addressLineFormats = addressFormat.split(/%n/g);
  const addressLines = [];
  for (const lf of addressLineFormats) {
    addressLines.push(formatAddressLine(lf, address, rules, formatLocale));
  }
  addressLines.push(countryOverride ? countryOverride.toLocaleUpperCase(formatLocale) : rules.countryName);
  return addressLines.filter(x => x).join('\n');
}

async function latinizeAddress(address, normalized = false) {
  if (!normalized) {
    address = await normalizeAddress(address);
  }

  const cleanedData = Object.assign({}, address);
  const countryCode = (address.countryCode || '').toUpperCase();
  const [_, database] = await loadCountryData(countryCode);

  if (countryCode) {
    const countryArea = address.countryArea;
    if (countryArea) {
      const key = `${countryCode}/${countryArea}`;
      const countryAreaData = database[key];
      if (countryAreaData) {
        cleanedData.countryArea = countryAreaData.lname || countryAreaData.name || countryArea;
        const city = address.city;
        const key = `${countryCode}/${countryArea}/${city}`;
        const cityData = database[key];
        if (cityData) {
          cleanedData.city = cityData.lname || cityData.name || city;
          const cityArea = address.cityArea;
          const key = `${countryCode}/${countryArea}/${city}/${cityArea}`;
          const cityAreaData = database[key];
          if (cityAreaData) {
            cleanedData.cityArea = cityAreaData.lname || cityAreaData.name || cityArea;
          }
        }
      }
    }
  }

  return cleanedData;
}

export {
  KNOWN_FIELDS,
  loadValidationData,
  ValidationRules,
  getValidationRules,
  InvalidAddress,
  normalizeAddress,
  getFieldOrder,
  formatAddress,
  latinizeAddress,
}
