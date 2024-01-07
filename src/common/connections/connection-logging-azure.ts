/* eslint max-len: ["error", { "code": 400 }] */
//version 1.0.1 2023-01-04 SRODRIGUEZ
import * as winston from "winston";
// import {LoggingWinston} from "@google-cloud/logging-winston";
// import { AzureFunctions } from 'winston-azure-functions'
// import AzureFunctions = require("winston-azure-functions");

/** ********************************************************** */
/** **********   L O G G I N G   ********************************* */
/** ********************************************************** */
// const loggingWinston = new LoggingWinston({logName: appName, labels: {version: "1.0"}});

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"

let _logger: winston.Logger | undefined = undefined;

/**
 *
 * @return {winstonLogger}
 */
export function logger() {
  if (_logger === undefined) {
    // const loggingWinston = new AzureFunctions({ context });
    _logger = winston.createLogger({
      level: "info",
      transports: [
        new winston.transports.Console(),
        // Add Stackdriver Logging
      ],
    });

    _logger.configure({
      transports: [
        new winston.transports.Console(),
        // new AzureFunctions({ context })
      ],
    });
  }

  return _logger;
}


