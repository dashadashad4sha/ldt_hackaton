from django.contrib import admin

from customs.models import Unit, Region, Country, CustomData, CustomTnvedCode, FederalDistrict
# Register your models here.


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ['unit_id', 'unit_code', 'unit_name']


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['region_id', 'region_code', 'region_name', 'federal_district']


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['country_id', 'country_name', 'country_block']


@admin.register(FederalDistrict)
class FederalDistrictAdmin(admin.ModelAdmin):
    list_display = ['federal_district_id', 'federal_district_code', 'federal_district_name']


@admin.register(CustomTnvedCode)
class CustomTnvedCodeAdmin(admin.ModelAdmin):
    list_display = ['tnved_id', 'tnved_code', 'tnved_name', 'parent_tnved']
