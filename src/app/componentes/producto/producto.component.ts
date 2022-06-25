import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
import { Producto } from '../../models';
import { ComentariosComponent } from '../comentarios/comentarios.component';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

  @Input() producto: Producto;

  constructor(public carritoService: CarritoService,
              public modalController: ModalController) {

  }

  ngOnInit() {
  }

  addCarrito() {
        console.log('addCarrito()');
        this.carritoService.addProducto(this.producto);
  }

  async openModal(){
      const modal = await this.modalController.create({
        component: ComentariosComponent,
        componentProps: {producto: this.producto}
      });

      return await modal.present();
}
}
  