import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {MiForChkvTableModel} from "../model/mi-for-chkv-table-model";
import {Observable} from "rxjs";
import {MiForChkvResultModel} from "../model/mi-for-chkv-result-model";

@Injectable()
export class MiPricingService {

  private readonly BASE = "http://85.234.106.147:8080";

  constructor(private _httpClient: HttpClient) {
  }

  public calculateMi(data: MiForChkvTableModel): Observable<MiForChkvResultModel> {
    return this._httpClient.post<MiForChkvResultModel>(`${this.BASE}/mi_cost`, data);
  }

}
