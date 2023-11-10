import { Component, Input, Output, ElementRef, ViewChild, HostListener, EventEmitter, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkbox-select',
  templateUrl: './checkbox-select.component.html',
  styleUrls: ['./checkbox-select.component.css']
})
export class CheckboxSelectComponent implements OnInit {
  @Input() serviceList: string[] = [];
  @Output() checkboxSelectEvent = new EventEmitter<string[]>();

  @ViewChild('dropdown') dropdown: ElementRef;
  isOpen = false;
  checkedItems: string[] = [];
  btnText = "Иберете услуга";

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.dropdown.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;

    // Get the mat-horizontal-content-container element
    const matHorizontalContentContainer = document.querySelector('.mat-horizontal-content-container');

    // Apply styles based on the dropdown state
    if (matHorizontalContentContainer) {
      if (this.isOpen) {
        this.renderer.setStyle(matHorizontalContentContainer, 'overflow', 'visible');
      } else {
        this.renderer.setStyle(matHorizontalContentContainer, 'overflow', 'hidden');
      }
    }
  }

  toggleItem(item: string) {
    const index = this.checkedItems.indexOf(item);

    if (index === -1) {
      this.checkedItems.push(item);
    } else {
      this.checkedItems.splice(index, 1);
    }

    this.checkboxSelectEvent.emit(this.checkedItems);

    this.updateButtonText();
  }

  updateButtonText() {
    if (this.checkedItems.length > 0) {
      this.btnText = `Избрани: ${this.checkedItems.length}`;
    } else {
      this.btnText = "Иберете услуга";
    }
  }
}
