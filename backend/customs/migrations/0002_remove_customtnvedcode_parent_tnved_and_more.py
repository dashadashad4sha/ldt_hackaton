# Generated by Django 4.1.2 on 2022-10-30 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customs', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customtnvedcode',
            name='parent_tnved',
        ),
        migrations.AddField(
            model_name='customtnvedcode',
            name='tnved_fee',
            field=models.CharField(max_length=200, null=True),
        ),
    ]