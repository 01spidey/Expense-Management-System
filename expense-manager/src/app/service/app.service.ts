import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { GetExpensesResponse, GetIncomesResponse, ServerResponse, SummaryResponse } from '../models';
import { SummaryComponent } from '../summary/summary.component';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  API_URL = 'http://127.0.0.1:8000/'

  user = 'null'

  constructor(private http:HttpClient) { 

  }

  initUser(user:string){
    this.user = user
  }

  // User registration and Login

  register(formdata:FormData){
    return this.http.post<ServerResponse>(`${this.API_URL}/register`, formdata)
  }

  login(formdata:FormData){
    return this.http.post<ServerResponse>(`${this.API_URL}/login`,formdata);
  }

  sendRequest(){
    return this.http.post<ServerResponse>(this.API_URL, "hello")
  }

  // Expense CRUD Operations

  addExpense(formdata:FormData){
    return this.http.post<ServerResponse>(`${this.API_URL}/add_expense`, formdata)
  }

  editExpense(formdata:FormData){
    return this.http.post<ServerResponse>(`${this.API_URL}/edit_expense`, formdata)
  }

  deleteExpense(formdata:FormData){
    return this.http.post<ServerResponse>(`${this.API_URL}/delete_expense`, formdata)
  }

  getExpenses(formdata:FormData){
    return this.http.post<GetExpensesResponse>(`${this.API_URL}/get_expenses`, formdata)
  }


  // Income CRUD Operations

  addIncome(formdata:FormData){
    return this.http.post<ServerResponse>(`${this.API_URL}/add_income`, formdata)
  }

  editIncome(formdata:FormData){
    return this.http.post<ServerResponse>(`${this.API_URL}/edit_income`, formdata)
  }

  deleteIncome(formdata:FormData){
    return this.http.post<ServerResponse>(`${this.API_URL}/delete_income`, formdata)
  }

  getIncomes(formdata:FormData){
    return this.http.post<GetIncomesResponse>(`${this.API_URL}/get_incomes`, formdata)
  }

  getExpenseSummary(formdata:FormData){
    return this.http.post<SummaryResponse>(`${this.API_URL}/get_expense_summary`, formdata)
  }

  getIncomeSummary(formdata:FormData){
    return this.http.post<SummaryResponse>(`${this.API_URL}/get_income_summary`, formdata)
  }

  getIncomeCSV(formdata:FormData){
    return this.http.post<ServerResponse>(`${this.API_URL}/get_income_csv`, formdata)
  }

  getExpenseCSV(formdata:FormData){
    console.log('Get Expense CSV')
    return this.http.post<ServerResponse>(`${this.API_URL}/get_expense_csv`, formdata)
  }

}
