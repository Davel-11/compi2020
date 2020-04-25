import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { platform } from 'os';

@Component({
  selector: 'app-separadores',
  templateUrl: './separadores.component.html',
  styleUrls: ['./separadores.component.scss']
})
export class SeparadoresComponent implements OnInit {

  form: FormGroup;
  totalSpaces = 0;
  totalLines = 0;
  totalWords = 0;
  totalRepeated;
  
  constructor() { }

  ngOnInit() {

    this.form = new FormGroup({
      input: new FormControl()
    });

  }

  onSubmit() {

    console.log('form value is', this.form.value );

    const textToProcess = this.form.get('input').value;

    this.totalSpaces = this.getTotalSpaces(textToProcess);
    this.totalLines = this.getTotalLines(textToProcess);
    this.totalWords = this.getTotalWords(textToProcess);
    this.totalRepeated = this.getTotalRepeatedWords(textToProcess);

  }


  getTotalSpaces(text: any): number {

    const tempOne = text;
    const tempSec = tempOne.split(' ');
    return tempSec.length - 1;
  }

  getTotalLines(text: any ) {

    const tempOne = text;
    const tempSec = tempOne.split('\n');
    return tempSec.length;

  }
  

  getTotalWords(text: any) {

    const tempOne = text;
    const tempSec = tempOne.split(' ');
    return tempSec.length + 1;

  }

  getTotalRepeatedWords(text: any) {

    const tempOne = text;
    const tempSec = tempOne.split(' ');
    let total = 0;
    let palabras = [];

    for ( let i = 0; i < tempSec.length; i++ ) {

      for ( let j = 0; j < tempSec.length; j++ ) {

        if ( i !== j ) {

            if ( tempSec[i] === tempSec[j] ) {
              
              total++;

              let found = palabras.find( obj => obj.palabra ===  tempSec[i] );

              if ( !found ) {
                  console.log('fond is', found);
                  palabras.push({ palabraRepetida: tempSec[i] });
              }

            }

        }

      }

    }

    return JSON.stringify(palabras);

  }

}
