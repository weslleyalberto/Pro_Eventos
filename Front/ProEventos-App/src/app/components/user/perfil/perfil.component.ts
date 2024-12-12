import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  formRegistration!:FormGroup;
  constructor(private fb:FormBuilder) { }

  get form():any{
    return this.formRegistration.controls;
  }
  ngOnInit() {
    this.validation();
  }
  validation(){
    const formOptions : AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password','confirmPassword')
    };
    this.formRegistration = this.fb.group({
      firstName: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      lastName: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      email: ['',[Validators.required, Validators.email]],
      telefone: ['',[Validators.required]],
      descricao: ['',[Validators.required]],
      password: ['',[Validators.required,Validators.minLength(4)]],
      confirmPassword: ['',[Validators.required,Validators.minLength(4)]],
      role: ['',[Validators.required]],
      titulo: ['',[Validators.required]],

    }, formOptions)
  }
}
