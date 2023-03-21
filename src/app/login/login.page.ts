import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email: string;
  public password: string;
  public rememberMe: boolean;

  constructor(private navCtrl:NavController, private http: HttpClient, private toastController: ToastController){
    this.email = '';
    this.password = '';
    this.rememberMe = false;

    this.checkIfSaved();
  }

  ngOnInit() {
  }
  async checkIfSaved(){
    let email = await Preferences.get({key: 'SavedEmail'});
    let password = await Preferences.get({key: 'SavedPassword'});
    if(email.value != null && password.value != null){
      this.email = email.value;
      this.password = password.value;
      this.rememberMe = true;
    }
    else {
      this.rememberMe = false;
    }
  }
  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Mot de pass ou email incorrect',
      duration: 1500,
      position: position
    })
    await toast.present();
  }
  async logIn(){
    let firstTime = await Preferences.get({key: 'FirstTime'});
    this.http.get(`http://www.sebastien-thon.fr/prince/index.php?connexion&login=${this.email}&mdp=${this.password}`).subscribe((data) => {
      let response = JSON.parse(JSON.stringify(data));
      console.log(response['resultat']);
      if(response['resultat'] == 'OK'){
        if(this.rememberMe)
        {
        Preferences.set({key: 'SavedEmail', value: this.email});
        Preferences.set({key: 'SavedPassword', value: this.password});
        }
        Preferences.set({key: 'ConnectedEmail', value: this.email});
        Preferences.set({key: 'ConnectedPassword', value: this.password});
        this.navCtrl.navigateRoot('tabs/tabs/tab1');

        if(firstTime.value == null){
          Preferences.set({key: 'FirstTime', value: 'false'});
          this.navCtrl.navigateRoot('tutorial');
        }
      }
      else{
        this.presentToast('top');
      }
    });
  }


}
