# Generated by Django 4.1.2 on 2022-11-03 15:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customs', '0006_rename_recomendation_id_recommendation_recommendation_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExportToExel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tnved_id', models.IntegerField(unique=True)),
                ('tnved_code', models.CharField(max_length=400)),
                ('tnved_name', models.CharField(max_length=400)),
                ('tnved_fee', models.CharField(max_length=200, null=True)),
                ('create_time', models.DateTimeField(auto_now_add=True)),
                ('modification_time', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AlterField(
            model_name='customdata',
            name='quantity',
            field=models.DecimalField(decimal_places=2, max_digits=20),
        ),
        migrations.AlterField(
            model_name='customdata',
            name='volume',
            field=models.DecimalField(decimal_places=2, max_digits=20),
        ),
        migrations.AlterField(
            model_name='customtnvedcode',
            name='tnved_code',
            field=models.BigIntegerField(),
        ),
        migrations.AlterField(
            model_name='customtnvedcode',
            name='tnved_name',
            field=models.CharField(max_length=400),
        ),
    ]