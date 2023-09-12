import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.css"],
})
export class GeneralComponent implements OnInit {
  currentUploadedImage: File | null = null;
  base64Image: string | null = null;

  constructor() { }

  ngOnInit(): void { }

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.base64Image = e.target.result;
        this.currentUploadedImage = file
      };

      reader.readAsDataURL(file);
    }
  }

  clearImageField() {
    this.base64Image = null;
    this.currentUploadedImage = null;
  }

}
