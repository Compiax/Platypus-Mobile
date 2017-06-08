import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Used for storing user data locally
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  nickname: string;
  colour: string;

  constructor(private navCtrl: NavController, private navParams: NavParams, private storage: Storage) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter() {

    this.storage.get('nickname').then((data) => {this.nickname = data;});
    this.storage.get('colour').then((data) => {this.colour = data;});

  }

}
