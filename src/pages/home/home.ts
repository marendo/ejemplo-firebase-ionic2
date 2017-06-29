import { Component } from '@angular/core';
import { NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  songs: FirebaseListObservable<any>;
  
  songRef:firebase.database.Reference;
  songsList: Array<any>;
  loadedSongsList: Array<any>;
  
  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController, 
			  af: AngularFireDatabase, 
			  public actionSheetCtrl: ActionSheetController) {
			  
		// Usando AngularFireDatabase
		this.songs = af.list('/songs');
		
		// Usando metodo nativo de firebase
		this.songRef = firebase.database().ref('/songs');
		this.songRef.on('value', songsList => {
			let songsArray = [];
			songsList.forEach( song => {
				songsArray.push(song.val());
				return false;
			});
			
		this.songsList = songsArray;
		this.loadedSongsList = songsArray;
		console.log(this.songsList.length);
		});
  }

  addSong(){
    let prompt = this.alertCtrl.create({
    title: 'Song Name',
    message: "Enter a name for this new song you're so keen on adding",
    inputs: [
      {
        name: 'title',
        placeholder: 'Title'
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          this.songs.push({
            title: data.title
          });
        }
      }
    ]
    });
    prompt.present();
  }

  removeSong(songId: string){
    this.songs.remove(songId);
  }  

  updateSong(songId, songTitle){
  let prompt = this.alertCtrl.create({
    title: 'Song Name',
    message: "Update the name for this song",
    inputs: [
      {
        name: 'title',
        placeholder: 'Title',
        value: songTitle
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          this.songs.update(songId, {
            title: data.title
          });
        }
      }
    ]
  });
  prompt.present();
  }
  
  showOptions(songId, songTitle) {
  let actionSheet = this.actionSheetCtrl.create({
    title: 'What do you want to do?',
    buttons: [
      {
        text: 'Delete Song',
        role: 'destructive',
        handler: () => {
          this.removeSong(songId);
        }
      },{
        text: 'Update title',
        handler: () => {
          this.updateSong(songId, songTitle);
        }
      },{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
    });
    actionSheet.present();
  }  

  initializeItems(){
    this.songsList = this.loadedSongsList;
  }  
  
  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();
    
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;


    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.songsList = this.songsList.filter((v) => {
      if(v.title && q) {
        if (v.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.songsList.length);
  }

}
