import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-compierror',
  templateUrl: './compierror.component.html',
  styleUrls: ['./compierror.component.scss']
})
export class CompierrorComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<CompierrorComponent>
  ) { }

  finalErrorList = [];

  ngOnInit() {

    this.finalErrorList = [];
    if ( this.data ) {

        this.data.errorList.forEach( obj => {

          this.finalErrorList.push( {
            line: this.data.list[obj.index],
            errorType: obj.errorType,
            index: obj.index
          });
        });

        console.log(' new list is', this.finalErrorList);

    }

  }

  onClose() {

      this.matDialogRef.close();

  }

}
