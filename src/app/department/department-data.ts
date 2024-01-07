
/* eslint max-len: ["error", { "code": 400 }] */
import {HuemulLog, layerType, IHuemulWhoIAm, errorType} from "../../common/huemul/huemul-log";
import {IDepartment, IDepartmentFilter} from "./interface-department-data-v1";
import {db} from "../../common/connections/connection-data-sql-server";
import {actionTypeDepartment,  tableName} from "./department";
import {APP_DB_NAME, moduleType} from "../../global";
import {isEmpty, sqlInjectionValidation} from "../../common/huemul/huemul-functions";

/**
 * class Department: implements CRUD methods to department entity (table or entity name: department)
 * @author Sebasti�n Rodr�guez Robotham
 */
export class Department {

  /**
   * constructor
   */
  // constructor () {
  // }

  /* ******************************************************************** */
  /* ********   C R U D   M E T H O D S    ****************************** */
  /* ******************************************************************** */

  sqlBase(orgId: string) {
    return `select base.* 

from "${tableName}" base `;}

  sqlBaseForPublic(orgId: string) {
  return `select base."departmentId", 
base."departmentName", 
base."departmentDesc", 
base."orgId"

from "${tableName}" base
  `;}

  /**
   * get sql
   * @author Sebasti�n Rodr�guez Robotham
   * @param {string} departmentId Department Id
   * @return {string}
   */
  getByIdQuery(departmentId: string, orgId: string, forPublic: boolean = false): string {
    return `( ${forPublic ? this.sqlBaseForPublic(orgId) : this.sqlBase(orgId)}
    where base."departmentId" = '${departmentId}' 
    ) final `;
  }

  /**
   * get all sql records
   * @author Sebasti�n Rodr�guez Robotham
   * @param {IDepartmentFilter} filters Filters
   * @param {boolean} forPublic true if result is public access
   * @return {string}
   */
  getAllQuery(filters: IDepartmentFilter, orgId: string, forPublic: boolean = false): string {
    let whereSql = "";
  
    if (!isEmpty(filters.departmentId)) {
      const dtf = filters.departmentId!.split(";").map((x:any) => `'${x}'`).join(","); 
      if (filters.departmentId!.split(";").length === 1) {
        whereSql += `${whereSql.length === 0 ? "" : " and "}base."departmentId" = '${filters.departmentId}'`; 
      } else {
        whereSql += `${whereSql.length === 0 ? "" : " and "}base."departmentId" in (${dtf})`; 
      }
    }

    if (!isEmpty(filters.departmentName)) {
      const dtf = filters.departmentName!.split(";").map((x:any) => `'${x}'`).join(","); 
      if (filters.departmentName!.split(";").length === 1) {
        whereSql += `${whereSql.length === 0 ? "" : " and "}upper(base."departmentName") like '%${filters.departmentName!.toUpperCase()}%'`; 
      } else {
        whereSql += `${whereSql.length === 0 ? "" : " and "}base."departmentName" in (${dtf})`; 
      }
    }

    if (!isEmpty(filters.departmentDesc)) {
      const dtf = filters.departmentDesc!.split(";").map((x:any) => `'${x}'`).join(","); 
      if (filters.departmentDesc!.split(";").length === 1) {
        whereSql += `${whereSql.length === 0 ? "" : " and "}upper(base."departmentDesc") like '%${filters.departmentDesc!.toUpperCase()}%'`; 
      } else {
        whereSql += `${whereSql.length === 0 ? "" : " and "}base."departmentDesc" in (${dtf})`; 
      }
    }
   
  
    return `( ${forPublic ? this.sqlBaseForPublic(orgId) : this.sqlBase(orgId)} 
    ${whereSql.length === 0 ? "" : ` where ${whereSql}`} 
    ) final `;
  }

  /**
   * create a new department to the database
   * @author Sebasti�n Rodr�guez Robotham
   * @param {IHuemulWhoIAm} whoExecute executor information
   * @param {IDepartment} data info to insert
   * @return {HuemulLog} huemulResponse
   */
  async departmentCreate(whoExecute: IHuemulWhoIAm, data: IDepartment): Promise<(HuemulLog)> {
    const huemulLog = new HuemulLog(layerType.data, moduleType.department, actionTypeDepartment.create, "departmentCreate", "1.0");

    try {
      huemulLog.setStepName("setIdentify");
      huemulLog.setIdentifyInfoFromParent(whoExecute);
      huemulLog.setOrgId(APP_DB_NAME);

      data.errorSinc= false;
      data.cdcUpdateDt= data.cdcCreateDt;
      // save to database
      huemulLog.setStepName("startSaveToDatabase");
      const dbConnection = await db(huemulLog.getOrgId()); // settings database = null
      /* const sqlResult = */await dbConnection(tableName).insert({
        departmentId: data.departmentId,
        departmentName: data.departmentName,
        departmentDesc: data.departmentDesc,
        orgId: data.orgId,
        cdcCreateDt: data.cdcCreateDt,
        cdcCreateUser: data.cdcCreateUser,
        cdcCreateApiVersion: data.cdcCreateApiVersion,
        cdcUpdateUser: data.cdcUpdateUser,
        cdcUpdateDt: data.cdcUpdateDt,
        cdcUpdateApiVersion: data.cdcUpdateApiVersion,
        errorSinc: data.errorSinc,
        internalTaskKey: data.internalTaskKey,
      });
      huemulLog.setStepName("endDataValidation");

      // return success result
      huemulLog.addNumRecordsWrite(1);

      huemulLog.setStepName("getFinalElement");
      const finalElement = await this.departmentGetById(huemulLog.whoIAm, data.orgId, data.departmentId);
      huemulLog.addSubProcess(finalElement);

      if (!finalElement.isSuccessful()) {
        return huemulLog.finishErrorForDataLayer( finalElement.getErrorId(), finalElement.getErrorTxt());
      }

      return huemulLog.finishSuccessfullyForDataLayer(finalElement.data);
    } catch (error) {
      huemulLog.consoleError(error);
      // get DB error
      if (huemulLog.getTextFromExternalError(error).indexOf("6 ALREADY_EXISTS") >= 0) {
        // DUPLICATE ERROR
        return huemulLog.finishErrorForDataLayer(errorType.dbDuplicated, error);
      } else if (huemulLog.getTextFromExternalError(error).indexOf("duplicate key value violates unique constraint") >= 0) {
        // DUPLICATE ERROR
        return huemulLog.finishErrorForDataLayer(errorType.dbDuplicated, error);
      } else {
        return huemulLog.finishErrorForDataLayer(errorType.dbOther, error);
      }
    }
  }

  /**
   * update a specific department from the database
   * @author Sebasti�n Rodr�guez Robotham
   * @param {IHuemulWhoIAm} whoExecute executor information
   * @param {IDepartment} data to be updated
   * @return {HuemulLog} huemulResponse
   */
  async departmentUpdate(whoExecute: IHuemulWhoIAm, data: IDepartment): Promise<(HuemulLog)> {
    const huemulLog = new HuemulLog(layerType.data, moduleType.department, actionTypeDepartment.update, "departmentUpdate", "1.0");
    try {
      huemulLog.setStepName("setIdentify");
      huemulLog.setIdentifyInfoFromParent(whoExecute);
      huemulLog.setOrgId(APP_DB_NAME);


      // update to database
      huemulLog.setStepName("startSaveToDatabase");
      const dbConnection = await db(huemulLog.getOrgId()); // settings database = null
      await dbConnection(tableName)
        .where("departmentId", data.departmentId)
        .update({
        departmentName: data.departmentName,
        departmentDesc: data.departmentDesc,
        orgId: data.orgId,
        cdcUpdateApiVersion: huemulLog.whoIAm.apiVersion,
        cdcUpdateDt: data.cdcUpdateDt,
        cdcUpdateUser: huemulLog.whoIAm.userId,
        errorSinc: false,
        internalTaskKey: data.internalTaskKey,
      });
      huemulLog.setStepName("endSaveToDatabase");

      huemulLog.setStepName("getFinalElement");
      const finalElement = await this.departmentGetById(huemulLog.whoIAm, data.orgId, data.departmentId);
      huemulLog.addSubProcess(finalElement);

      if (!finalElement.isSuccessful()) {
        return huemulLog.finishErrorForDataLayer( finalElement.getErrorId(), finalElement.getErrorTxt());
      }

      // return success result
      huemulLog.addNumRecordsUpdate(1);
      return huemulLog.finishSuccessfullyForDataLayer(finalElement.data);
    } catch (error) {
      huemulLog.consoleError(error);
      // get DB error
      return huemulLog.finishErrorForDataLayer(errorType.dbOther, error);
    }
  }

  /**
   * delete a specific department from the database (phisically)
   * @author Sebasti�n Rodr�guez Robotham
   * @param {IHuemulWhoIAm} whoExecute executor information
   * @param {string} orgId organization Id
   * @param {string} departmentId Department Id
   * @return {HuemulLog} huemulResponse
   */
  async departmentDelete(whoExecute: IHuemulWhoIAm, orgId: string, departmentId: string): Promise<(HuemulLog)> {
    const huemulLog = new HuemulLog(layerType.data, moduleType.department, actionTypeDepartment.delete, "departmentDelete", "1.0");
    try {
      huemulLog.setStepName("setIdentify");
      huemulLog.setIdentifyInfoFromParent(whoExecute);
      huemulLog.setOrgId(APP_DB_NAME);

      huemulLog.setStepName("getCurrentElement");
      const currentElement = await this.departmentGetById(huemulLog.whoIAm, orgId, departmentId);
      huemulLog.addSubProcess(currentElement);

      if (!currentElement.isSuccessful()) {
        return huemulLog.finishErrorForDataLayer( currentElement.getErrorId(), currentElement.getErrorTxt());
      }

      const currentData = (currentElement.data[0] as IDepartment);

      // delete from database
      huemulLog.setStepName("startDeleteFromDatabase");
      const dbConnection = await db(huemulLog.getOrgId()); // settings database = null
      await dbConnection(tableName).where("departmentId", departmentId).del();
      huemulLog.setStepName("endDeleteFromDatabase");
      huemulLog.setStepName("endSaveDW");

      // return success result
      huemulLog.addNumRecordsDelete(1);
      return huemulLog.finishSuccessfullyForDataLayer([currentData]);
    } catch (error) {
      huemulLog.consoleError(error);
      // get DB error
      return huemulLog.finishErrorForDataLayer(errorType.dbOther, error);
    }
  }

  /**
   * get a specific department from the database
   * @author Sebasti�n Rodr�guez Robotham
   * @param {IHuemulWhoIAm} whoExecute executor information
   * @param {string} orgId organization Id
   * @param {string} departmentId Department Id
   * @return {HuemulLog} huemulResponse
   */
  async departmentGetById(whoExecute: IHuemulWhoIAm, orgId: string, departmentId: string, forPublic: boolean = false): Promise<(HuemulLog)> {
    const huemulLog = new HuemulLog(layerType.data, moduleType.department, actionTypeDepartment.get, "departmentGetById", "1.0");
    try {
      huemulLog.setStepName("setIdentify");
      huemulLog.setIdentifyInfoFromParent(whoExecute);
      huemulLog.setOrgId(APP_DB_NAME);

      // get from database
      huemulLog.setStepName("startGetFromDatabase");
      const dbConnection = await db(huemulLog.getOrgId()); // settings database = null
      const data = await dbConnection.fromRaw(this.getByIdQuery(departmentId, orgId, forPublic)).select();
      huemulLog.setStepName("endGetFromDatabase");

      if (data.length !==1) {
        return huemulLog.finishErrorForDataLayer(errorType.dbRecordNotFound
            , `record doesn't exists in department (${departmentId})`);
      } else if (data[0].departmentId !== departmentId) {
        return huemulLog.finishErrorForDataLayer(errorType.dbRecordNotFound
            , `record doesn't exists in department (${departmentId})`);
      }

      // document exists

      // return success result
      huemulLog.addNumRecordsRead(1);
      return huemulLog.finishSuccessfullyForDataLayer(data);
    } catch (error) {
      huemulLog.consoleError(error);
      // get DB error
      return huemulLog.finishErrorForDataLayer(errorType.dbOther, error);
    }
  }

  /**
   * get a collection of department from the database
   * @author Sebasti�n Rodr�guez Robotham
   * @param {IHuemulWhoIAm} whoExecute executor information
   * @param {string} orgId organization Id
   * @param {IDepartmentFilter} filters filters 
   * @param {number} limit num rows
   * @param {number} page page number
   * @param {IDepartment} lastRecord last record of last query
   * @return {HuemulLog}
   */
  async departmentGetAll(whoExecute: IHuemulWhoIAm, orgId: string, filters: IDepartmentFilter, forPublic: boolean, limit: number, page: number, lastRecord?: IDepartment): Promise<(HuemulLog)> {
    const huemulLog = new HuemulLog(layerType.data, moduleType.department, actionTypeDepartment.getAll, "departmentGetAll", "1.0");
    try {
      huemulLog.setStepName("setIdentify");
      huemulLog.setIdentifyInfoFromParent(whoExecute);
      huemulLog.setOrgId(APP_DB_NAME);
      
      huemulLog.setStepName("startFilters");
      const dbConnection = await db(huemulLog.getOrgId()); // settings database = null
      const myLimit = limit > 0 ? limit : 1000000;
      let myOffset = (page ?? 0) === 0 ? 1 : (page ?? 1);
      myOffset = (myOffset - 1) * myLimit;

      if (!sqlInjectionValidation(filters.departmentId)){
        huemulLog.whatIDid.extraInfo = {sqlInjection: {"departmentId": filters.departmentId}  ,...huemulLog.whatIDid.extraInfo};
        return huemulLog.finishErrorForDataLayer(errorType.dbDataValidation, "error in data filters");
      }
      if (!sqlInjectionValidation(filters.departmentName)){
        huemulLog.whatIDid.extraInfo = {sqlInjection: {"departmentName": filters.departmentName}  ,...huemulLog.whatIDid.extraInfo};
        return huemulLog.finishErrorForDataLayer(errorType.dbDataValidation, "error in data filters");
      }
      if (!sqlInjectionValidation(filters.departmentDesc)){
        huemulLog.whatIDid.extraInfo = {sqlInjection: {"departmentDesc": filters.departmentDesc}  ,...huemulLog.whatIDid.extraInfo};
        return huemulLog.finishErrorForDataLayer(errorType.dbDataValidation, "error in data filters");
      }
      const data = await dbConnection.fromRaw(this.getAllQuery(filters, orgId, forPublic))
        .select("*")
        .orderBy([{column:"departmentName", order: "asc"}])
        .limit(myLimit)
        .offset(myOffset);

      huemulLog.setStepName("endGetFromDatabase");

      // return success result
      huemulLog.addNumRecordsRead(data.length);
      return huemulLog.finishSuccessfullyForDataLayer(data);
    } catch (error) {
      huemulLog.consoleError(error);
      // get DB error
      return huemulLog.finishErrorForDataLayer(errorType.dbOther, error);
    }
  }

  async createTableDepartment() {
    try {
      const dbConnection = await db(APP_DB_NAME); // settings database = null
    const data= await dbConnection.raw(`
    CREATE TABLE department (
      "departmentId" varchar(50) NOT NULL,
      "departmentName" varchar(100) NOT NULL,
      "departmentDesc" varchar(1000) NOT NULL,
      "orgId" varchar(50) NOT NULL,
      "cdcState" int NULL,
      "cdcCreateDt" datetime NULL,
      "cdcCreateUser" varchar(100) NULL,
      "cdcCreateApiVersion" varchar(100) NULL,
      "cdcUpdateDt" datetime NULL,
      "cdcUpdateUser" varchar(100) NULL,
      "cdcUpdateApiVersion" varchar(100) NULL,
      "errorSinc" bit NULL,
      "internalTaskKey" varchar(200) NULL,
      CONSTRAINT department_pkey PRIMARY KEY ("departmentId")
    );`);

    return data;
    } catch (error) {
      return error;
    }
    
  }
}
