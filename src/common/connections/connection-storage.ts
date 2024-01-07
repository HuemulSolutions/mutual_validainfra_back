//version 1.0.2 2023-03-18 SRODRIGUEZ - Deja dinamica url de retorno
//version 1.0.1 2023-01-04 SRODRIGUEZ
import {cloudProvider, CloudProviderType} from "../../global";
import {generateGetUrl as generateGetUrlGcp} from "./connection-storage-gcp";
import {generateGetUrl as generateGetUrlAzure} from "./connection-storage-azure";
/**
 * create temp url to get file 2
 * @param {string} bucketName google bucketName
 * @param {string} fileName file name
 * @return {string} result
 */
 export async function generateGetUrl(basePath: string, bucketName: string, fileName: string): Promise<string> {
    if (cloudProvider == CloudProviderType.google) {
        return await generateGetUrlGcp(basePath, bucketName, fileName);
    } else if (cloudProvider == CloudProviderType.azure) {
        return await generateGetUrlAzure(basePath, bucketName, fileName);
    }
    
    return "";
  }
  
