import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-term-and-conditions',
  templateUrl: './term-and-conditions.component.html',
  styleUrls: ['./term-and-conditions.component.css']
})
export class TermAndConditionsComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<TermAndConditionsComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
  }
  closeDialog() {
    return this.dialogRef.close({ result: true });
  }
}
