import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthenticatinService } from 'src/app/shared/services/authenticatin.service';
import html2canvas from "html2canvas";
import QRCode from 'qrcode';

@Component({
  selector: 'app-my-business-card',
  templateUrl: './my-business-card.component.html',
  styleUrls: ['./my-business-card.component.css']
})
export class MyBusinessCardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @ViewChild('qrContainer') qrContainer!: ElementRef;

  public businessCardForm: FormGroup;
  public facilityLink: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);
  public currentSize: string;
  public viewSize: number = 180;

  facebookLink = "John Doe Studious";
  instagramLink = "john.doe.studious";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticatinService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.facilityLink = `https://localhost:4200/#/facility-schedule/${this.authService.getFacilityId()}`;
    this.manageQRCodeSize();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  private initForm() {
    this.businessCardForm = this.formBuilder.group({
      socialInstagram: ["", Validators.required],
      socialFacebook: ["", Validators.required],
    });
  }

  public async downloadQRCode(): Promise<void> {
    try {
      // Capture the content of qrContainer
      const qrContainer = this.qrContainer.nativeElement;
      const canvas = await html2canvas(qrContainer, {
        backgroundColor: 'black' // Set background color to black
      });

      // Convert canvas to image data URL with PNG format
      const imageDataUrl = canvas.toDataURL('image/png');

      // Create a link element for download
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = imageDataUrl;

      // Trigger download
      link.click();
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  public manageQRCodeSize(): void {
    const isViewSmallSubscription = this.isExtraSmall.subscribe((size) => {
      this.currentSize = size.matches ? "small" : "large";

      if (size.matches) {
        this.viewSize = 200;
      } else {
        this.viewSize = 280;
      }
    });
    this.subscriptions.push(isViewSmallSubscription);
  }
}
