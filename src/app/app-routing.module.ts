import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntegrantesComponent } from './content/integrantes/integrantes/integrantes.component';
import { HomeComponent } from './content/home/home/home.component';
import { CompiladorComponent } from './content/compilador/compilador.component';
import { TestRockaComponent } from './content/test-rocka/test-rocka.component';
import { TestOrellanaComponent } from './content/test-orellana/test-orellana.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'integrantes', component: IntegrantesComponent},
  {path: 'compilador', component: CompiladorComponent },
  {path: 'testone', component: TestRockaComponent },
  {path: 'testsec', component: TestOrellanaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
