# Generated by Django 4.1.2 on 2022-11-01 07:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customs', '0005_recommendation'),
    ]

    operations = [
        migrations.RenameField(
            model_name='recommendation',
            old_name='recomendation_id',
            new_name='recommendation_id',
        ),
    ]
