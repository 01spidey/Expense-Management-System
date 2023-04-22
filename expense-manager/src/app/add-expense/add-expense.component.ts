import { Component,Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../service/app.service';
import { ServerResponse } from '../models';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit{

  expenseForm! : FormGroup;
  title:string = "Add Expense";
  action:string = "Add";

  constructor(
    private dialogref: MatDialogRef<AddExpenseComponent>, 
    private builder:FormBuilder,
    private toastr:ToastrService,
    private service:AppService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ){

  }

  ngOnInit(): void {

    this.expenseForm = this.builder.group({
    
      desc:this.builder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
  
      cat:this.builder.control('null',Validators.required),
      
      date:this.builder.control('', Validators.required,),
      
      amt:this.builder.control('',[Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)])
    });

    if(this.data['action']=='edit'){

      let desc = this.data['desc']
      let cat = this.data['cat']
      let date = this.data['date']
      let amt = this.data['amt']
      let id = this.data['id']
      
      this.title = "Edit Expense";
      this.action = "Save"

      console.log(
        `id : ${id}\n
        Desc  : ${desc}\n
        Category  : ${cat}\n
        Date  : ${date}\n
        Amount  : ${amt}\n`
      )

      this.expenseForm.setValue({
        desc: desc,
        cat: cat,
        date: date,
        amt: amt
      });
    }
    

  }


  onSubmit(){
    if(this.expenseForm.valid){
      let desc = this.expenseForm.value.desc
      let cat = this.expenseForm.value.cat
      let date = this.expenseForm.value.date
      let amt = this.expenseForm.value.amt

      let formdata:FormData = new FormData();
      formdata.append('uname', sessionStorage.getItem('user')!)
      formdata.append('desc', desc)
      formdata.append('cat', cat)
      formdata.append('date', date)
      formdata.append('amt', amt)

      if(this.data['action']=='edit'){
        formdata.append('id',this.data['id'])
        this.service.editExpense(formdata).subscribe(
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
        this.service.addExpense(formdata).subscribe(
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
