import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css']
})
export class QrCodeComponent implements OnInit {
  @Input() currentQrCode: string = null;
  @Input() qrCodeColor: string = null;
  qrCodeDownloadLink: any = '';

  constructor() { }

  ngOnInit(): void {
    console.log('>>>> currentQrCode', this.currentQrCode);
    console.log('>>>> qrCodeDownloadLink', this.qrCodeDownloadLink);
  }

  onChangeURL(url: Event) {
    this.qrCodeDownloadLink = url;
  }
}
