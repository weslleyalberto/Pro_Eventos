import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
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
    private router:ActivatedRoute,
    private eventoService:EventoService,
    private spinner: NgxSpinnerService,
    private toaster:ToastrService
  ) { 
    this.localeService.use('pt-br');
  }
  salvarAlteracao(){
    this.spinner.show();
    if(this.form.valid){
     console.log(this.estadoSalvar);
     this.evento = (this.estadoSalvar == 'post') ? this.evento = {... this.form.value} 
     : this.evento = {id: this.evento.id ,... this.form.value};
      
      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        () =>{
          this.toaster.success('Evento salvo com sucesso!',"Sucesso!");
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
    const  eventoIdParam = this.router.snapshot.paramMap.get('id');
    this.spinner.show();

    
    if(eventoIdParam !== null ){
      this.estadoSalvar = 'put';
      this.eventoService.getEventById(+eventoIdParam)
      .subscribe(
        (evento:Evento) => {
          this.evento =   {... evento};
          this.form.patchValue(this.evento);
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
      quantidade:[lote.quantidade],
    }));
  }
  resetForm(){
    this.form.reset();
  }
  cssValitador(campoForm:FormControl):any{
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }
}
