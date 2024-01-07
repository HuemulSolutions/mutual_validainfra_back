
/* eslint max-len: ["error", { "code": 400 }] */
import * as huemulFunctions from "../../common/huemul/huemul-functions";
import {errorType, HuemulLog, IHuemulWhoIAm, layerType} from "../../common/huemul/huemul-log";
// data functions
import {Department as DepartmentPostgres} from "./department-data";
import {IDepartment, IDepartmentFilter} from "./interface-department-data-v1";
import {actionTypeDepartment} from "./department";
import {moduleType} from "../../global";
import * as validation from "./department-validation";

/**
 * return data provider
 * @return {DepartmentSqlServer | DepartmentPostgres | DepartmentFirebase | undefined}
 */
export function getDepartmentData(): DepartmentPostgres {
  return new DepartmentPostgres();
}

/**
 * Business Logic to create a new department
 * @author Sebasti�n Rodr�guez Robotham
 * @param {IHuemulWhoIAm} whoExecute log object
 * @param {IDepartment} data new record in IDepartment format
 * @return {HuemulLog} result
 */
export async function departmentLogicCreate(whoExecute: IHuemulWhoIAm, data: IDepartment): Promise<HuemulLog> {
  const huemulLog = new HuemulLog(layerType.logic, moduleType.department, actionTypeDepartment.create, "departmentLogicCreate", "1.0");
  try {
    huemulLog.setStepName("setIdentify");
    huemulLog.setIdentifyInfoFromParent(whoExecute);
    const department = getDepartmentData();

    /* **************     D A T A   V A L I D A T I O N    *******************/
    huemulLog.setStepName("startDataValidation");
    let dataError: string[] = [];
    data.orgId = huemulLog.getOrgId();

    dataError = dataError.concat(validation.departmentIdCheck(data.departmentId));
    dataError = dataError.concat(validation.departmentNameCheck(data.departmentName));
    dataError = dataError.concat(validation.departmentDescCheck(data.departmentDesc));

    // finish data validation
    huemulLog.setStepName("endDataValidation");
    if (dataError.length > 0) {
      // return error --> data validation
      return huemulLog.finishErrorForDataLayer(errorType.appDataValidation
          , huemulFunctions.getMessageErrorDataValitation(dataError));
    }
    // Assing change data capture and control columns
    setCdcValues(huemulLog, data);




    huemulLog.setStepName("startCall department.departmentCreate");
    const departmentResult = await department!.departmentCreate(huemulLog.whoIAm, data);
    huemulLog.setStepName("endCall department.departmentCreate");
    huemulLog.addSubProcess(departmentResult);
    if (departmentResult.isSuccessful()) {
      return huemulLog.finishSuccessfullyForDataLayer( departmentResult.data);
    } else {
      return huemulLog.finishErrorForDataLayer( departmentResult.getErrorId(), departmentResult.getErrorTxt());
    }
  } catch (error) {
    return huemulLog.finishErrorForDataLayer( errorType.appOthers, error);
  }
}

/**
* Business Logic to update a department
* @author Sebasti�n Rodr�guez Robotham
* @param {IHuemulWhoIAm} whoExecute log object
* @param {IDepartment} data to updated record in IDepartment format
* @return {HuemulLog} result
*/
export async function departmentLogicUpdate(whoExecute: IHuemulWhoIAm, data: IDepartment): Promise<HuemulLog> {
  const huemulLog = new HuemulLog(layerType.logic, moduleType.department, actionTypeDepartment.update, "departmentLogicUpdate", "1.0");
  try {
    huemulLog.setStepName("setIdentify");
    huemulLog.setIdentifyInfoFromParent(whoExecute);
    const department = getDepartmentData();

    // Assing change data capture and control columns
    setCdcValues(huemulLog, data);

    // ***************     D A T A   V A L I D A T I O N    *******************/
    data.orgId = huemulLog.getOrgId();
    huemulLog.setStepName("startDataValidation");
    let dataError: string[] = [];
    dataError = dataError.concat(validation.departmentIdCheck(data.departmentId));
    dataError = dataError.concat(validation.departmentNameCheck(data.departmentName));
    dataError = dataError.concat(validation.departmentDescCheck(data.departmentDesc));

    // finish data validation
    huemulLog.setStepName("endDataValidation");
    if (dataError.length > 0) {
      // return error --> data validation
      return huemulLog.finishErrorForDataLayer( errorType.appDataValidation
          , huemulFunctions.getMessageErrorDataValitation(dataError));
    }

    huemulLog.setStepName("startCall department.departmentUpdate");
    const departmentResult = await department!.departmentUpdate(huemulLog.whoIAm, data);
    huemulLog.setStepName("endCall department.departmentUpdate");
    huemulLog.addSubProcess(departmentResult);
    if (departmentResult.isSuccessful()) {
      return huemulLog.finishSuccessfullyForDataLayer( departmentResult.data);
    } else {
      return huemulLog.finishErrorForDataLayer( departmentResult.getErrorId(), departmentResult.getErrorTxt());
    }
  } catch (error) {
    return huemulLog.finishErrorForDataLayer( errorType.appOthers, error);
  }
}

/**
* Business Logic to delete a department record
* @author Sebasti�n Rodr�guez Robotham
* @param {IHuemulWhoIAm} whoExecute log object
* @param {string} departmentId Department Id
* @return {HuemulLog} huemulResponse
*/
export async function departmentLogicDelete(whoExecute: IHuemulWhoIAm, departmentId: string): Promise<HuemulLog> {
  const huemulLog = new HuemulLog(layerType.logic, moduleType.department, actionTypeDepartment.delete, "departmentLogicDelete", "1.0");
  try {
    huemulLog.setStepName("setIdentify");
    huemulLog.setIdentifyInfoFromParent(whoExecute);
    const department = getDepartmentData();

    huemulLog.setStepName("startCall department.departmentDelete");
    const departmentResult = await department!.departmentDelete(huemulLog.whoIAm, huemulLog.getOrgId(), departmentId);
    huemulLog.setStepName("endCall department.departmentDelete");
    huemulLog.addSubProcess(departmentResult);
    if (departmentResult.isSuccessful()) {
      return huemulLog.finishSuccessfullyForDataLayer( departmentResult.data);
    } else {
      return huemulLog.finishErrorForDataLayer( departmentResult.getErrorId(), departmentResult.getErrorTxt());
    }
  } catch (error) {
    return huemulLog.finishErrorForDataLayer( errorType.appOthers, error);
  }
}

/**
* Business Logic to delete multiple  department record
* @author Sebasti�n Rodr�guez Robotham
* @param {IHuemulWhoIAm} whoExecute log object
* @param {string[]} departmentIdList PK List to delete
* @return {HuemulLog} huemulResponse
*/
export async function departmentLogicDeleteMulti(whoExecute: IHuemulWhoIAm, departmentIdList: string[]): Promise<HuemulLog> {
  const huemulLog = new HuemulLog(layerType.logic, moduleType.department, actionTypeDepartment.delete, "departmentLogicDeleteMulti", "1.0");
  try {
    huemulLog.setStepName("setIdentify");
    huemulLog.setIdentifyInfoFromParent(whoExecute);

    // data validation
    const errorList: string[] = [];
    
    const departmentIdResult = [];
    for (const departmentId of departmentIdList) {
      huemulLog.setStepName(`processing ${departmentId}`);
      departmentIdResult.push(departmentLogicDelete(huemulLog.whoIAm, departmentId ));
    }
    
    const departmentIdResultEnd = await Promise.all(departmentIdResult);
    
    for (const result of departmentIdResultEnd) {
      huemulLog.addSubProcess(result);
      if (!result.isSuccessful()) {
        errorList.push(result.getErrorTxt());
      }
    }
    if (errorList.length === 0) {
      return huemulLog.finishSuccessfullyForDataLayer([{total: departmentIdList.length}] );
    } else {
      return huemulLog.finishErrorForDataLayer( errorType.appOthers, errorList.join(";"));
    }
  } catch (error) {
    return huemulLog.finishErrorForDataLayer( errorType.appOthers, error);
  }
}

/**
* Business Logic to get one department record
* @author Sebasti�n Rodr�guez Robotham
* @param {IHuemulWhoIAm} whoExecute log object
* @param {string} departmentId Department Id
* @return {HuemulLog} huemulResponse
*/
export async function departmentLogicGetById(whoExecute: IHuemulWhoIAm, departmentId: string, forPublic: boolean): Promise<HuemulLog> {
  const huemulLog = new HuemulLog(layerType.logic, moduleType.department, actionTypeDepartment.get, "departmentLogicGetById", "1.0");
  try {
    huemulLog.setStepName("setIdentify");
    huemulLog.setIdentifyInfoFromParent(whoExecute);
    const department = getDepartmentData();

    huemulLog.setStepName("startCall department.departmentGetById");
    const departmentResult = await department!.departmentGetById(huemulLog.whoIAm, huemulLog.getOrgId(), departmentId, forPublic);
    huemulLog.setStepName("endCall department.departmentGetById");
    huemulLog.addSubProcess(departmentResult);
    if (departmentResult.isSuccessful()) {
      return huemulLog.finishSuccessfullyForDataLayer( departmentResult.data);
    } else {
      return huemulLog.finishErrorForDataLayer( departmentResult.getErrorId(), departmentResult.getErrorTxt());
    }
  } catch (error) {
    return huemulLog.finishErrorForDataLayer( errorType.appOthers, error);
  }
}

/**
* Business Logic to get all department records
* @author Sebasti�n Rodr�guez Robotham
* @param {IHuemulWhoIAm} whoExecute log object
* @param {IDepartmentFilter} filters filters
* @param {number} limit number or records to return
* @param {number} page page to return
* @param {IDepartment} lastRecord last record of the last query, in json or IDepartment format
* @return {HuemulLog} result
*/
export async function departmentLogicGetAll(whoExecute: IHuemulWhoIAm, filters: IDepartmentFilter, forPublic: boolean, limit: number, page?: number, lastRecord?: IDepartment): Promise<HuemulLog> {
  const huemulLog = new HuemulLog(layerType.logic, moduleType.department, actionTypeDepartment.getAll, "departmentLogicGetAll", "1.0");
  try {
    huemulLog.setStepName("setIdentify");
    huemulLog.setIdentifyInfoFromParent(whoExecute);
    const department = getDepartmentData();

    huemulLog.setStepName("startCall department.departmentGetAll");
    const departmentResult = await department!.departmentGetAll(huemulLog.whoIAm, huemulLog.getOrgId(), filters, forPublic, limit, page ?? 0, lastRecord);
    huemulLog.setStepName("endCall department.departmentGetAll");
    huemulLog.addSubProcess(departmentResult);
    if (departmentResult.isSuccessful()) {
      return huemulLog.finishSuccessfullyForDataLayer( departmentResult.data);
    } else {
      return huemulLog.finishErrorForDataLayer( departmentResult.getErrorId(), departmentResult.getErrorTxt());
    }
  } catch (error) {
    return huemulLog.finishErrorForDataLayer( errorType.appOthers, error);
  }
}



/* ******************************************************************** */
/* ********   G E N E R I C   M E T H O D S    ****************************** */
/* ******************************************************************** */

/**
 *
 * @param {HuemulLog} huemulLog
 * @param {IDepartment} data
 * @return {void}
 */
function setCdcValues(huemulLog: HuemulLog, data: IDepartment): void {
  if (huemulLog.whoIAm.action === "c") {
    data.cdcCreateApiVersion = huemulLog.whoIAm.apiVersion;
    data.cdcCreateDt = huemulFunctions.getDateTimeText(new Date());
    data.cdcUpdateDt = data.cdcCreateDt;
    data.cdcCreateUser = huemulLog.whoIAm.userId;
    data.cdcState = 1;
    data.internalTaskKey = "";
  } else if (huemulLog.whoIAm.action === "u" || huemulLog.whoIAm.action === "i" || huemulLog.whoIAm.action === "re") {
    data.cdcUpdateApiVersion = huemulLog.whoIAm.apiVersion;
    data.cdcUpdateDt = huemulFunctions.getDateTimeText(new Date());
    data.cdcUpdateUser = huemulLog.whoIAm.userId;
    data.internalTaskKey = data.internalTaskKey ?? "";
  }
}

