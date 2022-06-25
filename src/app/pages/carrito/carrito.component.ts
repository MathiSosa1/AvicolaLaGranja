import { Component, OnDestroy, OnInit } from '@angular/core';
import { Pedido } from '../../models';
import { Subscription } from 'rxjs';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})

export class CarritoComponent implements OnInit, OnDestroy {

  
  pedido: Pedido;
  carritoSuscriber: Subscription;
  total: number;
  cantidad: number;
  client: any;

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public carritoService: CarritoService,
              public firebaseauthService: FirebaseauthService) {

            this.initCarrito();
            this.loadPedido();
   }

  ngOnInit() {}

  ngOnDestroy() {
      console.log('ngOnDestroy() - carrito componente');
      if (this.carritoSuscriber) {
         this.carritoSuscriber.unsubscribe();
      }
  }


  openMenu() {
      console.log('open menu');
      this.menucontroler.toggle('principal');
  }

  loadPedido() {
      this.carritoSuscriber = this.carritoService.getCarrito().subscribe( res => {
          console.log('loadPedido() en carrito', res);
          this.pedido = res;
          this.getTotal();
          this.getCantidad()
      });
  }

  initCarrito() {
    this.pedido = {
        id: '',
        cliente: null,
        productos: [],
        precio:null,
        estado: 'enviado',
        fecha: new Date(),

        
    };
  }

  getTotal() {
      this.total = 0;
      this.pedido.productos.forEach( producto => {
           this.total = (producto.producto.precio) * producto.cantidad + this.total; 
      });
  }

  getCantidad() {
      this.cantidad = 0
      this.pedido.productos.forEach( producto => {
            this.cantidad =  producto.cantidad + this.cantidad; 
      });
  }

  async pedir() {
    if (!this.pedido.productos.length) {
      console.log('añade productos al carrito');
      return;
    }
    this.pedido.fecha = new Date();
    this.pedido.precio= this.total;
    this.pedido.id = this.firestoreService.getId();
    const uid = await this.firebaseauthService.getUid()
    const path = 'Clientes/' + uid + '/pedidos/' 
    console.log(' pedir() -> ', this.pedido, uid, path);

    this.firestoreService.createDoc(this.pedido, path, this.pedido.id).then( () => {
         console.log('guadado con exito');
         this.carritoService.clearCarrito();
    });

    
  }


}
