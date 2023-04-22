import { Component,OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { ServerResponse } from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{

  serverMessage = "---"
  user = sessionStorage.getItem('user')
  active_title = 'home'
  component = "my_expense"
  // component = "summary"

  constructor(private service:AppService, private router:Router){

  }


  sendRequest(){
    this.service.sendRequest().subscribe(
      (res:ServerResponse)=>{
        this.serverMessage = res.message
      },
      err=>{

      }
    )
  }

  setActive(title:string){
    this.component = title
    if(title=='my_income' || title=='my_expense') this.active_title = 'home';
    else this.active_title='summary'
  }

  logout(){
    sessionStorage.setItem('user','null')
    this.router.navigate([''])
  }
}
