from django.db import models
from django.utils.timezone import now

# Create your models here.

class User(models.Model):
    user_id = models.CharField(primary_key=True, max_length=50)
    password = models.CharField(max_length=50, null=False)
    name = models.CharField(max_length=50, null=False)
    email = models.CharField(max_length=50, null=False)
    
class Expense(models.Model):
    id = models.AutoField(primary_key=True, default=None)
    user_id = models.TextField(max_length=50, null=False)
    description = models.CharField(max_length=100, null=False)
    category = models.CharField(max_length=50, null=False)
    date = models.DateField(default=now, null=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=False)

    class Meta:
        ordering = ['-date']

class Income(models.Model):
    id = models.AutoField(primary_key=True, default=None)
    user_id = models.TextField(max_length=50, null=False)
    description = models.CharField(max_length=100, null=False)
    source = models.CharField(max_length=50, null=False)
    date = models.DateField(default=now, null=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=False)

    class Meta:
        ordering = ['-date']

