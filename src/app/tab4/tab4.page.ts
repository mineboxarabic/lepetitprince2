import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {


  ngOnInit() {
  }
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
      let temp = Array<any>();
      console.log(this.articles.articles);
      if(Favori.value != null)
        this.favori = JSON.parse(Favori.value);
      console.log(this.favori);
      this.favori.map((item) => {
        this.articles.articles.map((article:any) => {
          if(article.id === item)
            temp.push(article);
        });

      }
      );
      this.articles.articles = temp;
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

  handleRefresh(event:any) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }


}


