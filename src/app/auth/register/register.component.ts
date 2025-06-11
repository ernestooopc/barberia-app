import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../auth.service';
import { UppercaseDirective } from '../../../shared/nav/uppercase.directive';
import { ToastrService } from 'ngx-toastr';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('contrasena')?.value;
  const cpw = control.get('confirmPassword')?.value;
  return pw === cpw ? null : { noMatch: true };
}

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UppercaseDirective
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre:         ['', Validators.required],
      apellido:         ['', Validators.required],
      correo:         ['', [Validators.required, Validators.email]],
      contrasena:     ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword:['', Validators.required],
      tipoCliente:    ['NUEVO', Validators.required],
    }, { validators: passwordMatchValidator });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { nombre,apellido, correo, contrasena, tipoCliente } = this.registerForm.value;

    const nuevoUsuario: Usuario = {
      nombre,
      apellido,
      correo,
      contrasena,
      rol: 'USUARIO',
      tipoCliente,
    };

     this.authService.register(nuevoUsuario).subscribe({
  next: () => {
    this.toastr.success(
      'Tu cuenta ha sido creada con éxito',
      '¡Bienvenido!'
    );
    this.router.navigate(['/login']);
  },
  error: err => {
    const msg = err.error ?? 'No se pudo registrar';
    this.toastr.error(msg, 'Error en el registro');
    this.error = msg;
  }
});

  }
}

