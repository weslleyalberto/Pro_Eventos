import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  form!:FormGroup;
  evento!:Evento;
  eventoId!:number;
  get modoEditar():boolean{
    return this.estadoSalvar === 'put';
  }
  estadoSalvar:string='post';
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
  get lotes():FormArray{
    return this.form.get('lotes') as FormArray;
  }

  constructor(private fb:FormBuilder,
    private localeService: BsLocaleService,
    private activatedRoute:ActivatedRoute,
    private eventoService:EventoService,
    private spinner: NgxSpinnerService,
    private toaster:ToastrService,
    private router:Router,
    private loteService: LoteService
    
  ) { 
    this.localeService.use('pt-br');
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

    
    if(this.eventoId !== null ){
      this.estadoSalvar = 'put';
      this.eventoService.getEventById(this.eventoId)
      .subscribe(
        (evento:Evento) => {
          this.evento =   {... evento};
          this.form.patchValue(this.evento);
          this.carregarLotes();
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
  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
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
  carregarLotes(){
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesREtorno:Lote[]) => {
        lotesREtorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        });
      },
      (error:any) => {
        console.log(error);
        this.toaster.error("Erro ao tentar carregar lotes","Erro!");
      }
    ).add(() => this.spinner.hide());
  }
  adicionarLote(){
    this.lotes.push(this.criarLote({id:0}as Lote));
  }
  criarLote(lote:Lote): FormGroup{
    return (this.fb.group({
     
      id:[lote.id],
      nome:[lote.nome,Validators.required],
      preco:[lote.quantidade,Validators.required],
      dataInicio:[lote.dataInicio],
      dataFim:[lote.dataInicio],
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
    this.spinner.show();
    if(this.form.controls.lotes.valid){
      this.loteService.saveLote(this.evento.id,this.form.value.lotes).subscribe(
        () => {
            this.toaster.success('Lotes salvos com sucesso!','Sucesso!');
            this.lotes.reset();
        },
        (error) => {
              this.toaster.error('Erro ao tentar salvar lotes','Erro!');
        }
      ).add(() => this.spinner.hide());
    }
  }
}
