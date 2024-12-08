import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  
  public eventos:any=[];
  readonly widthImage:number = 100;
  readonly marginImage = 2;
  mostrarImagem:boolean = true;
  private _filtroLista:string ="";
  public eventosFiltrados:any = [];
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }
  public getEventos(){
    this.http.get('https://localhost:5190/api/eventos')
    .subscribe(
        (response) =>{
          this.eventos = response;
          this.eventosFiltrados = this.eventos;
         
        },
       (error) =>{
        console.log(error)
       }
    );
   
  }
  alterarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }
  public get filtroLista():string{
    return  this._filtroLista;
  }
  public set filtroLista(value:string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista):
    this.eventos;
  }
  filtrarEventos(filtrarPor:string):any{
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.eventos.filter(
      (      evento: { tema: string; local: string; }) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

}
