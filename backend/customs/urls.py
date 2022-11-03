from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('unit', views.UnitView, basename='unit')
router.register('region', views.RegionView, basename='region')
router.register('country', views.CountryView, basename='country')
router.register('federal-district', views.FederalDistrictView, basename='federal_district')
router.register('custom-data', views.CustomDataView, basename='custom-data')
router.register('sanction', views.SanctionView, basename='sanction')
router.register('recommendation', views.RecommendationView, basename='recommendation')
# router.register('export-to-exel', views.ExportToExelView, basename='export-to-exel')
urlpatterns = router.urls
