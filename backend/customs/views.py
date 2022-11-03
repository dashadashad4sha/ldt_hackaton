from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from django.db.models import Sum
from rest_framework.response import Response

from customs.models import Unit, Region, Country, CustomTnvedCode, FederalDistrict, CustomData, Recommendation, Sanction
from customs.serializers import UnitSerializer, RegionSerializer, CountrySerializer, FederalDistrictSerializer, \
    TnvedCodeSerializer, CustomDataSerializer, SanctionSerializer, RecommendationSerializer, \
    TopRecommendationSerializer, CustomsDataChartSerializer, MainCustomsPartner, ImportExportTnvedSerializer, \
    PartnerByTnvedSerializer, SanctionGoodsVolume, ClearImportByTnved

doc_get_top_recommendation_resp = {
    status.HTTP_200_OK: TopRecommendationSerializer(many=True)
}

doc_get_customsdata_chart = {
    status.HTTP_200_OK: CustomsDataChartSerializer(many=True)
}

doc_get_customsdata_main_partner = {
    status.HTTP_200_OK: MainCustomsPartner(many=True)
}

doc_get_import_export_by_tnved = {
    status.HTTP_200_OK: ImportExportTnvedSerializer(many=True)
}

doc_get_customs_partner_by_tnved = {
    status.HTTP_200_OK: PartnerByTnvedSerializer(many=True)
}

doc_sanction_goods_volume_by_region = {
    status.HTTP_200_OK: SanctionGoodsVolume(many=True)
}

doc_clear_import = {
    status.HTTP_200_OK: ClearImportByTnved(many=True)
}


class UnitView(viewsets.GenericViewSet,
               mixins.ListModelMixin,
               mixins.RetrieveModelMixin
               ):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer


class RegionView(viewsets.GenericViewSet,
                 mixins.ListModelMixin,
                 mixins.RetrieveModelMixin
                 ):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class CountryView(viewsets.GenericViewSet,
                  mixins.ListModelMixin,
                  mixins.RetrieveModelMixin
                  ):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class FederalDistrictView(viewsets.GenericViewSet,
                          mixins.ListModelMixin,
                          mixins.RetrieveModelMixin
                          ):
    queryset = FederalDistrict.objects.all()
    serializer_class = FederalDistrictSerializer


class CustomTnvedCodeView(viewsets.GenericViewSet,
                          mixins.ListModelMixin,
                          mixins.RetrieveModelMixin
                          ):
    queryset = CustomTnvedCode.objects.all()
    serializer_class = TnvedCodeSerializer
    filterset_fields = ['start_date', 'end_date', 'code', 'region', 'country']

    @swagger_auto_schema(responses=doc_get_import_export_by_tnved)
    @action(methods=['GET'], detail=False, url_path='chart/customs-volume')
    def import_export_by_tnved(self, request, *args, **kwargs):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        code = request.query_params.get('code')
        region = request.query_params.get('region')
        country = request.query_params.get('country')

        if start_date and end_date:
            period_1 = f'where (cc.period between {start_date} and {end_date}) '
            period_2 = f'where (cc.period between {start_date} and {end_date})'
        else:
            period_1 = "where cc.period between '2019-01-01' and '2021-12-31' "
            period_2 = "where cc.period between '2019-01-01' and '2021-12-31'"

        if code:
            code_filter = f"and (ctc.tnved_code like '{code}%') "
        else:
            code_filter = ''

        if region:
            region_filter = f"and cr.region_name like '{region}' "
        else:
            region_filter = ''

        if country:
            country_filter = f"and ccn.country_name like '{country}'"
        else:
            country_filter = ''
        instance = CustomTnvedCode().import_export_by_tnved(period_1, period_2, code_filter, region_filter,
                                                            country_filter)
        serializer = ImportExportTnvedSerializer(instance, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(responses=doc_get_customs_partner_by_tnved)
    @action(methods=['GET'], detail=False, url_path='chart/customs-partner')
    def customs_partner_by_tnved(self, request, *args, **kwargs):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        code = request.query_params.get('code')
        region = request.query_params.get('region')

        if start_date and end_date:
            period_1 = f'where (cc.period between {start_date} and {end_date}) '
        else:
            period_1 = "where cc.period between '2019-01-01' and '2021-12-31' "

        if code:
            code_filter = f"and (ctc.tnved_code like '{code}%') "
        else:
            code_filter = ''

        if region:
            region_filter = f"and cr.region_name like '{region}' "
        else:
            region_filter = ''

        instance = CustomTnvedCode().customs_partner_by_tnved(period_1, region_filter, code_filter)
        serializer = PartnerByTnvedSerializer(instance, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(responses=doc_clear_import)
    @action(methods=['GET'], detail=False, url_path='clera-import')
    def clear_import(self, request, *args, **kwargs):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        code = request.query_params.get('code')
        region = request.query_params.get('region')

        if start_date and end_date:
            period_1 = f'where (cc.period between {start_date} and {end_date}) '
        else:
            period_1 = "where cc.period between '2019-01-01' and '2021-12-31' "

        if code:
            code_filter = f"and (ctc.tnved_code like '{code}%') "
        else:
            code_filter = ''

        if region:
            region_filter = f"and cr.region_name like '{region}' "
        else:
            region_filter = ''

        instance = CustomTnvedCode().clear_import(period_1, region_filter, code_filter)
        serializer = ClearImportByTnved(instance, many=True)
        return Response(serializer.data)



class CustomDataView(viewsets.GenericViewSet,
                     mixins.ListModelMixin,
                     mixins.RetrieveModelMixin
                     ):
    queryset = CustomData.objects.all()
    serializer_class = CustomDataSerializer

    @swagger_auto_schema(responses=doc_get_customsdata_chart)
    @action(methods=['GET'], detail=False, url_path='chart/import')
    def import_chart(self, request, *args, **kwargs):
        instance = CustomData.objects.filter(direction='И').order_by('period').values('period').annotate(
            volume=Sum('price'))
        serializer = CustomsDataChartSerializer(instance, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(responses=doc_get_customsdata_chart)
    @action(methods=['GET'], detail=False, url_path='chart/export')
    def export_chart(self, request, *args, **kwargs):
        instance = CustomData.objects.filte(direction='Э').order_by('period').values('period').annotate(
            volume=Sum('price'))
        serializer = CustomsDataChartSerializer(instance, many=True)
        return Response(serializer.deta)

    @swagger_auto_schema(responses=doc_get_customsdata_main_partner)
    @action(methods=['GET'], detail=False, url_path='chart/main-partner')
    def main_partner(self, request, *args, **kwargs):
        instance = CustomData().get_main_clients()
        serializer = MainCustomsPartner(instance, many=True)
        return Response(serializer.data)


class SanctionView(viewsets.GenericViewSet,
                   mixins.ListModelMixin,
                   mixins.RetrieveModelMixin
                   ):
    queryset = Sanction.objects.all()
    serializer_class = SanctionSerializer

    @swagger_auto_schema(responses=doc_sanction_goods_volume_by_region)
    @action(methods=['GET'], detail=False, url_path='goods-volume')
    def sanction_goods_volume_by_region(self, request, *args, **kwargs):
        region = request.query_params.get('region')
        code = request.query_params.get('code')

        if code:
            code_filter = f"and (ctc.tnved_code like '{code}%') "
        else:
            code_filter = ''

        if region:
            region_filter = f"and cr.region_name like '{region}' "
        else:
            region_filter = ''

        instance = Sanction().sanction_goods_volume_by_region(region=region_filter, code=code_filter)
        serializer = SanctionGoodsVolume(instance, many=True)
        return Response(serializer.data)


class RecommendationView(viewsets.GenericViewSet,
                         mixins.ListModelMixin,
                         mixins.RetrieveModelMixin
                         ):
    queryset = Recommendation.objects.all()
    serializer_class = RecommendationSerializer

    @swagger_auto_schema(
        responses=doc_get_top_recommendation_resp)
    @action(methods=['GET'], detail=False, url_path='top')
    def top_recommendation(self, request, *args, **kargs):
        instance = Recommendation.objects.prefetch_related('region').filter(region__region_name='Москва').values(
            'tnved__tnved_code', 'tnved__tnved_name')
        serializer = TopRecommendationSerializer(instance=instance, many=True)
        return Response(serializer.data)
