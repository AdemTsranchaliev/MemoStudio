import { Component, Input, Output, ElementRef, ViewChild, HostListener, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox-select',
  templateUrl: './checkbox-select.component.html',
  styleUrls: ['./checkbox-select.component.css']
})
export class CheckboxSelectComponent {
  @Input() serviceList: string[] = [];
  @Output() checkboxSelectEvent = new EventEmitter<string[]>();

  @ViewChild('dropdown') dropdown: ElementRef;
  isOpen = false;
  checkedItems: string[] = [];
  btnText = "Иберете услуга";

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.dropdown.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
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
