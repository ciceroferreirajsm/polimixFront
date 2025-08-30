import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.username || !this.password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          console.log('Login successful', response);
          // Salvar dados do usuário se necessário
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
          // Redirecionar para a tela home
          this.router.navigate(['/home']);
        },
        error: (error) => { 
          this.router.navigate(['/home']);

          console.error('Login failed', error);
          alert('Erro no login. Verifique suas credenciais.');
        }
      });
  }
}
