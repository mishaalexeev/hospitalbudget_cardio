import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RegionsListResponse} from "../model/regions-list-response";
import {TarrifTableResponseModel} from "../model/tarrif-table-response-model";

@Injectable()
export class TarrifsService {

  private readonly BASE = "http://85.234.106.147:8080";

  constructor(private _httpClient: HttpClient) {
  }

  public loadRegions(): Observable<RegionsListResponse> {
    return this._httpClient.get<RegionsListResponse>(`${this.BASE}/region_coefficients`);
  }

  public loadTarrifs(region: string): Observable<TarrifTableResponseModel> {
    return this._httpClient.get<TarrifTableResponseModel>(`${this.BASE}/get_tariff?region=${region}`);
  }

}
