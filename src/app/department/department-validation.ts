
/* eslint max-len: ["error", { "code": 400 }] */
import * as huemulFunctions from "../../common/huemul/huemul-functions";
import { departmentColumnsInfo } from "./interface-department-data-v1";

/* ******************************************************************** */
/* ********   D A T A   V A L I D A T I O N   M E T H O D S    ******** */
/* ******************************************************************** */

/**
* data validation for field departmentId
* @author Sebasti�n Rodr�guez Robotham
* @param {string} departmentId Department Id
* @return {string[]}
*/
export function departmentIdCheck(departmentId: string): string[] {
  const result: string[] = [];
  if (huemulFunctions.isEmpty(departmentId)) {
    result.push(`departmentId(value: [${departmentId}]) not found or is empty`);
  }
  
  const columnDef= departmentColumnsInfo.filter(x => x.columnName === "departmentId");
  if (columnDef.length === 1 && !huemulFunctions.isEmpty(columnDef[0].columnLength) && columnDef[0].columnLength! > 0) {
    if (departmentId?.length > columnDef[0].columnLength!) {
      result.push(`departmentId(value: [${departmentId}]) length is greater than ${columnDef[0].columnLength}`);
    }
  }

  return result;
}

/**
* data validation for field departmentParentId
* @author Sebasti�n Rodr�guez Robotham
* @param {string} departmentParentId Parent Department Id
* @return {string[]}
*/
export function departmentParentIdCheck(departmentParentId?: string): string[] {
  const result: string[] = [];
// custom code here
  return result;
}

/**
* data validation for field departmentName
* @author Sebasti�n Rodr�guez Robotham
* @param {string} departmentName Department Name
* @return {string[]}
*/
export function departmentNameCheck(departmentName: string): string[] {
  const result: string[] = [];
  if (huemulFunctions.isEmpty(departmentName)) {
    result.push(`departmentName(value: [${departmentName}]) not found or is empty`);
  }
  
  const columnDef= departmentColumnsInfo.filter(x => x.columnName === "departmentName");
  if (columnDef.length === 1 && !huemulFunctions.isEmpty(columnDef[0].columnLength) && columnDef[0].columnLength! > 0) {
    if (departmentName?.length > columnDef[0].columnLength!) {
      result.push(`departmentName(value: [${departmentName}]) length is greater than ${columnDef[0].columnLength}`);
    }
  }

  return result;
}


/**
* data validation for field departmentDesc
* @author Sebasti�n Rodr�guez Robotham
* @param {string} departmentDesc Department Desc
* @return {string[]}
*/
export function departmentDescCheck(departmentDesc: string): string[] {
  const result: string[] = [];
  if (huemulFunctions.isEmpty(departmentDesc)) {
    result.push(`departmentDesc(value: [${departmentDesc}]) not found or is empty`);
  }
  
  const columnDef= departmentColumnsInfo.filter(x => x.columnName === "departmentDesc");
  if (columnDef.length === 1 && !huemulFunctions.isEmpty(columnDef[0].columnLength) && columnDef[0].columnLength! > 0) {
    if (departmentDesc?.length > columnDef[0].columnLength!) {
      result.push(`departmentDesc(value: [${departmentDesc}]) length is greater than ${columnDef[0].columnLength}`);
    }
  }

  return result;
}



/**
* data validation for field orgId
* @author Sebasti�n Rodr�guez Robotham
* @param {string} orgId Organization Id
* @return {string[]}
*/
export function orgIdCheck(orgId: string): string[] {
  const result: string[] = [];
  if (huemulFunctions.isEmpty(orgId)) {
    result.push(`orgId(value: [${orgId}]) not found or is empty`);
  }
  
  const columnDef= departmentColumnsInfo.filter(x => x.columnName === "orgId");
  if (columnDef.length === 1 && !huemulFunctions.isEmpty(columnDef[0].columnLength) && columnDef[0].columnLength! > 0) {
    if (orgId?.length > columnDef[0].columnLength!) {
      result.push(`orgId(value: [${orgId}]) length is greater than ${columnDef[0].columnLength}`);
    }
  }

  return result;
}


