/* eslint max-len: ["error", { "code": 400 }] */
//version 1.0.2 2023-03-18 SRODRIGUEZ - Deja dinamica url de retorno
//version 1.0.1 2023-01-04 SRODRIGUEZ
// Imports the Google Cloud client library
// const {Storage} = require('@google-cloud/storage');

// Creates a client
// const storage = new Storage();

let storageBucket: string | null = null;
// let storageBucketImages: string | null = null;

/**
 * get storage instance
 * @return {storage.Storage} result
 */
export function getStorage() {
  return null;
}

/**
 * get storage bucket name
 * @return {string} result
 */
export function getStorageBucketName(): string {
  if (storageBucket === null) {
    storageBucket = ``;
  }

  return storageBucket;
}


/**
 * create temp url to upload file
 * @param {string} bucketName google bucketName
 * @param {string} fileName file name
 * @return {string} result
 */
export async function generateUploadSignedUrl(bucketName: string, fileName: string): Promise<string> {
  
  return "";
}

/**
 * create temp url to get file
 * @param {string} bucketName google bucketName
 * @param {string} fileName file name
 * @return {string} result
 */
export async function generateGetSignedUrl(bucketName: string, fileName: string): Promise<string> {
  return "";
}

/**
 * create temp url to get file
 * @param {string} bucketName google bucketName
 * @param {string} fileName file name
 * @return {string} result
 */
export async function generateGetUrl(basePath: string, bucketName: string, fileName: string): Promise<string> {
  return `${basePath}/${bucketName}/${fileName}`;
}
