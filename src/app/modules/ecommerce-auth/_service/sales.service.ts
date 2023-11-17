import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth-profile/_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(
    public _authServices: AuthService,
    public http: HttpClient,
  ) { }
//Proceso de compra
    storeSale(data:any){
      let headers = new HttpHeaders({'Authorization': 'Bearer' + this._authServices.token});
    let URL = URL_SERVICIOS + "/ecommerce/checkout/sale";
    return this.http.post(URL,data,{headers: headers});
    }

//Direccion del Cliente
  listAddressUser(){
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this._authServices.token});
    let URL = URL_SERVICIOS + "/ecommerce/checkout/all";
    return this.http.get(URL,{headers: headers});
  }

  addAddressUser(data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this._authServices.token});
    let URL = URL_SERVICIOS + "/ecommerce/checkout/add";
    return this.http.post(URL,data,{headers: headers});
  } 

  updateAddressUser(cart_id:any, data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this._authServices.token});
    let URL = URL_SERVICIOS + "/ecommerce/checkout/update/"+cart_id;
    return this.http.put(URL,data,{headers: headers});
  }

  deleteAddressUser(cart_id:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this._authServices.token});
    let URL = URL_SERVICIOS + "/ecommerce/checkout/delete/"+cart_id;
    return this.http.delete(URL,{headers: headers});
  }
}
