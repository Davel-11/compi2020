import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntegrantesComponent } from './content/integrantes/integrantes/integrantes.component';
import { HomeComponent } from './content/home/home/home.component';
import { CompiladorComponent } from './content/compilador/compilador.component';
import { TestOrellanaComponent } from './content/test-orellana/test-orellana.component';
import { CompierrorComponent } from './content/compilador/compierror/compierror.component';


const routes: Routes = [
  {path: '', component: CompiladorComponent },
  {path: 'integrantes', component: IntegrantesComponent},
  {path: 'info', component: HomeComponent },
  {path: 'testsec', component: TestOrellanaComponent },
  {path: 'modal', component: CompierrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
