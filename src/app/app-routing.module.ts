import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntegrantesComponent } from './content/integrantes/integrantes/integrantes.component';
import { HomeComponent } from './content/home/home/home.component';
import { SeparadoresComponent } from './content-right/separadores/separadores.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'integrantes', component: IntegrantesComponent},
  {path: 'separador', component: SeparadoresComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
