import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
readonly baseURL:string = 'https://localhost:7280/api/Eventos';
constructor(private http:HttpClient) { }
  

  public getEventos():Observable<Evento[]>{
    return this.http.get<Evento[]>(this.baseURL);
    
  }
  public getEventosByTema(tema:string):Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseURL}${tema}/tema`);
    
    
  }
  public getEventById(id:number):Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
    
  }

}


