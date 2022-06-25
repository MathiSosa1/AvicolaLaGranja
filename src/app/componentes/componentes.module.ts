import { NgModule } from '@angular/core';
import { ProductoComponent } from './producto/producto.component';
import { ItemcarritoComponent } from './itemcarrito/itemcarrito.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    ProductoComponent,
   ItemcarritoComponent,
   ComentariosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ], exports: [
    ProductoComponent,
    ItemcarritoComponent
  ]
})
export class ComponentesModule { }
