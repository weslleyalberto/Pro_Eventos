import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '@app/models/Evento';
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
  evento!:Evento;;
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

  constructor(private fb:FormBuilder,
    private localeService: BsLocaleService,
    private router:ActivatedRoute,
    private eventoService:EventoService,
    private spinner: NgxSpinnerService,
    private toaster:ToastrService
  ) { 
    this.localeService.use('pt-br');
  }
  carregarEvento(){
    const  eventoIdParam = this.router.snapshot.paramMap.get('id');
    this.spinner.show();
    if(eventoIdParam !== null ){
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
      imagemURL:  ['', [Validators.required]],
      telefone:  ['', [Validators.required]],
      email:  ['', [Validators.required,Validators.email]]
    });
  }
  resetForm(){
    this.form.reset();
  }
  cssValitador(campoForm:FormControl):any{
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }
}
