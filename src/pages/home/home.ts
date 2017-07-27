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
  colour: string;
  pages = PAGES;

  constructor(private navCtrl: NavController, private navParams: NavParams, private storage: Storage) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter() {

    this.storage.get('nickname').then((data) => {this.nickname = data;});
    this.storage.get('colour').then((data) => {this.colour = data;});

  }

  /**
   * Opens a page with the specified name
   * @param {String} page The name of the page to open
   */
  openPage(page): void { this.navCtrl.push(page); }

}
