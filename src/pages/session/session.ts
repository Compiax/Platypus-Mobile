import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';

// Used for storing user data locally
import { Storage } from '@ionic/storage';
import { SESSION_PAGES } from '../../app/pages';
import { Item } from '../../providers/Item';

@IonicPage()
@Component({
  selector: 'page-session',
  templateUrl: 'session.html',
})
export class SessionPage {

  pages = SESSION_PAGES;
  total: number;
  items: Array<Item>;

  selectedItems: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
      this.items = new Array<Item>();
      this.createNewItem(0, 11.24, 5, "Cheese Burger");
      this.createNewItem(1, 24.90, 2, "Milkshake");
      this.total = this.getTotal();

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
    // @todo Check session_id is stored and correct
    // @todo Check user_id is stored and correct
    // @todo If valid client, start socketIO

    // @todo Get JSON (Store it locally as array of JSON items)
    // @todo Receive updates from socketIO and update JSON array items
    // OR
    // @todo Get JSON and parse it straight into ionic panels
    // @todo Receive updates from scoketIO, parse it as ionic panels and update them
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
    // If tick button is pressed save all changes to local data
    // Send changes to server
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
    var total = 0.0;
    for(let item of this.items) {
      total += item.getPrice()*item.getMyQuantity();
    }
    return total;
  }

}
