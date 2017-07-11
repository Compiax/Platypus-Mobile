import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { HttpProvider } from '../../providers/HttpProvider';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { Storage } from '@ionic/storage';

// @todo Add try again button in interface to relaunch the camera
@IonicPage()
@Component({
  selector: 'page-create-session',
  templateUrl: 'create-session.html',
  providers:[HttpProvider]
})

export class CreateSessionPage {

  loading: any; // Loading spinner
  imageData: any;
  timeoutId: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private camera: Camera,
    private httpProvider: HttpProvider) {

      console.log("Initialize loading spinner");
      this.loading = this.loadingCtrl.create({
        content: "<ion-spinner></ion-spinner>"
      });

  }

  startTimeout() {
    this.loading.present();
    this.timeoutId = setTimeout(() => {
      this.loading.dismiss();
      this.navCtrl.pop();
    }, 30000);
  };

  endTimeout() {
    clearTimeout(this.timeoutId);
    this.loading.dismiss();
    console.log("Ending timeout");
  };

  captureImage() {
    console.log("Accessing device's camera and saving the captured data");
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
	    correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageData = base64Image;
    }, (err) => {
      console.log("Camera error occured: "+err);
      return false;
    });

    return true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateSessionPage');
  }

  ionViewDidEnter() {

    console.log("CreateSessionPage View Did Enter");

    this.startTimeout();
    console.log("Call http provider's createSession");

    this.storage.get('nickname').then(nickname => {
      console.log("trace "+nickname);
      this.storage.get('colour').then(color => {
        console.log("trace "+color);

        console.log("Call http provider's createSession");
        this.httpProvider.createSession(nickname, color).subscribe(session_vars => {

          console.log("createSession Response JSON: "+session_vars.json());
          var session_id = session_vars.json().data.attributes.session_id;
          var user_id = session_vars.json().data.attributes.user_id;
          console.log("createSession Response JSON session_id: "+session_id);
          console.log("createSession Response JSON user_id: "+user_id);
          this.storage.set('session_id', session_id);
          this.storage.set('user_id', user_id);

          this.endTimeout();

          this.handleImage(session_id);
        });
      });
    });



    // @todo Check if all of the above was successful
    // if(session_id){
    //   console.log("Redirecting to JoinSessionPage");
    //   // this.navCtrl.push('SessionPage', {session_id: session_id});
    // } else {
    //   console.log("Invalid Session id. Http provider must've encountered a problem.");
    // }
  }

  handleImage(session_id) {
    if(this.captureImage()) {
      // @todo Check if error occurs

      this.startTimeout();
      this.httpProvider.sendSessionImage(this.imageData, session_id).subscribe(session_items => {


        this.endTimeout();
      });
    }
  }

}
