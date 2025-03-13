import { DEBUG_ENABLED, LANGUAGES_IDS } from "../settings";

export function addParamsToUrl(url: string, params: object) {
    return url + (url.indexOf('?') === -1 ? '?' : '%') + Object.keys(params).map(function (key) {
        return key + '=' + params[key];
    }).join('&');

}

export function createSeedName(seedbase: string) {
    return seedbase + ' seed ' + uuid();
}

/**
 * @TODO may be check if end side is uuuid
 * @param string
 * @returns 
 */
export function stringHasSeed(string: string): boolean {
    return string.includes(' seed ');
}

export function stringGetSeed(string: string): string {
    return string.split(' seed ')[1] || '';
}

export function createRandomStringWithLength(length: number) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}


export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function rand(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randArrayValue(values: any[], def = undefined): any {
    let filteredValues = values.filter(value => value !== undefined);
    if (filteredValues.length) {
        return filteredValues[rand(0, filteredValues.length - 1)];
    }
    return def;
}

export function randArrayValues(values: any[], number: number): any {
    let result = [];
    let value: any;
    for (let i = 1; i <= number; i++) {
        value = randArrayValue(values);
        if (result.indexOf(value) === -1) {
            result.push(value);
        }

    }
    return result.filter(val => val !== undefined);
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function isStringJson(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function isObjectI18n(object: object): boolean {
    let keys = Object.keys(object);
    if (!keys.length) {
        return false;
    }
    return keys.filter(id => LANGUAGES_IDS.includes(parseInt(id))).length === keys.length;
}

/**
 * Checks if object 1 data is same as object2 data on level 1 depth
 * 
 * @param object1 
 * @param object2 
 * @returns 
 */
export function isObjectDataContainedInObject(object1: object, object2): boolean {

    const compareObject = filterObjectFromObject(object1, object2);
    const compareObjectKeys = Object.keys(compareObject);
    return Object.keys(object1).filter((name: string) => {
        // skip ids
        if (name === 'id' || undefined === object1[name]) {
            return false;
        }
        if (!compareObjectKeys.includes(name)) {
            debug.warn('ob1 param not in ob2', name);
            return true;
        }

        if (JSON.stringify(sortIfPossible(object1[name])) !== JSON.stringify(sortIfPossible(compareObject[name]))) {
            return true;
        }
        return false;
    }).length === 0;

}

export function filterObjectFromObject(object1: object, object2): object {
    const objectKets = Object.keys(object1);
    const newObject = {};
    for (let name in object2) {
        if (objectKets.includes(name)) {
            newObject[name] = object2[name];
        }
    }
    return newObject;
}

export function sortIfPossible(varaible: any): any {
    if (Array.isArray(varaible)) {
        return varaible.sort();
    } else if (null !== varaible && typeof varaible === 'object') {
        return sortIfPossible(Object.keys(varaible)).reduce((obj, key) => {
            obj[key] = varaible[key];
            return obj;
        }, {});
    }
    return varaible;
}


export const debug = {
    log: function (...args) {
        if (DEBUG_ENABLED) {
            console.log(...args);
        }
    },
    warn: function (...args) {
        if (DEBUG_ENABLED) {
            console.warn(...args);
        }
    },
    error: function (...args) {
        if (DEBUG_ENABLED) {
            console.error(...args);
        }
    },
};