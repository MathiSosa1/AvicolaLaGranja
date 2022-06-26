import { Component, OnInit } from '@angular/core';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { Subscription } from 'rxjs';
import { EstadoPedido, Pedido } from '../../models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})

export class PedidosComponent implements OnInit {


  
  nuevosSuscriber: Subscription;
  culmidadosSuscriber: Subscription;
  pedidos: Pedido[] = [];
  pedidosEntregados: Pedido[] = [];

  nuevos = true;

  estados: EstadoPedido[] = ['enviado', 'Pase a retirar']

  constructor(public menucontroler: MenuController,
    public firestoreService: FirestoreService,
    public firebaseauthService: FirebaseauthService) { }
  
   ngOnInit() {
       this.getPedidosNuevos();
   }
 
    
   openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  segmento(ev: any) {
   
     const opc = ev.detail.value;
     if (opc === 'culminados') {
       this.nuevos = false;
       this.getPedidosTerminados();
     }
     if (opc === 'nuevos') {
          this.nuevos = true;
          this.getPedidosNuevos();
    }
  }
 
  async getPedidosNuevos() {
    console.log('getPedidosNuevos()');
    const path = 'pedidos';
    let startAt = null;
    if (this.pedidos.length) {
        startAt = this.pedidos[this.pedidos.length - 1].fecha
    }
    this.nuevosSuscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'enviado', startAt).subscribe( res => {
          if (res.length) {
                console.log('getPedidosNuevos() -> res ', res);
                res.forEach( pedido => {
                      this.pedidos.push(pedido);
                });
          }
    });

  }

  async getPedidosTerminados() {
    console.log('getPedidosTerminados()');
    const path = 'pedidos';
    let startAt = null;
    if (this.pedidosEntregados.length) {
        startAt = this.pedidosEntregados[this.pedidosEntregados.length - 1].fecha
    }
    this.nuevosSuscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'Pase a retirar', startAt).subscribe( res => {
          if (res.length) {
                console.log('getPedidosTerminados() -> res ', res);
                res.forEach( pedido => {
                      this.pedidosEntregados.push(pedido);
                });
          }
    });
    
  }
  
  actualizarestado(pedido:Pedido, event:any){
    const estado='enviado';
    console.log('actualizarestado()=>', event.detail.value);
    const path ='Clientes/' + pedido.cliente.uid + '/pedidos/';
  const updateDoc = {
    estado:'Pase a retirar',
  };
  const id =pedido.id;
  this.firestoreService.updateDoc(updateDoc, path, id).then( () => {

  console.log('actualizado exitosamente');
  });
}
}




