import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Used for storing user data locally
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-get-started',
  templateUrl: 'get-started.html',
})

export class GetStartedPage {

  nickname: string;
  colour: string;
  activeColour: Object;

  constructor(private navCtrl: NavController, private navParams: NavParams, private storage: Storage) {
    this.colour =  "rgb(242, 111, 129)";
    this.activeColour = { 'background-color': this.colour };
  }

  // Set the user's prefered colour to the selected colour
  selectedColor($event):void {

    // Clicked div
    var element = $event.currentTarget;

    // Set 'colour' to the background colour of the label of the div which was clicked on
    this.colour = window.getComputedStyle(element.querySelector("label")).backgroundColor;
    this.activeColour = { 'background-color': this.colour };

    // Update selected colour radio buttons
    document.getElementsByClassName("active")[0].classList.remove("active");
    element.className += " active";
  }

  navigateToHomePage(): void {

    if(this.nickname != "" && this.nickname != null) { this.storage.set('nickname', this.nickname); }
    this.storage.set('colour', this.colour);

    // How to navigate and send information to next page
    // this.navCtrl.push('HomePage', {nickname: this.nickname, colour: "#AAA"});

    this.navCtrl.setRoot("HomePage");
  }

  // If the user has used the app before, skip to the home page
  ionViewWillEnter() {

    // Delete for production
    this.storage.clear();

    this.storage.length().then( length => {
      if(length >= 2)
        this.navCtrl.setRoot("HomePage");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GetStartedPage');
  }

}
