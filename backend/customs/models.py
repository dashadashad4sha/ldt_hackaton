from django.db import models, connection

from customs import raw_sql


class Unit(models.Model):
    unit_id = models.IntegerField(unique=True, null=False, blank=False)
    unit_code = models.IntegerField()
    unit_name = models.CharField(max_length=200)
    create_time = models.DateTimeField(auto_now_add=True)
    modification_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.unit_code}: {self.unit_name}'


class Country(models.Model):
    country_id = models.IntegerField(unique=True, null=False, blank=False)
    country_name = models.CharField(max_length=200)
    country_block = models.CharField(max_length=200)
    create_time = models.DateTimeField(auto_now_add=True)
    modification_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.country_name}'


class FederalDistrict(models.Model):
    federal_district_id = models.IntegerField(unique=True, null=False)
    federal_district_code = models.CharField(max_length=200)
    federal_district_name = models.CharField(max_length=200)
    create_time = models.DateTimeField(auto_now_add=True)
    modification_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.federal_district_code}: {self.federal_district_name}'


class Region(models.Model):
    region_id = models.IntegerField(unique=True, blank=False)
    region_code = models.CharField(max_length=200)
    region_name = models.CharField(max_length=200)
    federal_district = models.ForeignKey(FederalDistrict,
                                         to_field='federal_district_id',
                                         on_delete=models.PROTECT,
                                         db_column='region_federal_district_id',
                                         related_name='regions')
    create_time = models.DateTimeField(auto_now_add=True)
    modification_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.region_code}: {self.region_name}'


class CustomTnvedCode(models.Model):
    tnved_id = models.IntegerField(unique=True, blank=False)
    tnved_code = models.CharField(max_length=400)
    tnved_name = models.CharField(max_length=400)
    tnved_fee = models.CharField(max_length=200, null=True)
    create_time = models.DateTimeField(auto_now_add=True)
    modification_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.tnved_code}: {self.tnved_name}'

    # ToDo rewrite to Django ORM
    def import_export_by_tnved(self, period_1, period_2, code_filter, region_filter, country_filter):
        with connection.cursor() as cursor:
            cursor.execute(
                raw_sql.import_export_by_tnved.format(period_1, code_filter, region_filter, country_filter, period_2))
            columns = [col[0] for col in cursor.description]
            resp = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
        return resp

    # ToDO rewrite to Django ORM
    def customs_partner_by_tnved(self, period, code_filter, region_filter):
        with connection.cursor() as cursor:
            cursor.execute(raw_sql.customs_partner_by_tnved.format(period, code_filter, region_filter))
            columns = [col[0] for col in cursor.description]
            resp = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
        return resp

    # ToDO rewrite to Django ORM
    def clear_import(self, period, code_filter, region_filter):
        with connection.cursor() as cursor:
            print(raw_sql.clear_import.format(period, code_filter, region_filter))
            cursor.execute(raw_sql.clear_import.format(period, code_filter, region_filter))
            columns = [col[0] for col in cursor.description]
            resp = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
        return resp


class CustomData(models.Model):
    tnved = models.ForeignKey(CustomTnvedCode, on_delete=models.CASCADE, related_name='custom_data',
                              to_field='tnved_id', db_column='custom_data_tnved_id')
    direction = models.CharField(max_length=1)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='custom_data', to_field='country_id',
                                db_column='custom_data_country_id')
    period = models.DateField()
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='custom_data', to_field='region_id',
                               db_column='custom_data_region_id')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='custom_data', to_field='unit_id',
                             db_column='custom_data_unit_id')
    price = models.DecimalField(max_digits=20, decimal_places=2)
    volume = models.DecimalField(max_digits=20, decimal_places=2)
    quantity = models.DecimalField(max_digits=20, decimal_places=2)
    create_time = models.DateTimeField(auto_now_add=True)
    modification_time = models.DateTimeField(auto_now=True)

    # ToDo rewrite to django ORM
    def get_main_clients(self):
        with connection.cursor() as cursor:
            cursor.execute(raw_sql.main_customs_partner)
            columns = [col[0] for col in cursor.description]
            resp = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]

        return resp

    def retrieve_alalytic_three(self, period_filter, region_filter, code_filter):
        with connection.cursor() as cursor:
            cursor.execute(
                raw_sql.ananytic_three.format(period_filter, region_filter, code_filter, period_filter, region_filter,
                                              code_filter))
            columns = [col[0] for col in cursor.description]
            resp = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
        return resp

    def retrieve_alalytic_four(self, region_filter, code_filter):
        with connection.cursor() as cursor:
            cursor.execute(raw_sql.analytic_four.format(region_filter, code_filter, region_filter, code_filter))
            columns = [col[0] for col in cursor.description]
            resp = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
        return resp

    def retrieve_alalytic_five(self, region_filter, code_filter):
        with connection.cursor() as cursor:
            print(raw_sql.analytic_five.format(region_filter, code_filter))
            cursor.execute(raw_sql.analytic_four.format(region_filter, code_filter))
            columns = [col[0] for col in cursor.description]
            resp = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
        return resp


class Sanction(models.Model):
    sanction_id = models.IntegerField(unique=True, blank=False)
    direction = models.CharField(max_length=1)
    country = models.ForeignKey(Country, to_field='country_id', on_delete=models.RESTRICT, related_name='sanctions',
                                db_column='sanction_country_id')
    tnved = models.ForeignKey(CustomTnvedCode, on_delete=models.CASCADE, related_name='sanctions',
                              db_column='sanction_tnved_id')

    # ToDo rewrite to Django ORM
    def sanction_goods_volume_by_region(self, region, code):
        with connection.cursor() as cursor:
            cursor.execute(raw_sql.sanction_goods_volume_by_region.format(region, code))
            columns = [col[0] for col in cursor.description]
            resp = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
        return resp


class Recommendation(models.Model):
    recommendation_id = models.IntegerField(unique=True)
    tnved = models.ForeignKey(CustomTnvedCode, on_delete=models.CASCADE, related_name='recommendations',
                              to_field='tnved_id', db_column='recommendation_tnved_id')
    region = models.ForeignKey(Region, on_delete=models.RESTRICT, related_name='recommendations', to_field='region_id',
                               db_column='recommendation_region_id')
