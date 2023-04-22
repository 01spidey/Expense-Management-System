import { Component,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Expense, ServerResponse } from '../models';
import { AppService } from '../service/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent {

  constructor(
    private dialog:MatDialogRef<DeletePopupComponent>,
    private service:AppService,
    private toastr:ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,){

  }

  delete(){
    if(this.data['from']=='expense'){
      let expense_id = this.data['expense_id']
      let formdata:FormData = new FormData()
      formdata.append('expense_id',expense_id)
      this.service.deleteExpense(formdata).subscribe(
        (res:ServerResponse)=>{
          this.toastr.success(res.message)
          this.dialog.close()
        },err=>{
          this.toastr.warning('Server Not Reachable!!')
        }
      )
    }
    else{
      let income_id = this.data['income_id']
      let formdata:FormData = new FormData()
      formdata.append('income_id',income_id)
      this.service.deleteIncome(formdata).subscribe(
        (res:ServerResponse)=>{
          this.toastr.success(res.message)
          this.dialog.close()
        },err=>{
          this.toastr.warning('Server Not Reachable!!')
        }
      )
    }
  }

  close(){
    this.dialog.close()
  }

}
