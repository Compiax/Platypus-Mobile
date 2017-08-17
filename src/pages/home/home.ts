import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { Alert } from '../../providers/Alert';

// Used for storing user data locally
import { Storage } from '@ionic/storage';
import { PAGES } from '../../app/pages';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[Alert]
})
export class HomePage {

  nickname: string;
  nicknameFirstLetter: string;
  nicknameOtherLetters: string;
  color: string;
  activeColor: Object;
  modal: any;

  pages = PAGES;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter() {
    this.loadResources();
  }

  /**
   * Sets local variables to saved values in SQLite
   */
  loadResources() {

    this.storage.get('nickname').then((data) => {
      this.nickname = data;
      this.nicknameFirstLetter = this.nickname.charAt(0);
      this.nicknameOtherLetters = this.nickname.substr(1, this.nickname.length-1);
    });
    this.storage.get('color').then((data) => {
      this.color = data;
      this.activeColor = { 'background-color': this.color };
    });

  }

  /**
   * Opens a modal with the specified name
   * @param {String} modal The name of the modal to open
   */
  openModal(modal): void {
    this.modal = this.modalCtrl.create(modal);
    this.modal.onDidDismiss((data) => {
      this.loadResources();
    });
    this.modal.present();
  }

  /**
   * Opens a page with the specified name
   * @param {String} page The name of the page to open
   */
  openPage(page): void { this.navCtrl.push(page); }

}
