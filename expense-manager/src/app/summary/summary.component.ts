import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import { Chart, registerables } from 'node_modules/chart.js'
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas'; // import html2canvas library

Chart.register(...registerables);

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { AppService } from '../service/app.service';
import { dateAmount, Expense, Income, ServerResponse, SummaryResponse } from '../models';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class SummaryComponent implements OnInit{
  start_date = new FormControl(moment());
  end_date = new FormControl(moment());

  total_income = "-"
  salary = "-"
  business = "-"
  investment = "-"
  rental = "-"
  income_others = "-"

  INCOME_PIE_DATA: Income[] = []
  income_pie_labelData:string[] = ['Salary', 'Business', 'Investment', 'Rental', 'Others']
  income_pie_colordata:any[] = ['#1b2f45ff','#4ca1cbff','#ff8080ff','#d9b3ffff','#feb236ff']

  total_expense = "-"
  housing = "-"
  transport = "-"
  food = "-"
  utilities = "-"
  personal = "-"
  expense_others = "-"

  EXPENSE_PIE_DATA: Income[] = []
  expense_pie_labelData:string[] = ['Housing','Transport','Food','Utilities','Personal','Others']
  expense_pie_colordata:any[] = ['#1b2f45ff','#4ca1cbff','#ff8080ff','#d9b3ffff','#6b5b95ff','#feb236ff',]
  private income_pie_chart!: any;
  private expense_pie_chart!: any;
  private income_area_chart!:any;
  private expense_area_chart!:any;

  flag = true;
  top_income_source = "-"
  total_savings = "-"
  
  total_income_num:Number = 0
  total_expense_num:Number = 0

  top_expense_cat = ""
  expense_income_ratio = "0.0"
  avg_income = "-"
  avg_expense = "-"

  active_section='-'
  loading = false

  days = 0
  constructor(private service:AppService){

  }

  setSection(section:string){
    this.active_section = section;
  }

  ngOnInit(): void {
    const startOfMonth = moment().startOf('month');
    const startDate = moment(startOfMonth).subtract(3, 'months').startOf('month');
    const endDate = moment().endOf('month');

    this.days = endDate.diff(startDate, 'days') + 1;

    this.start_date.setValue(startDate);
    this.end_date.setValue(endDate);
    this.submitDates()

    const links = document.querySelectorAll('.nav-btns a');
    document.getElementById('generate')!.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});

    links.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const sectionId = link.getAttribute('href');
        const section = document.querySelector(sectionId!);
        section!.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      });
    });


    document.getElementById('up-btn')?.addEventListener('click', (event) => {
      event.preventDefault();
      const section = document.getElementById('generate');
      section!.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    });

  }
  

  chosenStartYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.start_date.value;
    ctrlValue!.year(normalizedYear.year());
    this.start_date.setValue(ctrlValue);
  }

  chosenStartMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.start_date.value;
    ctrlValue!.month(normalizedMonth.month());
    this.start_date.setValue(ctrlValue);
    datepicker.close();
  }

  chosenEndYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.end_date.value;
    ctrlValue!.year(normalizedYear.year());
    this.end_date.setValue(ctrlValue);
  }

  chosenEndMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.end_date.value;
    ctrlValue!.month(normalizedMonth.month());
    this.end_date.setValue(ctrlValue);
    datepicker.close();
  }

  submitDates() {
    if(!this.flag){

      this.loading = true
      
      setTimeout(() => {
        document.getElementById('cards')!.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        this.setSection('analysis')
        this.loading = false
      }, 2000);
      
      
    }

    this.getIncomeSummary()
    this.getExpenseSummary()
    this.flag = false
  }

  getExpenseSummary(){
    const startDateStr = this.start_date.value!.format('YYYY-MM-DD');
    const endDateStr = this.end_date.value!.format('YYYY-MM-DD');
    
    const startDate = moment(startDateStr);
    const endDate = moment(endDateStr);

    const numDays = Math.ceil(endDate.diff(startDate, 'days', true)) + 1;
    this.avg_expense = (Number(this.total_expense_num)/numDays).toFixed(1)

    let formdata_1 : FormData = new FormData();

    formdata_1.append('start_date',startDateStr)
    formdata_1.append('end_date',endDateStr)
    formdata_1.append('uname',sessionStorage.getItem('user')!)
      
    this.service.getExpenseSummary(formdata_1).subscribe(
      (res:SummaryResponse)=>{
        if(res.success){
          this.total_expense = this.convertAmount(res.total)
          this.housing = this.convertAmount(res.subs[0])
          this.transport = this.convertAmount(res.subs[1])
          this.food = this.convertAmount(res.subs[2])
          this.utilities = this.convertAmount(res.subs[3])
          this.personal = this.convertAmount(res.subs[4])
          this.expense_others = this.convertAmount(res.subs[5])
          this.total_expense_num = res.total
          this.initExpenseCharts([res.subs[0],res.subs[1],res.subs[2],res.subs[3],res.subs[4],res.subs[5]],res.chart_data)
        }
    },err=>{

      }
    )
  }

  getIncomeSummary(){
    const startDateStr = this.start_date.value!.format('YYYY-MM-DD');
    const endDateStr = this.end_date.value!.format('YYYY-MM-DD');
    
    const startDate = moment(startDateStr);
    const endDate = moment(endDateStr);

    const numDays = Math.ceil(endDate.diff(startDate, 'days', true)) + 1;
    this.avg_income = (Number(this.total_income_num)/numDays).toFixed(1)
    
    // console.log(`Start date: ${startDateStr}, End date: ${endDateStr}`);

    let formdata : FormData = new FormData();

    formdata.append('start_date',startDateStr)
    formdata.append('end_date',endDateStr)
    formdata.append('uname',sessionStorage.getItem('user')!)
      
    this.service.getIncomeSummary(formdata).subscribe(
      (res:SummaryResponse)=>{
        if(res.success){
          this.total_income = this.convertAmount(res.total)
          this.salary = this.convertAmount(res.subs[0])
          this.business = this.convertAmount(res.subs[1])
          this.investment = this.convertAmount(res.subs[2])
          this.rental = this.convertAmount(res.subs[3])
          this.income_others = this.convertAmount(res.subs[4])
          // console.log(res.chart_data)
          this.total_income_num = res.total
          this.initIncomeCharts([res.subs[0],res.subs[1],res.subs[2],res.subs[3],res.subs[4]],res.chart_data)

        }
    },err=>{

      }
    )
  }

  convertAmount(amount: number): string {
    if (amount < 10000) {
      return amount.toString();
    } else if (amount >= 10000 && amount < 1000000) {
      const k = Math.floor(amount / 1000);
      const remainder = amount % 1000;
      if (remainder === 0) {
        return `${k}k`;
      } else {
        return `${k}.${(remainder / 100).toFixed(0)}k`;
      }
    } else if (amount >= 1000000 && amount < 1000000000) {
      const m = Math.floor(amount / 1000000);
      const remainder = amount % 1000000;
      if (remainder === 0) {
        return `${m}M`;
      } else {
        return `${m}.${(remainder / 100000).toFixed(0)}M`;
      }
    } else {
      return `${(amount / 1000000000).toFixed(1)}B`;
    }
  }
  
  initIncomeCharts(pieChartData:number[],  areaChartData:dateAmount[]){
    if(this.income_pie_chart) this.income_pie_chart.destroy();
    if(this.income_area_chart) this.income_area_chart.destroy();
    
    let diff = Number(this.total_income_num)-Number(this.total_expense_num)
    this.total_savings = this.convertAmount(diff)
    
    let max = 0
    let ind = 0
    let num = 0
    for(let i=0;i<pieChartData.length;i++){
      num = Number(pieChartData[i])
      if(num>max){ 
        // console.log(max+" < "+num)
        max = num
        ind = i
      }
    }
    // console.log(max+" => "+ind)
    switch(ind){
      case 0:
        this.top_income_source = "Salary"
        break
      case 1:
        this.top_income_source = 'Business'
        break
      case 2:
        this.top_income_source = "Investment"
        break
      case 3:
        this.top_income_source = 'Rental'
        break
      case 4:
        this.top_income_source = "Others"
        break
    }

    this.income_pie_chart = new Chart('income-pie', {
      type: 'pie',
      data: {
        labels: this.income_pie_labelData,
        datasets: [{
          label: 'Income in INR',
          data: pieChartData,
          backgroundColor : this.income_pie_colordata,
          borderWidth: 1,
          hoverOffset : 6
        }]
      }
    });

    const data = {
      labels: areaChartData.map(item => item.date),
      datasets: [{
          label: 'Income',
          data: areaChartData.map(item => item.amount),
          borderColor: '#1b2f45ff',
          backgroundColor: 'white',
          fill: false
      }]
    };

    this.income_area_chart = new Chart('income-area', {
      type: 'line',
      data: data,
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }

  initExpenseCharts(pieChartData:number[], areaChartData:dateAmount[]){
    if(this.expense_pie_chart) this.expense_pie_chart.destroy();
    if(this.expense_area_chart) this.expense_area_chart.destroy();
    
    this.expense_income_ratio = ((Number(this.total_expense_num)/Number(this.total_income_num))*100).toFixed(1)

    let max = 0
    let ind = 0
    let num = 0
    for(let i=0;i<pieChartData.length;i++){
      num = Number(pieChartData[i])
      if(num>max){ 
        // console.log(max+" < "+num)
        max = num
        ind = i
      }
    }
    // console.log(max+" => "+ind)
    switch(ind){
      case 0:
        this.top_expense_cat = "Housing"
        break
      case 1:
        this.top_expense_cat = 'Transport'
        break
      case 2:
        this.top_expense_cat = "Food"
        break
      case 3:
        this.top_expense_cat = 'Utilities'
        break
      case 4:
        this.top_expense_cat = "Personal"
        break
      case 5:
        this.top_expense_cat = "Others"
        break
    }

    this.expense_pie_chart = new Chart('expense-pie', {
      type: 'pie',
      data: {
        labels: this.expense_pie_labelData,
        datasets: [{
          label: 'Expense in INR',
          data: pieChartData,
          backgroundColor : this.expense_pie_colordata,
          borderWidth: 1,
          hoverOffset : 6
        }]
      }
    });

    const data = {
      labels: areaChartData.map(item => item.date),
      datasets: [{
          label: 'Expense',
          data: areaChartData.map(item => item.amount),
          borderColor: '#35363aff',
          backgroundColor: 'white',
          fill: false
      }]
    };

    this.expense_area_chart = new Chart('expense-area', {
      type: 'line',
      data: data,
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });


  }

  getCSV(type:string){
    const startDateStr = this.start_date.value!.format('YYYY-MM-DD');
    const endDateStr = this.end_date.value!.format('YYYY-MM-DD');
    const uname = sessionStorage.getItem('user')
    
    let formdata:FormData = new FormData();
    formdata.append('uname',uname!)
    formdata.append('start_date',startDateStr)
    formdata.append('end_date',endDateStr)

    if(type=='income'){
      this.service.getIncomeCSV(formdata).subscribe(
        (res:ServerResponse)=>{
          let csv_data = res.message
          const blob = new Blob([csv_data], { type: 'text/csv;charset=utf-8;' }); // Create a Blob object with the CSV data
          saveAs(blob, `income_data[${startDateStr}-${endDateStr}].csv`);
        },err=>{

        }
      )

    }
    else{
      this.service.getExpenseCSV(formdata).subscribe(
        (res:ServerResponse)=>{
          let csv_data = res.message
          const blob = new Blob([csv_data], { type: 'text/csv;charset=utf-8;' }); // Create a Blob object with the CSV data
          saveAs(blob, `expense_data[${startDateStr}-${endDateStr}].csv`);
        },err=>{

        }
      )
    }
  }

  downloadImg(div:string) {
    const element = document.getElementById(div)!;
    if(element){
      html2canvas(element).then(function(canvas) {
        const imageData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${div=='income-div'?'income-summary':'expense-summary'}.png`;
        link.href = imageData;
        link.click();
      });
    }
  
    
  }
    
}
