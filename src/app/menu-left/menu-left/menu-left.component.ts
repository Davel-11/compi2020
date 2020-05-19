import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss']
})
export class MenuLeftComponent implements OnInit {

  home  = false;
  integrantes = false;
  compilador = false;
  rocka = false;
  orellana = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  resetValues() {
    this.home  = false;
    this.integrantes = false;
    this.compilador = false;
    this.rocka = false;
    this.orellana = false;
  }

  navigate(navigateTo: string) {
    
    this.resetValues();

    if ( navigateTo === 'integrantes') {
      this.integrantes = true;
      this.router.navigate(['integrantes'], {
        queryParams: { }
      });
    }

    if ( navigateTo === 'home') {
      this.home = true;
      this.router.navigate([''], {
        queryParams: { }
      });
    }

    if ( navigateTo === 'compilador') {
      this.compilador = true;
      this.router.navigate(['compilador'], {
        queryParams: { }
      });
    }

    if ( navigateTo === 'rocka') {
      this.rocka = true;
      this.router.navigate(['testone'], {
        queryParams: { }
      });
    }

    if ( navigateTo === 'orellana') {
      this.orellana = true;
      this.router.navigate(['testsec'], {
        queryParams: { }
      });
    }

  }

}
