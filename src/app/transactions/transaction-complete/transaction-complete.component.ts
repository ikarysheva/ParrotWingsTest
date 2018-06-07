import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-transaction-complete',
  templateUrl: './transaction-complete.component.html',
  styleUrls: ['./transaction-complete.component.scss']
})
export class TransactionCompleteComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TransactionCompleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
