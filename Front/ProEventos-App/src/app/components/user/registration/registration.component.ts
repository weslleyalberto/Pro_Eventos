import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  formRegistration!:FormGroup;

  get form():any{
    return this.formRegistration.controls;
  }
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.validation();
  }
  validation(){
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmPassword'),
    };
    this.formRegistration = this.fb.group({
      primaryName : ['',[Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
      lastName : ['',[Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
      email : ['',[Validators.required,Validators.email]],
      userName : ['',[Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
      password : ['',[Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
      confirmPassword : ['',[Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
      
      // checkboxConfirm : ['',[Validators.required]]
    },formOptions);
  }

}
