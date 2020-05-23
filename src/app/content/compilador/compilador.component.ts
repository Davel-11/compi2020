import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ThrowStmt } from "@angular/compiler";
import { CompierrorComponent } from "./compierror/compierror.component";
import { ObjectUnsubscribedError } from "rxjs";

const ELEMENT_DATA: any[] = [
  {
    id: 1,
    Token: " = ",
    Categoria: "Igualdador",
    Tipo: "Igualador",
    Valor: "-",
    Prioridad: "1",
  },
  {
    id: 1,
    Token: " Temp1 ",
    Categoria: "Variable",
    Tipo: "Variable",
    Valor: "-",
    Prioridad: "-",
  },
  {
    id: 1,
    Token: " Temp1 ",
    Categoria: "Variable",
    Tipo: "Variable",
    Valor: "-",
    Prioridad: "-",
  },
  {
    id: 1,
    Token: " Temp1 ",
    Categoria: "Variable",
    Tipo: "Variable",
    Valor: "-",
    Prioridad: "-",
  },
  {
    id: 1,
    Token: " Temp1 ",
    Categoria: "Variable",
    Tipo: "Variable",
    Valor: "-",
    Prioridad: "-",
  },
  {
    id: 1,
    Token: " Temp1 ",
    Categoria: "Variable",
    Tipo: "Variable",
    Valor: "-",
    Prioridad: "-",
  },
  {
    id: 1,
    Token: " Temp1 ",
    Categoria: "Variable",
    Tipo: "Variable",
    Valor: "-",
    Prioridad: "-",
  },
];

@Component({
  selector: "app-compilador",
  templateUrl: "./compilador.component.html",
  styleUrls: ["./compilador.component.scss"],
})
export class CompiladorComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "Token",
    "Categoria",
    "Tipo",
    "Valor",
    "Prioridad",
  ];
  dataSource = ELEMENT_DATA;

  form: FormGroup;
  totalSpaces = 0;
  totalLines = 0;
  totalWords = 0;
  totalRepeated;
  textArraySpacesGroupLines = [];
  declarationTokens = [{
    token: undefined,
    category: undefined,
    type: undefined,
    valToken: undefined,
    priority: undefined
  }];

  dataValue = "";

  erroList = [];

  constructor(public matDialog: MatDialog) {}

  ngOnInit() {
    this.form = new FormGroup({
      input: new FormControl(this.dataValue),
    });
  }

  onSubmit() {}

  //obtiene todo el texto lo separa por saltos de linea y cada linea es un objeto por espacios
  textToarrayTable(text) {
    //cada linea se vuelve un array
    var textLines = [];
    textLines = text.split("\n");
    //se crea un array por cada linea, y el array contiene las separaciones por espacio
    for (var i = 0; i < textLines.length; i++) {
      var lineArray = textLines[i].toString().split(" "); // separa por espacios
      this.textArraySpacesGroupLines.push(lineArray); //añade el array por espacio al array de lineas
    }
    console.log("=====spread===============================");
    console.log(
      "Array de spacios agrupado por lineas: ",
      this.textArraySpacesGroupLines
    );
    console.log("====================================");
  }

  dataGeneralTable(arrayLineSpaces){
    for (const item of arrayLineSpaces) {
      if (item.includes("As")){
        console.log('decalración: ', item);
      }
      
    }
  }

  processData() {
    this.erroList = [];
    const textToProcess = this.form.get("input").value;

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

    // CONFIRMAR SI HAY ERROR
    if (this.erroList.length > 0) {
      this.callError(listOfLines);
    }

    //
    this.textToarrayTable(textToProcess);
    this.dataGeneralTable(this.textArraySpacesGroupLines);
  }

  getLinesInArray(text: any) {
    const tempOne = text;
    const tempSec = tempOne.split("\n");
    return tempSec;
  }

  removeAllWhiteSpaces(list: any[]) {
    const newTempList = [];

    if (list.length > 0) {
      list.forEach((obj) => {
        if (obj !== "") {
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
      lineTocheck.forEach((obj) => {
        let receivedString = "";
        receivedString = obj.toString();
        const response = receivedString.charAt(receivedString.length - 1);

        if (response !== ";") {
          this.erroList.push({ index: indexIs, errorType: "Semicolon" });
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

    const tempOne = wordList.split("(");
    totalParentesisApertura = tempOne.length;

    const tempSec = wordList.split(")");
    totalParentesisCierre = tempSec.length;

    const totalOpen = totalParentesisApertura - 1;
    const totalClose = totalParentesisCierre - 1;

    if (totalOpen !== totalClose) {
      this.erroList.push({
        index: indexIs,
        errorType: "parentesis",
        message:
          " Parentesis Abiertos " +
          totalOpen +
          " Parentesis Cerrados " +
          totalClose,
      });
    }
  }

  callError(listOfLines: any) {
    this.matDialog.open(CompierrorComponent, {
      width: "700px",
      data: {
        list: listOfLines,
        errorList: this.erroList,
      },
    });
  }

  checkFormulaStructure(listOfLines: any[]) {
    if (listOfLines.length > 0) {
      listOfLines.forEach((obj: string, index: number) => {
        const spitFormula = obj.split("=");

        if (this.checkIfIsFormula(obj)) {
          if (obj.includes("+")) {
            this.splitAndCheck("+", spitFormula[1], index);
          }

          if (obj.includes("-")) {
            this.splitAndCheck("-", spitFormula[1], index);
          }

          if (obj.includes("/")) {
            this.splitAndCheck("/", spitFormula[1], index);
          }

          if (obj.includes("*")) {
            this.splitAndCheck("*", spitFormula[1], index);
          }
        }
      });
    }
  }

  splitAndCheck(sign: string, textToSplit: string, indexIs: number) {
    console.log("split by", sign);
    // quitar espacions en blanco
    const textToWork = textToSplit.replace(/\s/g, "");
    // split by simbolo
    const tempArray = textToWork.split(sign);
    // arreglo
    console.log("tempArray is", tempArray);

    tempArray.forEach((obj) => {
      if (obj.length > 1) {
        // caracter inicial
        if (
          obj[0] === "+" ||
          obj[0] === "-" ||
          obj[0] === "/" ||
          obj[0] === "*" ||
          obj[0] === "" ||
          obj[0] === ")"
        ) {
          this.erroList.push({
            index: indexIs,
            errorType: "structure",
            message: "Error de estructura - cerca de simbolo >> " + sign,
          });
        }

        // carater final
        if (
          obj[obj.length - 1] === "+" ||
          obj[obj.length - 1] === "-" ||
          obj[obj.length - 1] === "/" ||
          obj[obj.length - 1] === "*" ||
          obj[obj.length - 1] === "" ||
          obj[obj.length - 1] === "("
        ) {
          this.erroList.push({
            index: indexIs,
            errorType: "structure",
            message: "*Error de estructura - cerca de simbolo >>> " + sign,
          });
        }
      } else if (obj.length === 1) {
        // solo es un caracter
        if (
          obj === "+" ||
          obj === "-" ||
          obj === "/" ||
          obj === "*" ||
          obj === "" ||
          obj === ";"
        ) {
          this.erroList.push({
            index: indexIs,
            errorType: "structure",
            message: "Error de Estructura cerca de simbolo > " + sign,
          });
        }
      } else if (obj.length === 0) {
        this.erroList.push({
          index: indexIs,
          errorType: "structure",
          message: "Error de Estructura cerca de simbolo > " + sign,
        });
      }
    });

    if (textToWork.length <= 3) {
      this.erroList.push({
        index: indexIs,
        errorType: "structure",
        message:
          "Error de Estructura cerca de simbolo, debe tener al menos 3 datos para poder procesar",
      });
    }
  }

  checkIfIsFormula(objToCheck: string) {
    if (
      objToCheck.toLowerCase().includes("+") ||
      objToCheck.toLowerCase().includes("-") ||
      objToCheck.toLowerCase().includes("/") ||
      objToCheck.toLowerCase().includes("*") ||
      objToCheck.toLowerCase().includes(")") ||
      objToCheck.toLowerCase().includes("(")
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
      this.form.get("input").setValue(xe.target.result);
    };

    reader.readAsText(e.target.files[0]);
  }
}
