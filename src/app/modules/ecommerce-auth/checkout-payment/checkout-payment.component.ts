import { Component } from '@angular/core';
import { CartShopsService } from '../../home/_services/cart-shops.service';
import { SalesService } from '../_service/sales.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.css']
})
export class CheckoutPaymentComponent {

  full_name:any = null;
  full_surname:any = null;
  company_name:any = null;
  region:any = null;
  direccion:any = null;
  city:any = null;
  zip_code:any = null;
  phone:any = null;
  email:any = null;

  listCarts:any = [];
  TotalPrice:any = 0;

  ConversationDolar:any = 3.7;

  listAddress:any = [];
  address_selected:any = null;
  status_view:Boolean = false;

  user:any =null;

  constructor(
    public _cartService: CartShopsService,
    public _saleService: SalesService,
  ){}

  ngOnInit(): void {
    this._cartService.ToDolar().subscribe((resp:any) => {
      console.log(resp);
      this.ConversationDolar = resp.Cotizacion[0].Venta;
    })

    this._cartService.currentDataCart$.subscribe((resp:any) =>{
      console.log(resp);
      this.listCarts = resp;
      this.TotalPrice = this.listCarts.reduce((sum:any, item:any) => sum + item.total, 0);
    })

    this.user = this._cartService._authServices.user;
    this._saleService.listAddressUser().subscribe((resp:any) => {
      console.log(resp);
      this.listAddress = resp.address;
      this.status_view = this.listAddress.length == 0 ? true : false;
    })
  }

  resetAddress(){
    this.address_selected = null;

    this.full_name = null;
    this.full_surname = null;
    this.company_name = null;
    this.region = null;
    this.direccion = null;
    this.city = null;
    this.zip_code = null;
    this.phone = null;
    this.email = null;
  }

  changeStatus(){
    this.status_view = !this.status_view;
  }

  save(){
    if(!this.full_name || !this.full_surname){
      alert("Necesitas ingresar los nombres y apellidos de la persona que resepcionara el Producto")
      return;
    }
    if(!this.region){
      alert("Por favor, ingrese la region donde se entregará el producto. Esto nos ayudará a garantizar una entrega exitosa")
      return;
    }
    if(!this.direccion){
      alert("Por favor, ingrese su direccion donde se entregará el producto. Esto nos ayudará a garantizar una entrega exitosa")
      return;
    }
    if(!this.city){
      alert("Por favor, ingrese la ciudad donde se entregará el producto. Esto nos ayudará a garantizar una entrega exitosa")
      return;
    }
    if(!this.zip_code){
      alert("Por favor, ingrese su código postal para completar la dirección de envío de su pedido")
      return;
    }
    if(!this.phone){
      alert("Por favor, ingrese su número de celular para poder contactarlo")
      return;
    }
    if(!this.email){
      alert("Por favor, ingrese su correo electrónico para que podamos enviarle los detalles de su compra.")
      return;
    }

    if(this.address_selected){
      this.updateAddress();

    }else{
      this.addAddress();
    }
  }

  selectAddress(addrr:any){
    this.address_selected = addrr;

    this.full_name = addrr.full_name;
    this.full_surname = addrr.full_surname;
    this.company_name = addrr.company_name;
    this.region = addrr.region;
    this.direccion = addrr.direccion;
    this.city = addrr.city;
    this.zip_code = addrr.zip_code;
    this.phone = addrr.phone;
    this.email = addrr.email;
  }


  addAddress(){
    let data = {
      full_name: this.full_name,
      full_surname: this.full_surname,
      company_name: this.company_name,
      region: this.region,
      direccion: this.direccion,
      city: this.city,
      zip_code: this.zip_code,
      phone: this.phone,
      email: this.email,
    }
    this._saleService.addAddressUser(data).subscribe((resp:any) => {
      console.log(resp);
      this.selectAddress(resp.address);
      this.listAddress.unshift(resp.address);
      alert("La dirección se registro correctamente");
    })



    
  }

  updateAddress(){
    let data = {
      full_name: this.full_name,
      full_surname: this.full_surname,
      company_name: this.company_name,
      region: this.region,
      direccion: this.direccion,
      city: this.city,
      zip_code: this.zip_code,
      phone: this.phone,
      email: this.email,
    }
    this._saleService.updateAddressUser(this.address_selected.id,data).subscribe((resp:any) => {
      console.log(resp);
      //this.selectAddress(resp.address);
      let INDEX = this.listAddress.findIndex((item:any) => item.id == resp.address.id);
      this.listAddress[INDEX] = resp.address;
      alert("La dirección se ha registrado cambios correctamente");
    })
  }

  PROCESS_PAYMENT() {
    if (this.TotalPrice == 0) {
      alert("EL TOTAL DE LA VENTA DEBE SER MAYOR A 0");
      return;
    }
    if (this.listCarts.length == 0) {
      alert("EL CARRITO DE COMPRAS ESTA VACIO");
      return;
    }
    if (!this.address_selected) {
      alert("NECESITAS SELECCIONAR UNA DIRECCIÓN");
      return;
    }
    let dataSale = {
      sale: {
        user_id: this.user.id,
        method_payment: 'Culqi',
        currency_total: this.TotalPrice,
        currency_payment: this.TotalPrice,
        total: this.TotalPrice,
        price_dolar: this.ConversationDolar,
        n_transaccion: 'tranzaccion',
      },
      sale_address: {
        full_name: this.address_selected.full_name,
        full_surname: this.address_selected.full_surname,
        company_name: this.address_selected.company_name,
        region: this.address_selected.region,
        direccion: this.address_selected.direccion,
        city: this.address_selected.city,
        zip_code: this.address_selected.zip_code,
        phone: this.address_selected.phone,
        email: this.address_selected.email,
      },
    };
    this._saleService.storeSale(dataSale).subscribe((resp:any) => {
      console.log(resp);
    });
  }
}


