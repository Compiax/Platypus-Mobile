import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { Alert } from '../../providers/Alert';

// import { IOProvider } from '../../providers/IOProvider';

import { HttpProvider } from '../../providers/HttpProvider';

// SOCKET
import * as io from 'socket.io-client';

// Used for storing user data locally
import { Storage } from '@ionic/storage';
import { SESSION_PAGES } from '../../app/pages';
import { Item } from '../../providers/Item';

// SOCKET
const SOCKET_IP = 'http://192.168.43.144:3002';

@IonicPage()
@Component({
  selector: 'page-session',
  templateUrl: 'session.html',
  providers:[/*IOProvider,*/ HttpProvider, Alert]
})
export class SessionPage {

  // SOCKET
  socket: SocketIOClient.Socket;

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
  scope: any;
  selectedItems: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage,
    private alertService: Alert,
    /*private ioProvider: IOProvider,*/
    private httpProvider: HttpProvider) {

      // SOCKET
      this.socket = io(SOCKET_IP);
      this.s_handleListeners();

      this.items = new Array<Item>();
      this.scope = this;
      this.maxId = 0;

      // this.items.push(new Item(43.50, 5, "Cheese Burger", "m1t17uNaN"));
      // this.items.push(new Item(24.90, 2, "Milkshake", 1));
      // this.items.push(new Item(18.00, 3, "Filter Coffee", 2));
      // this.items.push(new Item(25.90, 2, "Toasted Cheese", 3));
      // this.items.push(new Item(5.90, 1, "Extra Bacon", 4));
      // this.items.push(new Item(32.90, 1, "Chicken Wrap", 5));

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

  ionViewDidEnter() {

    this.loadResources(this)
    .then((data) => { this.validateSessionData(data, this) }, (err) => {this.redirectHome(err, this)})
    .then((data) => { this.getAllSessionData(data, this) }, (err) => {this.redirectHome(err, this)})
    .then((data) => {}, (err) => { this.redirectHome(err, this) });

  }

  redirectHome(err, scope){
    console.log(err);
    console.log("Redirecting home");
    scope.navCtrl.setRoot("HomePage");
  }

  validateSessionData(data, scope) {
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

  getAllSessionData(data, scope){
    return new Promise(function (resolve, reject) {
      scope.httpProvider.getAllSessionData(scope.session_id).then( (data) => {
        scope.parseItems(data);
        resolve();
      }, (err) => {
        reject(err);
      });
    });
  }

  parseItems(json) {
    var parsedData = JSON.parse(json.data);
    console.log(parsedData.data.attributes);
    console.log(parsedData.data.attributes.items[0].i_price+" "+parsedData.data.attributes.items[0].i_name+" "+parsedData.data.attributes.items[0].i_quantity+" "+parsedData.data.attributes.items[0].i_id);
    for(var i = 0; i<parsedData.data.attributes.items.length; i++) {
      this.items.push(new Item(
        parsedData.data.attributes.items[i].i_price,
        parsedData.data.attributes.items[i].i_quantity,
        parsedData.data.attributes.items[i].i_name,
        parsedData.data.attributes.items[i].i_id
      ));
    }
  }

  loadResources(scope) {
    return new Promise(function (resolve, reject) {

      scope.storage.get('session_id').then((data) => {
        console.log("TRACE: "+data);
        scope.session_id = data;
        scope.storage.get('user_id').then((data) => {
          scope.user_id = data;
          scope.storage.get('nickname').then((data) => {
            scope.nickname = data;
            scope.storage.get('color').then((data) => {
              scope.color = data;
              scope.activeBackgroundColor = { 'background-color': scope.color };
              scope.activeColor = { 'color': scope.color };
              console.log(scope.color);
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
    // this.ioProvider.deleteItem(this.session_id, item.getId());
    this.s_deleteItem(this.session_id, item.getId());
  }

  addItem(item) {
    item.decrementQuantity();
    // this.ioProvider.claimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
    this.s_claimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
  }

  addAllItems(item) {
    while(item.getQuantity() != 0)
      item.decrementQuantity();
    // this.ioProvider.unclaimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
    this.s_unclaimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
  }

  removeItem(item) {
    item.incrementQuantity();
    // this.ioProvider.claimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
    this.s_claimItem(this.session_id, this.user_id, item.getMyQuantity(), item.getId());
  }

  editItemHandler(item, slider) {

    console.log("Handling Edit: "+item.getName());
    slider.close();
    this.editItem(item);
  }

  editItem(item) {

    console.log("Editing: "+item.getName());

    var checkExist = setInterval(function() {
       if (document.getElementById(item.getId()) != null) {
          clearInterval(checkExist);

          var itemContainer = document.getElementById(item.getId());

          var elementList = <NodeListOf<HTMLElement>>itemContainer.querySelectorAll(".edit-item-input");

          for (var i = 0; i < elementList.length; ++i)
              elementList[i].style.display = "inline-block";

          (<HTMLElement>itemContainer.querySelector(".card-drag")).style.display="none";
          (<HTMLElement>itemContainer.querySelector(".card-confirm")).style.display="inline";

       } else {
         console.log("Waiting to edit item");
       }
    }, 100);
  }

  closeEdit(item, event) {

    console.log("Closing: "+item.getName());
    var itemContainer = document.getElementById(item.getId());

    if((<HTMLElement>itemContainer.querySelector(".card-drag")).style.display == "none") {

      var elementList = <NodeListOf<HTMLElement>>itemContainer.querySelectorAll(".edit-item-input");

      for (var i = 0; i < elementList.length; ++i)
          elementList[i].style.display = "none";

      (<HTMLElement>itemContainer.querySelector(".card-drag")).style.display="inline";
      (<HTMLElement>itemContainer.querySelector(".card-confirm")).style.display="none";

      if(item.getId() == -1) {
        // this.ioProvider.createItem(this.session_id, item.getPrice(), item.getName(), item.getQuantity());
        this.s_createItem(this.session_id, item.getPrice(), item.getName(), item.getQuantity());
        this.items.splice(this.items.indexOf(item), 1);
      } else {
        // this.ioProvider.editItem(this.session_id, item.getPrice(), item.getName(), item.getQuantity(), item.getId());
        this.s_editItem(this.session_id, item.getPrice(), item.getName(), item.getQuantity(), item.getId());
      }

    }
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
    for(let item of this.items){
      var numberOfItems: number = item.getQuantity()+item.getMyQuantity();
      total += item.getPrice()*numberOfItems;
      // console.log(item.getPrice()+" "+item.getQuantity()+" "+item.getMyQuantity()+" "+item.getName()+" "+item.getPrice()*numberOfItems);
    }
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


  /*--------------------------*/
  /*----------SOCKET---------*/
  /*--------------------------*/
  s_handleListeners() {
    this.socket.on('sendItem', (data) => {console.log("TRACE: Detected change"); this.s_getItem(data, this); });
  }

  s_claimItem(session_id, user_id, quantity, item_id) {
    console.log("claimItem: Emitting: "+session_id+", "+user_id+", "+quantity+", "+item_id);
    this.socket.emit('claimItem', { session_id: session_id, user_id: user_id, quantity: quantity, item_id: item_id });
  }

  s_unclaimItem(session_id, user_id, quantity, item_id) {
    console.log("claimItem: Emitting: "+session_id+", "+user_id+", "+quantity+", "+item_id);
    this.socket.emit('unclaimItem', { session_id: session_id, user_id: user_id, quantity: quantity, item_id: item_id });
  }

  s_createItem(session_id, price, name, quantity) {
    console.log("createItem: Emitting: "+session_id+", "+price+", "+name+", "+quantity);
    this.socket.emit('createItem', { session_id: session_id, price: price, name: name, quantity: quantity });
  }

  s_deleteItem(session_id, item_id) {
    console.log("deleteItem: Emitting: "+session_id+", "+item_id);
    this.socket.emit('deleteItem', { session_id: session_id, item_id: item_id });
  }

  s_editItem(session_id, price, name, quantity, item_id) {
    console.log("editItem: Emitting: "+session_id+", "+price+", "+name+", "+quantity+", "+item_id);
    this.socket.emit('editItem', { session_id: session_id, price: price, name: name, quantity: quantity, item_id: item_id });
  }

  s_getItem(parsedData, scope) {
    var isFound = false;
    console.log("Got item: ");
    console.log(parsedData);
    console.log(this.session_id+" "+parsedData.data.attributes.session_id);
    if(scope.session_id == parsedData.data.attributes.session_id) {
      for(let itemIter of scope.items) {
        if(itemIter.getId() == parsedData.data.attributes.item.i_id) {
          console.log("Editing old item");
          isFound = true;
          itemIter.setPrice(parsedData.data.attributes.item.i_price);
          itemIter.setName(parsedData.data.attributes.item.i_name);
          itemIter.setQuantity(parsedData.data.attributes.item.i_quantity);
        }
      }
      if(!isFound) {
        console.log("Adding new item");
        scope.items.push(new Item(parsedData.data.attributes.item.i_price, parsedData.data.attributes.item.i_quantity, parsedData.data.attributes.item.i_name, parsedData.data.attributes.item.i_id));
      }
    }
  }

}
