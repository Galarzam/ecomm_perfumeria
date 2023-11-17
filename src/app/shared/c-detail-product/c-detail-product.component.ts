import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth-profile/_services/auth.service';
import { CartShopsService } from 'src/app/modules/home/_services/cart-shops.service';

declare var $:any;
declare function loadModalDetailProduct():any;

@Component({
  selector: 'app-c-detail-product',
  templateUrl: './c-detail-product.component.html',
  styleUrls: ['./c-detail-product.component.css']
})
export class CDetailProductComponent implements OnInit {

  @Input() product_selected_modal:any;
  @Input() is_landing:boolean = false;

  quantity:any = 0;
  
  constructor(
    public _cartService: CartShopsService,
    public _authService: AuthService,
  ) { }


  ngOnInit(): void {
    setTimeout(() =>{
      setTimeout(() => {
        loadModalDetailProduct();
      },25);
      if(!this.is_landing){
        $('.product_quickview').addClass('active');
        $('body').css('overflow-y', 'hidden')
      }
    }, 50);
  }

  reduceQ(){
    if(this.quantity > 0){
      this.quantity --;

    }
  }
  
  addQ(){
    //if(){

    //}
    this.quantity ++;
  }

  addCart(product_selected_modal:any){
    if(!this._authService.user){
      alert("Necesitas registrarte");
      return;
    }

  
    if(this.quantity <= 0 ){
      alert("INGRESA LA CANTIDAD");
      return;
    }
  
  

  

    let data = {
      user_id: this._authService.user.id,
      product_id: this.product_selected_modal.id,
      type_discount: null,
      discount: null,
      cantidad: this.quantity,
      code_cupon: null,
      code_discount: null,
      precio_unitario: this.product_selected_modal.price_soles,
      subtotal: this.product_selected_modal.price_soles,
      total: this.product_selected_modal.price_soles * this.quantity,
    }
    this._cartService.addCartShop(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alert(resp.message_text);
        return;
      }else{ 
        this._cartService.changeCart(resp.cart_shop);
      }
    })
  }
}
