import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;
 
  public eventos:any=[];
  readonly widthImage:number = 100;
  readonly marginImage = 2;
  mostrarImagem:boolean = true;
  private _filtroLista:string ="";
  public eventosFiltrados:any = [];
  constructor(private eventoService:EventoService,
    private modalService:BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router:Router
  ) {}

   
   

  public ngOnInit(): void {
    this.getEventos();
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 2000);
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
  getEventos(){
    this.eventoService.getEventos()
    .subscribe(
        (_eventos:Evento[]) =>{
          this.eventos = _eventos;
          this.eventosFiltrados = this.eventos;
         
        },
       (error) =>{
        console.log(error)
        this.spinner.hide();
        this.toastr.error("Erro ao carregar eventos", "Erro")
       },
      
      //  () => this.spinner.hide()
       
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
  detalheEvento(id:number){
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

}