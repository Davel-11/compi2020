import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';
import { CompierrorComponent } from './compierror/compierror.component';
import { ObjectUnsubscribedError } from 'rxjs';


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

        // PASO 1, PASAR EL TEXTO A LINEAS
        let listOfLines = this.getLinesInArray(textToProcess);

        // PASO 2. QUITAR ESPACIOS EN BLANCO
        listOfLines = this.removeAllWhiteSpaces(listOfLines);

        // PASO 3.  CONFIRMAR PUNTO Y COMA
        listOfLines = this.checkIfSemiColon(listOfLines);

        // PASO 4. CHECKEAR PARENTESIS
        this.checkParentesis(listOfLines);

        // CONFIRMAR SI HAY ERROR
        if ( this.erroList.length > 0 ) {
              this.callError(listOfLines);
        }
  }

  getLinesInArray(text: any ) {
    const tempOne = text;
    const tempSec = tempOne.split('\n');
    return tempSec;
  }

  removeAllWhiteSpaces( list: any[] ) {
      const newTempList = [];

      if ( list.length > 0 ) {

        list.forEach(obj => {
          if ( obj !== '' ) {
            newTempList.push(obj.trim());
          }
        });

        // newTempList.forEach( (obj: string, index: number) => {
        //   newTempList[index] = obj.replace(/\s/g, '');
        // });

      }

      return newTempList;
  }

  checkIfSemiColon( lineTocheck: string[] ) {

    if ( lineTocheck.length > 0 ) {

          let index2 = 0;

          lineTocheck.forEach( obj => {

              let receivedString = '';
              receivedString = obj.toString();
              const response = receivedString.charAt( receivedString.length - 1);

              if ( response !== ';' ) {
                this.erroList.push({ index: index2, errorType: 'Semicolon' });
              }

              index2++;
          });

          return lineTocheck;
    } else {

      return [];

    }

  }

  checkParentesis( linesToCheck: string[] ) {

    const tempList = linesToCheck;

    if ( tempList.length > 0 ) {

      tempList.forEach( ( obj: string, index: number  ) => {

        if ( this.checkIfIsFormula(obj) ) {
          // Es una Formula!!
          console.log('is Formula', obj);
          this.findParentesis(obj, index);
        }

      });

    }

    return tempList;
  }

  findParentesis(wordList: string, indexIs: number) {

    let totalParentesisApertura = 0;
    let totalParentesisCierre = 0;

    const tempOne = wordList.split('(');
    totalParentesisApertura = tempOne.length;

    const tempSec = wordList.split(')');
    totalParentesisCierre = tempSec.length;

    const totalOpen =  totalParentesisApertura - 1;
    const totalClose = totalParentesisCierre  - 1;

    if ( totalOpen !== totalClose  ) {
      this.erroList.push({
        index: indexIs,
        errorType: 'parentesis',
        open: totalOpen,
        close:  totalClose
      });
    }

  }

  callError(listOfLines: any) {
    this.matDialog.open( CompierrorComponent, {
      width: '700px',
      data: {
        list: listOfLines,
        errorList: this.erroList
      }
    });
  }

  checkIfIsFormula(objToCheck: string) {
    if (
      objToCheck.toLowerCase().includes('+') ||
      objToCheck.toLowerCase().includes('-') ||
      objToCheck.toLowerCase().includes('/') ||
      objToCheck.toLowerCase().includes('*') ||
      objToCheck.toLowerCase().includes(')') ||
      objToCheck.toLowerCase().includes('(')
      ) {
        return true;
      } else {
        return  false;
      }
  }

  showFile(e: any): any {

    e.preventDefault();
    const reader = new FileReader();

    reader.onload = async ( xe: any) => {
      this.form.get('input').setValue(xe.target.result);
    };

    reader.readAsText(e.target.files[0]);

  }

}
