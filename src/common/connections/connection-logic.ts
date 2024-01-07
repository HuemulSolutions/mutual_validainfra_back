/* eslint max-len: ["error", { "code": 400 }] */
//version 1.0.1 2023-01-04 SRODRIGUEZ
import * as path from "path";
import * as os from "os";
import * as fs from "fs";


/**
 * create file and save it to cloud storage
 * @param {string} subPath path to save the file
 * @param {string} fileName filename with extension
 * @param {any} content file content to save
 * @return {boolean}
 */
export async function createFile(subPath: string, fileName: string, content: any): Promise<boolean> {
  const tempFilePath = path.join(os.tmpdir(), fileName);
  console.log({tempFilePath});
  fs.writeFileSync(tempFilePath, content);

  /*
  const bucket = admin.storage().bucket();

  await bucket.upload(tempFilePath, {
    destination: `exports${subPath}/${fileName}`,
  });
  */

  return true;
}
