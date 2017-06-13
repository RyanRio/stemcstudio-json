(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global[''EIGHT''] = global[''EIGHT''] || {})));
}(this, (function (exports) { 'use strict';

/*
    http://www.JSON.org/json_parse.js
    2008-09-18

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    This file creates a json_parse function.

        json_parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = json_parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/
// This is a function that can parse a JSON text, producing a JavaScript
// data structure. It is a simple, recursive descent parser. It does not use
// eval or regular expressions, so it can be used as a model for implementing
// a JSON parser in other languages.
// We are defining the function inside of another function to avoid creating
// global variables.
/**
 * The index of the current character.
 */
var at;
/**
 * The current character.
 */
var ch;
/**
 * Lookup table
 */
var escapee = {
    '"': '"',
    '\\': '\\',
    '/': '/',
    b: '\b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t'
};
/**
 * Module-level variable whose sole purpose is to provide the text property for the error function.
 */
var text;
var error = function error(m) {
    // Call error when something is wrong.
    throw {
        name: 'SyntaxError',
        message: m,
        at: at,
        text: text
    };
};
/**
 * Returns the character at the current position and advances the current position.
 * @param c The character that is expected to be the current character. May be omitted.
 */
var next = function next(c) {
    // If a c parameter is provided, verify that it matches the current character.
    if (c && c !== ch) {
        error("Expected '" + c + "' instead of '" + ch + "'");
    }
    // Get the next character. When there are no more characters,
    // return the empty string.
    ch = text.charAt(at);
    at += 1;
};
var number = function number() {
    // Parse a number value.
    var n;
    var string = '';
    if (ch === '-') {
        string = '-';
        next('-');
    }
    while (ch >= '0' && ch <= '9') {
        string += ch;
        next();
    }
    if (ch === '.') {
        string += '.';
        while (next() && ch >= '0' && ch <= '9') {
            string += ch;
        }
    }
    if (ch === 'e' || ch === 'E') {
        string += ch;
        next();
        ch = ch;
        if (ch === '-' || ch === '+') {
            string += ch;
            next();
        }
        while (ch >= '0' && ch <= '9') {
            string += ch;
            next();
        }
    }
    n = +string;
    // return issue happening here
    if (isNaN(n)) {
        error("Bad number");
    }
    else {
        return n;
    }
};
var string = function () {
    // Parse a string value.
    var hex, i, string = '', uffff;
    // When parsing for string values, we must look for " and \ characters.
    if (ch === '"') {
        while (next()) {
            if (ch === '"') {
                next();
                return string;
            }
            else if (ch === '\\') {
                next();
                ch = ch;
                if (ch === 'u') {
                    uffff = 0;
                    for (i = 0; i < 4; i += 1) {
                        next();
                        hex = parseInt(ch, 16);
                        if (!isFinite(hex)) {
                            break;
                        }
                        uffff = uffff * 16 + hex;
                    }
                    string += String.fromCharCode(uffff);
                }
                else if (typeof escapee[ch] === 'string') {
                    string += escapee[ch];
                }
                else {
                    break;
                }
            }
            else {
                string += ch;
            }
        }
    }
    error("Bad string");
};
var white = function skipWhitespace() {
    // Skip whitespace.
    while (ch && ch <= ' ') {
        next();
    }
};
var word = function word() {
    // true, false, or null.
    switch (ch) {
        case 't':
            next('t');
            next('r');
            next('u');
            next('e');
            return true;
        case 'f':
            next('f');
            next('a');
            next('l');
            next('s');
            next('e');
            return false;
        case 'n':
            next('n');
            next('u');
            next('l');
            next('l');
            return null;
    }
    error("Unexpected '" + ch + "'");
};
// const value;  // Place holder for the value function.
var array = function () {
    // Parse an array value.
    var array = [];
    if (ch === '[') {
        next('[');
        ch = ch;
        white();
        if (ch === ']') {
            next(']');
            return array; // empty array
        }
        while (ch) {
            array.push(value());
            white();
            if (ch === ']') {
                next(']');
                return array;
            }
            next(',');
            white();
        }
    }
    error("Bad array");
};
var object = function () {
    // Parse an object value.
    var key, object = {};
    if (ch === '{') {
        next('{');
        ch = ch;
        white();
        if (ch === '}') {
            next('}');
            return object; // empty object
        }
        while (ch) {
            key = string();
            white();
            next(':');
            if (Object.hasOwnProperty.call(object, key)) {
                error('Duplicate key "' + key + '"');
            }
            object[key] = value();
            white();
            if (ch === '}') {
                next('}');
                return object;
            }
            next(',');
            white();
        }
    }
    error("Bad object");
};
var value = function value() {
    // Parse a JSON value. It could be an object, an array, a string, a number,
    // or a word.
    white();
    switch (ch) {
        case '{':
            return object();
        case '[':
            return array();
        case '"':
            return string();
        case '-':
            return number();
        default:
            return ch >= '0' && ch <= '9' ? number() : word();
    }
};
// Return the json_parse function. It will have access to all of the above
// functions and variables.
function parse(source, reviver) {
    var result;
    text = source;
    at = 0;
    ch = ' ';
    result = value();
    white();
    if (ch) {
        error("Syntax error");
    }
    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.
    return typeof reviver === 'function' ? function walk(holder, key) {
        var k, v, value = holder[key];
        if (value && typeof value === 'object') {
            for (k in value) {
                if (Object.hasOwnProperty.call(value, k)) {
                    v = walk(value, k);
                    if (v !== undefined) {
                        value[k] = v;
                    }
                    else {
                        delete value[k];
                    }
                }
            }
        }
        return reviver.call(holder, key, value);
    }({ '': result }, '') : result;
}

exports.parse = parse;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
