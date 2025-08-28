import { Component } from '@angular/core';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],
  template: '<app-login></app-login>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'polimixFront';
}
