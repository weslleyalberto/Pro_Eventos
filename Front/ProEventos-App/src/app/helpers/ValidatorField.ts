import { AbstractControl, ValidatorFn } from '@angular/forms';

export class ValidatorField {
  static MustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl) => {
      const formGroup = control as any; // Assegure que o tipo é FormGroup
      const controlToMatch = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (!controlToMatch || !matchingControl) {
        return null; // Retorna null se os controles não existirem
      }

      // Se já foi validado anteriormente, evita marcar o campo como touched/desnecessário
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      // Define o erro `mustMatch` no campo correspondente
      if (controlToMatch.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }

      return null; // Sempre retorna null, pois é um validador de grupo
    };
  }
}
