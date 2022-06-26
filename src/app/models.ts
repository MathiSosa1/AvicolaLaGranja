export interface Producto {
    nombre: string;
    precio: number;
    foto: string;
    id: string;
    fecha: Date;
   
    
}


export interface Cliente {
   uid: string;
   email: string;
   nombre: string;
   celular: string;
   }

export interface Pedido {
   id: string;
   cliente: Cliente;
   productos: ProductoPedido[];
   precio: number;
   estado: EstadoPedido;
   fecha: any;
}

export interface ProductoPedido {
    producto: Producto;
    cantidad: number;
}

export type  EstadoPedido = 'enviado' | 'Pase a retirar';