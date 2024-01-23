import { Component, OnInit, Inject } from "@angular/core";
import { Subscription } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-cancel-message',
  templateUrl: './cancel-message.component.html',
  styleUrls: ['./cancel-message.component.css']
})
export class CancelMessageDialogComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CancelMessageDialogComponent>,
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  onSubmit() {
    this.dialogRef.close(true);
  }
}
