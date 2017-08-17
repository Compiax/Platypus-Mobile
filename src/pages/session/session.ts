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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
      this.items = new Array<Item>();
      this.createNewItem(0, 11.24, 5, "Cheese Burger");
      this.createNewItem(1, 24.90, 2, "Milkshake");

      this.total = this.getTotal();
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
    console.log("Added: "+item.getName());
    // Add it to client's list of items
    item.decrementQuantity();
  }

  editItem(item) {
    console.log("Editing: "+item.getName());
  }

  removeItem(item) {
    console.log("Removing: "+item.getName());
    // Check if User has an item to remove
    // Remove it from client's list of items
    item.incrementQuantity();
  }

  getTotal() {
    var total = 0.0;
    for(let item of this.items) {
      total += item.getPrice();
    }
    return total;
  }

}
