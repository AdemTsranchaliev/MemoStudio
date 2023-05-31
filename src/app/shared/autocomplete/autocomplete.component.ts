import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent implements OnInit {
  @Input() options: any[] = [];
  @Input() label: string = "";
  @Input() propertyShow: string = "";
  @Input() propertyReturn: string = "";
  @Input() isRequired: boolean = false;

  @Output() inputChangeEvent = new EventEmitter<any>();

  myControl = new FormControl("");
  filteredOptions: Observable<any[]> | null = null;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => {
        this.inputChangeEvent.emit(this.myControl.value);
        const item = typeof value === "string" ? value : value?.name;
        let result = item ? this._filter(item as string) : this.options.slice();
        return result;
      })
    );
  }

  displayFn(item: any): any {
    return item ? item : "";
  }

  private _filter(item: any): any[] {
    const filterValue = item.toLowerCase();

    return this.options.filter((option) =>
      option[this.propertyShow].toLowerCase().includes(filterValue)
    );
  }
}
