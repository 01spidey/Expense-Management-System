import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { AppService } from '../service/app.service';
import { ToastrService } from 'ngx-toastr';
import { ServerResponse } from '../models';
import {OnInit} from '@angular/core'


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit{


  constructor(private builder:FormBuilder, private toastr:ToastrService,
    private service:AppService, private router:Router){ 
      
    }

    ngOnInit(): void {
      sessionStorage.clear();
      sessionStorage.setItem('user', 'null')

    }


    is_active = 'signup'

    signupForm = this.builder.group({
    
      uname:this.builder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
  
      name:this.builder.control('',Validators.required),
      
      pass:this.builder.control('',Validators.compose([
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ])),
      
      re_pass:this.builder.control('', Validators.compose([
        Validators.required,
        this.matchPassword.bind(this)
      ])),

      mail:this.builder.control('',Validators.compose([
        Validators.required,
        Validators.email
      ]))
    });

    loginForm = this.builder.group({
      uname:this.builder.control('', Validators.required),
      pass:this.builder.control('', Validators.required)
    });

    get uname() { return this.signupForm.get('uname')!; }
    get name() { return this.signupForm.get('name')!; }
    get pass() { return this.signupForm.get('pass')!; }
    get re_pass() { return this.signupForm.get('re_pass')!; }
    get mail() { return this.signupForm.get('mail')!; }



    matchPassword(control: AbstractControl): {[key: string]: boolean} | null {
      const password = control.root.get('pass');
      return (password && control.value !== password.value) ? {'misMatch': true} : null;
    }
  
  
    onSubmit(form:string) {
      if(form=='signup'){
        if (this.signupForm.valid) {
          const formdata:FormData = new FormData();
          const formValue = this.signupForm.value;
          formdata.append('uname',formValue.uname!);
          formdata.append('name',formValue.name!);
          formdata.append('pass',formValue.pass!);
          formdata.append('mail',formValue.mail!);

          this.service.register(formdata).subscribe(
            (res:ServerResponse)=>{
              if(res.success){ 
                this.toastr.success(res.message);
                sessionStorage.setItem('user',formValue.uname!)
                this.service.initUser(sessionStorage.getItem('user')!)
                this.router.navigate(['dashboard'])
              }
              else this.toastr.warning(res.message) 
            },err=>{
              this.toastr.warning('Server Not Reachable!!')
            }
          )

        }
      }

      if(form=='login'){
        if (this.loginForm.valid) {
          const formdata:FormData = new FormData();
          const formValue = this.loginForm.value;
          formdata.append('uname',formValue.uname!);
          formdata.append('pass',formValue.pass!);

          this.service.login(formdata).subscribe(
            (res:ServerResponse)=>{
              if(res.success){
                this.toastr.success(res.message)
                sessionStorage.setItem('user',formValue.uname!)
                console.log(sessionStorage.getItem('user'))
                this.service.initUser(sessionStorage.getItem('user')!)
                this.router.navigate(['dashboard'])
              }else this.toastr.warning(res.message)
            },err=>{
              this.toastr.warning('Server Not Reachable!!')
            }
          )

        }
      }
    }

    reset(){
      this.signupForm.reset()
      this.loginForm.reset()
    }

    shiftTab(tab:string){
      this.is_active = tab;
    }
}
