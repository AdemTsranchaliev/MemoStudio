import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthenticatinService } from 'src/app/shared/services/authenticatin.service';

@Component({
  selector: 'app-my-business-card',
  templateUrl: './my-business-card.component.html',
  styleUrls: ['./my-business-card.component.css']
})
export class MyBusinessCardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public businessCardForm: FormGroup;
  public facilityLink: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);
  public currentSize: string;
  public viewSize: number = 180;

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

  public onSubmit() {

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

  public showExample() {
    // load modal, with IMG example
  }
}
