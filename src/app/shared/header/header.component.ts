import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';
import { AuthService } from 'src/app/modules/auth-profile/_services/auth.service';
import { CartShopsService } from 'src/app/modules/home/_services/cart-shops.service';
import { HomeService } from 'src/app/modules/home/_services/home.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit{

  user:any = null;
  listCarts:any = [];

  TotalPrice:any = 0;

  search_product:any = null;
  source:any;
  sugerencias:any = [];

  @ViewChild("filter") filter?:ElementRef;

  categories:any = [];

  constructor(
    public authService: AuthService,
    public router:Router,
    public _cartService: CartShopsService,
    public _homeService: HomeService,
){}

  ngOnInit(): void {
      this.user = this.authService.user;
      console.log(this.user);
      if(this.user){
        this._cartService.listCartShop().subscribe((resp:any) =>{
          //console.log(resp);
         
          resp.carts.data.forEach((element:any) => {
            this._cartService.changeCart(element);
          });;
        })
      }

      this._homeService.configInitialFilter().subscribe((resp:any) => {
        this.categories = resp.categories;
      })


      this._cartService.currentDataCart$.subscribe((resp:any) =>{
        //console.log(resp);
        this.listCarts = resp;
        setTimeout(() => {
          this.TotalPrice = this.listCarts.reduce((sum:number, item:any) => sum + +item.total, 0);
        }, 100);
       // TotalPrice = this.listCarts.reduce((sum:number, item:any) => sum + +item.total, 0);
        //debugger;
      })
  }

  ngAfterViewInit(): void {
    this.source = fromEvent(this.filter?.nativeElement, "keyup");
    this.source.pipe(debounceTime(250)).subscribe((c:any) => {
      console.log(this.search_product);
      let data = {
        search_product: this.search_product,
      }
      if(this.search_product.length > 1){
        this._homeService.listProducts(data).subscribe((resp:any) => {
          console.log(resp);
          this.sugerencias = resp.products;
        })
      }
    })
  }


  searchEnter(){
    console.log(this.search_product);
    this.router.navigateByUrl("lista-de-productos?search_product="+this.search_product);
  }

  removeItem(cart:any){
    this._cartService.deleteCartShop(cart.id).subscribe();
    this._cartService.removeItemCart(cart);
  }

  isRouterActive(){
    return this.router.url == "" || this.router.url == "/" ? true : false;
  }

  logout(){
    this.authService.logout();
  }

}

