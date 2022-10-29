from rest_framework.serializers import ModelSerializer

from customs.models import Unit, Region, Country, FederalDistrict, CustomTnvedCode


class UnitSerializer(ModelSerializer):

    class Meta:
        model = Unit
        fields = ['unit_id', 'unit_code', 'unit_name']


class RegionSerializer(ModelSerializer):

    class Meta:
        model = Region
        fields = ['region_id', 'region_code', 'region_name', 'federal_district']


class CountrySerializer(ModelSerializer):

    class Meta:
        model = Country
        fields = ['country_id', 'country_name', 'country_block']


class FederalDistrictSerializer(ModelSerializer):

    class Meta:
        model = FederalDistrict
        fields = ['federal_district_id', 'federal_district_code', 'federal_district_name']


class TnvedCodeSerializer(ModelSerializer):

    class Meta:
        model = CustomTnvedCode
        fields = ['tnved_id', 'tnved_code', 'tnved_name', 'parent_tnved']
