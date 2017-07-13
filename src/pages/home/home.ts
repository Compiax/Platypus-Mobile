import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  pages = PAGES;

  constructor(private navCtrl: NavController, private navParams: NavParams, private storage: Storage) { }

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

  openPage(page): void { this.navCtrl.push(page); }

}
