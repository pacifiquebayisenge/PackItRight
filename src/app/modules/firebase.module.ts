import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/compat/app';

firebase.default.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [],
  imports: [],
  providers: [],
  bootstrap: []
})
export class FirebaseModule {}
