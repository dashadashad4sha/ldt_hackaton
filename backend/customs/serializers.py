from rest_framework import serializers

from customs.models import Unit, Region, Country, \
    FederalDistrict, CustomTnvedCode, CustomData, Sanction, Recommendation


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['unit_id', 'unit_code', 'unit_name']


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['region_id', 'region_code', 'region_name', 'federal_district']


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['country_id', 'country_name', 'country_block']


class FederalDistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = FederalDistrict
        fields = ['federal_district_id', 'federal_district_code', 'federal_district_name']


class TnvedCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomTnvedCode
        fields = ['tnved_id', 'tnved_code', 'tnved_name', 'parent_tnved']


class CustomDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomData
        fields = ['tnved', 'direction', 'country', 'period', 'region', 'unit', 'price', 'volume', 'quantity']


class SanctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sanction
        fields = ['sanction_id', 'direction', 'country', 'tnved']


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ['recommendation_id', 'tnved', 'region']


class TopRecommendationSerializer(serializers.Serializer):
    tnved_code = serializers.CharField()
    tnved_name = serializers.CharField()
