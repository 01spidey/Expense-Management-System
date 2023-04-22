import csv
from io import StringIO
from django.http import JsonResponse
from django.shortcuts import render
from .models import User,Expense,Income
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from collections import OrderedDict

# Create your views here.
@csrf_exempt
def home(request):
    data = {
        'success' : True,
        'message':'vanakkam Bruh!!'}
    
    return JsonResponse(data)


# User Registration and Login
@csrf_exempt
def register(request):
    user_id = request.POST.get('uname')
    name = request.POST.get('name')
    password = request.POST.get('pass')
    mail = request.POST.get('mail')
    
    
    if User.objects.filter(user_id=user_id,password=password).exists():
        return JsonResponse({
            'success' : False,
            'message' : 'Username already exists!!'
        })
        
    user = User.objects.create(
        user_id=user_id,
        password = password,
        name = name,
        email = mail)
    
    
    user.save()
    
    print(f'user_id : {user_id}\nname : {name}\npassword : {password}\nmail : {mail}')
    
    return JsonResponse({
        'success' : True,
        'message' : 'Registration Successful!!'
    })
    
@csrf_exempt
def login(request):
    user_id = request.POST.get('uname')
    password = request.POST.get('pass')
    
    if User.objects.filter(user_id=user_id,password=password).exists():
        return JsonResponse({
            'success' : True,
            'message' : f'Welcome {user_id}!!'
        })
           
    return JsonResponse({
        'success' : False,
        'message' : 'User Not found!!'
    })

# Expense CRUD Operations
@csrf_exempt
def add_expense(request):
    user_id = request.POST.get('uname')
    desc = request.POST.get('desc')
    cat = request.POST.get('cat')
    date = request.POST.get('date')
    amt = request.POST.get('amt')
    
    print(f'user_id : {user_id}\nDesc : {desc}\nCategory : {cat}\nDate : {date}\nAmount : {amt}')

    expense = Expense.objects.create(
        user_id = user_id,
        description = desc,
        category = cat,
        date = date,
        amount = amt
    )
    
    expense.save()
    
    return JsonResponse({
        'success' : True,
        'message' : 'Expense Added Successfully!!'
    })

@csrf_exempt
def edit_expense(request):
    expense_id = request.POST.get('id')
    user_id = request.POST.get('uname')
    desc = request.POST.get('desc')
    cat = request.POST.get('cat')
    date = request.POST.get('date')
    amt = request.POST.get('amt')
    
    expense = Expense.objects.get(id=expense_id)
    
    expense.description = desc
    expense.category = cat
    expense.date = date
    expense.amount = amt
    
    expense.save()
    
    return JsonResponse({
        'success' : True,
        'message' : 'Expense Saved Successfully!!'
    })
    

@csrf_exempt
def delete_expense(request):
    expense_id = request.POST.get('expense_id')
    
    expense = Expense.objects.filter(id=expense_id)
    
    expense.delete()
    
    return JsonResponse({
        'success' : True,
        'message' : 'Expense deleted Successfully!!'
    })


@csrf_exempt
def get_expenses(request):
    user_id = request.POST.get('user')    
    start_date = datetime.now().date()
    end_date = start_date - timedelta(days=90)

    expenses = Expense.objects.filter(user_id=user_id, date__range=[end_date, start_date])
    data = []

    for i, expense in enumerate(expenses):
        data.append({
            'id' : expense.id,
            'position' : i + 1,
            'desc': expense.description,
            'date': str(expense.date),
            'category' : expense.category,
            'amount': expense.amount,
        })

    return JsonResponse({
        'success' : True,
        'data' : data
    })

# Income CRUD Operations

@csrf_exempt
def add_income(request):
    user_id = request.POST.get('uname')
    desc = request.POST.get('desc')
    src = request.POST.get('src')
    date = request.POST.get('date')
    amt = request.POST.get('amt')
    
    print(f'user_id : {user_id}\nDesc : {desc}\nSource : {src}\nDate : {date}\nAmount : {amt}')

    income = Income.objects.create(
        user_id = user_id,
        description = desc,
        source = src,
        date = date,
        amount = amt
    )
    
    income.save()
    
    return JsonResponse({
        'success' : True,
        'message' : 'Income Added Successfully!!'
    })

@csrf_exempt
def edit_income(request):
    income_id = request.POST.get('id')
    user_id = request.POST.get('uname')
    desc = request.POST.get('desc')
    src = request.POST.get('src')
    date = request.POST.get('date')
    amt = request.POST.get('amt')
    
    income = Income.objects.get(id=income_id)
    
    income.description = desc
    income.source = src
    income.date = date
    income.amount = amt
    
    income.save()
    
    return JsonResponse({
        'success' : True,
        'message' : 'Income Saved Successfully!!'
    })

@csrf_exempt
def delete_income(request):
    income_id = request.POST.get('income_id')
    
    income = Income.objects.filter(id=income_id)
    
    income.delete()
    
    return JsonResponse({
        'success' : True,
        'message' : 'Income deleted Successfully!!'
    })
    
@csrf_exempt
def get_incomes(request):
    user_id = request.POST.get('user')    
    start_date = datetime.now().date()
    end_date = start_date - timedelta(days=90)

    incomes = Income.objects.filter(user_id=user_id, date__range=[end_date, start_date])
    data = []

    for i, income in enumerate(incomes):
        data.append({
            'id' : income.id,
            'position' : i + 1,
            'desc': income.description,
            'date': str(income.date),
            'source' : income.source,
            'amount': income.amount,
        })

    return JsonResponse({
        'success' : True,
        'data' : data
    })

@csrf_exempt
def get_expense_summary(request):
    start_date_str = request.POST.get('start_date')
    end_date_str = request.POST.get('end_date')
    user_id = request.POST.get('uname')
    
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    
    expenses = Expense.objects.filter(user_id=user_id, date__range=[start_date,end_date])
    
    total_expense = 0
    housing, transport, utilities, food, personal, utilities, others = 0,0,0,0,0,0,0
    
    data = []
    
    date_expense = OrderedDict()
    
    for i, expense in enumerate(expenses):
        cat = expense.category
        total_expense+=expense.amount
        print(expense.category)
        if cat=='Housing':
            housing+=expense.amount
        elif cat=='Transport':
            transport+=expense.amount
        elif cat=='Utilities':
            utilities+=expense.amount
        elif cat=='Food':
            food+=expense.amount
        elif cat=='Personal':
            personal+=expense.amount
        else:
            others+=expense.amount
            
        data.append({
            'id' : expense.id,
            'position' : i + 1,
            'desc': expense.description,
            'date': str(expense.date),
            'category' : expense.category,
            'amount': expense.amount,
        })
        
        if(expense.date in date_expense):
            date_expense[expense.date]+=expense.amount
        else:
            date_expense[expense.date] = expense.amount
    
    chart_data = []
    for date, amount in date_expense.items():
        chart_data.append({
            'date': str(date),
            'amount': amount
        })

    print(f'Start Date : {start_date}\nEnd Date : {end_date}\nTotal Expense : {total_expense}')
    
    return JsonResponse({
        'success' : True,
        'data' : data,
        'total' : total_expense,
        'subs' : [housing,transport,food,utilities,personal,others],
        'chart_data' : chart_data
    })

@csrf_exempt
def get_income_summary(request):   
    start_date_str = request.POST.get('start_date')
    end_date_str = request.POST.get('end_date')
    user_id = request.POST.get('uname')
    
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    
    incomes = Income.objects.filter(user_id=user_id, date__range=[start_date,end_date])
    
    total_income = 0
    salary,business,investment,rental,others = 0,0,0,0,0
    
    data = []
    
    date_income = OrderedDict()
    
    for i, income in enumerate(incomes):
        src = income.source
        total_income+=income.amount
        print(income.source)
        if src=='Salary':
            salary+=income.amount
        elif src=='Business':
            business+=income.amount
        elif src=='Investment':
            investment+=income.amount
        elif src=='Rental':
            rental+=income.amount
        else:
            others+=income.amount
            
        data.append({
            'id' : income.id,
            'position' : i + 1,
            'desc': income.description,
            'date': str(income.date),
            'category' : income.source,
            'amount': income.amount,
        })
        
        if(income.date in date_income):
            date_income[income.date]+=income.amount
        else:
            date_income[income.date] = income.amount
    
    chart_data = []
    for date, amount in date_income.items():
        chart_data.append({
            'date': str(date),
            'amount': amount
        })

        
    return JsonResponse({
        'success' : True,
        'data' : data,
        'total' : total_income,
        'subs' : [salary,business,investment,rental,others],
        'chart_data' : chart_data
    })
    
    
@csrf_exempt
def get_income_csv(request): 
    
    start_date_str = request.POST.get('start_date')
    end_date_str = request.POST.get('end_date')
    user_id = request.POST.get('uname')
    
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
     
    buffer = StringIO()
    writer = csv.writer(buffer)
    writer.writerow(['S.No','Date','Source','Description','Amount']) # Headers for your CSV file

    # Fetch data from the database
    incomes = Income.objects.filter(user_id=user_id, date__range=[start_date,end_date])

    # Write data rows to the CSV file
    for i, income in enumerate(incomes):
        writer.writerow([i+1,income.date,income.source,income.description,income.amount])
    
    # print(CSV_DATA)
    CSV_DATA = buffer.getvalue()
    
    return JsonResponse({
        'success' : True,
        'message' : CSV_DATA
    })

@csrf_exempt
def get_expense_csv(request):  
    start_date_str = request.POST.get('start_date')
    end_date_str = request.POST.get('end_date')
    user_id = request.POST.get('uname')
    
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    
    
    # CSV_DATA = []
    buffer = StringIO()
    writer = csv.writer(buffer)
    writer.writerow(['S.No','Date','Category','Description','Amount']) # Headers for your CSV file

    # Fetch data from the database
    expenses = Expense.objects.filter(user_id=user_id, date__range=[start_date,end_date])


    # Write data rows to the CSV file
    for i, expense in enumerate(expenses):
        writer.writerow([i+1,expense.date,expense.category,expense.description,expense.amount])
    
    # print(CSV_DATA)
    CSV_DATA = buffer.getvalue()
    
    return JsonResponse({
        'success' : True,
        'message' : CSV_DATA
    })
    
    
    
    
    
    