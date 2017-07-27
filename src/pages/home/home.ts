import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';

// Used for storing user data locally
import { Storage } from '@ionic/storage';
import { PAGES } from '../../app/pages';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  nickname: string;

  nicknameFirstLetter: string;
  nicknameOtherLetters: string;
  color: string;
  activeColor: Object;
  modal: any;

  pages = PAGES;

  constructor(private modalCtrl: ModalController, private navCtrl: NavController, private navParams: NavParams, private storage: Storage) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter() {

    this.storage.get('nickname').then((data) => {
      this.nickname = data;
      this.nicknameFirstLetter = this.nickname.charAt(0);
      this.nicknameOtherLetters = this.nickname.substr(1, this.nickname.length-1);
    });
    this.storage.get('colour').then((data) => {
      this.color = data;
      this.activeColor = { 'background-color': this.color };
    });


  }


  openModal(page): void {
    // this.modal = this.modalCtrl.create(Profile);
    this.modal.present();
  }

  /**
   * Opens a page with the specified name
   * @param {String} page The name of the page to open
   */
  openPage(page): void { this.navCtrl.push(page); }

}

@Component({
  selector: 'ProfilePage',
  template: '<ion-header><ion-navbar><ion-title>Profile</ion-title></ion-navbar></ion-header><ion-content padding text-center><h1>Profile</h1></ion-content>',
})
class Profile {

   constructor(public navParams: NavParams, private viewCtrl: ViewController) {

   }

   dismiss() {
     this.viewCtrl.dismiss();
   }
}
