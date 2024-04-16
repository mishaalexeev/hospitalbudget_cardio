import {MiCostData} from "./mi-cost-data";

export interface MiForChkvResultModel {
  rota_pro_cost: number;
  ra_with_three_stents: number;
  mi_cost_data: MiCostData[];
  vsuzi_percent: number;
  okt_percent: number;
}
