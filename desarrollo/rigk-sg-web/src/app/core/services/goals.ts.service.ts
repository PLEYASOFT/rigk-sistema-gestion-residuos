import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoalsTsService {
  url = `${environment.API_V1_URL}/goals`;

  constructor(private http: HttpClient) { }

  getAllGoals(){
    return this.http.get<any>(`${this.url}/goals`);
  }

  saveGoals(body:any) {
    return this.http.post<any>(`${this.url}/saveGoals`, body);
  }

  updateGoals(body:any) {
    return this.http.put<any>(`${this.url}/updateGoals`, body);
  }

  getGoalsYear(year: any){
    return this.http.get<any>(`${this.url}/goalsYear/${year}`);
  }
}
