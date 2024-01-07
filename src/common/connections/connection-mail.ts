/* eslint max-len: ["error", { "code": 2000 }] */
//version 1.0.10 2023-03-07 SRODRIGUEZ agrega ambiente LOCAL
//version 1.0.2 2023-01-04 SRODRIGUEZ -- bug envio correos con copia a, debe ir con mensaje - simplera util
//version 1.0.1 2023-01-04 SRODRIGUEZ
//import axios from "axios";
const axios = require('axios').default || require('axios')
import nodemailer = require("nodemailer");
import {emailProvider, emailProviderType, emailToNotify, email_azure_applicationId, email_azure_secret, email_azure_tenantId, email_google_privateKey, email_google_serviceClient, environment, HuemulEnvironmentType} from "../../global";
import { isEmpty } from "../huemul/huemul-functions";


export async function sendMail(email: string, to: string, subject: string, message: string): Promise<{isOK: boolean, detail: any}> {
  if (emailProvider === emailProviderType.google) {
    //console.log("enviar con google");
    return await sendMailWithGmail(email, to, subject, message);
  } else if (emailProvider === emailProviderType.azure) {
    //console.log("enviar con azure");
    return await sendMailWithAzure(email, to, subject, message);
  } 

  const messageToReturn: {isOK: boolean, detail: any} = {
    isOK: false,
    detail: {
      error: `emailProvider: ${emailProvider} not defined`
    },
  };

  return messageToReturn;
}

/**
 * send email function
 * @param {string} email from email address
 * @param {string} to to email address
 * @param {string} subject subject
 * @param {string} message message body
 * @return {any}
 */
export async function sendMailWithGmail(email: string, to: string, subject: string, message: string): Promise<{isOK: boolean, detail: any}> {
  const messageToReturn: {isOK: boolean, detail: any} = {
    isOK: false,
    detail: {},
  };
  
  const serviceClient = email_google_serviceClient;
  const privateKey = email_google_privateKey.replace(/\\n/g, "\n");

  //console.log("serviceClient v2", serviceClient);
  

  if (isEmpty(serviceClient)) {
    messageToReturn.detail = {"error": "serviceClient is empty"}
    return messageToReturn;
  }
  if (isEmpty(privateKey)) {
    messageToReturn.detail = {"error": "privateKey is empty"}
    return messageToReturn;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        type: "OAuth2",
        user: emailToNotify,
        serviceClient: serviceClient,
        privateKey: privateKey,
      },
    });

    transporter.verify();
    //console.log("configurando");

    // config the email message
    const mailOptions = {
      from: email,
      to: to,
      subject: subject,
      text: message,
      html: message,
    };

    //console.log("enviando");

    // call the built in `sendMail` function and return different responses upon success and failure
    const result = await transporter.sendMail(mailOptions);
    //console.log("resultado");
    //console.log(result);
    messageToReturn.isOK = true;
    messageToReturn.detail = result;
  } catch (err) {
    console.log("error final");
    console.log(err);
    messageToReturn.isOK = false;
    messageToReturn.detail = err;

    return messageToReturn;
  }

  return messageToReturn;
}

var azureToken: string = "";

/*
async function azureGetToken2() {
  
  const FormData = require("form-data");
  var data2= new FormData();
  data2.append('grant_type', 'client_credentials');
  data2.append('client_id', '606a29f1-fcb0-4387-81d8-61bd05400fce');
  data2.append('client_secret', 'THK8Q~jUSZtaOyAzopkM4FRc2eCFmMddZqK91drx');
  data2.append('scope', 'https://graph.microsoft.com/.default');

  const querystring = require('querystring');

  const data = querystring.stringify({
      client_id: '606a29f1-fcb0-4387-81d8-61bd05400fce',
      client_secret: 'THK8Q~jUSZtaOyAzopkM4FRc2eCFmMddZqK91drx',
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
      
  });

  var config = {
    method: 'post',
    url: 'https://login.microsoftonline.com/84cf6443-261e-4f7e-8441-aeaa995aae70/oauth2/v2.0/token',
    
    data : data
  };

  const result = await axios(config);

  return result.data.access_token;
 
}
*/

async function azureGetToken(): Promise<string> {
  const tenantId = email_azure_tenantId;
  const applicationId = email_azure_applicationId;
  const secret = email_azure_secret;
  const urlGetToken = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`; //          # Directory (tenant) ID

  const querystring = require('querystring');
  const dataToSend = querystring.stringify({
    client_id: applicationId,
    client_secret: secret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  });
  
  // ### GET AZURE ACCESS TOKEN ###
  try {
    const response = await axios.post (
      urlGetToken, 
      dataToSend,
    );

    const statusToReview = response.status ?? response.statusCode;
  
    if (statusToReview !== 200 && statusToReview !== 201 && statusToReview !== 202) {
      throw new Error(`Request failed with status ${statusToReview} - ${response.data ? response.data.error_description : ""}`)
    }
  
    const data: any =  response.data;
    azureToken = data.access_token;
  } catch (error: any) {
    console.log("error");
    console.log(error);
  }
  

  return azureToken;
}

/**
 * Envía mail via azure office365
 * @param email email desde donde se enviará
 * @param to email de destino
 * @param subject título
 * @param message mensaje en html
 * @returns 
 */
export async function sendMailWithAzure(email: string, to: string, subject: string, message: string): Promise<{isOK: boolean, detail: any}> {
  const messageToReturn: {isOK: boolean, detail: string} = {
    isOK: false,
    detail: "",
  };
  const token = await azureGetToken();

  if (isEmpty(token)) {
    messageToReturn.detail = "Token vacío, no se puede validar usuario";
    if (environment === HuemulEnvironmentType.DEV || environment === HuemulEnvironmentType.LOCAL) {
      console.log(messageToReturn);
    }
    return messageToReturn;
  }
  

  try {
    const response = await axios.post(
      `https://graph.microsoft.com/v1.0/users/${email}/sendMail`, 
      JSON.stringify({
        message: {
          subject: subject,
          body: {
            contentType: "HTML",
            content: message
          },
          
          toRecipients: [
            {
              emailAddress: {
                address: to
              }
            }
          ],
          /*
          ccRecipients: [
            {
              emailAddress: {
                address: ""
              }
            }
          ]
          */
        },
        saveToSentItems: true
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const statusToEvaluate = response.statusCode ?? response.status ?? (response.res === undefined ? 200 : response.res.statusCode);

    if (statusToEvaluate !== 200 && statusToEvaluate !== 201 && statusToEvaluate !== 202) {
      messageToReturn.detail = `Request failed with status ${statusToEvaluate}`;
      messageToReturn.isOK = false;
      if (environment === HuemulEnvironmentType.DEV || environment === HuemulEnvironmentType.LOCAL) {
        console.log(messageToReturn);
      }
      return messageToReturn;
    }

    //const data =  response.data;
    
    messageToReturn.isOK = true;
  } catch (err) {
    console.log("error final");
    console.log(err);
    messageToReturn.isOK = false;
    messageToReturn.detail = `${err}`;
  }

  if (environment === HuemulEnvironmentType.DEV || environment === HuemulEnvironmentType.LOCAL) {
    console.log(messageToReturn);
  }
  return messageToReturn;
}