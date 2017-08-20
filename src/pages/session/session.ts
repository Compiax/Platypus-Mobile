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

  maxId: number;

  selectedItems: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage,
    private alertService: Alert) {
      this.items = new Array<Item>();

      this.maxId = 0;

      this.createNewItem(0, 43.50, 5, "Cheese Burger"); // @todo Get this info from the server upon establishing a connection
      this.createNewItem(1, 24.90, 2, "Milkshake");     // @todo Get this info from the server upon establishing a connection
      this.createNewItem(2, 32.90, 1, "Chicken Wrap");     // @todo Get this info from the server upon establishing a connection
      this.createNewItem(3, 18.00, 3, "Filter Coffee");     // @todo Get this info from the server upon establishing a connection
      this.createNewItem(4, 25.90, 2, "Toasted Cheese");     // @todo Get this info from the server upon establishing a connection
      this.createNewItem(5, 5.90, 1, "Extra Bacon");     // @todo Get this info from the server upon establishing a connection

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

  createNewItem(id:number, price:number, quantity:number, name:string): void;
  createNewItem(): void;

  createNewItem(id?:number, price?:number, quantity?:number, name?:string): void {
    if(id != null && price != null && quantity != null && name != null){

      this.items.push(new Item(id, price, quantity, name));

      if(this.maxId < id)
        this.maxId = id;

    } else {
        var newItem = new Item(this.maxId+1, 0, 0, "", true);
        console.log("Create: ID: "+newItem.getId());

        this.items.push(newItem);
        // this.editItem(newItem);
    }
  }

  addItem(item) {
    item.decrementQuantity();
    // Send changes to API
  }

  addAllItems(item) {
    while(item.getQuantity() != 0)
      item.decrementQuantity();
  }

  removeItem(item) {
    item.incrementQuantity();
    // Send changes to API
  }

  editItemHandler(item, slider) {

    console.log("Handling Edit: "+item.getName());
    slider.close();
    this.editItem(item);
  }

  editItem(item) {

    console.log("Editing: "+item.getName());
    var itemContainer = document.getElementById(item.getId()); // NULL, wait for it to exist
    console.log("pre error");
    var elementList = <NodeListOf<HTMLElement>>itemContainer.querySelectorAll(".edit-item-input");
    console.log("post error");

    for (var i = 0; i < elementList.length; ++i)
        elementList[i].style.display = "inline-block";

    (<HTMLElement>itemContainer.querySelector(".card-drag")).style.display="none";
    (<HTMLElement>itemContainer.querySelector(".card-confirm")).style.display="inline";

  }

  closeEdit(item, e) {

    console.log("Closing: "+item.getName());
    var itemContainer = document.getElementById(item.getId());
    var elementList = <NodeListOf<HTMLElement>>itemContainer.querySelectorAll(".edit-item-input");

    for (var i = 0; i < elementList.length; ++i)
        elementList[i].style.display = "none";

    (<HTMLElement>itemContainer.querySelector(".card-drag")).style.display="inline";
    (<HTMLElement>itemContainer.querySelector(".card-confirm")).style.display="none";

    // Send changes to API (API: Check if the item ID exists, if not, create the item)
  }

  getItemIndex(arr, id: number) {
    for(var i = 0; i<arr.length; i++){
      if(arr[i].getId() == id)
        return i;
    }
    return -1;
  }

  getTotal() {
    var total = 0.0;
    for(let item of this.items)
      total += item.getPrice()*(item.getQuantity()+item.getMyQuantity());

    return total;
  }

  getDue() {
    var due = 0.0;
    for(let item of this.items)
      due += item.getPrice()*item.getMyQuantity();

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
