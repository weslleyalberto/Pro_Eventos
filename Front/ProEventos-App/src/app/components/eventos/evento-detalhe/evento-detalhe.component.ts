import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  modalRef?:BsModalRef;
  form!:FormGroup;
  evento!:Evento;
  eventoId!:number;
  estadoSalvar:string='post';
  estadoSalvado!:boolean;
  loteAtual = { id:0, nome:'',indice:0};
  constructor(private fb:FormBuilder,
    private localeService: BsLocaleService,
    private activatedRoute:ActivatedRoute,
    private eventoService:EventoService,
    private spinner: NgxSpinnerService,
    private toaster:ToastrService,
    private router:Router,
    private loteService: LoteService,
    private modalService:BsModalService
    
  ) { 
    this.localeService.use('pt-br');
  
  }
  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
    this.estadoSalvado = false;

  }

  get modoEditar():boolean{
    return this.estadoSalvar === 'put';
  }
 
  get f():any{
    return this.form.controls;
  }
  get bsConfig():any{
    return { isAnimated: true , 
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass:'theme-default',
      showWeekNumbers:false,

    };
  }
  get bsConfigLote():any{
    return { isAnimated: true , 
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass:'theme-default',
      showWeekNumbers:false,

    };
  }
  get lotes():FormArray{
    return this.form.get('lotes') as FormArray;
  }

 
  salvarEvento(){
    this.spinner.show();
    if(this.form.valid){
     console.log(this.estadoSalvar);
     this.evento = (this.estadoSalvar == 'post') ? this.evento = {... this.form.value} 
     : this.evento = {id: this.evento.id ,... this.form.value};
      
      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        (eventoRetorno:Evento) =>{
          this.toaster.success('Evento salvo com sucesso!',"Sucesso!");
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
          
        },
        (error:any) => {
              console.log(error);
              this.spinner.hide();
              this.toaster.error('Erro ao tentar salvar evento','error!');
        },
        () => {
          this.spinner.hide();
        }
      )  
    }
  }
  carregarEvento(){
    this.eventoId = this.activatedRoute.snapshot.paramMap.get('id') as any;
    
    

    console.log(this.eventoId);
    this.spinner.show();

    
    if(this.eventoId !== null  && this.eventoId !== 0){
      this.estadoSalvar = 'put';
      this.eventoService.getEventById(this.eventoId)
      .subscribe(
        (evento:Evento) => {
          this.evento =   {... evento};
          this.form.patchValue(this.evento);
          this.carregarLotes(evento.lotes);
        },
        (error:any) => {console.log(error);
          this.spinner.hide();
          this.toaster.error('Erro ao tentar carregar evento','error!');
        },
        () => {this.spinner.hide();}
      );
      
    }
    else{
      this.spinner.hide();
      console.log('Evento não encontrado');
    }
    
  }
 
  validation() {
    this.form =this.fb.group({
      local:  ['', [Validators.required]],
      dataEvento:  ['', [Validators.required]],
      tema:  ['', [Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
      qtdPessoas:  ['', [Validators.required,Validators.max(120000)]],
      imageURL:  ['', [Validators.required]],
      telefone:  ['', [Validators.required]],
      email:  ['', [Validators.required,Validators.email]],
      lotes :this.fb.array([]),
    });
    
  }
  carregarLotes(lotes:Lote[]){
    lotes.forEach(lote => {
      this.lotes.push(this.criarLote(lote));
    });
    // this.loteService.getLotesByEventoId(this.eventoId).subscribe(
    //   (lotesREtorno:Lote[]) => {
    //     lotesREtorno.forEach(lote => {
    //       this.lotes.push(this.criarLote(lote));
    //     });
    //   },
    //   (error:any) => {
    //     console.log(error);
    //     this.toaster.error("Erro ao tentar carregar lotes","Erro!");
    //   }
    // ).add(() => this.spinner.hide());
  }
  adicionarLote(){
    this.lotes.push(this.criarLote({id:0}as Lote));
  }
  criarLote(lote:Lote): FormGroup{
    return (this.fb.group({
     
      id:[lote.id],
      nome:[lote.nome,Validators.required],
      preco:[lote.preco,Validators.required],
      dataInicio:[lote.dataInicio],
      dataFim:[lote.dataFim],
      quantidade:[lote.quantidade,[Validators.required,Validators.min(5), Validators.max(250)]],
    }));
  }
  resetForm(){
    this.form.reset();
  }
  cssValitador(campoForm:FormControl | AbstractControl | null):any{
    return {'is-invalid': campoForm?.errors && campoForm?.touched};
  }
  salvarLotes(){
    
    if(this.form.controls.lotes.valid){
      this.spinner.show();
      this.loteService.saveLote(this.evento.id,this.form.value.lotes).subscribe(
        () => {
            this.toaster.success('Lotes salvos com sucesso!','Sucesso!');
            // this.lotes.reset();
        },
        (error) => {
              this.toaster.error('Erro ao tentar salvar lotes','Erro!' + error);
        }
      ).add(() => this.spinner.hide());
    }
    
  }
  excluirLote(template: TemplateRef<any>,index:number){
   this.loteAtual.id = this.lotes.get(index + '.id')?.value;
   this.loteAtual.nome = this.lotes.get(index + '.nome')?.value;
   this.loteAtual.indice = index;
    this.modalRef = this.modalService.show(template,{class:'modal-sm'});
    
  }
  retornaTitleLote(index:number) : string | null{

     let nomeLote = this.lotes.get(index + '.nome')?.value;
     if(nomeLote == null || nomeLote == ''){
      return "Lote";
     }
     else{
      return nomeLote;
     }
  }

  confirmDeleteLote(){
      this.modalRef?.hide();
        this.spinner.show();

      this.loteService.deleteLote(this.eventoId,this.loteAtual.id).subscribe(
        () => {
          
              this.toaster.success('Lote excluido com sucesso!','Sucesso!');  
              // this.lotes.removeAt(this.loteAtual.indice);
        },
        (error) => {
           
            this.toaster.error(`Erro ao tentar deletar um lote  id: ${this.loteAtual.id}`,'Erro!');
            console.log(error);
        }
      ).add(() => this.spinner.hide());
      this.lotes.removeAt(this.loteAtual.indice);
  }
  declineDeleteLote(){
    this.modalRef?.hide();
  }
  // excluirLote(id:number){
  //   this.estadoSalvado = true;
  //   let loteid = this.lotes.at(id).get('id')?.value;
  //   console.log("lote id lote: " + id);
  //  if(loteid == null){
  //    this.toaster.error("Lote não pode ser excluido","Erro!");
    
  //  }else{
  //    this.spinner.show();
  //    this.loteService.deleteLote(this.eventoId,loteid).subscribe(
  //     () => {
  //           this.toaster.success('Lote excluido com sucesso!','Sucesso!');
  //           this.lotes.removeAt(id);
            
  //     },
  //     (error) => {
  //           this.toaster.error('Erro ao tentar excluir lote','Erro!');
  //           console.log(error);
  //     }
  //    ).add(() => this.spinner.hide());
    
  //  }
  //  this.lotes.removeAt(loteid);
            
    
  // }
  
}
