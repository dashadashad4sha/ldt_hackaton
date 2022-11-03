from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from django.db.models import Sum
from rest_framework.response import Response

from django.db.models import Q

from .models import Unit, Region, Country, CustomTnvedCode, FederalDistrict, CustomData, Recommendation, Sanction, ExportToExel
from .serializers import UnitSerializer, RegionSerializer, CountrySerializer, FederalDistrictSerializer, \
    TnvedCodeSerializer, CustomDataSerializer, SanctionSerializer, RecommendationSerializer, \
    TopRecommendationSerializer, CustomsDataChartSerializer, ExportToExelSerializer

doc_get_top_recommendation_resp = {
    status.HTTP_200_OK: TopRecommendationSerializer(many=True)
}

doc_get_customdata_chart = {
    status.HTTP_200_OK: CustomsDataChartSerializer(many=True)
}

doc_get_exp_to_xls_resp = {
    status.HTTP_200_OK: ExportToExelSerializer(many=True)
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


class CustomDataView(viewsets.GenericViewSet,
                     mixins.ListModelMixin,
                     mixins.RetrieveModelMixin
                     ):
    queryset = CustomData.objects.all()
    serializer_class = CustomDataSerializer

    @swagger_auto_schema(responses=doc_get_customdata_chart)
    @action(methods=['GET'], detail=False, url_path='chart/import')
    def import_char(self, request, *args, **kwargs):
        search_query_tnved_name = request.GET.get('name')
        search_query_tnved_code = request.GET.get('code')

        if not search_query_tnved_code:
            search_query_tnved_code = 0

        if not search_query_tnved_name:

            instance = CustomData.objects.filter(Q(direction='И') & Q(
                tnved__tnved_code__icontains=search_query_tnved_code)).values(
                'period', 'tnved__tnved_code', 'tnved__tnved_name').annotate(volume=Sum('price'))

            serializer = CustomsDataChartSerializer(instance, many=True)
            return Response(serializer.data)

        else:
            instance = CustomData.objects.filter(Q(direction='И') & (
                    Q(tnved__tnved_name__iregex=search_query_tnved_name) | Q(
                tnved__tnved_code=search_query_tnved_code))).values(
                'period', 'tnved__tnved_code', 'tnved__tnved_name').annotate(volume=Sum('price'))

            serializer = CustomsDataChartSerializer(instance, many=True)
            return Response(serializer.data)


class SanctionView(viewsets.GenericViewSet,
                   mixins.ListModelMixin,
                   mixins.RetrieveModelMixin
                   ):
    queryset = Sanction.objects.all()
    serializer_class = SanctionSerializer


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
        search_query = request.GET.get('region')
        instance = Recommendation.objects.filter(region__region_name__iregex=search_query).values(
            'tnved__tnved_code', 'tnved__tnved_name', 'region__region_name')
        serializer = TopRecommendationSerializer(instance=instance, many=True)
        return Response(serializer.data)


class ExportToExelView(viewsets.GenericViewSet,
                       mixins.ListModelMixin,
                       mixins.RetrieveModelMixin
                       ):
    queryset = ExportToExel.objects.all()
    serializer_class = ExportToExelSerializer

    @swagger_auto_schema(
        responses=doc_get_exp_to_xls_resp)
    @action(methods=['GET'], detail=False, url_path='export-to-xls')
    def export_to_exel(self, request, *args, **kargs):
        code = request.query_params.get('code')
        region = request.query_params.get('region')
        if code:
            code_filter = f"and (ctc.tnved_code like '{code}%') "
        else:
            code_filter = ''

        if region:
            region_filter = f"and cr.region_name like '{region}' "
        else:
            region_filter = ''

        instance = ExportToExel().export_to_exel(code_filter, region_filter)
        serializer = ExportToExelSerializer(instance, many=True)
        return Response(serializer.data)






        # # export_value = 0
        # # clean_exp_imp = 0
        # # clean_exp_imp_del = 0
        # # main_partners = []
        # # customs_duties = 0
        # # sanctions = []
        # # potential_volume = 0
        # # del_import = 0
        # # rows = CustomData.objects.all().values_list('tnved', 'tnved__tnved_name', 'import_value', 'export_value',
        # #                                             'clean_exp_imp', 'clean_exp_imp_del', 'main_partners',
        # #                                             'customs_duties', 'sanctions', 'potential_volume', 'del_import')
        #
        # rows = [import_value]
        #
        # response = HttpResponse(content_type='application/ms-excel')
        # response['Content-Disposition'] = 'attachment; filename="test.xls"'
        #
        # wb = xlwt.Workbook(encoding='utf-8')
        # ws = wb.add_sheet('Test')
        #
        # row_num = 0
        #
        # font_style = xlwt.XFStyle()
        # font_style.font.bold = True
        #
        # # columns = ['tnved', 'tnved__tnved_name', 'объём импорта', 'объём экспорта', "чистый импорт/экспорт",
        # #            "Изменение чистого импорта", "Основные партнеры по импорту", "Таможенные пошлины на импорт",
        # #            "Наличие ограничений на импорт", "Потенциальный объем ниши", "Выбывающий импорт из-за санкций",
        # #            "Рост ниши за год"]
        # columns = ['объём импорта']
        #
        # for col_num in range(len(columns)):
        #     ws.write(row_num, col_num, columns[col_num], font_style)
        #
        # # Sheet body, remaining rows
        # font_style = xlwt.XFStyle()
        #
        # for row in rows:
        #     row_num += 1
        # for col_num in range(len(row)):
        #     ws.write(row_num, col_num, row[col_num], font_style)
        #
        # wb.save(response)
        #
        # return response
