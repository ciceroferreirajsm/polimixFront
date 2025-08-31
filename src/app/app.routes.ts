import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MaterialBaseComponent } from './components/material-base/material-base.component';
import { MaterialClasseComponent } from './components/material-classe/material-classe.component';
import { MaterialTipoComponent } from './components/material-tipo/material-tipo.component';
import { MaterialComplementoComponent } from './components/material-complemento/material-complemento.component';
import { MaterialUnidadeMedidaComponent } from './components/material-unidade-medida/material-unidade-medida.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },

  // Rotas do Material
  { path: 'material-base', component: MaterialBaseComponent },
  { path: 'classe', component: MaterialClasseComponent },
  { path: 'tipo', component: MaterialTipoComponent },
  { path: 'complemento', component: MaterialComplementoComponent },
  { path: 'unidade-medida', component: MaterialUnidadeMedidaComponent },

  // Rotas do Cadastro
  { path: 'fornecedor', component: HomeComponent },
  { path: 'fabrica', component: HomeComponent },

  // Outras rotas
  { path: 'inicio', component: HomeComponent },
  { path: 'produto-ctt', component: HomeComponent },
  { path: 'produto-unidade', component: HomeComponent },
  { path: 'calculadora', component: HomeComponent },

  { path: '**', redirectTo: '/login' }
];
