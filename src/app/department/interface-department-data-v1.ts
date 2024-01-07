
/* eslint max-len: ["error", { "code": 400 }] */
import {huemulBaseColumnsInfo, IHuemulBase} from "../../common/huemul/interfaces/interface-huemul-base-data-v1";
import {IHuemulColumnDef} from "../../common/huemul/interfaces/interface-huemul-column-def";

/**
 * department interface
 * @author Sebasti�n Rodr�guez Robotham
 * @description: Department Information
 */
export interface IDepartment extends IHuemulBase {
  departmentId: string,
  departmentName: string,
  departmentDesc: string,
  orgId: string
}

export interface IDepartmentFilter {
  departmentId?: string,
  departmentName?: string,
  departmentDesc?: string,
}
export const departmentColumnsInfo: IHuemulColumnDef[] = [
  {columnName: "departmentId", columnType: "string", columnLength: 50,  columnDescription: "Department Id", pkType: "manualPK", allowNull: false, required: true, numOrderInGet: 0, columnPosition: 1, PKModuleName: '' , PKModuleNameId: '', PKModuleAliasColumnName: '' } as IHuemulColumnDef, 
  {columnName: "departmentName", columnType: "string", columnLength: 100,  columnDescription: "Department Name", pkType: "none", allowNull: false, required: true, numOrderInGet: 1, columnPosition: 3, PKModuleName: '' , PKModuleNameId: '', PKModuleAliasColumnName: '' } as IHuemulColumnDef, 
  {columnName: "departmentDesc", columnType: "string", columnLength: 1000,  columnDescription: "Desc", pkType: "none", allowNull: false, required: true, numOrderInGet: 0, columnPosition: 4, PKModuleName: '' , PKModuleNameId: '', PKModuleAliasColumnName: '' } as IHuemulColumnDef, 
  {columnName: "orgId", columnType: "string", columnLength: 50,  columnDescription: "Organization Id", pkType: "none", allowNull: false, required: true, numOrderInGet: 0, columnPosition: 5, PKModuleName: '' , PKModuleNameId: '', PKModuleAliasColumnName: '' } as IHuemulColumnDef, 
].concat(huemulBaseColumnsInfo);
