import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';
import { CompierrorComponent } from './compierror/compierror.component';
import { ObjectUnsubscribedError } from 'rxjs';
import { NodeObject } from './compilador.model';
import {isNullOrUndefined, isNumber} from "util";


@Component({
  selector: 'app-compilador',
  templateUrl: './compilador.component.html',
  styleUrls: ['./compilador.component.scss'],
})
export class CompiladorComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'token',
    'category',
    'type',
    'valToken',
  ];
  dataSource = [];

  form: FormGroup;
  totalSpaces = 0;
  totalLines = 0;
  totalWords = 0;
  totalRepeated;
  textArraySpacesGroupLines = [];
  declarationTokens = [];

  dataValue = '';

  displayedColumns2: string[] = [ 'line', 'index',  'message' ];
  erroList = [];

  binaryTree : any;
  operaciones = ['+', '-', '/', '*'];
  startPriority = 0;

  variables = [
    { name: 'var1', value: 2, tipo: 'Integer' },
    { name: 'var2', value: 2, tipo: 'Integer' },
    { name: 'var3', value: 2, tipo: 'Real' }
  ];

  totales = [];

  counter = 0;

  tabIndex = 0;
  listOfLines = [];

  priorityTable: any[] =  [];

  priorities = [];

  displayedColumns3 = ['initialOperation', 'nodeLeft', 'nodeRight', 'operation', 'operationResult', 'pendingToProcess', 'priority' ];

  gTempArray = [];
  globlaCounter = 0;

  constructor(
    public matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      input: new FormControl(''),
    });
  }

  onSubmit() { }

  // obtiene todo el texto lo separa por saltos de linea y cada linea es un objeto por espacios
  textToarrayTable(text) {
    // cada linea se vuelve un array
    var textLines = [];
    textLines = text.split('\n');
    // se crea un array por cada linea, y el array contiene las separaciones por espacio
    for (var i = 0; i < textLines.length; i++) {
      var lineArray = textLines[i].toString().split(' '); //  separa por espacios
      this.textArraySpacesGroupLines.push(lineArray); // añade el array por espacio al array de lineas
    }
  }

  dataGeneralTable(arrayLineSpaces) {
    for (const item of arrayLineSpaces) {
      if (item.includes("As")) {
        //*******solo decalra variable******** */
        if (item.length == 3) {
          this.declarationTokens.push({
            token: item[0],
            category: "Var",
            type: item[2],
            valToken: undefined,
            priority: undefined,
          });
        }
        //*******decalra y asigna valor**** */
        if (item.length == 5) {
          this.declarationTokens.push({
            token: item[0],
            category: "Var",
            type: item[2],
            valToken: item[4],
            priority: undefined,
          });
          for (let index = 0; index < this.declarationTokens.length; index++) {
            if (this.declarationTokens[index].token === item[0]) {
              this.declarationTokens[index].valToken = item[4];
              this.declarationTokens[index].type = item[2];
            }
          }
        }
      }
      if (item.length == 3) {
        if (item.includes("=")) {
          for (let index = 0; index < this.declarationTokens.length; index++) {
            if (this.declarationTokens[index].token === item[0]) {
              this.declarationTokens[index].valToken = item[2];
            }
          }
        }
      }
    }
    for (let index = 0; index < this.declarationTokens.length; index++) {
        this.declarationTokens[index].index = index;
    }
    this.dataSource = this.declarationTokens;
  }

  processData() {

    this.erroList = [];
    const textToProcess = this.form.get('input').value;

    //  PASO 1, PASAR EL TEXTO A LINEAS
    this.listOfLines = this.getLinesInArray(textToProcess);

    //  PASO 2. QUITAR ESPACIOS EN BLANCO || trim
    this.listOfLines = this.removeAllWhiteSpaces(this.listOfLines);

    //  PASO 3.  Validar PUNTO Y COMA
    this.checkIfSemiColon(this.listOfLines);

    //  PASO 4. Validar PARENTESIS
    this.checkParentesis(this.listOfLines);

    //  PASO 5. * Validar estructura de operacion
    this.checkFormulaStructure(this.listOfLines);

    // PASO 6. Validar variables en las formulas
    this.textToarrayTable(textToProcess);
    this.dataGeneralTable(this.textArraySpacesGroupLines);
    this.validateFormulaVariables(this.listOfLines);


    // CONFIRMAR SI HAY ERROR
    if (this.erroList.length > 0) {
      this.callError(this.listOfLines);
    } else {
      // ** CREACION DE ARBOL BINARIO ** //
      this.tabIndex = 1;
      this.totales = [];
      this.generateBinaryTree(this.listOfLines);

    }

    console.log("this.declarationTokens is", this.declarationTokens);

  }

  validateFormulaVariables( receivedArray: any[] ) {

    receivedArray.forEach( obj => {

       if ( this.checkIfIsFormula(obj) ) {

         // paso 0 quitar punto y coma;
         let tempOb = obj.replace(';', '');

         // paso 1, quitar el la variableinicial y el igual
         if ( tempOb.includes('=') ) {

           let tempSplit = tempOb.split('=');

           // paso 2 limpiar lineas
           let tempArray = this.clearLines(tempSplit[1]);

           // paso 3 quitar, simbolos, espacios en blanco y numeros
           let newTempArray = this.removeNotNeededData(tempArray);

           // paso 4, Buscar variables en array
           this.checkVariableValue(newTempArray);

         }

       }
    });

  }

  checkVariableValue(variablesToCheck: any[]) {

    for ( let i = 0; i < variablesToCheck.length; i++ ) {

      for ( let j = 0; j < this.declarationTokens.length; j++ ) {

           if ( variablesToCheck[i] === this.declarationTokens[j].token ) {

                if ( String(this.declarationTokens[j].type).toLocaleLowerCase().includes('integer') ||
                    String(this.declarationTokens[j].type).toLocaleLowerCase().includes('real')  ) {

                } else {
                  this.erroList.push({
                    line: null,
                    index: null,
                    errorType: 'variableError' ,
                    message: ' La variable ' + variablesToCheck[i]  + ' No se puede Procesar ' });
                    break;
                }

           }

      }

    }

  }

  removeNotNeededData( array: any[] ) {
    let tempArray = [];

    array.forEach( obj => {

      if (
        obj != '+' &&
        obj != '-' &&
        obj != '*' &&
        obj != '/' &&
        obj != '=' &&
        obj != '(' &&
        obj != ')' &&
        obj != '' &&
        obj != ' ' &&
        !obj.includes('.')
      ) {
        tempArray.push(obj);
      }

    })
    return tempArray;
  }

  clearLines( line: string ) {

    // PASO UNO HACER SPLIT POR SPACIOS
    const initialSplit = line.split(' ');

    // PASO DOS, LIMPIAR DOBLE O TRIPLE ESPACIO
    let tempClean = this.clearWhiteSpacesString(initialSplit);

    // PASO 3, REALIZAR SPLIT DE SPACIOS CONTROLADO
    tempClean = this.setSplitSpace(tempClean);

    // PASO 4, REALIZAR SPLIT DE SPACIOS,
    let newArray = tempClean.split(' ');

    return newArray;

  }

  getLinesInArray(text: any) {
    const tempOne = text;
    const tempSec = tempOne.split('\n');
    return tempSec;
  }

  removeAllWhiteSpaces(list: any[]) {
    const newTempList = [];

    if (list.length > 0) {
      list.forEach((obj) => {
        if (obj !== '') {
          newTempList.push(obj.trim());
        }
      });

      //  newTempList.forEach( (obj: string, index: number) => {
      //    newTempList[index] = obj.replace(/\s/g, '');
      //  });
    }

    return newTempList;
  }

  checkIfSemiColon(lineTocheck: string[]) {
    if (lineTocheck.length > 0) {
      let indexIs = 0;
      lineTocheck.forEach((obj) => {
        let receivedString = '';
        receivedString = obj.toString();
        const response = receivedString.charAt(receivedString.length - 1);

        if (response !== ';') {
          this.erroList.push({ line: this.listOfLines[indexIs], index: indexIs, errorType: 'Semicolon' , message: 'Falta ;'});
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
        line: this.listOfLines[indexIs],
        index: indexIs,
        errorType: 'parentesis',
        message:
          ' Parentesis Abiertos ' +
          totalOpen +
          ' Parentesis Cerrados ' +
          totalClose,
      });
    }
  }

  callError(listOfLines: any) {
    this.matDialog.open(CompierrorComponent, {
      width: '700px',
      data: {
        list: listOfLines,
        errorList: this.erroList,
      },
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
    //  split by simbolo
    const tempArray = textToWork.split(sign);
    // arreglo

    tempArray.forEach((obj) => {
      if (obj.length > 1) {
        //  caracter inicial
        if (
          obj[0] === '+' ||
          obj[0] === '-' ||
          obj[0] === '/' ||
          obj[0] === '*' ||
          obj[0] === '' ||
          obj[0] === ')'
        ) {
          this.erroList.push({
            line: this.listOfLines[indexIs],
            index: indexIs,
            errorType: 'structure',
            message: 'Error de estructura - cerca de simbolo >> ' + sign,
          });
        }

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
            line: this.listOfLines[indexIs],
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
            line: this.listOfLines[indexIs],
            index: indexIs,
            errorType: 'structure',
            message: '*Error de estructura - cerca de simbolo >>> ' + sign,
          });
        }

      } else if (obj.length === 1) {
        // solo es un caracter
        if (obj === '+' || obj === '-' || obj === '/' || obj === '*' || obj === '' || obj === ';') {
          this.erroList.push({
            line: this.listOfLines[indexIs],
            index: indexIs,
            errorType: 'structure',
            message: '*Error de estructura - cerca de simbolo >>> ' + sign,
          });
        }
      } else if (obj.length === 1) {
        //  solo es un caracter
        if (
          obj === '+' ||
          obj === '-' ||
          obj === '/' ||
          obj === '*' ||
          obj === '' ||
          obj === ';'
        ) {
          this.erroList.push({
            line: this.listOfLines[indexIs],
            index: indexIs,
            errorType: 'structure',
            message: 'Error de Estructura cerca de simbolo > ' + sign,
          });
        }
      } else if (obj.length === 0) {

        this.erroList.push({
          line: this.listOfLines[indexIs],
          index: indexIs,
          errorType: 'structure',
          message: 'Error de Estructura cerca de simbolo > ' + sign,
        });
      }

    });

    if (textToWork.length <= 3) {

      this.erroList.push({
        line: this.listOfLines[indexIs],
        index: indexIs,
        errorType: 'structure',
        message:
          'Error de Estructura cerca de simbolo, debe tener al menos 3 datos para poder procesar',
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

    this.priorityTable = [];

    formulas.forEach(obj => {

      if (this.checkIfIsFormula(obj)) {

        if (obj.includes('=')) {

          const miniTree = obj.split('=');
          let primaryNodeInfo: NodeObject;
          let nodeInfo: NodeObject;
          this.binaryTree = [];

          // PASO 0 -- QUITAR PUNTO Y COMA AL FINAL
          let minTree = miniTree[1];
          minTree = minTree.replace(';', '');
          this.startPriority = 0;

          // PASO 1 -- CHECK FOR PARENTESIS
          const checking = minTree.includes('(');

          if (checking) {

                nodeInfo = this.checkForParentesis(minTree);

                nodeInfo = {
                  priority: nodeInfo.priority,
                  initialOperation: nodeInfo.initialOperation,
                  nodeLeft: nodeInfo.nodeLeft,
                  nodeRight: nodeInfo.nodeRight,
                  operation: nodeInfo.operation,
                  operationResult: nodeInfo.operationResult,
                  pendingToProcess: nodeInfo.pendingToProcess,
                  nextTree: nodeInfo.nextTree ? (
                    (nodeInfo.pendingToProcess.includes('/') || nodeInfo.pendingToProcess.includes('*')) ? this.checkForMulAndDiv('/', '*', nodeInfo.pendingToProcess) :
                      (nodeInfo.pendingToProcess.includes('+') || nodeInfo.pendingToProcess.includes('-')) ? this.checkForMulAndDiv('+', '-', nodeInfo.pendingToProcess) :
                        []
                  ) : []
                };

          } else {

            // PASO 2 --- CHECK FOR   MULTIPLICACON    OR   DIVICION /
            const checking = minTree.includes('*');
            const checkingSec = minTree.includes('/');

            if (checking || checkingSec) {

              // TIENE MULTIPLICACION O DIVICION
              nodeInfo = this.checkForMulAndDiv('*', '/', minTree);

            } else {

              const checking = minTree.includes('+');
              const checkingSec = minTree.includes('-');

              // TIENE suma O RESTA
              nodeInfo = this.checkForMulAndDiv('+', '-', minTree);

            }

          }

          primaryNodeInfo = {
            priority: 0,
            initialOperation: obj,
            nodeLeft: miniTree[0],
            nodeRight: minTree,
            operation: '=',
            operationResult: null,
            pendingToProcess: minTree,
            nextTree: nodeInfo ? nodeInfo : null
          }

          this.binaryTree = primaryNodeInfo;

        }

        this.gTempArray = [];
        this.globlaCounter++;

        this.generatePriorityTable(this.binaryTree);
        this.priorityTable.push(this.gTempArray);

      }

    });

    console.log("this finaly priority Table ",  this.priorityTable );

    // this.priorities =  this.priorityTable[0];

  }

  generatePriorityTable(binaryTree: any) {

    let nodeData: NodeObject;
    nodeData = binaryTree;

      this.gTempArray.push({
        initialOperation: nodeData.initialOperation,
        nodeLeft:  nodeData.nodeLeft,
        nodeRight: nodeData.nodeRight,
        operation: nodeData.operation,
        operationResult: nodeData.operationResult,
        pendingToProcess: nodeData.pendingToProcess,
        priority:  nodeData.priority
      });

      if (  nodeData.nextTree != null )  {
        this.generatePriorityTable( nodeData.nextTree );
      }

  }

  checkForMulAndDiv(procesOne, procesSec, receivedString: string) {

    this.startPriority++;

    // recibir string y limpiar extra white spaces
    let initialSplit = receivedString.split(' ');
    let tempClean = this.clearWhiteSpacesString(initialSplit);

    // setiar espacios en blanco controlados
    tempClean = this.setSplitSpace(tempClean);

    // Separar arreglo por espacios
    let tempArray = tempClean.split(' ');

    let leftData = '';
    let operationData = [];
    let rightData = '';

    // GET DATA OPERATION
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i] === procesOne || tempArray[i] === procesSec) {
        operationData.push(tempArray[i - 1]);
        operationData.push(tempArray[i]);
        operationData.push(tempArray[i + 1]);
        break;
      }
    }

    // GET PARENTESIS LEFT DATA
    for (let i = 0; i < tempArray.length; i++) {
      leftData += tempArray[i] + ' ';
      if (tempArray[i] === procesOne || tempArray[i] === procesSec) {
        break;
      }
    }

    // GET PARENTESIS RIGHT DATA
    let position = 0;
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i] === procesOne || tempArray[i] === procesSec) {
        position = i;
      }
      if (position > 0) {
        rightData += ' ' + tempArray[i];
      }
    }

    // PROCESS OPERATION
    let operationResult = this.processOperation(operationData[0], operationData[2], operationData[1]);

    // SET MISSING TO PROCESS
    leftData = this.clearMultAndDiv('L', leftData);
    rightData = this.clearMultAndDiv('R', rightData);
    let missingToProcess = leftData + operationResult + rightData;

    // SET NODE INFO
    let newData: any;
    if (operationData.length === 3) {
      newData = this.setNodeInfo(this.startPriority, operationData[1], operationData[0], operationData[2]);
    }

    let newNode: NodeObject;

    missingToProcess = this.setSplitSpace(missingToProcess);

    let check: any[] = missingToProcess.split(' ');
    check = this.clearWhiteSpaces(check);

    newNode = {
      priority: this.startPriority,
      initialOperation: receivedString,
      nodeLeft: operationData[0],
      nodeRight: operationData[2],
      operation: operationData[1],
      operationResult: operationResult,
      pendingToProcess: missingToProcess,
      nextTree: check.length >= 3 ?
        (
          (missingToProcess.includes('/') || missingToProcess.includes('*')) ? (this.checkForMulAndDiv('/', '*', missingToProcess)) :
            (missingToProcess.includes('+') || missingToProcess.includes('-')) ? this.checkForMulAndDiv('+', '-', missingToProcess) :
              []
        ) : null
    }

    if (!(check.length >= 3)) {

            this.totales.push(operationResult);

    }

    return newNode;

  }

  processOperation(variableOne, variableSec, operatioType) {
    // PROCESS OPERATION
    const operationToCheck = variableOne;
    const operationToCheckSec = variableSec;

    let operationResult: number;
    let processOne = 0;
    let processSec = 0;

    if (Number(operationToCheck)) {
      processOne = Number(operationToCheck);
    } else {
      this.declarationTokens.forEach(obj => {
        if (obj.token.includes(variableOne) ) {
          let value1 = obj.valToken.replace(';', '');
          let value2 = Number(value1);
          console.log("valor 2 op 1 ", value2 );
          processOne = value2;
        }
      });
    }

    if (Number(operationToCheckSec)) {
      processSec = Number(operationToCheckSec);
    } else {
      this.declarationTokens.forEach(obj => {

        if (obj.token.includes(variableSec) ) {
          let value1 = obj.valToken.replace(';', '');
          let value2 = Number(value1);
          console.log("valor 2 op 2 ", value2 );
          processSec = value2;
        }
      });
    }

    if (operatioType === '/') {
      operationResult = processOne / processSec;
    } else if (operatioType === '*') {
      operationResult = processOne * processSec;
    } else if (operatioType === '+') {
      operationResult = processOne + processSec;
    } else if (operatioType === '-') {
      operationResult = processOne - processSec;
    }

    return operationResult;

  }

  checkForParentesis(equation: string) {

    const initialSplit = equation.split(' ');

    let tempClean = this.clearWhiteSpacesString(initialSplit);
    tempClean = this.setSplitSpace(tempClean);

    let eqArray = tempClean.split(' ');
    eqArray = this.clearWhiteSpaces(eqArray);

    let leftData = '';
    let insideParentesis = '';
    let rightData = '';
    this.startPriority++;


    // GET DATA INSIDE PARENTESIS
    for (let i = 0; i < eqArray.length; i++) {
      if (eqArray[i] === '(') {
        for (let j = i; j < eqArray.length; j++) {
          insideParentesis += ' ' + eqArray[j] + ' ';
          if (eqArray[j] === ')') {
            break;
          }
        }
      }
    }

    // GET PARENTESIS LEFT DATA
    for (let i = 0; i < eqArray.length; i++) {
      leftData += eqArray[i] + ' ';
      if (eqArray[i] === '(') {
        break;
      }
    }

    // GET PARENTESIS RIGHT DATA
    let position = 0;
    for (let i = 0; i < eqArray.length; i++) {
      if (eqArray[i] === ')') {
        position = i;
      }
      if (position > 0) {
        rightData += ' ' + eqArray[i];
      }
    }

    // SET NODE INFORMATION
    let tempMiniTree = insideParentesis.split(' ');
    tempMiniTree = this.clearTreeAndParentesis(tempMiniTree);

    let newNode: any;
    if (tempMiniTree.length === 3) {
      newNode = this.setNodeInfo(this.startPriority, tempMiniTree[1], tempMiniTree[0], tempMiniTree[2]);
    }

    // PROCESS OPERATION
    let operationResult = this.processOperation(tempMiniTree[0], tempMiniTree[2], tempMiniTree[1]);

    // SET MISSING TO PROCESS
    leftData = this.clearParentesis('(', ')', leftData);
    rightData = this.clearParentesis('(', ')', rightData);
    const missingToProcess = leftData + operationResult + rightData;

    let check: any[] = missingToProcess.split(' ');
    check = this.clearWhiteSpaces(check);

    newNode = {
      priority: this.startPriority,
      initialOperation: equation,
      nodeLeft: tempMiniTree[0],
      nodeRight: tempMiniTree[2],
      operation: tempMiniTree[1],
      operationResult: operationResult,
      pendingToProcess: missingToProcess,
      nextTree: check.length >= 3 ? true : false
    }

    return newNode;
  }

  setNodeInfo(priority: any, opType: any, nodeLeft: any, nodeRight: any) {

    const newNode = {
      opType: opType,
      nodeLeft: nodeLeft,
      nodeRight: nodeRight,
      priority: priority
    };

    return newNode;
  }

  clearTreeAndParentesis(arrayToClean: any[]) {

    let tempArray = [];

    arrayToClean.forEach(obj => {

      if (obj !== '' && obj !== '(' && obj !== ')') {
        tempArray.push(obj);
      }

    });

    return tempArray;

  }

  clearParentesis(one, sec, receivedString: string) {

    const tempArray = receivedString.split(' ');
    const newTempArray = [];
    let stringToReturn = '';

    tempArray.forEach(obj => {
      if (obj !== one && obj !== sec && obj !== ' ') {
        newTempArray.push(obj);
      }
    });

    newTempArray.forEach(obj2 => {
      stringToReturn += ' ' + obj2;
    })

    return stringToReturn;

  }

  clearMultAndDiv(side: any, receivedString: string) {

    const tempArray = receivedString.split(' ');
    const newTempArray = [];
    let stringToReturn = '';

    tempArray.forEach(obj => {
      if (obj !== '') {
        newTempArray.push(obj);
      }
    });

    const newTempArraySec = [];

    if (side === 'L') {
      for (let i = 0; i < (newTempArray.length - 2); i++) {
        newTempArraySec.push(newTempArray[i]);
      }
    }

    if (side === 'R') {
      for (let i = 2; i < (newTempArray.length); i++) {
        newTempArraySec.push(newTempArray[i]);
      }
    }

    newTempArraySec.forEach(obj => {
      stringToReturn += obj;
    });

    return stringToReturn;

  }

  clearWhiteSpaces(receivedArray: any[]) {
    const tempArray = [];
    receivedArray.forEach(obj => {
      if (obj !== '' && obj !== ' ') {
        tempArray.push(obj);
      }
    });
    return tempArray;
  }

  clearWhiteSpacesString(receivedArray: any[]) {
    let tempString = '';
    receivedArray.forEach(obj => {
      if (obj !== '' && obj !== ' ' && obj !== '  '  ) {
        tempString += obj;
      }
    });
    return tempString;
  }

  setSplitSpace(receivedSTring: string) {

    if (receivedSTring.includes('+')) {
      receivedSTring = this.replaceAll(receivedSTring, '\\+', ' + ');
    }

    if (receivedSTring.includes('-')) {
      receivedSTring = this.replaceAll(receivedSTring, '-', ' - ');
    }

    if (receivedSTring.includes('/')) {
      receivedSTring = this.replaceAll(receivedSTring, '\\/', ' / ');
    }

    if (receivedSTring.includes('*')) {
      receivedSTring = this.replaceAll(receivedSTring, '\\*', ' * ');
    }

    if (receivedSTring.includes('(')) {
      receivedSTring = this.replaceAll(receivedSTring, '\\(', ' ( ');
    }

    if (receivedSTring.includes(')')) {
      receivedSTring = this.replaceAll(receivedSTring, '\\)', ' ) ');
    }


    return receivedSTring;

  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }



}
