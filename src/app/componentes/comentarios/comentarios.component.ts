import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cliente, Producto } from '../../models';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent implements OnInit, OnDestroy {

  @Input() producto: Producto;

  comentario = '';

  comentarios: Comentario[] = []; 

  suscriber: Subscription;
  suscriberUserInfo: Subscription;

  constructor(public modalController: ModalController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService) {
         
               }

   async ngOnInit() {
      console.log('producto', this.producto);
      this.loadCommentarios();
      }

  ngOnDestroy(): void {
        console.log('ngOnDestroy() modal')
        if (this.suscriber) {
           this.suscriber.unsubscribe();
        }
  }

  closeModal() {
      this.modalController.dismiss();
  }
  

  loadCommentarios() {
    let startAt = null;
    if(this.comentarios.length) {
        startAt = this.comentarios[ this.comentarios.length - 1].fecha;
    }
    const path = 'Productos/' +  this.producto.id + '/comentarios';
    this.suscriber = this.firestoreService.getCollectionComentarios<Comentario>(path, 3, startAt).subscribe( res => {
      if (res.length) {
        res.forEach( comentario => {
            const exist = this.comentarios.find( commentExist => {
                   commentExist.id === comentario.id   
            });
            if (exist === undefined) {
              this.comentarios.push(comentario);
            }
        });
        // this.comentarios = res;
        console.log(res);
     }
} );

}

   async comentar() {
     const comentario = this.comentario;
     console.log('comentario ->' , comentario);
     const path = 'Productos/' +  this.producto.id + '/comentarios';
     const data: Comentario = {
        autor: await this.firebaseauthService.datosCliente.nombre,
        comentario: comentario,
        fecha: new Date(),
        id: this.firestoreService.getId()
     }
     this.firestoreService.createDoc(data, path, data.id).then( () => {
         console.log('comentario enviado');
         this.comentario = '';
     });
  }

}


interface Comentario {
  autor: string;
  comentario: string;
  fecha: any;
  id: string;
}