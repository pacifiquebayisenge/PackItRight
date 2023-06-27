/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  async tripToDb(
    country: string,
    counrtyIso2: string,
    city: string,
    startDate: Date,
    endDate: Date
  ) {
    await this.firestore
      .collection('trips')
      .doc()
      .set({
        country,
        counrtyIso2,
        city,
        startDate,
        endDate,
        date: new Date(Date.now())
      })
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch((error) => {
        // this.snackServ.launchSnackbar(
        //   'Something Went wrong... Try again later'
        // );
        console.log('ERROR: trips to firestore');
        console.log(error);
      });
  }

  async updateTrip(
    id: string,
    country: string,
    counrtyIso2: string,
    city: string,
    startDate: Date,
    endDate: Date
  ) {
    await this.firestore
      .collection('trips')
      .doc(id)
      .update({
        country,
        counrtyIso2,
        city,
        startDate,
        endDate,
        date: new Date(Date.now())
      })
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch((error) => {
        // this.snackServ.launchSnackbar(
        //   'Something Went wrong... Try again later'
        // );
        console.log('ERROR: trips to firestore');
        console.log(error);
      });
  }

  async deleteTrip(id: string) {
    await this.firestore
      .collection('trips')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  }

  async tripById(id: string) {
    let trip;

    await firstValueFrom(this.firestore.collection('trips').doc(id).get())
      .then((doc) => {
        if (doc.exists) {
          const data: any = doc.data();
          trip = { id: id, ...data };
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });

    return trip;
  }

  async allTrips() {
    const trips: any = [];

    this.firestore
      .collection('trips')
      .snapshotChanges()
      .subscribe((snapshot) => {
        trips.length = 0;
        snapshot.map((change) => {
          const data: any = change.payload.doc.data();
          trips.push({ id: change.payload.doc.id, ...data });
        });
      });

    return trips;
  }

  // packing items

  async itemsToDb(id: string, items: string[]) {
    await firstValueFrom(
      this.firestore.collection('trips').doc(id).collection('items').get()
    ).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.firestore
          .collection('trips')
          .doc(id)
          .collection('items')
          .doc(doc.id)
          .delete()
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch((error) => {
            // this.snackServ.launchSnackbar(
            //   'Something Went wrong... Try again later'
            // );
            console.log('ERROR: delete item from firestore');
            console.log(error);
          });
      });
    });

    items.forEach(async (item: string) => {
      await this.firestore
        .collection('trips')
        .doc(id)
        .collection('items')
        .doc()
        .set({
          item: item
        })
        .then(() => {
          console.log('Document successfully written!');
        })
        .catch((error) => {
          // this.snackServ.launchSnackbar(
          //   'Something Went wrong... Try again later'
          // );
          console.log('ERROR: items to firestore');
          console.log(error);
        });
    });
  }

  async allItems(id: string) {
    const items: any = [];

    this.firestore
      .collection('trips')
      .doc(id)
      .collection('items')
      .snapshotChanges()
      .subscribe((snapshot) => {
        items.length = 0;
        snapshot.map((change) => {
          const data: any = change.payload.doc.data();
          items.push({ id: change.payload.doc.id, ...data });
        });
      });

    return items;
  }
}
