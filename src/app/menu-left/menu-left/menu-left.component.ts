import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss']
})
export class MenuLeftComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigate(navigateTo: string) {

    if ( navigateTo === 'integrantes') {
      this.router.navigate(['integrantes'], {
        queryParams: { }
      });
    }

    if ( navigateTo === 'home') {
      this.router.navigate([''], {
        queryParams: { }
      });
    }

  }

}
