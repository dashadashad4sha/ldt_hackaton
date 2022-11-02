import csv
import datetime
from itertools import islice
from decimal import Decimal
from pathlib import PurePath

from django.core.management.base import BaseCommand
from django.db import models

from customs.models import Unit, Country, FederalDistrict, Region, CustomTnvedCode, Sanction, CustomData, Recommendation
from django.conf import settings

BASE_DIR = settings.BASE_DIR


# def gen_chunks(reader, chunk_size=100):
#     """
#     Chunk generator. Take a CSV `reader` and yield
#     `chunksize` sized slices.
#     """
#     chunk = []
#     for i, line in enumerate(reader):
#         if i % chunk_size == 0 and i > 0:
#             yield chunk
#             del chunk[:]  # or: chunk = []
#         chunk.append(line)
#     yield chunk


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
            choices=('unit', 'country', 'federal_district', 'region', 'tnved_code', 'sanction', 'customs_data',
                     'recommendation',)
        )

    def handle(self, *args, **options):
        tables = {
            'unit': Unit,
            'country': Country,
            'federal_district': FederalDistrict,
            'region': Region,
            'tnved_code': CustomTnvedCode,
            'sanction': Sanction,
            'customs_data': CustomData,
            'recommendation': Recommendation
        }

        table: models.Model = tables.get(options['table'])

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
            elif options['table'] == 'tnved_code':
                for rec in csv_reader:
                    table.objects.create(
                        tnved_id=rec[0],
                        tnved_code=rec[1],
                        tnved_name=rec[2],
                        tnved_fee=rec[3]
                    )
            elif options['table'] == 'sanction':
                for rec in csv_reader:
                    country = Country.objects.get(country_id=rec[2])
                    tnved = CustomTnvedCode.objects.get(tnved_id=rec[3])
                    table.objects.create(
                        sanction_id=rec[0],
                        direction=rec[1],
                        country=country,
                        tnved=tnved
                    )
            elif options['table'] == 'customs_data':
                items = (CustomData(
                        tnved=CustomTnvedCode.objects.get(tnved_id=rec[7]),
                        direction=rec[0],
                        country=Country.objects.get(country_id=rec[6]),
                        period=rec[1],
                        region=Region.objects.get(region_id=rec[5]),
                        unit=Unit.objects.get(unit_id=rec[8]),
                        price=Decimal(rec[2].replace(',', '.')),
                        volume=Decimal(rec[3].replace(',', '.')),
                        quantity=Decimal(rec[4].replace(',', '.')),
                    ) for rec in csv_reader)
                while True:
                    batch = list(islice(items, 100000))
                    if not batch:
                        break
                    CustomData.objects.bulk_create(batch, 100000)


                # for chunk in gen_chunks(csv_reader, 100000):
                #     print(datetime.datetime.now().strftime('%Y:%d:%m %H:%M:%S'))
                #     items = [CustomData(
                #         tnved=CustomTnvedCode.objects.get(tnved_id=rec[7]),
                #         direction=rec[0],
                #         country=Country.objects.get(country_id=rec[6]),
                #         period=rec[1],
                #         region=Region.objects.get(region_id=rec[5]),
                #         unit=Unit.objects.get(unit_id=rec[8]),
                #         price=Decimal(rec[2].replace(',', '.')),
                #         volume=Decimal(rec[3].replace(',', '.')),
                #         quantity=Decimal(rec[4].replace(',', '.')),
                #     ) for rec in chunk]
                #     CustomData.objects.bulk_create(items)
                #     print(datetime.datetime.now().strftime('%Y:%d:%m %H:%M:%S'))
            elif options['table'] == 'recommendation':
                for rec in csv_reader:
                    Recommendation.objects.create(
                        recommendation_id=rec[0],
                        tnved=CustomTnvedCode.objects.get(tnved_id=rec[1]),
                        region=Region.objects.get(region_id=rec[2])
                    )
        self.stdout.write('finished loading')
