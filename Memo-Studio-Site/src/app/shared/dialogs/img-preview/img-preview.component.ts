import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AccountService } from "../../services/account.service";
import { HttpClient } from "@angular/common/http";
import { BASE_URL_DEV } from "../../routes";

@Component({
  selector: "app-img-preview",
  templateUrl: "./img-preview.component.html",
  styleUrls: ["./img-preview.component.css"],
})
export class ImgPreviewComponent implements OnInit {
  imageChangedEvent: any = "";
  croppedImage: any = "";

  changeStr: string = "Смяна на снимка";
  processingStr: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImgPreviewComponent>,
    private snackBar: MatSnackBar,
    private accountService: AccountService,
    private http: HttpClient // Inject HttpClient
  ) { }

  ngOnInit(): void {
    this.changeStr = this.data.size == "small" ? "Смяна" : "Смяна на снимка";
    this.processingStr =
      this.data.size == "small" ? "Обработване" : "Обработване на снимка";
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  loadImageFailed() {
    this.snackBar.open("Файла трябва да е .jpg/.jpeg/.png", "Затвори", {
      duration: 8000,
      panelClass: ["custom-snackbar"],
    });
  }

  clearImage() {
    this.imageChangedEvent = null;
    this.croppedImage = "";
  }

  saveCroppedImage() {
    if (this.croppedImage !== "") {
      // Create a Blob from the base64 data
      const byteCharacters = atob(this.croppedImage.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" }); // Adjust the type as needed

      // Convert the Blob to a File
      const file = new File([blob], "cropped-image.png", { type: "image/png" });

      // Create FormData and append the File
      const formData = new FormData();
      formData.append("file", file);

      // Now, you can send formData to your server using HTTP
      this.http.post(`${BASE_URL_DEV}/account/profile-picture`, formData).subscribe({
        next: () => {
          this.dialogRef.close(this.croppedImage);
          this.snackBar.open("Файла бе запазен успешно!", "Затвори", {
            duration: 8000,
            panelClass: ["custom-snackbar"],
          });
        },
        error: (err) => {
          this.snackBar.open(err, "Затвори", {
            duration: 8000,
            panelClass: ["custom-snackbar"],
          });
        },
      });
    }
  }
}
