import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseauthService } from './services/firebaseauth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

admin = false;
suscribe:any;

  constructor(
    public platform: Platform,
    private firebaseauthService: FirebaseauthService,) 
    {
      this.initializeApp();
      this.suscribe = this.platform.backButton.subscribeWithPriority(666666,()=>{

       if(this.constructor.name=="AppComponent")
       
       {
        if(window.confirm("presione ok para salir"))
        {
          navigator["app"].exitApp();
        }
       } 
      })
    }


  initializeApp() {
    
        this.getUid();
      
  }


   getUid() {
     this.firebaseauthService.stateAuth().subscribe( res => {
          if (res !== null) {
              if (res.uid === 'QxnR6CuE8kSZdB2aWu7xA0cmFOS2')  {
                  this.admin = true;
              } else {
                 this.admin = false;
              }
          } 
    });
}

}
