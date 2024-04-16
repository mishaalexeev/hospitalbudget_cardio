export interface IncomesOutcomesModel {
  haveQuotas: boolean;
  groupNumber: number;
  patientModel: string;
  healingMethod: string;
  summaryPatientsCount: number;
  countNeedToRA: number;
  tariff: number;
  lpu1withoutRotateAtr: number;
  lpu1withRotateAtr: number;
  lpu2withoutRotateAtr: number;
  lpu2withRotateAtr: number;
  summaryOutcomeForMaterials: number;
  budgetLpu: number;
  incomeLpu: number;
}
