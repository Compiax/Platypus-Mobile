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

  captureImage() {
    console.log("Accessing device's camera and saving the captured data");
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
	    correctOrientation:true
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

    this.loading.present();
    console.log("Call http provider's createSession");
    // var session_id = this.httpProvider.createSession(this.imageData).data.session_id;
    this.storage.get('nickname').then((nickname) => {
      console.log("trace "+nickname);
      this.storage.get('colour').then((color) => {
        console.log("trace "+color);

        console.log("Call http provider's createSession");
        var session_vars = this.httpProvider.createSession(nickname, color);
        this.loading.dismiss();

        console.log("createSession Response JSON: "+session_vars);
        var session_id = session_vars.data.attributes.session_id;
        var user_id = session_vars.data.attributes.user_id;
        this.storage.set('session_id', session_id);
        this.storage.set('user_id', user_id);

      });
    });

    // @todo If createSession was successful
    if(this.captureImage()) {
      // @todo Check if error occurs
      this.httpProvider.sendSessionImage(this.imageData);
    }

    // @todo Check if all of the above was successful
    // if(session_id){
    //   console.log("Redirecting to JoinSessionPage");
    //   // this.navCtrl.push('SessionPage', {session_id: session_id});
    // } else {
    //   console.log("Invalid Session id. Http provider must've encountered a problem.");
    // }
  }

}
