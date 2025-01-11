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
  eventoId!: number;
  evento!:Evento;
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
    this.carregarEventos();
    this.spinner.show();
    
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 2000);
  }
  openModal(event:any,template: TemplateRef<any>, eventoId: number) {
    event.stopPropagation();
    this.eventoId = eventoId;
    //Codigo API 
    this.eventoService.getEventById(eventoId).subscribe(
      (evento) =>  this.evento =  {...evento},
      (error) => console.log(error)
    );
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
  // public imageURL(idEvento:number){
  //   const baseURL = 'https://localhost:7280/resources/images/';
  //   if(this.evento.imageURL === null || this.evento.imageURL === ''){
  //     return baseURL + '../../../../assets/upload.png';
  //   }
  //   else{
  //     return baseURL + this.evento.imageURL;
  //   }
  // }
  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result) => { // Callback de sucesso
        console.log(result);
        this.toastr.success('O evento foi deletado com sucesso.', 'Deletado!');
        this.carregarEventos();
        
        
      },
      (error) => { // Callback de erro
        this.toastr.error(`Erro ao deletar eventoId: ${this.eventoId}`, 'Erro!');
        console.log(error);
        
      }
    ).add(() => this.spinner.hide());
    
    
    
  }
  
  decline(): void {
    
    this.modalRef?.hide();
  }
  carregarEventos(){
    this.eventoService.getEventos()
    .subscribe(
      (_eventos:Evento[]) =>{
        const eventoInterno =this.eventoInterno(_eventos);
         
        this.eventos= eventoInterno;
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
  private eventoInterno(eventos:Evento[]):Evento[]{
    eventos.forEach((evento) => {
      if(evento.imageURL === null || evento.imageURL === ''){
         evento.imageURL = '../../../../assets/upload.png';
      }
      else{
        evento.imageURL = `https://localhost:7280/resources/images/${evento.imageURL}`;
      }
      
    });
    return eventos;
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
