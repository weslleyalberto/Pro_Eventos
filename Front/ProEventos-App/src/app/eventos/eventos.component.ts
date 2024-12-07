import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  
  public eventos:any;

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }
  public getEventos(){
    this.http.get('https://localhost:5190/api/eventos')
    .subscribe(
        response => this.eventos = response,
       error =>console.log(error)
    );
   
  }

}
