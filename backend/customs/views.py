from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from django.db.models import Sum
from rest_framework.response import Response

from customs.models import Unit, Region, Country, CustomTnvedCode, FederalDistrict, CustomData, Recommendation, Sanction
from customs.serializers import UnitSerializer, RegionSerializer, CountrySerializer, FederalDistrictSerializer, \
    TnvedCodeSerializer, CustomDataSerializer, SanctionSerializer, RecommendationSerializer, TopRecommendationSerializer


doc_get_top_recommendation_resp = {
    status.HTTP_200_OK: TopRecommendationSerializer(many=True)
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

    @action(methods=['GET'], detail=False, url_path='chart/import')
    def import_char(self, request, *args, **kwargs):
        queryset = CustomData.objects.filter(direction='И')


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

    @swagger_auto_schema(operation_id='config',
                         responses=doc_get_top_recommendation_resp)
    @action(methods=['GET'], detail=False, url_path='top')
    def top_recommendation(self, request, *args, **kargs):
        instance = Recommendation.objects.prefetch_related('region').filter(region__region_name='Москва').values(
            'tnved__tnved_code', 'tnved__tnved_name')
        serializer = TopRecommendationSerializer(instance=instance, many=True)
        return Response(serializer.data)


