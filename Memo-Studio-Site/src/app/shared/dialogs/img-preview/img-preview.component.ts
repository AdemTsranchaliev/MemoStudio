import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-img-preview',
  templateUrl: './img-preview.component.html',
  styleUrls: ['./img-preview.component.css']
})
export class ImgPreviewComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';

  changeStr: string = 'Смяна на снимка';
  processingStr: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImgPreviewComponent>,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
   this.changeStr = this.data.size == 'small' ? 'Смяна' : 'Смяна на снимка';
   this.processingStr = this.data.size == 'small' ? 'Обработване' : 'Обработване на снимка';
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.base64);
  }

  loadImageFailed() {
    this.snackBar.open('Файла трябва да е .jpg/.jpeg/.png', 'Затвори', {
      duration: 8000,
      panelClass: ["custom-snackbar"],
    });
  }

  clearImage() {
    this.imageChangedEvent = null;
    this.croppedImage = '';
  }

  saveCroppedImage() {
    if (this.croppedImage != '') {
      this.dialogRef.close(this.croppedImage);
      this.snackBar.open('Файла бе запазен успешно!', 'Затвори', {
        duration: 8000,
        panelClass: ["custom-snackbar"],
      });
    }
  }
}
