import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';
import {take} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EventoService {
[key: string]: any;
readonly baseURL:string = 'https://localhost:7280/api/Eventos';
constructor(private http:HttpClient) { }
  

  public getEventos():Observable<Evento[]>{
    return this.http.get<Evento[]>(this.baseURL).pipe(take(1));
    
  }
  public getEventosByTema(tema:string):Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseURL}${tema}/tema`).pipe(take(1));
    
    
  }
  public getEventById(id:number):Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/${id}`).pipe(take(1));
    
  }
  public post(evento:Evento):Observable<Evento>{
    return this.http.post<Evento>(this.baseURL,evento).pipe(take(1));
    
  }
  public put(evento:Evento):Observable<Evento>{
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`,evento).pipe(take(1));
    
  }
  public deleteEvento(id:number) : Observable<any>{
    return this.http.delete(`${this.baseURL}/${id}`).pipe(take(1));
    
  }
  postUpload(eventoId:number, file:FileList) : Observable<Evento>{
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);
    return this.http.post<Evento>(`${this.baseURL}/upload-image/${eventoId}`,formData)
    .pipe(take(1));
  }

}


