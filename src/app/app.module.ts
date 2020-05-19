import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuLeftComponent } from './menu-left/menu-left/menu-left.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import { IntegrantesComponent } from './content/integrantes/integrantes/integrantes.component';
import { HomeComponent } from './content/home/home/home.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CompiladorComponent } from './content/compilador/compilador.component';
import { TestRockaComponent } from './content/test-rocka/test-rocka.component';
import { TestOrellanaComponent } from './content/test-orellana/test-orellana.component';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import { CompierrorComponent } from './content/compilador/compierror/compierror.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuLeftComponent,
    IntegrantesComponent,
    HomeComponent,
    CompiladorComponent,
    TestRockaComponent,
    TestOrellanaComponent,
    CompierrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
