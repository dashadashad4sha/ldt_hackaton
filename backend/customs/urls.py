from rest_framework.routers import DefaultRouter

from customs import views


router = DefaultRouter()
router.register('unit', views.UnitView, basename='unit')
router.register('region', views.RegionView, basename='region')
router.register('country', views.CountryView, basename='country')
router.register('federal-district', views.FederalDistrictView, basename='federal_district')

urlpatterns = router.urls
