import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { Alert } from '../../providers/Alert';
import { IOProvider } from '../../providers/IOProvider';

// Used for storing user data locally
import { Storage } from '@ionic/storage';
import { SESSION_PAGES } from '../../app/pages';
import { Item } from '../../providers/Item';

@IonicPage()
@Component({
  selector: 'page-session',
  templateUrl: 'session.html',
  providers:[IOProvider, Alert]
})
export class SessionPage {

  pages = SESSION_PAGES;
  total: number;
  gratuityPercent: number;
  items: Array<Item>;
  nickname: string;
  color: string;
  session_id: string;
  user_id: number;
  sessionOwner: string;
  activeBackgroundColor: Object;
  activeColor: Object;

  maxId: number;

  selectedItems: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage,
    private alertService: Alert,
    private ioProvider: IOProvider) {
      this.items = new Array<Item>();

      this.maxId = 0;

      this.items.push(new Item(43.50, 5, "Cheese Burger", 0));
      this.items.push(new Item(24.90, 2, "Milkshake", 1));
      this.items.push(new Item(18.00, 3, "Filter Coffee", 2));
      this.items.push(new Item(25.90, 2, "Toasted Cheese", 3));
      this.items.push(new Item(5.90, 1, "Extra Bacon", 4));
      this.items.push(new Item(32.90, 1, "Chicken Wrap", 5));

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

    this.loadResources()
    .then(this.validateSession, this.redirectHome)
    .then(this.validateUser, this.redirectHome)
    .then(this.getAllSessionData, this.redirectHome)
    .then(function(){}, this.redirectHome);

    this.loadResources();
  }

  redirectHome(err?){
    if(err != null)
      console.log(err);
    console.log("Redirecting home");
    this.navCtrl.setRoot("HomePage");
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

  loadResources() {
    return new Promise(function (resolve, reject) {

      this.storage.get('session_id').then((data) => {
        this.session_id = data;
        this.storage.get('user_id').then((data) => {
          this.user_id = data;
          this.storage.get('nickname').then((data) => {
            this.nickname = data;
            this.storage.get('color').then((data) => {
              this.color = data;
              this.activeBackgroundColor = { 'background-color': this.color };
              this.activeColor = { 'color': this.color };
              console.log(this.color);
              resolve();
            });
          });
        });
      });

    });
  }

  createNewItem() {
      var newItem = new Item(0, 0, "", -1);
      this.items.push(newItem);
      this.editItem(newItem);
  }

  deleteItem(item) {
    this.items.splice(this.items.indexOf(item), 1);
    this.ioProvider.deleteItem(this.session_id, item.getId());
  }

  addItem(item) {
    item.decrementQuantity();
    this.ioProvider.claimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
  }

  addAllItems(item) {
    while(item.getQuantity() != 0)
      item.decrementQuantity();
    this.ioProvider.claimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
  }

  removeItem(item) {
    item.incrementQuantity();
    this.ioProvider.claimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
  }

  editItemHandler(item, slider) {

    console.log("Handling Edit: "+item.getName());
    slider.close();
    this.editItem(item);
  }

  editItem(item) {

    console.log("Editing: "+item.getName());
    var itemContainer = document.getElementById(item.getId()); // NULL, wait for it to exist
    var elementList = <NodeListOf<HTMLElement>>itemContainer.querySelectorAll(".edit-item-input");

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

    if(item.getId() == -1)
      this.ioProvider.createItem(this.session_id, item.getPrice(), item.getName(), item.getQuantity());
    else
      this.ioProvider.editItem(this.session_id, item.getPrice(), item.getName(), item.getQuantity(), item.getId());


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
