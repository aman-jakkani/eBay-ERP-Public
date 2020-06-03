import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";

@Component({
  templateUrl: './external.component.html'
})
export class ExternalLoginComponent{

  constructor(private dialogRef: MatDialogRef<ExternalLoginComponent>, @Inject(MAT_DIALOG_DATA) public data: {source: string}) {}

  save(form: NgForm){
    this.dialogRef.close(form.value);
  }

}
