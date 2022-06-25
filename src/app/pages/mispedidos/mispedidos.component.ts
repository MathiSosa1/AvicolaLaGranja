import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirestorageService } from '../../services/firestorage.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { Subscription } from 'rxjs';
import { Pedido } from '../../models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-mispedidos',
  templateUrl: './mispedidos.component.html',
  styleUrls: ['./mispedidos.component.scss'],
})
export class MispedidosComponent implements OnInit, OnDestroy {

  nuevosSuscriber: Subscription;
  culmidadosSuscriber: Subscription;
  suscriberUserInfo: Subscription;
  pedidos: Pedido[] = [];

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService) { }

  ngOnInit() {
      this.getPedidosNuevos();
  }

  ngOnDestroy() {
     if (this.nuevosSuscriber) {
        this.nuevosSuscriber.unsubscribe();
     }
  }

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  changeSegment(ev: any) {
    //  console.log('changeSegment()', ev.detail.value);
     const opc = ev.detail.value;
     if (opc === 'culminados') {
       this.getPedidosCulminados();
     }
     if (opc === 'nuevos') {
          this.getPedidosNuevos();
    }
  }
  async getPedidosCulminados() {
    console.log('getPedidosCulminados()');
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.culmidadosSuscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'entregado').subscribe( res => {
          if (res.length) {
                console.log('getPedidosCulminados() -> res ', res);
                this.pedidos = res;
          }
    });

  }

  async getPedidosNuevos() {
    console.log('getPedidosNuevos()');
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.nuevosSuscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'enviado').subscribe( res => {
          if (res.length) {
                console.log('getPedidosNuevos() -> res ', res);
                this.pedidos = res;
          }
    });

  }
}
