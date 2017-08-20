import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'modal-about',
    templateUrl: 'about.html'
})
export class AboutModal {

  constructor(
    private viewController: ViewController) {}

  public dismiss() {
    this.viewController.dismiss();
  }

}
