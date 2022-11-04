from rest_framework import serializers

from .models import Unit, Region, Country, \
    FederalDistrict, CustomTnvedCode, CustomData, Sanction, Recommendation #, ExportToExel


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
        fields = ['tnved_id', 'tnved_code', 'tnved_name']


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
    tnved__tnved_code = serializers.CharField()
    tnved__tnved_name = serializers.CharField()


class CustomsDataChartSerializer(serializers.Serializer):
    period = serializers.DateField(format='%Y.%m.%d')
    volume = serializers.DecimalField(max_digits=15, decimal_places=2)


class MainCustomsPartner(serializers.Serializer):
    country = serializers.CharField()
    volume_of_trade = serializers.DecimalField(max_digits=20, decimal_places=2)


class ImportExportTnvedSerializer(serializers.Serializer):
    date = serializers.DateField(format='%Y.%m.%d')
    import_value = serializers.DecimalField(max_digits=20, decimal_places=2)
    export_value = serializers.DecimalField(max_digits=20, decimal_places=2)


class PartnerByTnvedSerializer(serializers.Serializer):
    country = serializers.CharField()
    import_volume = serializers.DecimalField(max_digits=20, decimal_places=2)
    export_volume = serializers.DecimalField(max_digits=20, decimal_places=2)
    trade_volume = serializers.DecimalField(max_digits=20, decimal_places=2)


# class ExportToExelSerializer(serializers.Serializer):
#     class Meta:
#         model = ExportToExel
#         fields = ['tnved__tnved_name', 'tnved__tnved_code', 'import_value']
#     import_value = serializers.DecimalField(max_digits=20, decimal_places=2)
#     # export_value = serializers.DecimalField(max_digits=20, decimal_places=2)
#     tnved__tnved_code = serializers.CharField()
#     tnved__tnved_name = serializers.CharField()
#
# class ImportVolumeSerializer(serializers.Serializer):
#     date = serializers.DateField(format='%Y.%m.%d')
#     import_value = serializers.DecimalField(max_digits=20, decimal_places=2)
#     export_value = serializers.DecimalField(max_digits=20, decimal_places=2)

