import { Component } from '@angular/core';
import { CartShopsService } from '../../home/_services/cart-shops.service';

@Component({
  selector: 'app-shopping-carts',
  templateUrl: './shopping-carts.component.html',
  styleUrls: ['./shopping-carts.component.css']
})
export class ShoppingCartsComponent {

  listCarts:any = [];
  TotalPrice:any = 0;

  ConversationDolar:any = 3.7;

  cupones:any = null;

  constructor(
    public _cartService: CartShopsService,
  ){}

  ngOnInit(): void {
    this._cartService.ToDolar().subscribe((resp:any) => {
      console.log(resp);
      this.ConversationDolar = resp.Cotizacion[0].Venta;
    })


    this._cartService.currentDataCart$.subscribe((resp:any) =>{
      console.log(resp);
      this.listCarts = resp;
      this.TotalPrice = this.listCarts.reduce((sum:any, item:any) => sum + +item.total, 0);
      debugger;
    })
  }

  deleteItem(cart:any){
    this._cartService.deleteCartShop(cart.id).subscribe();
    this._cartService.removeItemCart(cart);
  }

  reduceC(cart:any){
    if(cart.cantidad > 1){
      cart.cantidad --;

    }
    let data = {
      cantidad: cart.cantidad,
      total: cart.subtotal*cart.cantidad,
    };
    this._cartService.updateCartShop(cart.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alert(resp.message_text);
        return;
      }else{
        this._cartService.changeCart(resp.cart_shop);
      }      
    })
  }
  
  addC(cart:any){
    //if(){

    //}
    cart.cantidad ++;

    let data = {
      cantidad: cart.cantidad,
      total: cart.subtotal*cart.cantidad,
    };
    this._cartService.updateCartShop(cart.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alert(resp.message_text);
        return;
      }else{
        this._cartService.changeCart(resp.cart_shop);
      }      
    })
  }

  applyCupon(){
    if(!this.cupones){
      alert("Necesitas Ingresar un Cupon");
      return;
    }
    this._cartService.applyCupon(this.cupones).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alert(resp.message_text);
        return;
      }
      resp.carts.data.forEach((element:any) => {
        this._cartService.changeCart(element);
      })
      alert("Felicidades se pudo procesar el cupon");
    });
  }
}
