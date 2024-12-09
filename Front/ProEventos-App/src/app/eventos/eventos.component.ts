
import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  modalRef?: BsModalRef;
 
  public eventos:any=[];
  readonly widthImage:number = 100;
  readonly marginImage = 2;
  mostrarImagem:boolean = true;
  private _filtroLista:string ="";
  public eventosFiltrados:any = [];
  constructor(private eventoService:EventoService,
    private modalService:BsModalService,
    private toastr: ToastrService
  ) {}

   
   

  public ngOnInit(): void {
    this.getEventos();
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
   
    this.modalRef?.hide();
    this.toastr.success('O evento foi deletado com sucesso.', 'Deletado!');
  }
 
  decline(): void {
    
    this.modalRef?.hide();
  }
  public getEventos(){
    this.eventoService.getEventos()
    .subscribe(
        (_eventos:Evento[]) =>{
          this.eventos = _eventos;
          this.eventosFiltrados = this.eventos;
         
        },
       (error) =>{
        console.log(error)
       }
    );
   
  }
  public alterarImagem(){
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
  public filtrarEventos(filtrarPor:string):Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.eventos.filter(
      (      evento: { tema: string; local: string; }) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

}
