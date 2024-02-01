import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.css']
})
export class UserSubscriptionComponent implements OnInit, AfterViewInit {
  // Mat Menu Target
  @ViewChild('trigger') trigger: MatMenuTrigger;
  // Animation Check
  triggerAnimation = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (!this.triggerAnimation) {
      this.triggerBounceAnimation();
      this.triggerAnimation = true;
      this.cdr.detectChanges();
    }
  }

  private triggerBounceAnimation(): void {
    const icons = document.querySelectorAll('.bounce');
    icons.forEach((icon, index) => {
      // You can adjust the delay based on your preference
      const delay = 0.1 * index; // 0.1s delay for each icon
      icon.setAttribute('style', `animation: bounce 2s ease infinite; animation-delay: ${delay}s;`);
    });
  }

  public navigate(param: string) {
    this.router.navigate([`/${param}`]);
  }
}
