"""
URL configuration for expenseManager project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('expenses.urls')),
    path('register', include('expenses.urls')),
    path('add_expense', include('expenses.urls')),
    path('get_expenses', include('expenses.urls')),
    path('edit_expense',include('expenses.urls')),
    path('delete_expense',include('expenses.urls')),
    
    path('add_income',include('expenses.urls')),
    path('get_incomes',include('expenses.urls')),
    path('edit_income',include('expenses.urls')),
    path('delete_income',include('expenses.urls')),
    path('get_expense_summary',include('expenses.urls')),
    path('get_income_summary',include('expenses.urls')),
    path('get_expense_csv',include('expenses.urls')),
    path('get_income_csv',include('expenses.urls'))
]
