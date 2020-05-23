import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';
import { CompierrorComponent } from './compierror/compierror.component';


const ELEMENT_DATA: any[] = [
  { id: 1, Token: ' = ', Categoria: 'Igualdador', Tipo: 'Igualador', Valor: '-', Prioridad: '1' },
  { id: 1, Token: ' Temp1 ', Categoria: 'Variable', Tipo: 'Variable', Valor: '-', Prioridad: '-' },
  { id: 1, Token: ' Temp1 ', Categoria: 'Variable', Tipo: 'Variable', Valor: '-', Prioridad: '-' },
  { id: 1, Token: ' Temp1 ', Categoria: 'Variable', Tipo: 'Variable', Valor: '-', Prioridad: '-' },
  { id: 1, Token: ' Temp1 ', Categoria: 'Variable', Tipo: 'Variable', Valor: '-', Prioridad: '-' },
  { id: 1, Token: ' Temp1 ', Categoria: 'Variable', Tipo: 'Variable', Valor: '-', Prioridad: '-' },
  { id: 1, Token: ' Temp1 ', Categoria: 'Variable', Tipo: 'Variable', Valor: '-', Prioridad: '-' },
];



@Component({
  selector: 'app-compilador',
  templateUrl: './compilador.component.html',
  styleUrls: ['./compilador.component.scss']
})
export class CompiladorComponent implements OnInit {

  displayedColumns: string[] = ['id', 'Token', 'Categoria', 'Tipo', 'Valor', 'Prioridad' ];
  dataSource = ELEMENT_DATA;

  form: FormGroup;
  totalSpaces = 0;
  totalLines = 0;
  totalWords = 0;
  totalRepeated;

  dataValue = '';

  erroList = [];

  constructor(
    public matDialog: MatDialog
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      input: new FormControl(this.dataValue)
    });

  }

  onSubmit() {

  }

  processData() {

        this.erroList = [];
        const textToProcess = this.form.get('input').value;

        this.totalSpaces = this.getTotalSpaces(textToProcess);
        this.totalLines = this.getTotalLines(textToProcess);
        this.totalWords = this.getTotalWords(textToProcess);
        this.totalRepeated = this.getTotalRepeatedWords(textToProcess);

        const listOfLines = this.getLinesInArray(textToProcess);

        if ( listOfLines.length > 0 ) {

          let index = 0;
          listOfLines.forEach( obj => {

            if ( obj.toString().trim() !== '' ) {
              this.checkIfSemiColon(obj, index);
            }

            index++;
          });

        }

        if ( this.erroList.length > 0 ) {

          this.matDialog.open( CompierrorComponent, {
            width: '700px',
            data: {
              list: listOfLines,
              errorList: this.erroList
            }
          });

        }


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
                  palabras.push({ palabraRepetida: tempSec[i] });
              }

            }

        }

      }

    }

    return JSON.stringify(palabras);

  }

  getLinesInArray(text: any ) {
    const tempOne = text;
    const tempSec = tempOne.split('\n');
    return tempSec;
  }

  checkIfSemiColon( lineTocheck: string, position: number ) {

    let receivedString = '';
    receivedString = lineTocheck.toString().trim();
    console.log('receivedString ', receivedString);
    const response = receivedString.charAt( receivedString.length - 1);

    if ( response !== ';' ) {
      this.erroList.push({ index: position, errorType: 'Semicolon' });
    }

  }

  showFile(e: any) :any {

    e.preventDefault();
    const reader = new FileReader();

    reader.onload = async (e:any) => {
      this.form.get('input').setValue(e.target.result);
    };

    reader.readAsText(e.target.files[0]);

  };

}
