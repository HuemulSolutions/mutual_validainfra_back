/* eslint max-len: ["error", { "code": 400 }] */
//version 1.0.1 2023-01-04 SRODRIGUEZ
import * as winston from "winston";

/** ********************************************************** */
/** **********   L O G G I N G   ********************************* */
/** ********************************************************** */

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"

let loggerInternal: any = undefined;

/**
 * logger
 * @return {logger}
 */
export function logger() {
  if (loggerInternal !== undefined) {
    return loggerInternal;
  }

  //const loggingWinston = new LoggingWinston({logName: appName, labels: {version: "1.0"}});

  loggerInternal = winston.createLogger({
    level: "info",
    transports: [
      new winston.transports.Console(),
      // Add Stackdriver Logging
      //loggingWinston,
    ],
  });

  return loggerInternal;
}
