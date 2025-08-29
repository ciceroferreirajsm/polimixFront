import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showMaterialDropdown = false;
  showCadastroDropdown = false;

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.showMaterialDropdown = false;
    this.showCadastroDropdown = false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
