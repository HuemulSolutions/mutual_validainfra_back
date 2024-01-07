/* eslint max-len: ["error", { "code": 400 }] */
//version 1.0.5 2023-09-19 SRODRIGUEZ - oculta errores de base de datos hacia el usuario final, el error lo agrega a extrainfo.
//version 1.0.4 2023-07-16 SRODRIGUEZ - agrega control de versiones para aplicaciones.
//version 1.0.3 2023-03-05 SRODRIGUEZ - agrega función para obtener orgId en no-logueados
//version 1.0.2 2023-01-13 SRODRIGUEZ -> crea método newTransactionIdshort
//version 1.0.1 2023-01-04 SRODRIGUEZ
import * as huemulFunctions from "./huemul-functions";
import {moduleType, appName, CloudProviderType, cloudProvider, appVersions} from "../../global";
import {IHuemulTrace} from "./interfaces/interface-huemul-trace-data-v1";
import {logger as loggerGoogle} from "../connections/connection-logging-google";
import {logger as loggerAzure} from "../connections/connection-logging-azure";
import { IHuemulAppVersion } from "./interfaces/interface-huemul-appversion-v1";
import * as fs from 'fs';
// import express = require("express");

export interface IHuemulLog {
  whoIAm: IHuemulWhoIAm
  whatIDid: IHuemulWhatIDid
  executionConditions: IHuemulExecConditions
  saveToDatabase: boolean
  // lastErrors: IHuemulError
}

/**
 * message structure to client response
 */
export interface IHuemulResponse {
  isSuccessful: boolean
  /**
   * status code: 200 OK, 500 error, etc
   */
  httpStatusCode: number

    /**
   * text to client
   */
  message: string,

  startDate: string,

  elapsedTimeMS: number,

  transactionId: string,

  /**
   * api response version
   */
  apiVersion: string,

  // error detail
  errors: [{errorId: number,
            errorTxt: string}],

  /**
   * data to be retorned to client
   */
  data: [Record<string, unknown>],
  /**
   * additional info
   */
  extraInfo: [Record<string, unknown>],

  appVersions: [IHuemulAppVersion]
}

interface IHuemulExecConditions {
  debugMode: boolean
}

interface IHuemulError {
  errorId: errorType,
  errorTxt: string
}


export interface IHuemulWhoIAm {
  apiVersion: string
  app: string
  module: moduleType
  layer: layerType
  action: string
  functionName: string
  userId: string
  userDisplayName: string
  userEmail?: string
  url: string
  httpMethod: string
  ip: string

  userRoles: Record<string, any>[]
  userGrants: any
  customClaims: any
  isAdmin: boolean
  isServiceAccount: boolean

  clientLanguage: string
  clientVersion: string
  clientApp: string
  clientInfo: string
  // platformInfo: string

  /**
   * unique Id for this transaction
   */
  transactionId: string

  /**
   * unique Id of then transaction that calls me
   */
  transactionIdOrigin: string

  orgId: string
}

export enum errorType {
  notError = 0,

  dbDuplicated = 1010,
  dbRecordNotFound = 1020,
  dbOther = 1999,
  dbDataValidation = 2020,

  appOthers = 2999,
  appForbidden = 2030,
  appUnauthorized = 2040,
  appDataValidation = 2050,

}

/*
export enum operationType {
  write = "write",
  read = "read",
  delete = "delete"
}
*/

export enum layerType {
  data = "data",
  logic = "logic",
  endPoint = "endPoint"
}

export enum resultType {
  success = "success",
  error = "error"
}

/**
 * Execution information (elapsed time, calls to db, etc)
 */
export interface IHuemulWhatIDid {


  /**
   * write, read or delete from operationType /only form data layer
   */
  // operation?: operationType | null

  /**
   * operation count to database
   */
  numRecordsRead: number
  numRecordsWrite: number
  numRecordsUpdate: number
  numRecordsDelete: number
  numSubProcess: number

  startDate: Date,
  endDate?: Date,
  elapsedTimeMS: number,

  startDateIsAuth?: Date,
  endDateIsAuth?: Date,
  elapsedTimeIsAuthMS?: number,

  stepName: string,

  result?: resultType,
  error: IHuemulError,
  extraInfo?: Record<string, unknown>

}

/**
 *
 * @param {HuemulLog} huemulLog
 * @param {Record<string, any>} data
 */
export function setGlobalCdcValuesBatch(huemulLog: HuemulLog, data: Record<string, any>): void {
  if (huemulLog.whoIAm.action === "c") {
    data.cdcCreateApiVersion = huemulLog.whoIAm.apiVersion;
    data.cdcCreateDt = huemulFunctions.getDateTimeText(new Date());
    data.cdcUpdateDt = data.cdcCreateDt;
    data.cdcCreateUser = huemulLog.whoIAm.userId;
    data.cdcState = 1;
    data.internalTaskKey = "";
  } else if (huemulLog.whoIAm.action === "u" || huemulLog.whoIAm.action === "i" || huemulLog.whoIAm.action === "re" ) {
    if (typeof (data.cdcCreateDt) === "object") {
      data.cdcCreateDt = huemulFunctions.getDateTimeText(data.cdcCreateDt);
    }

    data.cdcUpdateApiVersion = huemulLog.whoIAm.apiVersion;
    data.cdcUpdateDt = huemulFunctions.getDateTimeText(new Date());
    data.cdcUpdateUser = huemulLog.whoIAm.userId;
    data.internalTaskKey = data.internalTaskKey ?? "";
  }
}

/**
 * HuemulLog
 */
export class HuemulLog implements IHuemulLog {
  whoIAm: IHuemulWhoIAm;
  whatIDid: IHuemulWhatIDid;
  executionConditions: IHuemulExecConditions;
  saveToDatabase: boolean;
  data: any[];
  oldData: any[];

  // private orgId: string

  // subProcess: HuemulLog[]

  // private currentTransactionId: string
  // private startDate: Date

  /**
   *
   * @param {layerType} layer
   * @param {moduleType} module
   * @param {string} action
   * @param {string} functionName
   * @param {string} apiVersion
   */
  constructor(layer: layerType, module: moduleType, action: string, functionName: string, apiVersion: string ) {
    // this.startDate =
    // this.currentTransactionId = this.newTransactionId()

    this.whoIAm = {
      app: appName,
      layer: layer,
      module: module,
      action: action,
      functionName: functionName,
      apiVersion: apiVersion,
      userId: "",
      userDisplayName: "",
      transactionId: this.newTransactionId(),
      transactionIdOrigin: "",

      isAdmin: false,
      isServiceAccount: false,
      userRoles: [],
      userGrants: [],
      customClaims: [],

      ip: "",
      httpMethod: "",
      url: "",

      clientLanguage: "",
      clientVersion: "",
      clientApp: "",
      clientInfo: "",
      // platformInfo: "",
      orgId: "",
    };

    const localDate = new Date();
    this.consoleLog(`start Id ${this.whoIAm.transactionId} at ${localDate}`);

    this.whatIDid = {
      startDate: localDate,
      endDate: undefined,
      elapsedTimeMS: 0,
      stepName: "",

      // operation: null,
      numRecordsWrite: 0,
      numRecordsUpdate: 0,
      numRecordsDelete: 0,
      numRecordsRead: 0,
      numSubProcess: 0,
      result: undefined,
      error: {errorId: errorType.notError, errorTxt: ""},
      extraInfo: {},
    };

    this.executionConditions = {
      debugMode: false,
    };

    // this.subProcess = [];
    this.data =[];
    this.oldData= [];
    this.saveToDatabase = true;
  }

  /**
   *
   * @param {express.Request} request
   */
  setSenderInfo(request: any): void {
    const xForw = huemulFunctions.getHeaderByName("x-forwarded-for",request);
    this.whoIAm.url = request.originalUrl;
    this.whoIAm.httpMethod = request.method;
    this.whoIAm.ip = (typeof xForw === "string" ? xForw : undefined) ||
              (Array.isArray(xForw) ? xForw.map((x) => x).join(",") : undefined) ||
              request.ip ||
    //              request.connection?.remoteAddress ||
              request.socket?.remoteAddress || "";
    //              request.connection?.socket?.remoteAddress;
    this.whoIAm.userEmail = request.locals?.email;
    this.whoIAm.userDisplayName = request.locals?.userDisplayName;
    this.whoIAm.userId = request.locals?.userId === undefined ? "" : request.locals.userId;
    this.whoIAm.orgId = request.locals?.orgId; // get from connection.isAuthenticated

    this.whoIAm.isAdmin = request.locals?.isAdmin ?? false;
    this.whoIAm.isServiceAccount = request.locals?.isServiceAccount ?? false;
    this.whoIAm.customClaims = request.locals?.customClaims ?? {};
    this.whoIAm.userRoles = request.locals?.userRoles;
    this.whoIAm.userGrants = request.locals?.userGrants;

    this.whoIAm.clientLanguage = huemulFunctions.isEmpty(huemulFunctions.getHeaderByName("huemul-client-language",request)) ?
      "" : typeof huemulFunctions.getHeaderByName("huemul-client-language",request) == "string" ?
      huemulFunctions.getHeaderByName("huemul-client-language",request) : "";
    this.whoIAm.clientVersion = huemulFunctions.isEmpty(huemulFunctions.getHeaderByName("huemul-client-version",request)) ?
      "" : typeof huemulFunctions.getHeaderByName("huemul-client-version",request) == "string" ?
      huemulFunctions.getHeaderByName("huemul-client-version",request) : "";
    this.whoIAm.clientApp = huemulFunctions.isEmpty(huemulFunctions.getHeaderByName("huemul-client-app",request)) ?
      "" : typeof huemulFunctions.getHeaderByName("huemul-client-app",request) == "string" ?
      huemulFunctions.getHeaderByName("huemul-client-app",request) : "";
    this.whoIAm.clientInfo = huemulFunctions.isEmpty(huemulFunctions.getHeaderByName("huemul-client-info",request)) ?
      "" : typeof huemulFunctions.getHeaderByName("huemul-client-info",request) == "string" ?
      huemulFunctions.getHeaderByName("huemul-client-info",request) : "";
    // this.whoIAm.platformInfo = huemulFunctions.getHeaderByName("huemul-platform-info",request)

    this.whatIDid.startDateIsAuth = request.locals?.authStartDate;
    this.whatIDid.endDateIsAuth = request.locals?.authEndDate;

    if (this.whatIDid.startDateIsAuth !== undefined && this.whatIDid.endDateIsAuth !== undefined) {
      this.whatIDid.elapsedTimeIsAuthMS = this.whatIDid.endDateIsAuth.getTime() - this.whatIDid.startDateIsAuth.getTime();
    }

    this.getExecutionConditions(request.params);
  }

   /**
   *
   * @param {express.Request} request
   */
  setSenderInfoNotLogged(request: any) {
    const orgIdFromHeader = huemulFunctions.getHeaderByName("huemul-orgid",request);
    let orgId: string = typeof orgIdFromHeader === "string" ? orgIdFromHeader : "";
    if (!huemulFunctions.isEmpty(orgId)) {
      orgId = orgId.toUpperCase();
    } else {
      orgId = "error";
    }

    this.whoIAm.url = request.originalUrl;
    this.whoIAm.httpMethod = request.method;
    this.whoIAm.orgId = orgId;
    
    this.whoIAm.clientLanguage = huemulFunctions.isEmpty(huemulFunctions.getHeaderByName("huemul-client-language",request)) ?
      "" : typeof huemulFunctions.getHeaderByName("huemul-client-language",request) == "string" ?
      huemulFunctions.getHeaderByName("huemul-client-language",request) : "";
    this.whoIAm.clientVersion = huemulFunctions.isEmpty(huemulFunctions.getHeaderByName("huemul-client-version",request)) ?
      "" : typeof huemulFunctions.getHeaderByName("huemul-client-version",request) == "string" ?
      huemulFunctions.getHeaderByName("huemul-client-version",request) : "";
    this.whoIAm.clientApp = huemulFunctions.isEmpty(huemulFunctions.getHeaderByName("huemul-client-app",request)) ?
      "" : typeof huemulFunctions.getHeaderByName("huemul-client-app",request) == "string" ?
      huemulFunctions.getHeaderByName("huemul-client-app",request) : "";
    this.whoIAm.clientInfo = huemulFunctions.isEmpty(huemulFunctions.getHeaderByName("huemul-client-info",request)) ?
      "" : typeof huemulFunctions.getHeaderByName("huemul-client-info",request) == "string" ?
      huemulFunctions.getHeaderByName("huemul-client-info",request) : "";
    // this.whoIAm.platformInfo = huemulFunctions.getHeaderByName("huemul-platform-info",request)

    this.whatIDid.startDateIsAuth = request.locals?.authStartDate;
    this.whatIDid.endDateIsAuth = request.locals?.authEndDate;

    if (this.whatIDid.startDateIsAuth !== undefined && this.whatIDid.endDateIsAuth !== undefined) {
      this.whatIDid.elapsedTimeIsAuthMS = this.whatIDid.endDateIsAuth.getTime() - this.whatIDid.startDateIsAuth.getTime();
    }

    this.getExecutionConditions(request.params);
  }

  /**
   *
   * @return {string}
   */
  getOrgId(): string {
    return this.whoIAm.orgId ?? "";
  }

  /**
   *
   * @param {string} orgId
   */
  setOrgId(orgId: string): void {
    this.whoIAm.orgId = orgId;
  }

  /**
   *
   * @param {string} userId
   * @param {string} transactionIdOrigin
   * @param {string} orgId
   */
  setIdentifyInfoBasic(userId: string, transactionIdOrigin: string, userDisplayName: string, orgId: string): void {
    this.whoIAm.userId = userId;
    this.whoIAm.userDisplayName = userDisplayName;
    this.whoIAm.transactionIdOrigin = transactionIdOrigin;

    if (orgId !== undefined && orgId !== null) {
      this.whoIAm.orgId = orgId;
    }
  }

  /**
   *
   * @param {IHuemulWhoIAm} whoIAmParent
   */
  setIdentifyInfoFromParent(whoIAmParent: IHuemulWhoIAm): void {
    this.whoIAm.userId = whoIAmParent.userId;
    this.whoIAm.userDisplayName = whoIAmParent.userDisplayName;
    this.whoIAm.transactionIdOrigin = whoIAmParent.transactionId;
    this.whoIAm.orgId = whoIAmParent.orgId;
    this.whoIAm.clientLanguage = whoIAmParent.clientLanguage;
    this.whoIAm.clientApp = whoIAmParent.clientApp;
    this.whoIAm.clientInfo = whoIAmParent.clientInfo;
    // this.whoIAm.platformInfo = whoIAmParent.platformInfo
    this.whoIAm.clientVersion = whoIAmParent.clientVersion;
    this.whoIAm.ip = whoIAmParent.ip;

    this.whoIAm.isAdmin = whoIAmParent.isAdmin;
    this.whoIAm.isServiceAccount = whoIAmParent.isServiceAccount;
    this.whoIAm.userRoles = whoIAmParent.userRoles;
    this.whoIAm.userGrants = whoIAmParent.userGrants;
  }

  /**
   *
   * @param {string} stepName
   * @return {void}
   */
  setStepName(stepName: string): void {
    // console.log(stepName)
    this.whatIDid.stepName = stepName;
  }

  /**
   *
   * @return {string}
   */
  newTransactionIdShort(): string {
    return "xxxxxxxx-xxxx-9xxx-yxxx".replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    // todo: add an additional count every time it passes to a new function, for example
    // in  "new step", or add new method to indicate a functions receive it as param
    const localDate = new Date();
    const randonNum: string = Math.round((Math.random() * 99999)).toString();
    const newId: string = huemulFunctions.getDateTimeNumber(localDate) +
        "_" +
        huemulFunctions.huemulTimestamp +
        "_" +
        ("00" + huemulFunctions.getHuemulAutoInc().toString()).slice(-4) +
        "_" +
        ("00" + randonNum).slice(-5);
    return newId;
  }

  /**
   *
   * @return {string}
   */
  newTransactionId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    // todo: add an additional count every time it passes to a new function, for example
    // in  "new step", or add new method to indicate a functions receive it as param
    const localDate = new Date();
    const randonNum: string = Math.round((Math.random() * 99999)).toString();
    const newId: string = huemulFunctions.getDateTimeNumber(localDate) +
        "_" +
        huemulFunctions.huemulTimestamp +
        "_" +
        ("00" + huemulFunctions.getHuemulAutoInc().toString()).slice(-4) +
        "_" +
        ("00" + randonNum).slice(-5);
    return newId;
  }

  /**
   *
   * @param {HuemulLog} subProcess
   */
  addSubProcess(subProcess: HuemulLog): void {
    this.addNumRecordsWrite(subProcess.whatIDid.numRecordsWrite);
    this.addNumRecordsUpdate(subProcess.whatIDid.numRecordsUpdate);
    this.addNumRecordsDelete(subProcess.whatIDid.numRecordsDelete);
    this.addNumRecordsRead(subProcess.whatIDid.numRecordsRead);
    this.whatIDid.numSubProcess += 1;
    // this.subProcess.push(subProcess);
  }


  /**
   *
   * @return {boolean}
   */
  isSuccessful(): boolean {
    return this.whatIDid.result === resultType.success;
  }

  /**
   *
   * @return {number}
   */
  getErrorId(): number {
    return this.whatIDid.error.errorId;
  }

  /**
   *
   * @param {unknown} error
   * @return {string}
   */
  getTextFromExternalError(error: unknown): string {
    if (typeof error === "string") {
      return error; // works, `e` narrowed to string
    } else if (error instanceof Error) {
      error.message; // works, `e` narrowed to Error
    }


    return `${error}`;
  }

  /**
   *
   * @return {string}
   */
  getErrorTxt(): string {
    return this.whatIDid.error.errorTxt;
  }

  /**
   *
   * @return {number}
   */
  getHttpStatusCodeError(): number {
    let httpErrorCode = 500;

    if (this.whatIDid.error.errorId === errorType.dbRecordNotFound) {
      httpErrorCode = 404;
    } else if (this.whatIDid.error.errorId === errorType.dbDataValidation) {
      httpErrorCode = 400;
    }

    return httpErrorCode;
  }

  /**
   *
   * @param {express.Response} response
   * @param {number} statusCode
   * @param {any} data
   * @return {any}
   */
  finishSuccessfullyForEndPointLayer(response: any, statusCode: number, data: any): any {
    this.setStepName("finishOK");
    const myResponse = this.createHuemulResponse(data, statusCode);
    this.registerToLog(false);
    if (response) {
      response.setHeader('Content-Type', 'application/json; charset=utf-8');
      return response.status(myResponse.httpStatusCode).send(myResponse);
    } else {
      return {
        status: statusCode,
        body: JSON.stringify(myResponse),
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    }
  }

  /**
   *
   * @param {express.Response} response
   * @param {number} statusCode
   * @param {any} data
   * @return {any}
   */
  finishSuccessfullyForWithHtmlEndPointLayer(response: any, statusCode: number, data: any): any {
    this.setStepName("finishOK");
    //const myResponse = this.createHuemulResponse(data, statusCode);
    this.registerToLog(false);
    if (response) {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      return response.status(statusCode).send(data);
    } else {
      return {
        status: statusCode,
        body: data,
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      }
    }
  }

  /**
   *
   * @param {express.Response} response
   * @param {number} statusCode
   * @param {any} data
   * @return {any}
   */
  finishSuccessfullyWithFileForEndPointLayer(response: any, statusCode: number, fileNameWithPath: string, fileName: string): any {
    this.setStepName("finishOK");
    //const myResponse = this.createHuemulResponse(data, statusCode);
    this.registerToLog(false);

    const fileContent = fs.readFileSync(fileNameWithPath, 'utf-8');

    if (response) {
      response.setHeader('Content-disposition', `attachment; filename=${fileName}`);
      response.setHeader('Content-type', 'text/plain'); 
  
      response.status(202).send(fileContent);
    } else {
      return {
        status: 202,
        body: fileContent,
        headers: {
          'Content-disposition': `attachment; filename=${fileName}`,
          'Content-Type': 'text/plain'
        }
      }
    }
    //response.sendFile(fileNameWithPath);

    //const fileStream = fs.createReadStream(fileNameWithPath);
    //fileStream.pipe(response);
    //return response.status(statusCode).sendFile();
  }

  /**
   *
   * @param {express.Response} response
   * @param {number} statusCode
   * @param {errorType} errorId
   * @param {string | unknown} errorTxt
   * @return {any}
   */
  finishErrorForEndPointLayer(response: any, statusCode: number, errorId: errorType, errorTxt: string | unknown): any {
    // this.consoleLog(`endPoint error: ${errorTxt}`)
    const myResponse = this.createHuemulError2(errorId, this.getTextFromExternalError(errorTxt), statusCode);
    this.registerToLog(true);
    if (response) {
      response.setHeader('Content-Type', 'application/json; charset=utf-8');
      return response.status(myResponse.httpStatusCode).send(myResponse);
    } else {
      return {
        status: statusCode,
        body: JSON.stringify(myResponse),
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    }
  }

  /**
   *
   * @param {number} value
   * @return {void}
   */
  addNumRecordsDelete(value: number):void {
    this.whatIDid.numRecordsDelete += value;
  }

  /**
   *
   * @param {number} value
   * @return {void}
   */
  addNumRecordsRead(value: number): void {
    this.whatIDid.numRecordsRead += value;
  }

  /**
   *
   * @param {number} value
   * @return {void}
   */
  addNumRecordsWrite(value: number): void {
    this.whatIDid.numRecordsWrite += value;
  }

  /**
   *
   * @param {number} value
   * @return {void}
   */
  addNumRecordsUpdate(value: number): void {
    this.whatIDid.numRecordsUpdate += value;
  }

  /**
   *
   * @param {any | undefined} data
   * @param {Record<string, unknown>[]|undefined} oldData
   * @return {HuemulLog}
   */
  finishSuccessfullyForDataLayer(data: any[]|undefined, oldData: Record<string, unknown>[]|undefined = undefined):HuemulLog {
    // this.whatIDid.operation = operation
    this.whatIDid.endDate = new Date();
    this.whatIDid.elapsedTimeMS = (new Date()).getTime() - this.whatIDid.startDate.getTime();
    this.whatIDid.result = resultType.success;
    this.setStepName("finishOK");
    this.data = data === undefined ? [] : data;
    this.oldData = oldData === undefined ? [] : oldData;
    this.whatIDid.numRecordsRead = this.whatIDid.numRecordsRead === 0 ? this.data.length : this.whatIDid.numRecordsRead;
    this.registerToLog(false);
    return this;
  }

  /**
   * create error response to client with huemul return structure
   * @param {number} errorId internal error code (use huemul-functions.error*)
   * @param {string} errorTxt error description
   * @return {HuemulLog}
   */
  finishErrorForDataLayer(errorId: errorType, errorTxt: string | unknown):HuemulLog {
    // this.consoleLog(`logic or data error: ${errorTxt}`)
    // this.whatIDid.operation = operation
    this.whatIDid.endDate = new Date();
    this.whatIDid.elapsedTimeMS = (new Date()).getTime() - this.whatIDid.startDate.getTime();
    this.whatIDid.result = resultType.error;
    if (errorId === errorType.dbDataValidation || errorId === errorType.dbOther) {
      this.whatIDid.error = {errorId: errorId, errorTxt: `An error has occurred in the database Id${this.whoIAm.transactionId}`};
      this.whatIDid.extraInfo = {errorTxt: this.getTextFromExternalError(errorTxt), ...this.whatIDid.extraInfo};
    } else {
      this.whatIDid.error = {errorId: errorId, errorTxt: this.getTextFromExternalError(errorTxt)};
    }
    
    this.registerToLog(true);
    return this;
  }


  /**
   * create error response to client with huemul return structure
   * @param {number} errorId internal error code (use huemul-functions.error*)
   * @param {string} errorTxt error description
   * @param {number} errorHttpStatusCode status code (201, 200, 400, 500, etc)
   * @return {IHuemulResponse}
   */
  private createHuemulError2(errorId: number, errorTxt: string, errorHttpStatusCode: number): IHuemulResponse {
    try {
      if (this.whoIAm.orgId === "" || this.whoIAm.orgId === undefined) {
        this.whoIAm.orgId = "error";
      }
      this.whatIDid.endDate = new Date();
      this.whatIDid.elapsedTimeMS = (new Date()).getTime() - this.whatIDid.startDate.getTime();
      this.whatIDid.result = resultType.error;
      this.whatIDid.error = {errorId: errorId, errorTxt: errorTxt};

      const error: IHuemulResponse = {
        data: [{}],
        isSuccessful: false,
        httpStatusCode: errorHttpStatusCode,
        apiVersion: this.whoIAm.apiVersion,
        message: "error",
        errors: [{errorId: errorId, errorTxt: `${errorTxt}`}],
        startDate: this.whatIDid.startDate.toString(),
        elapsedTimeMS: this.whatIDid.elapsedTimeMS,
        transactionId: this.whoIAm.transactionId,

        extraInfo: [{}],
        appVersions: appVersions
      };

      // this.consoleError(`errorId: ${errorId}, errorTxt: ${errorTxt}`, error)

      return error;
    } catch (error) {
      this.consoleError("createHuemulError error!!", error);
      return {
        data: [{}],

        isSuccessful: false,
        httpStatusCode: errorHttpStatusCode,
        apiVersion: "0.0",
        message: "error",
        errors: [{errorId: 1, errorTxt: `${errorTxt}`}],
        startDate: "",
        elapsedTimeMS: this.whatIDid.elapsedTimeMS,
        transactionId: this.whoIAm.transactionId,

        extraInfo: [{}],
        appVersions: appVersions
      };
    }
  }


  /**
   * create OK response to client with huemul return structure
   * @param {any} data data to be returned to user
   * @param {number} httpStatusCode status code
   * @return {IHuemulResponse}
   */
  private createHuemulResponse(data: any, httpStatusCode: number): IHuemulResponse {
    try {
      this.whatIDid.endDate = new Date();
      this.whatIDid.elapsedTimeMS = (new Date()).getTime() - this.whatIDid.startDate.getTime();
      this.whatIDid.result = resultType.success;
      this.whatIDid.numRecordsDelete = 0;
      this.whatIDid.numRecordsWrite = 0;
      this.whatIDid.numRecordsUpdate = 0;
      this.whatIDid.numRecordsRead = 0;

      const response: IHuemulResponse = {
        data: data,
        isSuccessful: true,
        httpStatusCode: httpStatusCode,
        apiVersion: this.whoIAm.apiVersion,
        message: "Successful",
        errors: [{errorId: 0, errorTxt: ""}],
        startDate: this.whatIDid.startDate.toString(),
        elapsedTimeMS: this.whatIDid.elapsedTimeMS,
        transactionId: this.whoIAm.transactionId,

        extraInfo: [{}],
        appVersions: appVersions
      };

      return response;
    } catch (error) {
      return {
        data: data,
        isSuccessful: true,
        httpStatusCode: httpStatusCode,
        apiVersion: this.whoIAm.apiVersion,
        message: "successful",
        errors: [{errorId: 0, errorTxt: ""}],
        startDate: this.whatIDid.startDate.toString(),
        elapsedTimeMS: this.whatIDid.elapsedTimeMS,
        transactionId: this.whoIAm.transactionId,

        extraInfo: [{}],
        appVersions: appVersions
      };
    }
  }

  /**
  * get additional parameters from client
  * @param {Record} params array of params
  * @return {void}
  */
  private getExecutionConditions(params: { [key: string]: string; }): void {
    let debugMode = false;

    if (params.debugMode === undefined) {
      debugMode = false;
    } else if (params.debugMode === "1" || params.debugMode === "true" || params.debugMode || params.debugMode === "yes" ) {
      debugMode = true;
    }

    this.executionConditions.debugMode = debugMode;
  }

  _loggerInternalHuemul: any = undefined;

  /**
   * logger
   * @return {logger}
   */
  logger(): any {
    if (this._loggerInternalHuemul !== undefined) {
      return this._loggerInternalHuemul;
    }

    if (cloudProvider === CloudProviderType.azure) {
      this._loggerInternalHuemul = loggerAzure();
    } else if (cloudProvider === CloudProviderType.google) {
      this._loggerInternalHuemul = loggerGoogle();
    }

    return this._loggerInternalHuemul;
  }

  /**
   *
   * @param {string} message
   * @param {unknown} infoLog
   * @return {void}
   */
  consoleLog(message: string, infoLog: unknown = undefined): void {
    // console.log(message)
    // return
    if (this.logger() !== undefined) {
      try {
        this.logger().info(`id[${this.whoIAm.transactionId}] - ${this.whoIAm.app}.${this.whoIAm.layer}.${this.whoIAm.module}.${this.whoIAm.functionName} (${this.whoIAm.action}) - ${message}`, {
          labels: {
            module: this.whoIAm.module,
            layer: this.whoIAm.layer,
            app: this.whoIAm.app,
            action: this.whoIAm.action,
            functionName: this.whoIAm.functionName,
            apiVersion: this.whoIAm.apiVersion,
          },
          infoLog: infoLog,
        });
      } catch (error) {
        console.log(message);
        console.error("logger consoleLog");
        console.error(error);
      }
    } else {
      console.log(message);
    }
  }

  /**
   *
   * @param {string} message
   * @return {void}
   */
  consoleDebug(message: string): void {
    // console.debug(message)
    // return
    if (this.logger() !== undefined) {
      try {
        this.logger().debug(`id[${this.whoIAm.transactionId}] - ${this.whoIAm.app}.${this.whoIAm.layer}.${this.whoIAm.module}.${this.whoIAm.functionName} (${this.whoIAm.action}) - ${message}`, {
          labels: {
            module: this.whoIAm.module,
            layer: this.whoIAm.layer,
            app: this.whoIAm.app,
            action: this.whoIAm.action,
            functionName: this.whoIAm.functionName,
            apiVersion: this.whoIAm.apiVersion,
          }});
      } catch (error) {
        console.log(message);
        console.error("logger consoleDebug");
        console.error(error);
      }
    } else {
      console.debug(message);
    }
  }

  /**
   *
   * @param {string} message
   * @return {void}
   */
  consoleWarn(message: string): void {
    // console.warn(message)
    // return
    if (this.logger() !== undefined) {
      try {
        this.logger().warn(`id[${this.whoIAm.transactionId}] - ${this.whoIAm.app}.${this.whoIAm.layer}.${this.whoIAm.module}.${this.whoIAm.functionName} (${this.whoIAm.action}) - ${message}`, {
          labels: {
            module: this.whoIAm.module,
            layer: this.whoIAm.layer,
            app: this.whoIAm.app,
            action: this.whoIAm.action,
            functionName: this.whoIAm.functionName,
            apiVersion: this.whoIAm.apiVersion,
          }});
      } catch (error) {
        console.log(message);
        console.error("logger error on consoleWarn");
        console.error(error);
      }
    } else {
      console.warn(message);
    }
  }

  /**
   *
   * @param {string} message
   * @param {unknown} error
   * @return {void}
   */
  consoleError(message: string | unknown, error: unknown = undefined): void {
    // console.error(message)
    // return
    if (this.logger() !== undefined) {
      try {
        this.logger().error(`id[${this.whoIAm.transactionId}] - ${this.whoIAm.app}.${this.whoIAm.layer}.${this.whoIAm.module}.${this.whoIAm.functionName} (${this.whoIAm.action}) - ${message}`, {
          labels: {
            module: this.whoIAm.module,
            layer: this.whoIAm.layer,
            app: this.whoIAm.app,
            action: this.whoIAm.action,
            functionName: this.whoIAm.functionName,
            apiVersion: this.whoIAm.apiVersion,
          },
          infoError: error,
        });
      } catch (error2) {
        console.log(message);
        console.error("logger error on consoleError");
        console.error(error2);
      }
    } else {
      console.error(message);
    }
  }

  /**
   *
   * @param {IHuemulTrace} data
   * @param {boolean} errorRaised
   */
  private consoleSavetoLogging(data: IHuemulTrace, errorRaised: boolean): void {
    // console.log(message)
    // return
    if (this.logger() !== undefined) {
      try {
        if (errorRaised) {
          this.logger().error(`id[${data.transactionId}] - HuemulLog - ${data.app}.${data.layer}.${data.module}.${data.functionName} (${data.action}) `, {
            huemulObject: data,

            labels: {
              module: data.module,
              layer: data.layer,
              app: data.app,
              action: data.action,
              functionName: data.functionName,
              orgId: data.orgId,
              userId: data.userId,
              type: "HuemulLog",
            }});
        } else {
          this.logger().info(`id[${data.transactionId}] - HuemulLog - ${data.app}.${data.layer}.${data.module}.${data.functionName} (${data.action}) `, {
            huemulObject: data,

            labels: {
              module: data.module,
              layer: data.layer,
              app: data.app,
              action: data.action,
              functionName: data.functionName,
              orgId: data.orgId,
              userId: data.userId,
              type: "HuemulLog",
            }});
        }
      } catch (error) {
        console.log(data.transactionId);
        console.error("logger consoleLog");
        console.error(error);
      }
    } else {
      console.log(data.transactionId);
    }
  }

  /**
   *
   * @param {HuemulLog} process
   * @param {number} level
   * @return {number}
   */
  /*
  private numSubProcess(process: HuemulLog, level: number): number {
    if (level > 15) {
      return 0;
    }

    let numProcess = 0;
    try {
      for (const subp of process.subProcess) {
        numProcess += 1;
        numProcess += this.numSubProcess(subp, level + 1);
      }
    } catch (error) {
      this.consoleError("Error in numSubProcess... ", error);
    }

    return numProcess;
  }
  */

  /**
   *
   * @param {boolean} errorRaised
   * @return {void}
   */
  registerToLog(errorRaised: boolean): void {
    if (!this.saveToDatabase) {
      return;
    }

    try {
      // const tempNumSubProcessL1: number = this.subProcess.length;
      // const tempNumSubProcessTotal: number = this.numSubProcess(this, 1);

      // const huemulTrace = new HuemulTrace()
      const data: IHuemulTrace = {
        transactionId: this.whoIAm.transactionId,
        transactionIdOrigin: this.whoIAm.transactionIdOrigin,
        app: huemulFunctions.defaultValueIfEmpty(this.whoIAm.app, "n/a"),
        module: huemulFunctions.defaultValueIfEmpty(this.whoIAm.module, "n/a"),
        layer: huemulFunctions.defaultValueIfEmpty(this.whoIAm.layer, "n/a"),
        action: huemulFunctions.defaultValueIfEmpty(this.whoIAm.action, "n/a"),
        functionName: huemulFunctions.defaultValueIfEmpty(this.whoIAm.functionName, "n/a"),
        userId: huemulFunctions.defaultValueIfEmpty(this.whoIAm.userId, "n/a"),
        userEmail: huemulFunctions.defaultValueIfEmpty(this.whoIAm.userEmail, "n/a"),
        url: huemulFunctions.defaultValueIfEmpty(this.whoIAm.url, "n/a"),
        httpMethod: huemulFunctions.defaultValueIfEmpty(this.whoIAm.httpMethod, ""),
        ip: huemulFunctions.defaultValueIfEmpty(this.whoIAm.ip, ""),
        stepName: huemulFunctions.defaultValueIfEmpty(this.whatIDid.stepName, ""),
        // operation:  huemulFunctions.defaultValueIfEmpty(tempLog.whatIDid.operation?.toString(),"n/a"),
        numRecordsDelete: huemulFunctions.defaultValueIfEmpty(this.whatIDid.numRecordsDelete, 0),
        numRecordsRead: huemulFunctions.defaultValueIfEmpty(this.whatIDid.numRecordsRead, 0),
        numRecordsWrite: huemulFunctions.defaultValueIfEmpty(this.whatIDid.numRecordsWrite, 0),
        numRecordsUpdate: huemulFunctions.defaultValueIfEmpty(this.whatIDid.numRecordsUpdate, 0),
        startDate: huemulFunctions.getDateTimeText(huemulFunctions.defaultValueIfEmpty(this.whatIDid.startDate, new Date(1900, 1, 1))),
        endDate: huemulFunctions.getDateTimeText(huemulFunctions.defaultValueIfEmpty(this.whatIDid.endDate, new Date(1900, 1, 1))),
        elapsedTimeMS: huemulFunctions.defaultValueIfEmpty(this.whatIDid.elapsedTimeMS, -1),
        startDateIsAuth: huemulFunctions.getDateTimeText(huemulFunctions.defaultValueIfEmpty(this.whatIDid.startDateIsAuth, new Date(1900, 1, 1))),
        endDateIsAuth: huemulFunctions.getDateTimeText(huemulFunctions.defaultValueIfEmpty(this.whatIDid.endDateIsAuth, new Date(1900, 1, 1))),
        elapsedTimeIsAuthMS: huemulFunctions.defaultValueIfEmpty(this.whatIDid.elapsedTimeIsAuthMS, -1),
        result: huemulFunctions.defaultValueIfEmpty(this.whatIDid.result, "n/a"),
        errorId: huemulFunctions.defaultValueIfEmpty(this.whatIDid.error.errorId.toString(), "n/a"),
        errorTxt: huemulFunctions.defaultValueIfEmpty(`${this.whatIDid.error.errorTxt}`, "n/a"),

        clientLanguage: huemulFunctions.defaultValueIfEmpty(this.whoIAm.clientLanguage, "n/a"),
        clientVersion: huemulFunctions.defaultValueIfEmpty(this.whoIAm.clientVersion, "n/a"),
        clientApp: huemulFunctions.defaultValueIfEmpty(this.whoIAm.clientApp, "n/a"),
        clientInfo: huemulFunctions.defaultValueIfEmpty(this.whoIAm.clientInfo, "n/a"),

        extraInfo: huemulFunctions.defaultValueIfEmpty(this.whatIDid.extraInfo, "n/a"),
        // platformInfo: huemulFunctions.defaultValueIfEmpty(tempLog.whoIAm.platformInfo,"n/a"),

        // get from fist/ call
        orgId: this.whoIAm.orgId === "" || this.whoIAm.orgId === undefined ? "error" : this.whoIAm.orgId,

        numSubProcessLevel1: this.whatIDid.numSubProcess, // tempNumSubProcessL1,
        numSubProcess: 0, // tempNumSubProcessTotal,
      };

      this.consoleSavetoLogging(data, errorRaised);
    } catch (error) {
      this.consoleError("error in registerToLog", error);
    }
  }
}
