import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from '@angular/forms'
import { ToastrModule } from 'ngx-toastr';
import { MyexpenseComponent } from './myexpense/myexpense.component';
import {MaterialModule} from './material.module'
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { MyincomeComponent } from './myincome/myincome.component';
import { AddIncomeComponent } from './add-income/add-income.component';
import { SummaryComponent } from './summary/summary.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AuthenticationComponent,
    HomeComponent,
    MyexpenseComponent,
    AddExpenseComponent,
    DeletePopupComponent,
    MyincomeComponent,
    AddIncomeComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MaterialModule,
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
