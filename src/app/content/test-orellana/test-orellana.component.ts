import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-test-orellana',
  templateUrl: './test-orellana.component.html',
  styleUrls: ['./test-orellana.component.scss']
})
export class TestOrellanaComponent implements OnInit {

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
