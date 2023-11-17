import { Injectable } from '@angular/core';
import { AuthService } from '../../auth-profile/_services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartShopsService {

  public cart = new BehaviorSubject<Array<any>>([]);  //Encargada de almacenar toda la lista del productos 
  public currentDataCart$ = this.cart.asObservable();

  constructor(
    public _authServices: AuthService,
    public http: HttpClient,
  ) { }

  changeCart(DATACART:any){
    let listCart = this.cart.getValue();
    let objIndex = listCart.findIndex(item => item.id == DATACART.id);

    if(objIndex != -1){
      listCart[objIndex] = DATACART;
    }else{
      listCart.unshift(DATACART);
    }
    this.cart.next(listCart);
  }

  resetCart(){
    let listCart:any = [];
    this.cart.next(listCart);
  }

  removeItemCart(DATACART:any){
    let listCart = this.cart.getValue();
    let objIndex = listCart.findIndex(item => item.id == DATACART.id);
    if(objIndex != -1){
      listCart.splice(objIndex,1);
    }
    this.cart.next(listCart);
  }



  listCartShop(){
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this._authServices.token});
    let URL = URL_SERVICIOS + "/ecommerce/cart/all";
    return this.http.get(URL,{headers: headers});
  }

  addCartShop(data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this._authServices.token});
    let URL = URL_SERVICIOS + "/ecommerce/cart/add";
    return this.http.post(URL,data,{headers: headers});
  } 

  updateCartShop(cart_id:any, data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this._authServices.token});
    let URL = URL_SERVICIOS + "/ecommerce/cart/update/"+cart_id;
    return this.http.put(URL,data,{headers: headers});
  }

  deleteCartShop(cart_id:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this._authServices.token});
    let URL = URL_SERVICIOS + "/ecommerce/cart/delete/"+cart_id;
    return this.http.delete(URL,{headers: headers});
  }

  //API para la contizacion del valor del Dolar
  ToDolar(){
    return this.http.get("https://deperu.com/api/rest/cotizaciondolar.json");
  }  


  applyCupon(cupon:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this._authServices.token});
    let URL = URL_SERVICIOS + "/ecommerce/cart/applycupon/"+cupon;
    return this.http.get(URL,{headers: headers});
  }
}
 