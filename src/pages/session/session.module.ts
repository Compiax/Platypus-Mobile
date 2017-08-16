import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SessionPage } from './session';

@NgModule({
  declarations: [
    SessionPage,
  ],
  imports: [
    IonicPageModule.forChild(SessionPage),
  ],
  exports: [
    SessionPage
  ]
})
export class SessionPageModule {}
