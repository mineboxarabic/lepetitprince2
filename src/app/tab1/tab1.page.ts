import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page {
    public articles: any;
    public className: any;
    public favori: Array<any> = [];
    constructor( private http: HttpClient , private navCtrl: NavController) {
      this.className = 'les petites';
      this.getData();
  
    }
    async getData(){
      let email = await Preferences.get({key: 'ConnectedEmail'});
      let password = await Preferences.get({key: 'ConnectedPassword'});
      let Favori = await Preferences.get({key: 'favori'});

      if(Favori.value != null)
        this.favori = JSON.parse(Favori.value);

      switch(email.value){
        case 'classe1':
          this.className = 'petites';
          break;
        case 'classe2':
          this.className = 'moyennes';
          break;
        case 'classe3':
          this.className = 'grandes';
          break;
  
      }
      this.http.get(`http://www.sebastien-thon.fr/prince/index.php?login=${email.value}&mdp=${password.value}`).subscribe((data) => {
        this.articles = data;
        for(let i = 0; i < this.articles.articles.length; i++){
          if(this.favori.indexOf(this.articles.articles[i].id) != -1){
            this.articles.articles[i].favori = true;
          }else{
            this.articles.articles[i].favori = false;
          }
        }
        console.log(this.articles.articles);
      });
    }
  
    showDetails(id: any){
      //navigate to details page
      this.navCtrl.navigateRoot(`/details`, {queryParams: {id: id-1}});
    }

     async addToFavori(id: any ,  event: any){
      
     let isChecked = event.detail.checked;

      if(isChecked){
        this.favori.push(id);
        
      }else{
        this.favori.splice(this.favori.indexOf(id), 1);
        
      }
      await Preferences.set({key: 'favori', value: JSON.stringify(this.favori)});      
    }
  
  }
  
