import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showMaterialDropdown = false;
  showCadastroDropdown = false;

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
    // Fechar todos os dropdowns ao navegar
    this.showMaterialDropdown = false;
    this.showCadastroDropdown = false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
