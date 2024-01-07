
/* eslint max-len: ["error", { "code": 400 }] */
import {HuemulLog, layerType, errorType} from "../../common/huemul/huemul-log";
import * as huemulFunctions from "../../common/huemul/huemul-functions";
import * as validation from "./department-validation";
import {actionTypeDepartment} from "./department";
// data functions
import {
  departmentLogicCreate,
  departmentLogicUpdate,
  departmentLogicDelete,
  departmentLogicDeleteMulti,
  departmentLogicGetById,
  departmentLogicGetAll} from "./department-logic";
import {moduleType, maxRowsForGets, rowsForGets} from "../../global";
import {IDepartment, IDepartmentFilter} from "./interface-department-data-v1";

const rowsForGetsdepartment: number = rowsForGets;
const maxRowsForGetsdepartment: number = maxRowsForGets;

/**
* create
* @author Sebasti�n Rodr�guez Robotham
* @param {request} request
* @param {response} response
* @return {HuemulLog} result
*/
export async function departmentEndPointCreate(request: any, response: any, huemulData: any): Promise<any> {
  const huemulLog = new HuemulLog(layerType.endPoint, moduleType.department, actionTypeDepartment.create, "app.post(/v1/)", "1.0");

  try {
    huemulLog.setStepName("setSenderInfoNotLogged");
    // get sender information (user, params, etc)
    huemulLog.setSenderInfoNotLogged(request);

   
    /* **************     A S S I G N     *******************/
    huemulLog.setStepName("startAssign");
    // params  --> /:paramId
    // query   --> /?queryId=value
    //check inputs
    let dataError: string[] = [];
    dataError = dataError.concat(validation.departmentIdCheck(huemulData.body.departmentId));
    dataError = dataError.concat(validation.departmentNameCheck(huemulData.body.departmentName));
    dataError = dataError.concat(validation.departmentDescCheck(huemulData.body.departmentDesc));
    if (dataError.length > 0) {
      // return error --> data validation
      return huemulLog.finishErrorForEndPointLayer(response, 400, errorType.appDataValidation
          , huemulFunctions.getMessageErrorDataValitation(dataError));
    }
    
    const data: IDepartment = {
      departmentId: huemulData.body.departmentId,
      departmentName: huemulData.body.departmentName,
      departmentDesc: huemulData.body.departmentDesc,
      orgId: huemulFunctions.isEmpty(huemulData.body.orgId) ? huemulLog.getOrgId() : huemulData.body.orgId,
    };
    // example for remplace empty values to "" --> huemulFunctions.defaultValueIfEmpty(huemulData.body.yourColumn,"")
    huemulLog.setStepName("endAssign");

    // /* *********     C H E C K   D A T A   A U T H O R I Z A T I O N    *******************/
    // // check for org authorization
    // if (!isAuthorizedOrg(request, data.orgId)) {
    //   return huemulLog.finishErrorForEndPointLayer(response, 403, errorType.appForbidden, `Forbidden Org ${department.orgId}`);
    // }

    /* *********     S A V E   T O   D A T A B A S E    *******************/
    const departmentResult = await departmentLogicCreate(huemulLog.whoIAm, data);
    huemulLog.addSubProcess(departmentResult);

    /* *********     R E T U R N     *******************/
    huemulLog.setStepName("checkResults");
    if (departmentResult.isSuccessful()) {
      return huemulLog.finishSuccessfullyForEndPointLayer(response, 201, departmentResult.data);
    } else {
      // return error --> DB Error
      return huemulLog.finishErrorForEndPointLayer(response, departmentResult.getHttpStatusCodeError(), departmentResult.getErrorId(), departmentResult.getErrorTxt());
    }
  } catch (error) {
    // return error --> application
    return huemulLog.finishErrorForEndPointLayer(response, 500, errorType.appOthers, error);
  }
}



/**
* update
* @author Sebasti�n Rodr�guez Robotham
* @param {request} request
* @param {response} response
* @return {HuemulLog} result
*/
export async function departmentEndPointUpdate(request: any, response: any, huemulData: any): Promise<any> {
  const huemulLog = new HuemulLog(layerType.endPoint, moduleType.department, actionTypeDepartment.update, "app.put(/v1/)", "1.0");

  try {
    huemulLog.setStepName("setSenderInfoNotLogged");
    // get sender information (user, params, etc)
    huemulLog.setSenderInfoNotLogged(request);
    // todo: add client version, with that we can manage differents behavior

    
    /* **************     A S S I G N     *******************/
    huemulLog.setStepName("startAssign");
    // params  --> /:paramId
    // query   --> /?queryId=value

    let dataError: string[] = [];
    dataError = dataError.concat(validation.departmentIdCheck(huemulData.body.departmentId));
    dataError = dataError.concat(validation.departmentNameCheck(huemulData.body.departmentName));
    dataError = dataError.concat(validation.departmentDescCheck(huemulData.body.departmentDesc));
    if (dataError.length > 0) {
      // return error --> data validation
      return huemulLog.finishErrorForEndPointLayer(response, 400, errorType.appDataValidation
          , huemulFunctions.getMessageErrorDataValitation(dataError));
    }
    
    const data: IDepartment = {
      departmentId: huemulData.body.departmentId,
      departmentName: huemulData.body.departmentName,
      departmentDesc: huemulData.body.departmentDesc,
      orgId: huemulFunctions.isEmpty(huemulData.body.orgId) ? huemulLog.getOrgId() : huemulData.body.orgId,
    };
    // example for remplace empty values to "" --> huemulFunctions.defaultValueIfEmpty(huemulData.body.yourColumn,"")
    huemulLog.setStepName("endAssign");

    // /* *********     C H E C K   D A T A   A U T H O R I Z A T I O N    *******************/
    // // check for org authorization
    // if (!isAuthorizedOrg(request, data.orgId)) {
    //   return huemulLog.finishErrorForEndPointLayer(response, 403, errorType.appForbidden, `Forbidden Org ${department.orgId}`);
    // }

    /* *********     S A V E   T O   D A T A B A S E    *******************/
    const departmentResult = await departmentLogicUpdate(huemulLog.whoIAm, data);
    huemulLog.addSubProcess(departmentResult);

    /* *********     R E T U R N     *******************/
    huemulLog.setStepName("checkResults");
    if (departmentResult.isSuccessful()) {
      return huemulLog.finishSuccessfullyForEndPointLayer(response, 200, departmentResult.data);
    } else {
      // return error --> DB Error
      return huemulLog.finishErrorForEndPointLayer(response, departmentResult.getHttpStatusCodeError(), departmentResult.getErrorId(), departmentResult.getErrorTxt());
    }
  } catch (error) {
    // return error --> application
    return huemulLog.finishErrorForEndPointLayer(response, 500, errorType.appOthers, error);
  }
}


/**
* delete: delete one record
* @author Sebasti�n Rodr�guez Robotham
* @param {request} request
* @param {response} response
* @return {HuemulLog} result
*/
export async function departmentEndPointDelete(request: any, response: any, huemulData: any): Promise<any> {
  const huemulLog = new HuemulLog(layerType.endPoint, moduleType.department, actionTypeDepartment.delete, "app.delete(/v1/:departmentId)", "1.0");

  try {
    huemulLog.setStepName("setSenderInfoNotLogged");
    // get sender information (user, params, etc)
    huemulLog.setSenderInfoNotLogged(request);
    // todo: add client version, with that we can manage differents behavior

   
    /* **************     A S S I G N     *******************/
    huemulLog.setStepName("startAssign");
    // params  --> /:paramId
    const departmentId = request.params.departmentId;

    // query   --> /?queryId=value


    //INPUT VALIDATION
    let dataError: string[] = [];
    dataError = dataError.concat(validation.departmentIdCheck(request.params.departmentId));
    if (dataError.length > 0) {
      // return error --> data validation
      return huemulLog.finishErrorForDataLayer(errorType.appDataValidation
          , huemulFunctions.getMessageErrorDataValitation(dataError));
    }

    huemulLog.setStepName("endAssign");

    // /* *********     C H E C K   D A T A   A U T H O R I Z A T I O N    *******************/
    // // check for org authorization
    // if (!isAuthorizedOrg(request, orgId)) {
    //   return huemulLog.finishErrorForEndPointLayer(response, 403, errorType.appForbidden, `Forbidden Org ${department.orgId}`);
    // }

    /* *********     D E L E T E   F R O M    D A T A B A S E   *******************/
    const departmentResult = await departmentLogicDelete(huemulLog.whoIAm, departmentId);
    huemulLog.addSubProcess(departmentResult);

    /* *********     R E T U R N     *******************/
    huemulLog.setStepName("checkResults");
    if (departmentResult.isSuccessful()) {
      return huemulLog.finishSuccessfullyForEndPointLayer(response, 200, departmentResult.data);
    } else {
      // return error --> DB Error
      return huemulLog.finishErrorForEndPointLayer(response, departmentResult.getHttpStatusCodeError(), departmentResult.getErrorId(), departmentResult.getErrorTxt());
    }
  } catch (error) {
    // return error --> application
    return huemulLog.finishErrorForEndPointLayer(response, 500, errorType.appOthers, error);
  }
}

/**
* delete: delete multiple records
* @author Sebasti�n Rodr�guez Robotham
* @param {request} request
* @param {response} response
* @return {HuemulLog} result
*/
export async function departmentEndPointDeleteMulti(request: any, response: any, huemulData: any): Promise<any> {
  const huemulLog = new HuemulLog(layerType.endPoint, moduleType.department, actionTypeDepartment.delete, "app.deleteMulti(/v1/:departmentId)", "1.0");

  try {
    huemulLog.setStepName("setSenderInfoNotLogged");
    // get sender information (user, params, etc)
    huemulLog.setSenderInfoNotLogged(request);
    // todo: add client version, with that we can manage differents behavior

    
    /* **************     A S S I G N     *******************/
    huemulLog.setStepName("startAssign");
    // params  --> /:paramId
    const departmentIdListText: string = huemulData.body.departmentIdList;

    // query   --> /?queryId=value

    //INPUT VALIDATION
    if (huemulFunctions.isEmpty(departmentIdListText)) {
      return huemulLog.finishErrorForEndPointLayer(response, 400, errorType.appOthers, "departmentIdList cannot be empty (format: cod01,cod02...");
    }

    const departmentIdList: string[] = departmentIdListText.split(",");
    huemulLog.setStepName("endAssign");

    // /* *********     C H E C K   D A T A   A U T H O R I Z A T I O N    *******************/
    // // check for org authorization
    // if (!isAuthorizedOrg(request, orgId)) {
    //   return huemulLog.finishErrorForEndPointLayer(response, 403, errorType.appForbidden, `Forbidden Org ${department.orgId}`);
    // }

    /* *********     D E L E T E   F R O M    D A T A B A S E   *******************/
    const departmentResult = await departmentLogicDeleteMulti(huemulLog.whoIAm, departmentIdList);
    huemulLog.addSubProcess(departmentResult);

    /* *********     R E T U R N     *******************/
    huemulLog.setStepName("checkResults");
    if (departmentResult.isSuccessful()) {
      return huemulLog.finishSuccessfullyForEndPointLayer(response, 200, departmentResult.data);
    } else {
      // return error --> DB Error
      return huemulLog.finishErrorForEndPointLayer(response, departmentResult.getHttpStatusCodeError(), departmentResult.getErrorId(), departmentResult.getErrorTxt());
    }
  } catch (error) {
    // return error --> application
    return huemulLog.finishErrorForEndPointLayer(response, 500, errorType.appOthers, error);
  }
}

/**
* get one record
* @author Sebasti�n Rodr�guez Robotham
* @param {request} request
* @param {response} response
* @return {HuemulLog} result
*/
export async function departmentEndPointGetById(request: any, response: any, huemulData: any): Promise<any> {
  const huemulLog = new HuemulLog(layerType.endPoint, moduleType.department, actionTypeDepartment.get, "app.get(/v1/:departmentId)", "1.0");

  try {
    huemulLog.setStepName("setSenderInfoNotLogged");
    // get sender information (user, params, etc)
    huemulLog.setSenderInfoNotLogged(request);
    // todo: add client version, with that we can manage differents behavior

    
    /* **************     A S S I G N     *******************/
    huemulLog.setStepName("startAssign");
    // params  --> /:paramId
    const departmentId = request.params.departmentId;

    // query   --> /?queryId=value


    //INPUT VALIDATION
    let dataError: string[] = [];
    dataError = dataError.concat(validation.departmentIdCheck(request.params.departmentId));
    if (dataError.length > 0) {
      // return error --> data validation
      return huemulLog.finishErrorForDataLayer(errorType.appDataValidation
          , huemulFunctions.getMessageErrorDataValitation(dataError));
    }
    huemulLog.setStepName("endAssign");

    // /* *********     C H E C K   D A T A   A U T H O R I Z A T I O N    *******************/
    // // check for org authorization
    // if (!isAuthorizedOrg(request, orgId)) {
    //   return huemulLog.finishErrorForEndPointLayer(response, 403, errorType.appForbidden, `Forbidden Org ${department.orgId}`);
    // }

    /* *********     G E T   F R O M    D A T A B A S E    *******************/
    const departmentResult = await departmentLogicGetById(huemulLog.whoIAm, departmentId, false);
    huemulLog.addSubProcess(departmentResult);

    /* *********     R E T U R N     *******************/
    huemulLog.setStepName("checkResults");
    if (departmentResult.isSuccessful()) {
      return huemulLog.finishSuccessfullyForEndPointLayer(response, 200, departmentResult.data);
    } else {
      // return error --> DB Error
      return huemulLog.finishErrorForEndPointLayer(response, departmentResult.getHttpStatusCodeError(), departmentResult.getErrorId(), departmentResult.getErrorTxt());
    }
  } catch (error) {
    // return error --> application
    return huemulLog.finishErrorForEndPointLayer(response, 500, errorType.appOthers, error);
  }
}

/**
* get multiples records
* @author Sebasti�n Rodr�guez Robotham
* @param {request} request
* @param {response} response
* @return {HuemulLog} result
*/
export async function departmentEndPointGetAll(request: any, response: any, huemulData: any): Promise<any> {
  const huemulLog = new HuemulLog(layerType.endPoint, moduleType.department, actionTypeDepartment.getAll, "app.get(/v1/)", "1.0");

  try {
    huemulLog.setStepName("setSenderInfoNotLogged");
    // get sender information (user, params, etc)
    huemulLog.setSenderInfoNotLogged(request);
    // todo: add client version, with that we can manage differents behavior

    /* **************     A S S I G N     *******************/
    huemulLog.setStepName("startAssign");
    // params  --> /:paramId

    // query   --> /?queryId=value
huemulFunctions.getQueryByName("limit",request)
    // get page
    const page: number = huemulFunctions.getQueryByName("page",request) === undefined ? 1 : Number(huemulFunctions.getQueryByName("page",request));

    // get limit
    let limit: number = huemulFunctions.getQueryByName("limit",request) === undefined ? rowsForGetsdepartment : Number(huemulFunctions.getQueryByName("limit",request));
    if (limit > maxRowsForGetsdepartment) {
      limit = maxRowsForGetsdepartment;
    }
    if (limit <= 0) {
      limit = 1;
    }

    const filters: IDepartmentFilter = {};
    filters.departmentId = huemulFunctions.getQueryByName("departmentId",request);
    filters.departmentName = huemulFunctions.getQueryByName("departmentName",request);
    filters.departmentDesc = huemulFunctions.getQueryByName("departmentDesc",request);

    // get last Document
    let lastRecord: IDepartment | undefined;

    //INPUT VALIDATION
    /*let dataError: string[] = [];
    if (dataError.length > 0) {
      // return error --> data validation
      return huemulLog.finishErrorForDataLayer(errorType.appDataValidation
          , huemulFunctions.getMessageErrorDataValitation(dataError));
    }*/
    huemulLog.setStepName("endAssign");

    // /* *********     C H E C K   D A T A   A U T H O R I Z A T I O N    *******************/
    // // check for org authorization
    // if (!isAuthorizedOrg(request, orgId)) {
    //   return huemulLog.finishErrorForEndPointLayer(response, 403, errorType.appForbidden, `Forbidden Org ${department.orgId}`);
    // }

    /* *********     G E T   F R O M    D A T A B A S E    *******************/
    const departmentResult = await departmentLogicGetAll(huemulLog.whoIAm, filters, false, limit, page, lastRecord);
    huemulLog.addSubProcess(departmentResult);

    /* *********     R E T U R N     *******************/
    huemulLog.setStepName("checkResults");
    if (departmentResult.isSuccessful()) {
      return huemulLog.finishSuccessfullyForEndPointLayer(response, 200, departmentResult.data);
    } else {
      // return error --> DB Error
      return huemulLog.finishErrorForEndPointLayer(response, departmentResult.getHttpStatusCodeError(), departmentResult.getErrorId(), departmentResult.getErrorTxt());
    }
  } catch (error) {
    // return error --> application
    return huemulLog.finishErrorForEndPointLayer(response, 500, errorType.appOthers, error);
  }
}