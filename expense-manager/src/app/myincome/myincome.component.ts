import { Component, ViewChild, OnInit,OnDestroy} from '@angular/core';
import { GetIncomesResponse, Income } from '../models';
import { AppService } from '../service/app.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddIncomeComponent } from '../add-income/add-income.component';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { Chart, registerables } from 'node_modules/chart.js'
Chart.register(...registerables);

@Component({
  selector: 'app-myincome',
  templateUrl: './myincome.component.html',
  styleUrls: ['./myincome.component.scss']
})
export class MyincomeComponent implements OnInit,OnDestroy {

  INCOME_DATA!: Income[]
  displayedColumns: string[] = ['position','desc', 'date', 'source','amount', 'edit', 'delete'];
  dataSource:any;

  labelData:string[] = ['Salary', 'Business', 'Investment', 'Rental', 'Others']
  colordata:any[] = ['#1b2f45ff','#4ca1cbff','#ff8080ff','#d9b3ffff','#feb236ff',]

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
      document.getElementById('top')!.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      this.fillTable()
  }

  ngOnDestroy(): void {
    this.bar_chart.destroy()
    this.pie_chart.destroy()
  }

  fillTable(){
    let formdata:FormData = new FormData();
    formdata.append('user',sessionStorage.getItem('user')!)

    this.service.getIncomes(formdata).subscribe(
      (res:GetIncomesResponse)=>{
        this.INCOME_DATA = res.data
        this.dataSource = new MatTableDataSource(this.INCOME_DATA);
        this.dataSource.paginator = this.paginator;
        console.log(this.INCOME_DATA)
        this.renderChart(this.INCOME_DATA)
      },err=>{
        this.toastr.warning('Server Not Reachable!!')
      }
    )
  }

  addIncome(){
    const popup = this.dialog.open(AddIncomeComponent,{
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

  editIncome(income:Income){
    let id = income.id
    let desc = income.desc
    let src = income.source
    let date = income.date
    let amt = income.amount

    const popup = this.dialog.open(AddIncomeComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      disableClose : true,
      position: {left: '35%', top: '20vh'},
      data : {
        'action': 'edit',
        'id' : id,
        'desc' : desc,
        'src' : src,
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

  delete(income:Income){
    const popup = this.dialog.open(DeletePopupComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      disableClose : true,
      position: {left: '45%', top: '23%'},
      data : {
        'from' : 'income',
        'income_id' : income.id
      }
    }
    );

    popup.afterClosed().subscribe(
      res=>{
        this.fillTable();
      }
    );
  }

  renderChart(chartData : Income[]){
    console.log('Vanakkamm  Bruh!!')
    let salary:number = 0
    let business:number = 0
    let investment:number = 0
    let rental:number = 0
    let others:number = 0
    
    let income:Income;

    for(let i=0;i<chartData.length;i++){
      income = chartData[i]
      if(income.source=='Salary') salary+=Number(income.amount)
      if(income.source=='Business') business+=Number(income.amount)
      if(income.source=='Investment') investment+=Number(income.amount)
      if(income.source=='Rental') rental+=Number(income.amount)
      if(income.source=='Others') others+=Number(income.amount)
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
          label: 'Income in INR',
          data: [salary,business,investment,rental,others],
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
          label: 'Income in INR',
          data: [salary,business,investment,rental,others],
          backgroundColor : this.colordata,
          borderWidth: 1,
          hoverOffset : 6
        }]
      }
    });

  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
