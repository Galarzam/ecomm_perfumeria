import { Component, OnInit } from '@angular/core';
import { HomeService } from '../_services/home.service';
import { AuthService } from '../../auth-profile/_services/auth.service';
import { CartShopsService } from '../_services/cart-shops.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lists-filter-products',
  templateUrl: './lists-filter-products.component.html',
  styleUrls: ['./lists-filter-products.component.css']
})
export class ListsFilterProductsComponent implements OnInit {
  
  products:any = [];
  categories:any = [];
  categories_array:any = [];

  search_product:any;

  categorie_id:any;


  constructor(
    public _homeServices: HomeService,
    public _authService: AuthService,
    public _cartService: CartShopsService,
    public router:Router,
    public activedRoute: ActivatedRoute,
  ){}

  ngOnInit(): void {
   
   this.activedRoute.queryParams.subscribe((resp:any) => {
    console.log(resp);
   this.search_product = resp["search_product"];
   this.categorie_id = resp["categorie_id"];
   })
   this.listProducts();
    this._homeServices.configInitialFilter().subscribe((resp:any) => {
      console.log(resp);
      this.categories = resp.categories;
    });
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
      }
    })
  }

  listProducts(){
    if(this.categorie_id){
      this.categories_array.push(this.categorie_id);
    }
    let data = {
      categories: this.categories_array,
      search_product: this.search_product,
    }
    this._homeServices.listProducts(data).subscribe((resp:any) =>{
      console.log(resp);
      this.products = resp.products;
      if(this.categorie_id){
        this.categories_array = [];
      };
      this.categorie_id = null;
    })
  }

  addCategorie(categorie:any){
    let INDEX = this.categories_array.findIndex((item:any) => item == categorie.id);
    if(INDEX != -1){
      this.categories_array.splice(INDEX,1)
    }else{ 
      this.categories_array.push(categorie.id);
    }
    this.listProducts();
  }

  

}
