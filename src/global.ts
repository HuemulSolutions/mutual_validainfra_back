import { IHuemulAppVersion } from "./common/huemul/interfaces/interface-huemul-appversion-v1";

export enum HuemulEnvironmentType {
  LOCAL = "LOCAL",
  DEV = "DEV",
  QA = "QA",
  PROD = "PROD"
}

export enum DatabaseType {
  firebase = "firebase",
  postgres = "postgres",
  sqlServer = "sql-server",
  bigquery = "bigquery",
}


export enum CloudProviderType {
  azure = "azure",
  google = "google"
}


/* eslint max-len: ["error", { "code": 300 }] */


export const emailFromNotify = process.env.emailFromNotify ?? ""; 
export const emailToNotify = process.env.emailToNotify ?? ""; 
export const emailProvider = process.env.emailProvider; 


//OTHER SETTINGS
export const environment = process.env.environment;
export const webPageUrlForTesting = 'http://localhost:3000';
export const appName = process.env.appName ?? "";
export const appVersion = "0.0.1";
export const businessName = "Mutual Backend Testing";
export const APP_DB_NAME: string = process.env.APP_DB_NAME ?? "";
export const rowsForGets: number = Number(process.env.rowsForGets) ?? 50;
export const maxRowsForGets = Number(process.env.maxRowsForGets) ?? 1000;
export const cloudProvider = process.env.cloudProvider;
export const databaseType = process.env.databaseType;
export const email_azure_applicationId = process.env.email_azure_applicationId ?? "";
export const email_azure_secret = process.env.email_azure_secret ?? "";
export const email_azure_tenantId = process.env.email_azure_tenantId ?? "";
export const email_google_serviceClient = process.env.email_google_serviceClient ?? "";
export const email_google_privateKey = process.env.email_google_privateKey ?? "";
export const appVersions: [IHuemulAppVersion] = [
  {
    appName: "Amanda-app",
    appPlatform: "WEB",
    appVersion: process.env.appWebVersion ?? "0.0.0"
  }
]

export enum emailProviderType {
  google = "google",
  azure = "azure",
}

// genera id unico

export enum moduleType {
  database = "database",
  authorization = "authorization",
  authentication = "authentication",
  authenticationCustom = "authenticationCustom",
  authValidateEmail = "authValidateEmail",
  sync = "sync",
  orgs = "orgs",
  authModule = "authModule",
  authPermission = "authPermission",
  authPermissionAssign = "authPermissionAssign",
  authRole = "authRole",
  authRoleAssign = "authRoleAssign",
  authUser = "authUser",
  // General
  internalTask = "internalTask",
  authServiceAccount = "authServiceAccount",
  // business app
  department = "department",
  
  orgSet = "orgSet",
  configBase = "configBase"
}

