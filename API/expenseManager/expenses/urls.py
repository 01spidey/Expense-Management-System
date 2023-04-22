from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('register',views.register),
    path('login',views.login),
    
    path('add_expense',views.add_expense),
    path('get_expenses',views.get_expenses),
    path('edit_expense',views.edit_expense),
    path('delete_expense',views.delete_expense),
    
    path('add_income',views.add_income),
    path('get_incomes',views.get_incomes),
    path('edit_income',views.edit_income),
    path('delete_income',views.delete_income),
    path('get_expense_summary',views.get_expense_summary),
    path('get_income_summary',views.get_income_summary),
    path('get_expense_csv',views.get_expense_csv),
    path('get_income_csv',views.get_income_csv)
]