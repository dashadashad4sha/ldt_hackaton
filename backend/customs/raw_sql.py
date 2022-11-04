import_value = ("select coalesce(round(sum(cc.price) / 1e3, 2), 0) \n"
                "from customs_customdata cc \n"
                "join customs_customtnvedcode ctc \n"
                "on cc.custom_data_tnved_id = ctc.tnved_id \n"
                "join customs_region cr \n"
                "on cc.custom_data_region_id = cr.region_id \n"
                "where cc.direction like 'И' \n"
                "and ctc.tnved_code like %s \n"
                "and cr.region_name like %s \n"
                "and (cc.period between '2019-01-01' and '2021-12-31');")

export_value = ("select coalesce(round(sum(cc.price) / 1e3, 2), 0) \n"
                "from customs_customdata cc \n"
                "join customs_customtnvedcode ctc \n"
                "on cc.custom_data_tnved_id = ctc.tnved_id \n"
                "join customs_region cr \n"
                "on cc.custom_data_region_id = cr.region_id \n"
                "where cc.direction like 'Э' \n"
                "and ctc.tnved_code like %s \n"
                "and cr.region_name like %s \n"
                "and (cc.period between '2019-01-01' and '2021-12-31');")