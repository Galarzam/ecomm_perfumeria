import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name:any = null;
  surname:any = null;
  email:any = null;
  password:any = null;
  repit_password:any = null;

  constructor(
    public authService:AuthService,
    public router:Router,
  ){ }

  ngOnInit(): void {
      if(this.authService.user && this.authService.token){
        this.router.navigate(["/"]);
      }
  }

  registro(){
      if(!this.surname || !this.name || !this.email || !this.password || !this.repit_password){
        alert("NECESITAS DIGITAR TODOS LOS CAMPOS PARA EL REGISTRO");
        return;
      }
      if(this.password != this.repit_password){
        alert("LAS CONTRASEMAS NO SON IGUALES");
        return;
      }
    let data = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      type_user: 1,
    };
    this.authService.registro(data).subscribe({
      next:(res)=>{
        console.log(res)

    },
      error:(err)=>{console.log(err)}
    })

    this.authService.registro(data).subscribe((resp:any) => {
    console.log(resp);
    this.router.navigate(["auth/login"]);
  })
  }

}
