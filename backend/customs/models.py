from django.db import models


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
    tnved_code = models.BigIntegerField()
    tnved_name = models.CharField(max_length=400)
    tnved_fee = models.CharField(max_length=200, null=True)
    create_time = models.DateTimeField(auto_now_add=True)
    modification_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.tnved_code}: {self.tnved_name}'


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


class Sanction(models.Model):
    sanction_id = models.IntegerField(unique=True, blank=False)
    direction = models.CharField(max_length=1)
    country = models.ForeignKey(Country, to_field='country_id', on_delete=models.RESTRICT, related_name='sanctions',
                                db_column='sanction_country_id')
    tnved = models.ForeignKey(CustomTnvedCode, on_delete=models.CASCADE, related_name='sanctions',
                              db_column='sanction_tnved_id')


class Recommendation(models.Model):
    recommendation_id = models.IntegerField(unique=True)
    tnved = models.ForeignKey(CustomTnvedCode, on_delete=models.CASCADE, related_name='recommendations',
                              to_field='tnved_id', db_column='recommendation_tnved_id')
    region = models.ForeignKey(Region, on_delete=models.RESTRICT, related_name='recommendations', to_field='region_id',
                               db_column='recommendation_region_id')
