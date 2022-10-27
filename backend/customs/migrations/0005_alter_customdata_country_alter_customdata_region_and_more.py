# Generated by Django 4.1.2 on 2022-10-27 06:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('customs', '0004_rename_child_tnved_customtnvedcode_parent_tnved'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customdata',
            name='country',
            field=models.ForeignKey(db_column='custom_data_country_id', on_delete=django.db.models.deletion.CASCADE, related_name='custom_data', to='customs.country', to_field='country_id'),
        ),
        migrations.AlterField(
            model_name='customdata',
            name='region',
            field=models.ForeignKey(db_column='custom_data_region_id', on_delete=django.db.models.deletion.CASCADE, related_name='custom_data', to='customs.region', to_field='region_id'),
        ),
        migrations.AlterField(
            model_name='customdata',
            name='tnved',
            field=models.ForeignKey(db_column='custom_data_tnved_id', on_delete=django.db.models.deletion.CASCADE, related_name='custom_data', to='customs.customtnvedcode', to_field='tnved_id'),
        ),
        migrations.AlterField(
            model_name='customdata',
            name='unit',
            field=models.ForeignKey(db_column='custom_data_unit_id', on_delete=django.db.models.deletion.CASCADE, related_name='custom_data', to='customs.unit', to_field='unit_id'),
        ),
    ]
