import csv
from pathlib import PurePath

from django.core.management.base import BaseCommand
from customs.models import Unit, Country, FederalDistrict, Region
from django.conf import settings

BASE_DIR = settings.BASE_DIR


class Command(BaseCommand):
    help = 'command for load custom data'

    def add_arguments(self, parser):
        parser.add_argument(
            '-f',
            '--file',
            help='path to file'
        )
        parser.add_argument(
            '-t',
            '--table',
            help='specify table',
            choices=('unit', 'country', 'federal_district', 'region')
        )

    def handle(self, *args, **options):
        tables = {
            'unit': Unit,
            'country': Country,
            'federal_district': FederalDistrict,
            'region': Region,
        }

        table = tables.get(options['table'])

        file_path = PurePath(options['file'])

        if not file_path.is_absolute():
            file_path = BASE_DIR.joinpath(file_path)
        with open(file_path, 'r') as f_in:
            csv_reader = csv.reader(f_in, delimiter=',')
            header = csv_reader.__next__()
            if options['table'] == 'unit':
                for rec in csv_reader:
                    table.objects.create(
                        unit_id=rec[0],
                        unit_code=rec[1],
                        unit_name=rec[2]
                    )
            elif options['table'] == 'country':
                for rec in csv_reader:
                    table.objects.create(
                        country_id=rec[0],
                        country_name=rec[1],
                        country_block=rec[2]
                    )
            elif options['table'] == 'federal_district':
                for rec in csv_reader:
                    table.objects.create(
                        federal_district_id=rec[0],
                        federal_district_code=rec[1],
                        federal_district_name=rec[2]
                    )
            elif options['table'] == 'region':
                for rec in csv_reader:
                    federal_district = FederalDistrict.objects.get(federal_district_id=rec[3])
                    table.objects.create(
                        region_id=rec[0],
                        region_code=rec[1],
                        region_name=rec[2],
                        federal_district=federal_district
                    )

        self.stdout.write('finished loading')
