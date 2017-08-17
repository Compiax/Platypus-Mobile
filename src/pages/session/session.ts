import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { Alert } from '../../providers/Alert';

// Used for storing user data locally
import { Storage } from '@ionic/storage';
import { SESSION_PAGES } from '../../app/pages';
import { Item } from '../../providers/Item';

@IonicPage()
@Component({
  selector: 'page-session',
  templateUrl: 'session.html',
  providers:[Alert]
})
export class SessionPage {

  pages = SESSION_PAGES;
  total: number;
  gratuityPercent: number;
  items: Array<Item>;
  nickname: string;
  color: string;
  sessionOwner: string;
  activeBackgroundColor: Object;
  activeColor: Object;

  selectedItems: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage,
    private alertService: Alert) {
      this.items = new Array<Item>();

      this.createNewItem(0, 11.24, 5, "Cheese Burger"); // @todo Get this info from the server upon establishing a connection
      this.createNewItem(1, 24.90, 2, "Milkshake");     // @todo Get this info from the server upon establishing a connection

      this.total = this.getTotal();
      this.gratuityPercent = 10;

      this.sessionOwner = "Duart";  // @todo Get this info from the server upon establishing a connection
      this.selectedItems = "all-items";
  }

  switchSegments(){
    var buttons = document.querySelectorAll(".menu .list button");

    if(this.selectedItems == "all-items")
      this.selectedItems = "my-items";
    else if(this.selectedItems == "my-items")
      this.selectedItems = "all-items";

    for (var i = 0; i < buttons.length; i++) {

      if(buttons[i].innerHTML == "All Items") {
        buttons[i].innerHTML = "My Items";
      } else if(buttons[i].innerHTML == "My Items") {
        buttons[i].innerHTML = "All Items";
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SessionPage');
  }

  ionViewWillEnter() {

    this.validateSession()
    .then(this.validateUser)
    .then(this.getAllSessionData)
    .then(this.startSocketIO);

    // @todo Check session_id is stored and correct
    // @todo Check user_id is stored and correct
    // @todo If valid client, start socketIO

    // @todo Get JSON and parse it straight into ionic panels
    // @todo Receive updates from scoketIO, parse it as ionic panels and update them
    this.loadResources();
  }

  validateSession() {
    return new Promise(function (resolve, reject) {
      if(1 == 1) {
        console.log("Session validated");
        resolve("Session validated");
      } else {
        console.log("Session validation broke");
        reject(Error("Session validation broke"));
      }
    });
  }

  getAllSessionData(){
    return new Promise(function (resolve, reject) {
      if(1 == 1) {
        console.log("Session data received");
        resolve("Session data received");
      } else {
        console.log("Session data retrievel broke");
        reject(Error("Session data retrievel broke"));
      }
    });
  }

  validateUser(){
    return new Promise(function (resolve, reject) {
      if(1 == 1) {
        console.log("User validated");
        resolve("User validated");
      } else {
        console.log("User validation broke");
        reject(Error("User validation broke"));
      }
    });
  }

  startSocketIO(){
    return new Promise(function (resolve, reject) {
      if(1 == 1) {
        console.log("Started SocketIO communicated successfully");
        resolve("Started SocketIO communicated successfully");
      } else {
        console.log("SocketIO communication broke");
        reject(Error("SocketIO communication broke"));
      }
    });
  }

  loadResources() {

    this.storage.get('nickname').then((data) => {
      this.nickname = data;
    });

    this.storage.get('color').then((data) => {
      this.color = data;
      this.activeBackgroundColor = { 'background-color': this.color };
      this.activeColor = { 'color': this.color };
      console.log(this.color);
    });
  }

  createNewItem(id, price, quantity, name) {
    this.items.push(new Item(id, price, quantity, name));
  }

  addItem(item) {
    item.decrementQuantity();
  }

  editItem(item) {
    console.log("Editing: "+item.getName());
    // Dismiss the slide/swipe
    // Replace spans with inputs, add a tick button at the end
    // If tick button is pressed save all changes locally
    // Send changes to API
  }

  removeItem(item) {
    item.incrementQuantity();
  }

  getItemIndex(arr, id: number){
    for(var i = 0; i<arr.length; i++){
      if(arr[i].getId() == id)
        return i;
    }
    return -1;
  }

  getTotal() {
    var total = 0.0;
    for(let item of this.items) {
      total += item.getPrice()*(item.getQuantity()+item.getMyQuantity());
    }
    return total;
  }

  getDue() {
    var due = 0.0;
    for(let item of this.items) {
      due += item.getPrice()*item.getMyQuantity();
    }
    return due;
  }

  getGratuity() {
    return this.getDue()*(this.gratuityPercent/100);
  }

  getTotalDue() {
    return this.getGratuity()+this.getDue();
  }

  leaveSession() {
    // @todo Ask the user if they're sure
    // @todo Inform the API this user is disconnecting
    this.navCtrl.setRoot("HomePage");
  }

}
