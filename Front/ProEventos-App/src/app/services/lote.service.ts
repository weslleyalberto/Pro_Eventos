import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote } from '@app/models/Lote';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

[key: string]: any;
readonly baseURL:string = 'https://localhost:7280/api/Lotes';
constructor(private http:HttpClient) { }
  

  public getLotesByEventoId(eventoId:number):Observable<Lote[]>{
    return this.http.get<Lote[]>(`${this.baseURL}/${eventoId}`).pipe(take(1));
    
  }
 
  
  public saveLote(eventoID:number , lotes:Lote[]):Observable<Lote[]>{
    return this.http.put<Lote[]>(`${this.baseURL}/${eventoID}`,lotes).pipe(take(1));
    
  }
  public deleteLote(eventoID:number,loteID:number) : Observable<any>{
    return this.http.delete(`${this.baseURL}/${eventoID}/${loteID}`).pipe(take(1));
    
  }

}
