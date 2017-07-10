import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateSessionPage } from './create-session';

@NgModule({
  declarations: [
    CreateSessionPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateSessionPage),
  ],
  exports: [
    CreateSessionPage
  ]
})
export class CreateSessionPageModule {}
