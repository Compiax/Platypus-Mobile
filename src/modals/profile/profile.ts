import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'modal-profile',
    templateUrl: 'profile.html'
})
export class ProfileModal {

  nickname: string;
  color: string;
  activeColor: Object;

  constructor(
    private viewController: ViewController,
    private storage: Storage) {}

  selectedColor($event):void {

    // Clicked div
    var element = $event.currentTarget;

    // Set 'color' to the background color of the label of the div which was clicked on
    this.color = window.getComputedStyle(element.querySelector("label")).backgroundColor;
    this.activeColor = { 'background-color': this.color };

    // Update selected color radio buttons
    document.getElementsByClassName("active")[0].classList.remove("active");
    element.className += " active";

    console.log("New Color: "+this.color);
  }

  public dismiss() {

    this.storage.set('color', this.color).then((data) => {
      if(this.nickname != "" && this.nickname != null) {
        this.storage.set('nickname', this.nickname).then((data) => {
          this.viewController.dismiss();
        });
      }

      else { this.viewController.dismiss(); }
    });
  }

  ionViewWillEnter () {

    this.storage.get('nickname').then((data) => {
      this.nickname = data;

      this.storage.get('color').then((data) => {

        this.color = data;
        this.activeColor = { 'background-color': this.color };

        var colorPickerItemArray = document.getElementsByClassName("color-picker-item");

        Array.prototype.forEach.call(colorPickerItemArray, function(currentItem) {

          if(window.getComputedStyle(currentItem.querySelector("label")).backgroundColor == data) {
            document.getElementsByClassName("active")[0].classList.remove("active");
            currentItem.className += " active";
          }
        });
      });
    });
  }
  
}
