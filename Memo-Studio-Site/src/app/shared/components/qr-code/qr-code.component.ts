import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css']
})
export class QrCodeComponent implements OnInit {
  @Input() currentQrCode: string = null;
  @Input() qrCodeColor: string = null;
  @Input() customWidth: number = null;
  qrCodeDownloadLink: any = '';

  constructor() { }

  ngOnInit(): void {
  }

  onChangeURL(url: Event) {
    this.qrCodeDownloadLink = url;
  }
}
