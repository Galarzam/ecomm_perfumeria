import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:any = null;
  password:any = null;

  constructor(
    public authService:AuthService,
    public router:Router
  ) { }

  ngOnInit(): void {
    if(this.authService.user && this.authService.token){
      this.router.navigate(["/"]);
    }
  }

  login(){
    if(!this.email || !this.password){
      alert("NECESITAS COLOCAR UN EMAIL Y UNA CONTRASEÑA");
      return;
    }
    this.authService.login(this.email,this.password).subscribe((resp:any) => {
      console.log(resp);
      if(!resp.error && resp){
        //  TODO SALIO BIEN Y VOLVER AL HOME CON USUARIO AUTENTICADO
        document.location.reload();
      }else{
        if(resp.error.error == 'Unauthorized' || resp.error.message == 'Unauthenticated.'){
          alert("EL USUARIO O CONTRASEÑA INGRESADO SON INCORRECTOS");
          return;
        }
      }
    })
  }
}

