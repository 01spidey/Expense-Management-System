import { Component, ViewChild, OnInit, ElementRef, OnDestroy} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from '../service/app.service';
import { AddExpenseComponent } from '../add-expense/add-expense.component';
import { Expense, GetExpensesResponse } from '../models';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { Chart, registerables } from 'node_modules/chart.js'
Chart.register(...registerables);

@Component({
  selector: 'app-myexpense',
  templateUrl: './myexpense.component.html',
  styleUrls: ['./myexpense.component.scss']
})
export class MyexpenseComponent implements OnInit,OnDestroy{

  EXPENSE_DATA!: Expense[]
  displayedColumns: string[] = ['position','desc', 'date', 'category','amount', 'edit', 'delete'];
  dataSource:any;

  labelData:string[] = ['Housing', 'Transport', 'Food', 'Utilities', 'Personal', 'Others']
  colordata:any[] = ['#1b2f45ff','#4ca1cbff','#ff8080ff','#d9b3ffff','#6b5b95ff','#feb236ff',]

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private bar_chart!: Chart;
  private pie_chart!: any;

  
  constructor(
    private service:AppService, 
    private dialog:MatDialog,
    private toastr:ToastrService,
    private router:Router){

  }

  ngOnInit(): void {
    this.fillTable();
    document.getElementById('top')!.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});

  }

  ngOnDestroy(): void {
      this.bar_chart.destroy()
      this.pie_chart.destroy()
  }
  

  fillTable(){
    let formdata:FormData = new FormData();
    formdata.append('user',sessionStorage.getItem('user')!)

    this.service.getExpenses(formdata).subscribe(
      (res:GetExpensesResponse)=>{
        this.EXPENSE_DATA = res.data
        this.dataSource = new MatTableDataSource(this.EXPENSE_DATA);
        this.dataSource.paginator = this.paginator;
        this.renderChart(this.EXPENSE_DATA)
      },err=>{
        this.toastr.warning('Server Not Reachable!!')
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addExpense(){
    const popup = this.dialog.open(AddExpenseComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      disableClose : true,
      position: {left: '35%', top: '20vh'},
      data : {
        'action': 'new'
      }
    }
    );

    popup.afterClosed().subscribe(
      res=>{
        this.fillTable();
      }
    );
  }

  editExpense(expense:Expense){
    let id = expense.id
    let desc = expense.desc
    let cat = expense.category
    let date = expense.date
    let amt = expense.amount

    const popup = this.dialog.open(AddExpenseComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      disableClose : true,
      position: {left: '35%', top: '20vh'},
      data : {
        'action': 'edit',
        'id' : id,
        'desc' : desc,
        'cat' : cat,
        'date' : date,
        'amt' : amt
      }
    }
    );

    popup.afterClosed().subscribe(
      res=>{
        this.fillTable();
      }
    );
  }

  delete(expense:Expense){
    const popup = this.dialog.open(DeletePopupComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      disableClose : true,
      position: {left: '45%', top: '23%'},
      data : {
        'from' : 'expense',
        'expense_id' : expense.id
      }
    }
    );

    popup.afterClosed().subscribe(
      res=>{
        this.fillTable();
      }
    );
  }


  renderChart(chartData : Expense[]){
    console.log('Vanakkamm  Bruh!!')
    let housing:number = 0
    let food:number = 0
    let utilities:number = 0
    let personal:number = 0
    let transport:number = 0
    let others:number = 0
    
    let expense:Expense;

    for(let i=0;i<chartData.length;i++){
      expense = chartData[i]
      if(expense.category=='Housing') housing+=Number(expense.amount)
      if(expense.category=='Food') food+=Number(expense.amount)
      if(expense.category=='Utilities') utilities+=Number(expense.amount)
      if(expense.category=='Transport') transport+=Number(expense.amount)
      if(expense.category=='Personal') personal+=Number(expense.amount)
      if(expense.category=='Others') others+=Number(expense.amount)
    }

    console.log(chartData)

    if (this.bar_chart) {
      this.bar_chart.destroy();
    }

    if(this.pie_chart){
      this.pie_chart.destroy();
    }

    this.bar_chart = new Chart('bar', {
      type: 'bar',
      data: {
        labels: this.labelData,
        datasets: [{
          label: 'Expense in INR',
          data: [housing, transport, food, utilities, personal, others],
          backgroundColor : this.colordata,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    this.pie_chart = new Chart('pie', {
      type: 'doughnut',
      data: {
        labels: this.labelData,
        datasets: [{
          label: 'Expense in INR',
          data: [housing, transport, food, utilities, personal, others],
          backgroundColor : this.colordata,
          borderWidth: 1,
          hoverOffset : 6
        }]
      }
    });

  }

}
