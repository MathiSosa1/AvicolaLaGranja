import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { FirestorageService } from '../../services/firestorage.service';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MenuController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  cliente: Cliente = {
    uid: '',
    email: '',
    celular: '',
    nombre: '',
    
  };

  newFile: any;

  uid = '';

  suscriberUserInfo: Subscription;

  ingresarEnable = false;

  constructor(public menucontroler: MenuController,
              public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public firestorageService: FirestorageService,
              private modalController: ModalController) {

        this.firebaseauthService.stateAuth().subscribe( res => {
                console.log(res);
                if (res !== null) {
                   this.uid = res.uid;
                   this.getUserInfo(this.uid);
                } else {
                    this.initCliente();
                }
        });

  }

  async ngOnInit() {
       const uid = await this.firebaseauthService.getUid();
       console.log(uid);
  }

  initCliente() {
      this.uid = '';
      this.cliente = {
        uid: '',
        email: '',
        celular: '',
        nombre: '',
        
      };
      console.log(this.cliente);
  }

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }


  async registrarse() {
      const credenciales = {
          email: this.cliente.email,
          password: this.cliente.celular,
      };
      const res = await this.firebaseauthService.registrar(credenciales.email, credenciales.password).catch( err => {
          console.log( 'error -> ',  err);
      });
      const uid = await this.firebaseauthService.getUid();
      this.cliente.uid = uid;
      this.guardarUser();

   }

   async guardarUser() {
      const path = 'Clientes';
      const name = this.cliente.nombre;
      this.firestoreService.createDoc(this.cliente, path, this.cliente.uid).then( res => {
          console.log('guardado con exito');
      }).catch( error => {
      });
    }

   async salir() {
      this.firebaseauthService.logout();
      this.suscriberUserInfo.unsubscribe();
   }

   getUserInfo(uid: string) {
       console.log('getUserInfo');
       const path = 'Clientes';
       this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe( res => {
              if (res !== undefined) {
                this.cliente = res;
              }
       });
   }

   ingresar() {
      const credenciales = {
        email: this.cliente.email,
        password: this.cliente.celular,
      };
      this.firebaseauthService.login(credenciales.email, credenciales.password).then( res => {
           console.log('ingreso con exito');
      });
   }

  }


  

