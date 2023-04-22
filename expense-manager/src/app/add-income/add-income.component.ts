import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../service/app.service';
import { ToastrService } from 'ngx-toastr';
import { ServerResponse } from '../models';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent implements OnInit{
  
  incomeForm! : FormGroup;
  title:string = "Add Income";
  action:string = "Add";

  constructor(
    private dialogref: MatDialogRef<AddIncomeComponent>, 
    private builder:FormBuilder,
    private toastr:ToastrService,
    private service:AppService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ){

  }

  ngOnInit(): void {

    this.incomeForm = this.builder.group({
    
      desc:this.builder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
  
      src:this.builder.control('null',Validators.required),
      
      date:this.builder.control('', Validators.required,),
      
      amt:this.builder.control('',[Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)])
    });

    if(this.data['action']=='edit'){

      let desc = this.data['desc']
      let src = this.data['src']
      let date = this.data['date']
      let amt = this.data['amt']
      let id = this.data['id']
      
      this.title = "Edit income̥";
      this.action = "Save"

      console.log(
        `id : ${id}\n
        Desc  : ${desc}\n
        Source  : ${src}\n
        Date  : ${date}\n
        Amount  : ${amt}\n`
      )

      this.incomeForm.setValue({
        desc: desc,
        src:src,
        date: date,
        amt: amt
      });
    }
    

  }

  onSubmit(){
    if(this.incomeForm.valid){
      let desc = this.incomeForm.value.desc
      let src = this.incomeForm.value.src
      let date = this.incomeForm.value.date
      let amt = this.incomeForm.value.amt

      let formdata:FormData = new FormData();
      formdata.append('uname', sessionStorage.getItem('user')!)
      formdata.append('desc', desc)
      formdata.append('src', src)
      formdata.append('date', date)
      formdata.append('amt', amt)

      if(this.data['action']=='edit'){
        formdata.append('id',this.data['id'])
        this.service.editIncome(formdata).subscribe(
          (res:ServerResponse)=>{
            if(res.success){
              this.toastr.success(res.message)
              this.dialogref.close()
            }else this.toastr.warning(res.message)
          },err=>{
            this.toastr.warning('Server Not Reachable!!')
          }
        )
      }
      
      else{
        this.service.addIncome(formdata).subscribe(
          (res:ServerResponse)=>{
            if(res.success){
              this.toastr.success(res.message)
              this.dialogref.close()
            }else this.toastr.warning(res.message)
          },err=>{
            this.toastr.warning('Server Not Reachable!!')
          }
        )
      }

      
    }else this.toastr.warning('Form Invalid!!')
  }


  close(){
    this.dialogref.close()
  }

}
