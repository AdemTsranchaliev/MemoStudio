import { Component, OnInit } from "@angular/core";
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.css"],
})
export class LoaderComponent implements OnInit {
  isLoadingGlobal: boolean;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    // Subscribe to the loader service's observable to track the loader state
    this.loaderService.getLoaderState().subscribe((isLoading) => {
      this.isLoadingGlobal = isLoading;
    });
  }
}
