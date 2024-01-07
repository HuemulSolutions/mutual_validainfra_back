/* eslint max-len: ["error", { "code": 400 }] */
//version 1.0.2 2023-03-18 SRODRIGUEZ - Deja dinamica url de retorno
//version 1.0.1 2023-02-03 SRODRIGUEZ - Cambia lectura de env a variable de global
//version 1.0.1 2023-01-04 SRODRIGUEZ
import {/*BlobSASPermissions,*/ BlobServiceClient, StorageSharedKeyCredential} from "@azure/storage-blob";
import { isEmpty } from "../huemul/huemul-functions";

// Create the BlobServiceClient object which will be used to create a container client
/*
let _blobServiceClient: BlobServiceClient;
function blobServiceClient(){ 
  if (_blobServiceClient) {
    return _blobServiceClient;
  }

  _blobServiceClient =  BlobServiceClient.fromConnectionString(storageBucketFile);

  return _blobServiceClient;
  }
*/

export class StorageResult {
  isOK: boolean = false;
  message: string = "";
}

export interface IStorageUpload {
  containerName: string,
  path: string,
  fileNameTo: string,
  fileNameOriginal: string
  file: Buffer,
  extension: string
}


/**
 * create temp url to get file
 * @param {string} bucketName google bucketName
 * @param {string} fileName file name
 * @return {string} result
 */
export async function generateGetUrl(basePath: string, bucketName: string, fileName: string): Promise<string> {
  const urlPath = `${basePath}${isEmpty(bucketName) ? ''  : `/${bucketName}`}${isEmpty(fileName) ? ''  : `/${fileName}`}`
  return urlPath;
  /*
  const containerClient = blobServiceClient().getContainerClient(bucketName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  const permissions= new BlobSASPermissions();
  permissions.read = true;

  const urlToDonwload = await blockBlobClient.generateSasUrl({
    permissions: permissions,
    expiresOn: new Date(Date.now() + 86400 * 1000),
  });

  return urlToDonwload; // `https://azure/${bucketName}/${fileName}`;
  */
}

/**
 * upload multiples files in parallel
 * @param {string} storageAzureName storageAzureName
 * @param {string} storageAzureKey storageAzureKey
 * @param {StorageUpload[]} files files
 * @return {StorageResult} result
 */
export async function uploadFileToAzureFromData(storageAzureName: string, storageAzureKey: string, files: IStorageUpload[]): Promise<StorageResult> {
  const uploadResult: StorageResult = {
    isOK: false,
    message: ""
  }
  try {
    // get connection string to Azure Storage from environment variables
    // Replace with DefaultAzureCredential before moving to production

    if (files.filter(e=> isEmpty(e.containerName)).length > 0) {
      uploadResult.isOK = false;
      uploadResult.message = "containerName cannot be empty";
      return uploadResult;
    }

    if (files.filter(e=> isEmpty(e.fileNameTo)).length > 0) {
      uploadResult.isOK = false;
      uploadResult.message = "fileNameTo cannot be empty";
      return uploadResult;
    }

    if (files.filter(e=> isEmpty(e.file)).length > 0) {
      uploadResult.isOK = false;
      uploadResult.message = "file cannot be empty";
      return uploadResult;
    }

    const responseArray =  [];

    for (const fileToUpload of files) {
      const credentials = new StorageSharedKeyCredential(
        storageAzureName,
        storageAzureKey
      );
  
      const blobService = new BlobServiceClient(
        `https://${storageAzureName}.blob.core.windows.net`,
        credentials
      );
  
      const containerClient = blobService.getContainerClient(fileToUpload.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(`${fileToUpload.path}/${fileToUpload.fileNameTo}`);

      responseArray.push(blockBlobClient.uploadData(fileToUpload.file!))
    }

    const responseEnd = await Promise.all(responseArray);

    if (responseEnd.filter(e=> !isEmpty(e.errorCode)).length > 0 ) {
      uploadResult.isOK = false;
      uploadResult.message = `files with error: ${responseEnd.filter(e=> !isEmpty(e.errorCode)).map(e=> e.errorCode).join(",") }`;
      return uploadResult;
    }

    uploadResult.isOK = true;
    uploadResult.message = `${responseEnd.length} files uploaded`;
    return uploadResult;    
  } catch (error) {
      uploadResult.isOK = false;
      uploadResult.message = `unexpected error: ${error}`;
      return uploadResult;
  }
}
