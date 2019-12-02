import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  name: string;
  era:  string;
  desc: string;
  isCancel: boolean;
}

@Component({
  selector: 'app-create-world-input-dialog',
  templateUrl: './create-world-input-dialog.component.html',
  styleUrls: ['./create-world-input-dialog.component.scss']
})
export class CreateWorldInputDialogComponent {

  constructor(public dialogRef: MatDialogRef<CreateWorldInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.data.isCancel = false;
    }

  onCancel(): void {
    this.data.isCancel = true;
    this.dialogRef.close();
  }

}
