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

  displayedColumns: string[] = ['id', 'Token', 'Categoria', 'Tipo', 'Valor', 'Prioridad'];
  dataSource = ELEMENT_DATA;

  form: FormGroup;
  totalSpaces = 0;
  totalLines = 0;
  totalWords = 0;
  totalRepeated;

  dataValue = '';

  erroList = [];

  binaryTree = [];

  operaciones = [ '+', '-', '/', '*' ];

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

    // PASO 2. QUITAR ESPACIOS EN BLANCO || trim
    listOfLines = this.removeAllWhiteSpaces(listOfLines);

    // PASO 3.  Validar PUNTO Y COMA
    this.checkIfSemiColon(listOfLines);

    // PASO 4. Validar PARENTESIS
    this.checkParentesis(listOfLines);

    // PASO 5. * Validar estructura de operacion
    this.checkFormulaStructure(listOfLines);


    // ** CREACION DE ARBOL BINARIO ** //
    this.generateBinaryTree(listOfLines);

    // CONFIRMAR SI HAY ERROR
    if (this.erroList.length > 0) {
      this.callError(listOfLines);
    }
  }

  getLinesInArray(text: any) {
    const tempOne = text;
    const tempSec = tempOne.split('\n');
    return tempSec;
  }

  removeAllWhiteSpaces(list: any[]) {
    const newTempList = [];

    if (list.length > 0) {

      list.forEach(obj => {
        if (obj !== '') {
          newTempList.push(obj.trim());
        }
      });

      // newTempList.forEach( (obj: string, index: number) => {
      //   newTempList[index] = obj.replace(/\s/g, '');
      // });

    }

    return newTempList;
  }

  checkIfSemiColon(lineTocheck: string[]) {

    if (lineTocheck.length > 0) {

      let indexIs = 0;
      lineTocheck.forEach(obj => {

        let receivedString = '';
        receivedString = obj.toString();
        const response = receivedString.charAt(receivedString.length - 1);

        if (response !== ';') {
          this.erroList.push({ index: indexIs, errorType: 'Semicolon' });
        }

        indexIs++;
      });
    }
  }

  checkParentesis(linesToCheck: string[]) {

    const tempList = linesToCheck;

    if (tempList.length > 0) {

      tempList.forEach((obj: string, index: number) => {

        if (this.checkIfIsFormula(obj)) {
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

    const totalOpen = totalParentesisApertura - 1;
    const totalClose = totalParentesisCierre - 1;

    if (totalOpen !== totalClose) {
      this.erroList.push({
        index: indexIs,
        errorType: 'parentesis',
        message: ' Parentesis Abiertos ' + totalOpen + ' Parentesis Cerrados ' + totalClose,
      });
    }

  }

  callError(listOfLines: any) {
    this.matDialog.open(CompierrorComponent, {
      width: '700px',
      data: {
        list: listOfLines,
        errorList: this.erroList
      }
    });
  }

  checkFormulaStructure(listOfLines: any[]) {
    if (listOfLines.length > 0) {

      listOfLines.forEach((obj: string, index: number) => {

        const spitFormula = obj.split('=');

        if (this.checkIfIsFormula(obj)) {

          if (obj.includes('+')) {
            this.splitAndCheck('+', spitFormula[1], index);
          }

          if (obj.includes('-')) {
            this.splitAndCheck('-', spitFormula[1], index);
          }

          if (obj.includes('/')) {
            this.splitAndCheck('/', spitFormula[1], index);
          }

          if (obj.includes('*')) {
            this.splitAndCheck('*', spitFormula[1], index);
          }

        }

      });

    }
  }

  splitAndCheck(sign: string, textToSplit: string, indexIs: number) {

    // quitar espacions en blanco
    const textToWork = textToSplit.replace(/\s/g, '');
    // split by simbolo
    const tempArray = textToWork.split(sign);
    // arreglo

    tempArray.forEach(obj => {

      if (obj.length > 1) {

        // caracter inicial
        if (
          obj[0] === '+' ||
          obj[0] === '-' ||
          obj[0] === '/' ||
          obj[0] === '*' ||
          obj[0] === '' ||
          obj[0] === ')'
        ) {

          this.erroList.push({
            index: indexIs,
            errorType: 'structure',
            message: 'Error de estructura - cerca de simbolo >> ' + sign,
          });

        }

        // carater final
        if (
          obj[obj.length - 1] === '+' ||
          obj[obj.length - 1] === '-' ||
          obj[obj.length - 1] === '/' ||
          obj[obj.length - 1] === '*' ||
          obj[obj.length - 1] === '' ||
          obj[obj.length - 1] === '('
        ) {
          this.erroList.push({
            index: indexIs,
            errorType: 'structure',
            message: '*Error de estructura - cerca de simbolo >>> ' + sign,
          });
        }

      } else if (obj.length === 1) {
        // solo es un caracter
        if (obj === '+' || obj === '-' || obj === '/' || obj === '*' || obj === '' || obj === ';') {
          this.erroList.push({
            index: indexIs,
            errorType: 'structure',
            message: 'Error de Estructura cerca de simbolo > ' + sign,
          });
        }
      } else if (obj.length === 0) {

        this.erroList.push({
          index: indexIs,
          errorType: 'structure',
          message: 'Error de Estructura cerca de simbolo > ' + sign,
        });
      }

    });

    if (textToWork.length <= 3) {

      this.erroList.push({
        index: indexIs,
        errorType: 'structure',
        message: 'Error de Estructura cerca de simbolo, debe tener al menos 3 datos para poder procesar',
      });

    }

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
      return false;
    }
  }

  showFile(e: any): any {

    e.preventDefault();
    const reader = new FileReader();

    reader.onload = async (xe: any) => {
      this.form.get('input').setValue(xe.target.result);
    };

    reader.readAsText(e.target.files[0]);

  }

  generateBinaryTree(formulas: string[]) {

    this.binaryTree = [];


    formulas.forEach(obj => {

        if (this.checkIfIsFormula(obj)) {

          if ( true )  {
              // remove punto y coma
          }

          if (obj.includes('=')) {

            const miniTree = obj.split('=');
            this.binaryTree.push({ fatherNode: '=', nodeLeft: null, nodeRight: miniTree[1] });

            if ( obj.includes('+') ) {

              this.createMiniTree('+', miniTree[1] );

            }
          }
        }
    });

    console.log('finaly binary tree is ', this.binaryTree);

  }

  createMiniTree(splitType: string, stringToSplite: string, position?: string) {

      const miniTree = stringToSplite.split(splitType);

      if ( miniTree.length === 2 ) {

        this.binaryTree.push({ fatherNode: splitType, nodeLeft: miniTree[0], nodeRight: miniTree[1] });

      } else if ( miniTree.length > 2 ) {

        let nodeInfo = '';

        miniTree.forEach((obj2: string, index: number) => {

          if (index !== 0) {

            if (index === 1) {
              nodeInfo += obj2;

            } else {
              nodeInfo += splitType + obj2;
            }

          }

        });

        this.binaryTree.push({ fatherNode: splitType, nodeLeft: miniTree[0], nodeRight: nodeInfo });

        this.operaciones.forEach( op => {

            if ( nodeInfo.includes(op) ) {

              this.createMiniTree( op, nodeInfo );

            }

        });

      }

  }

}
