import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-test-orellana',
  templateUrl: './test-orellana.component.html',
  styleUrls: ['./test-orellana.component.scss']
})





export class TestOrellanaComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  form: FormGroup;

  dataValue =
    ' variable1 As Integer = 1.0; ' +
    '\n variable2 As Integer = 1.0 ' +
    '\n variable3 As Real 1.2; ' +
    '\n variable4 As Real = 2.0; ' +
    '\n variable5 As Real = 3.0;  ' +
    '\n variable7 As char = "a"  ' +
    '\n  ' +
    '\n Formula1 = Valor1 + 16 * (24 / 1) + x; '  +
    '\n Formula1 = Valor1 + 16 * (24 / 1) + x; '  +
    '\n Formula1 = Valor1 + 16 * (24 / 1 + x;  '
    ;

    output = '';


  constructor() { }

  ngOnInit() {

    this.form = new FormGroup({
      input: new FormControl(this.dataValue)
    });

  }


  onSubmit() {

      this.output = this.form.get('input').value;
  }

}
