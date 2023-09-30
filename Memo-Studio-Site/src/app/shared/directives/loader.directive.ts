import { ComponentFactoryResolver, Directive, ViewContainerRef } from '@angular/core';
import { LoaderComponent } from '../components/loader/loader.component';

@Directive({
  selector: '[appLoader]'
})
export class LoaderDirective {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    // Create a ComponentFactory for LoaderComponent
    const loaderComponentFactory = this.componentFactoryResolver.resolveComponentFactory(LoaderComponent);

    // Create an instance of LoaderComponent and add it to the view
    const loaderComponentRef = loaderComponentFactory.create(this.viewContainerRef.injector);

    // Attach the component to the view
    this.viewContainerRef.insert(loaderComponentRef.hostView);

    // Detect changes in the loader component
    loaderComponentRef.changeDetectorRef.detectChanges();
  }
}
