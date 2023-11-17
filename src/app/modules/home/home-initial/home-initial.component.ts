import { Component, OnInit } from '@angular/core';
import { HomeService } from '../_services/home.service';
import { AuthService } from '../../auth-profile/_services/auth.service';
import { CartShopsService } from '../_services/cart-shops.service';

declare var $:any;
declare function initPageEcommerce([]):any;
declare function hero_slider_active():any;

@Component({
  selector: 'app-home-initial',
  templateUrl: './home-initial.component.html',
  styleUrls: ['./home-initial.component.css']
})
export class HomeInitialComponent implements OnInit {

  //api_URL:string = "http://127.0.0.1:8000/";
  
  sliders:any = [];
  group_categories_product:any = [];
  products_aletorio_a:any = [];
  products_aletorio_b:any = [];

  product_selected_modal:any;

  constructor(
    public _homeService:HomeService,
    public _authService: AuthService,
    public _cartService: CartShopsService,
  ) { }

  ngOnInit(): void {
    this._homeService.getHome().subscribe((resp:any) => {
      console.log(resp);
      this.sliders = resp.sliders;
      this.group_categories_product = resp.group_categories_product;
      this.products_aletorio_a = resp.products_aletorio_a;
      this.products_aletorio_b = resp.products_aletorio_b;
      setTimeout(() => {
        hero_slider_active();
      }, 50);
    });
  }

  openModal(products_aletorio:any){
    this.product_selected_modal = null;
    setTimeout(() =>{
      this.product_selected_modal = products_aletorio;
    },25);    
  }

  addCart(product_selected_modal:any){
    if(!this._authService.user){
      alert("Necesitas registrarte");
      return;
    }
  

    let data = {
      user_id: this._authService.user.id,
      product_id: product_selected_modal.id,
      type_discount: null,
      discount: null,
      cantidad: 1,
      code_cupon: null,
      code_discount: null,
      precio_unitario: product_selected_modal.price_soles,
      subtotal: product_selected_modal.price_soles,
      total: product_selected_modal.price_soles * 1,
    }
    this._cartService.addCartShop(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alert(resp.message_text);
        return;
      }else{ 
        this._cartService.changeCart(resp.cart_shop);
        alert("El producto se agrego al carrito")
      }
    })
  }
}
