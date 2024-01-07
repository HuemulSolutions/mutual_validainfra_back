/* eslint max-len: ["error", { "code": 400 }] */
//version 1.0.1 2023-01-04 SRODRIGUEZ
import * as crypto from "crypto";
import { CloudProviderType, cloudProvider } from "../../global";
export const huemulTimestamp = (((new Date).getUTCHours() * 60 * 60) +
                                ((new Date).getUTCMinutes() * 60) +
                                ((new Date).getUTCSeconds())).toString() +
                              ("00" + (new Date).getUTCMilliseconds().toString()).slice(-3);

/** ************************************************************** */
/** ***********     I N T E R F A C E S      ******************* */
/** ************************************************************** */


/** ************************************************************** */
/** ***********     F U N C T I O N S      ******************* */
/** ************************************************************** */

export function getQueryByName(queryName: string, request: any): any {
  let headerToReturn: any;

  if (typeof request.query[queryName] === "string" ) {
    headerToReturn = request.query[queryName];
  } else if (Array.isArray(request.query[queryName])) {
    headerToReturn = request.query[queryName];
  } else if (request.query[queryName] !== undefined ) {
    headerToReturn = request.query[queryName];
  } else if (cloudProvider === CloudProviderType.azure && typeof request.query.get(queryName) === "string" ) {
    headerToReturn = request.query.get(queryName);
  } else if (cloudProvider === CloudProviderType.azure && Array.isArray(request.query.get(queryName))) {
    headerToReturn = request.query.get(queryName);
  } else if (cloudProvider === CloudProviderType.azure && request.query.get(queryName) !== undefined ) {
    headerToReturn = request.query.get(queryName);
  } else {
    headerToReturn = undefined;
  }
  return headerToReturn
}

export function getHeaderByName(headerName: string, request: any): any {
  let headerToReturn: any;

  if (typeof request.headers[headerName] === "string" ) {
    headerToReturn = request.headers[headerName];
  } else if (cloudProvider === CloudProviderType.azure && typeof request.headers.get(headerName) === "string" ) {
    headerToReturn = request.headers.get(headerName);
  } else if (Array.isArray(request.headers[headerName])) {
    headerToReturn = request.headers[headerName];
  } else if (cloudProvider === CloudProviderType.azure && Array.isArray(request.headers.get(headerName))) {
    headerToReturn = request.headers.get(headerName);
  } else if (request.headers[headerName] !== undefined ) {
    headerToReturn = request.headers[headerName];
  } else if (cloudProvider === CloudProviderType.azure && request.headers.get(headerName) !== undefined ) {
    headerToReturn = request.headers.get(headerName);
  } else {
    headerToReturn = undefined;
  }
  return headerToReturn
}

/**
 * convert first letter to upperCase
 * @param {unknown} s
 * @return {string}
 */
export const capitalize = (s: unknown): string => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 *
 * @param {string[]} dataError
 * @return {string}
 */
export function getMessageErrorDataValitation(dataError: string[]): string {
  return `data with errors (${dataError.length} errors): {${dataError.join(",")}}`;
}

/**
 * return "defaultValue" if "currentValue" is undefined or null, otherwise return currentValue
 * @param {unknown} currentValue current value
 * @param {unknown} defaultValue default value
 * @return {any}
 */
export function defaultValueIfEmpty(currentValue: unknown, defaultValue: unknown): any {
  return (currentValue === undefined || currentValue === null) ? defaultValue : currentValue;
}


/**
 * return true if value is undefined,  null or cero-length
 * @author Sebastián Rodríguez Robotham
 * @param {string | number | boolean | object | null | undefined} value
 * @return {boolean}
 */
export function isEmpty(value: string | number | boolean | null | undefined | unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  } else if (typeof value === "string") {
    return value === undefined || value.length === 0 || value.trim().length === 0;
  } else if (typeof value === "number") {
    return value === undefined || value.toString().length === 0;
  } else if (typeof value === "object") {
    return value === undefined;
  } else if (typeof value === "boolean") {
    return value === undefined;
  } else {
    return true;
  }
}

export function sqlInjectionValidation(value: string | number | boolean | null | undefined | unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  } else if (typeof value === "string") {
    //const sqlInjectionRegex = /(\b)(drop|select|truncate|delete|update|insert|create|alter|rename|replace|drop|delete|truncate|update|insert|create|alter|rename|replace)(\b)/gi;
    const words = true; //sqlInjectionRegex.test(value);
    const comilla = value.indexOf("'") === -1;

    return words && comilla;
  } else if (typeof value === "number") {
    return true;
  } else if (typeof value === "object") {
    return false;
  } else if (typeof value === "boolean") {
    return true;
  } else {
    return false;
  }
}

/**
 * return true if value is undefined,  null or cero-length
 * @author Sebastián Rodríguez Robotham
 * @param {string | number | boolean | object | null | undefined} value
 * @return {boolean}
 */
export function isEmptyForRequest(value: string | number | boolean | null | undefined | unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  } else if (typeof value === "string") {
    return value === undefined || value.toUpperCase() === "NULL" || value.toUpperCase() === "UNDEFINED" || value.length === 0 || value.trim().length === 0;
  } else if (typeof value === "number") {
    return value === undefined || value.toString().length === 0;
  } else if (typeof value === "object") {
    return value === undefined;
  } else if (typeof value === "boolean") {
    return value === undefined;
  } else {
    return true;
  }
}

/**
 * clone an object
 * @param {any} dataToClone
 * @return {any}
 */
export function deepClone(dataToClone: any): any {
  // console.log("data a clonar");
  // console.log(dataToClone);
  // console.log("data clonada");
  // console.log(JSON.parse(JSON.stringify(dataToClone)));
  return JSON.parse(JSON.stringify(dataToClone));
}


/**
 * return true if value is boolean
 * @author Sebastián Rodríguez Robotham
 * @param {string | number | boolean | object | null | undefined} value
 * @return {boolean}
 */
export function isBoolean(value: string | number | boolean | null | undefined | unknown): boolean {
  if (isEmpty(value)) {
    return false;
  } else if (typeof value === 'boolean') {
    return true;
  } else if (typeof value === 'string' && value.toLowerCase() === "true") {
    return true;
  } else if (typeof value === 'string' && value.toLowerCase() === "false") {
    return true;
  } else if (typeof value === 'number' && value === 0) {
    return true;
  } else if (typeof value === 'number' && value === 1) {
    return true;
  } else {
    return false;
  }
}

/**
 * return true if value is boolean
 * @author Sebastián Rodríguez Robotham
 * @param {string | number | boolean | object | null | undefined} value
 * @return {boolean}
 */
export function toBoolean(value: string | number | boolean | null | undefined | unknown): boolean | null {
  if (isEmpty(value)) {
    return null;
  } else if (typeof value === 'boolean') {
    return value;
  } else if (typeof value === 'string' && value.toLowerCase() === "true") {
    return true;
  } else if (typeof value === 'string' && value.toLowerCase() === "false") {
    return false;
  } else if (typeof value === 'number' && value === 0) {
    return false;
  } else if (typeof value === 'number' && value === 1) {
    return true;
  } else {
    return null;
  }
}

let __huemulAutoInc: number = Math.round(Math.random() * 9999);

/**
 *
 * @author Sebastián Rodríguez Robotham
 * @return {number}
 */
export function getHuemulAutoInc(): number {
  __huemulAutoInc += 1;

  if (__huemulAutoInc > 9999) {
    __huemulAutoInc = 0;
  }

  return __huemulAutoInc;
}

/**
 *
 * @author Sebastián Rodríguez Robotham
 * @return {string}
 */
export function newRandomId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {string} value
 * @return {string}
 */
export function createHash(value: string): string {
  return crypto.createHash("md5").update(value).digest("hex");
}

/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {string} password
 * @return {string}
 */
export function createEncryptedPassword(password: string): string {
  return crypto.createHash("sha512").update(password).digest("hex");
}

/**
 * return hour, minute, second
 * @param {Date} startDate start date
 * @param {Date} endDate end date
 * @return {any}
 */
export function getDuration(startDate: Date, endDate: Date): any {
  const timeDiffMilliSeconds = (endDate.getTime() - startDate.getTime()) / 1000;
  const dot = (10.20).toString()[2];

  //                      time            seconds  mim  hour
  const hour = Number((timeDiffMilliSeconds / 60 / 60).toString().split(dot)[0]);
  const timeLeft = timeDiffMilliSeconds - (hour * 60 * 60);
  const minute = Number((timeLeft / 60).toString().split(dot)[0]);
  const second = Number((timeLeft - (minute * 60)).toString().split(dot)[0]);

  return {hour: hour, minute: minute, second: second, totalSeconds: second + minute * 60 + hour * 60 * 60};
}


/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {Date} date
 * @return {string}
 */
export function getDateTimeNumber(date: Date): string {
  return date.getUTCFullYear() +
    ("0" + (date.getUTCMonth()+1).toString()).slice(-2) +
    ("0" + date.getUTCDate().toString()).slice(-2) +
    ("0" + date.getUTCHours().toString()).slice(-2) +
    ("0" + date.getUTCMinutes().toString()).slice(-2) +
    ("0" + date.getUTCSeconds().toString()).slice(-2) +
    ("000000" + date.getUTCMilliseconds().toString()).slice(-3) + "Z";
}

/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {Date} date
 * @return {string}
 */
export function getDateTimeText(date: Date, onlyDate: boolean = false): string {
  return date.getUTCFullYear().toString() +
        "-" + ("0" + (date.getUTCMonth()+1).toString()).slice(-2) +
        "-" + ("0" + date.getUTCDate().toString()).slice(-2) +
        (onlyDate ? "" : ("T" + ("0" + date.getUTCHours().toString()).slice(-2) +
        ":" + ("0" + date.getUTCMinutes().toString()).slice(-2) +
        ":" + ("0" + date.getUTCSeconds().toString()).slice(-2) +
        "." + ("0000000" + date.getUTCMilliseconds().toString()).slice(-3) + "Z"));
}


/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {Date} date
 * @return {string}
 */
export function getDateText(date: Date, toUTC: boolean): string {
  if (toUTC) {
    return date.getUTCFullYear().toString() +
    "-" + ("0" + (date.getUTCMonth()+1).toString()).slice(-2) +
    "-" + ("0" + date.getUTCDate().toString()).slice(-2);
  } else {
    return date.getFullYear().toString() +
    "-" + ("0" + (date.getMonth()+1).toString()).slice(-2) +
    "-" + ("0" + date.getDate().toString()).slice(-2);
  }
  
}

function formatearNumero(num: number): string {
  return num < 10 ? '0' + num : num.toString();
}

export function getTimeToText(date: Date, toUTC: boolean): string {
  if (toUTC) {
    const hora = formatearNumero(date.getUTCHours());
    const minutos = formatearNumero(date.getUTCMinutes());

    return `${hora}:${minutos}`;
  } else {
    const hora = formatearNumero(date.getHours());
    const minutos = formatearNumero(date.getMinutes());

    return `${hora}:${minutos}`;
  }
}

export function getMinutesFromTime(textTimeFrom: string, textTimeTo: string): number {
  // Divide los textos en horas y minutos
  const regexHora = /^(\d{2}):(\d{2})$/;

  if (!regexHora.test(textTimeFrom) || !regexHora.test(textTimeTo)) {
    // Verifica si los textos tienen el formato correcto
    return 0; // Opcional: puedes manejar el error de alguna otra manera
  }

  const [, hora1Str, minuto1Str] = regexHora.exec(textTimeFrom)!;
  const [, hora2Str, minuto2Str] = regexHora.exec(textTimeTo)!;

  const hora1Num = parseInt(hora1Str, 10);
  const minuto1Num = parseInt(minuto1Str, 10);
  const hora2Num = parseInt(hora2Str, 10);
  const minuto2Num = parseInt(minuto2Str, 10);

  // Calcula la diferencia en minutos
  const diferenciaEnMinutos = (hora2Num * 60 + minuto2Num) - (hora1Num * 60 + minuto1Num);

  return diferenciaEnMinutos;
}

/**
 * @author Sebastián Rodríguez Robotham
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {number} hour
 * @param {number} minute
 * @param {number} second
 * @return {string}
 */
export function dateTimeToText(year: number, month: number, day: number, hour: number, minute: number, second: number): string {
  return year.toString() +
        "-" + ("0" + (month).toString()).slice(-2) +
        "-" + ("0" + day.toString()).slice(-2) +
        "T" + ("0" + hour.toString()).slice(-2) +
        ":" + ("0" + minute.toString()).slice(-2) +
        ":" + ("0" + second.toString()).slice(-2) +
        "." + ("000").slice(-3) + "Z";
}

/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {string} date
 * @return {string}
 */
export function dateTimeToDateDayOne(date: string): string {
  const firstDate = new Date(date);

  return firstDate.getUTCFullYear().toString() +
        "-" + ("0" + (firstDate.getUTCMonth()+1).toString()).slice(-2) +
        "-01" +
        "T00" +
        ":00" +
        ":00" +
        ".000Z";
}

/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {string} date
 * @return {string}
 */
export function dateTimeToDate(date: string, onlyDate: boolean = false): string {
  const firstDate = new Date(date);

  return firstDate.getUTCFullYear().toString() +
        "-" + ("0" + (firstDate.getUTCMonth()+1).toString()).slice(-2) +
        "-" + ("0" + firstDate.getUTCDate().toString()).slice(-2) +
        onlyDate ? "" : ("T00" +
        ":00" +
        ":00" +
        ".000Z");
}



/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {string} value
 * @return {boolean}
 */
export function validateDateTimeFormat(value: string | unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}\s*(?:T\d{2}:\d{2}(?::\d{2}(?:.\d{1,}(?:[zZ]?))?)?)?$/;

  return dateRegex.test(value);
}

/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {string} value
 * @return {boolean}
 */
export function validateDateTimeValue(value: string | unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}

/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {string} value
 * @return {boolean}
 */
export function validateTimeFormat(value: string | unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }
  
  const dateRegex = /^\d{2}:\d{2}(?::\d{2}(?:.\d{1,}(?:[Zz]?))?)?$/;

  return dateRegex.test(value);
}

/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {string} dataBase64
 * @return {string[]}
 */
export function base64DecodeString(dataBase64: string): string {
  const buff = Buffer.from(dataBase64, "base64");
  const text = buff.toString("ascii");

  return text;
}

/**
 *
 * @author Sebastián Rodríguez Robotham
 * @param {string} dataBase64
 * @return {string[]}
 */
export function base64DecodeKeys(dataBase64: string): string[] {
  const splitToken = base64DecodeString(dataBase64).split(":");

  return splitToken;
}

/**
 *
 * @param {string} datatoEncode
 * @return {string}
 */
export function base64EncodeString(datatoEncode: string): string {
  const buff = Buffer.from(datatoEncode);
  const base64data = buff.toString("base64");

  return base64data;
}

// Cifrado
//const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
export function encrypt(text: string, key: string): string {
  //const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), Buffer.alloc(16, 0));
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  //const encrypted = cipher.update(text, "utf-8", "hex"); // + cipher.final("hex");
  return encrypted;
}

// Descifrado
export function decrypt(encryptedText: string, key: string): string {
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = decipher.update(encryptedText, "hex", "utf-8") + decipher.final("utf-8");
  //const decrypted = decipher.update(encryptedText, "hex", "utf-8") + decipher.final("utf-8");
  return decrypted;
}


/*
async function delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  }
*/
