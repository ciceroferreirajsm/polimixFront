import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialBaseService {
  private apiUrl = 'http://localhost:5098/api/MaterialBase';

  constructor(private http: HttpClient) {}

  search(
    displayStart: number = 0,
    displayLength: number = 10,
    filtroNome: string = ''
  ): Observable<any> {
    const searchData = {
      sEcho: "2",
      iDisplayStart: displayStart.toString(),
      iDisplayLength: displayLength.toString(),
      iSortCol_0: null,
      sSortDir_0: null,
      sColumns: "IdMaterialBase,Nome",
      DisplayStart: displayStart,
      DisplayLength: displayLength,
      SortCol_0: 0,
      Columns: ["IdMaterialBase", "Nome"],
      QtyColumn: 2,
      FilterColumns: filtroNome ? [
        {
          Column: "Nome",
          Value: filtroNome
        }
      ] : []
    };

    return this.http.post(`${this.apiUrl}/search`, searchData);
  }
}
