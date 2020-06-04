import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";

@Component({
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.css']
})
export class ExternalLoginComponent{
  source: string;
  constructor(private dialogRef: MatDialogRef<ExternalLoginComponent>, @Inject(MAT_DIALOG_DATA) data)
    {this.source = data.source;}

  save(form: NgForm){
    this.dialogRef.close(form.value);
  }
  close(){
    this.dialogRef.close();
  }

}
