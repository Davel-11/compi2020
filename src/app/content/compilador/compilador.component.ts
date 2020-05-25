import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';
import { CompierrorComponent } from './compierror/compierror.component';
import { ObjectUnsubscribedError } from 'rxjs';
import { NodeObject } from './compilador.model';


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
    'priority',
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

  erroList = [];

  binaryTree = [];
  operaciones = ['+', '-', '/', '*'];
  startPriority = 0;

  variables = [
    { name: 'var1', value: 2, tipo: 'Integer' },
    { name: 'var2', value: 2, tipo: 'Integer' },
    { name: 'var3', value: 2, tipo: 'Real' }
  ];


  totalOperacion1 = 0;
  totalOperacion2 = 0;
  totalOperacion3 = 0;
  totalOperacion4 = 0;
  totalOperacion5 = 0;

  counter = 0;

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
    // console.log('=====spread===============================');
    // console.log(
    //   'Array de spacios agrupado por lineas: ',
    //   this.textArraySpacesGroupLines
    // );
    // console.log('====================================');
  }

  dataGeneralTable(arrayLineSpaces) {

    for (const item of arrayLineSpaces) {
      if (item.includes('As')) {
        if (item.length == 3) {
          //console.log('decalración: ', item);
          this.declarationTokens.push({ token: item[0], category: 'Var', type: item[2], valToken: undefined, priority: undefined });
        }
        if (item.length == 5) {
          // console.log('asignación: ', item);
          this.declarationTokens.push({ token: item[0], category: 'Var', type: item[2], valToken: item[4], priority: undefined });


        }
      }

    }
    console.log('======TABLITA==============================');
    // console.log(this.declarationTokens);
    this.dataSource = this.declarationTokens;
    console.log('====================================');
  }

  processData() {
    this.erroList = [];
    const textToProcess = this.form.get('input').value;

    //  PASO 1, PASAR EL TEXTO A LINEAS
    let listOfLines = this.getLinesInArray(textToProcess);

    //  PASO 2. QUITAR ESPACIOS EN BLANCO || trim
    listOfLines = this.removeAllWhiteSpaces(listOfLines);

    //  PASO 3.  Validar PUNTO Y COMA
    this.checkIfSemiColon(listOfLines);

    //  PASO 4. Validar PARENTESIS
    this.checkParentesis(listOfLines);

    //  PASO 5. * Validar estructura de operacion
    this.checkFormulaStructure(listOfLines);


    // CONFIRMAR SI HAY ERROR
    if (this.erroList.length > 0) {
       this.callError(listOfLines);
    } else {
        // ** CREACION DE ARBOL BINARIO ** //
        this.generateBinaryTree(listOfLines);
    }

    //
    this.textToarrayTable(textToProcess);
    this.dataGeneralTable(this.textArraySpacesGroupLines);
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

    this.binaryTree = [];

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

          console.log('Operation to process', minTree);

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
            priority: this.startPriority + 1,
            initialOperation: obj,
            nodeLeft: miniTree[0],
            nodeRight: minTree,
            operation: '=',
            operationResult: null,
            pendingToProcess: minTree,
            nextTree: nodeInfo ? nodeInfo : null
          }

          this.binaryTree.push(primaryNodeInfo);

        }


      }
    });

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

      console.log('counter is', this.counter);

      if ( this.counter === 0 ) {

        this.totalOperacion1 = operationResult;

      } else if ( this.counter === 1 ) {

        this.totalOperacion2 = operationResult;

      } else if ( this.counter === 2 ) {

        this.totalOperacion3 = operationResult;

      } else if ( this.counter === 3 ) {

        this.totalOperacion4 = operationResult;

      } else if ( this.counter === 4 ) {

        this.totalOperacion5 = operationResult;

      }

      this.counter++;
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
      this.variables.forEach(obj => {
        if (obj.name === operationToCheck) {
          processOne = obj.value;
        }
      });
    }

    if (Number(operationToCheckSec)) {
      processSec = Number(operationToCheckSec);
    } else {
      this.variables.forEach(obj => {
        if (obj.name === operationToCheckSec) {
          processSec = obj.value;
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
      if (obj !== '' && obj !== ' ') {
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
