# Generated by Django 4.2 on 2023-04-17 16:21

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('expenses', '0002_expense'),
    ]

    operations = [
        migrations.CreateModel(
            name='Income',
            fields=[
                ('id', models.AutoField(default=None, primary_key=True, serialize=False)),
                ('user_id', models.TextField(max_length=50)),
                ('description', models.CharField(max_length=100)),
                ('source', models.CharField(max_length=50)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
    ]
