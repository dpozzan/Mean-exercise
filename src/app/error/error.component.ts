import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
    templateUrl: './error.component.html'
})
export class ErrorComponent {
    
    constructor(public dialogRef: MatDialogRef<ErrorComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: string }) { }

    onNoClick(): void {
        this.dialogRef.close();
      }
}