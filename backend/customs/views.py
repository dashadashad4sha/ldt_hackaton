from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from django.db.models import Sum
from rest_framework.response import Response

from django.db.models import Q

from .models import Unit, Region, Country, CustomTnvedCode, FederalDistrict, CustomData, Recommendation, Sanction
from .serializers import UnitSerializer, RegionSerializer, CountrySerializer, FederalDistrictSerializer, \
    TnvedCodeSerializer, CustomDataSerializer, SanctionSerializer, RecommendationSerializer, \
    TopRecommendationSerializer, CustomDataChartSerializer

doc_get_top_recommendation_resp = {
    status.HTTP_200_OK: TopRecommendationSerializer(many=True)
}

doc_get_customdata_chart = {
    status.HTTP_200_OK: CustomDataChartSerializer(many=True)
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

            serializer = CustomDataChartSerializer(instance, many=True)
            return Response(serializer.data)

        else:
            instance = CustomData.objects.filter(Q(direction='И') & (
                    Q(tnved__tnved_name__iregex=search_query_tnved_name) | Q(
                tnved__tnved_code=search_query_tnved_code))).values(
                'period', 'tnved__tnved_code', 'tnved__tnved_name').annotate(volume=Sum('price'))

            serializer = CustomDataChartSerializer(instance, many=True)
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
