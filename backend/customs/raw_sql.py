main_customs_partner = """with top_countries as (
    select ccd.custom_data_country_id 
     from customs_customdata ccd 
     group by 1
     order by sum(ccd.price) desc
     limit 15)
     select cc.country_name as "country", round((sum(ccd.price) / 1e6), 2) as "volume_of_trade"
     from customs_customdata ccd 
     left join customs_country cc
     on ccd.custom_data_country_id = cc.country_id
     where ccd.custom_data_country_id in (select * from top_countries)
     group by 1
     union 
     select 'Остальные страны', round((sum(ccd.price) / 1e6), 2)
     from customs_customdata ccd 
     where ccd.custom_data_country_id not in (select * from top_countries)
     order by 2 desc;"""

import_export_by_tnved = ("with all_filters_data as ( "
                          "select cc.period, cc.price, cc.direction "
                          "from customs_customdata cc "
                          "join customs_customtnvedcode ctc "
                          "on cc.custom_data_tnved_id = ctc.tnved_id "
                          "join customs_region cr "
                          "on cc.custom_data_region_id = cr.region_id "
                          "join customs_country ccn "
                          "on cc.custom_data_country_id = ccn.country_id "
                          "{}"
                          "	  {}"
                          "	   {}"
                          "	   {}), "
                          "tnved_import as ( "
                          "select afd.period, round((sum(afd.price) / 1e3), 2) as tnved_import "
                          "from all_filters_data afd "
                          "where afd.direction like 'И' "
                          "group by 1), "
                          "tnved_export as ( "
                          "select afd.period, round((sum(afd.price) / 1e3), 2) as tnved_export "
                          "from all_filters_data afd "
                          "where afd.direction like 'Э' "
                          "group by 1), "
                          "all_dates as ( "
                          "select distinct cc.period "
                          "from customs_customdata cc "
                          " {} "
                          ") "
                          "select ad.period as date, "
                          "	   coalesce(ti.tnved_import, 0) as import_value, "
                          "	   coalesce(te.tnved_export, 0) as export_value "
                          "from tnved_import ti "
                          "full join tnved_export te "
                          "on ti.period=te.period "
                          "right join all_dates ad "
                          "on ti.period=ad.period "
                          "order by 1;")


customs_partner_by_tnved = (
                            "with all_filters_data as (\n"
                            "select cc.price, cc.direction, ccn.country_name\n"
                            "from customs_customdata cc\n"
                            "join customs_customtnvedcode ctc\n"
                            "on cc.custom_data_tnved_id = ctc.tnved_id\n"
                            "join customs_region cr\n"
                            "on cc.custom_data_region_id = cr.region_id\n"
                            "join customs_country ccn\n"
                            "on cc.custom_data_country_id = ccn.country_id\n"
                            "{}\n"
                            "	  {}\n"
                            "	   {}),\n"
                            "all_import as (\n"
                            "select afd.country_name, round((sum(afd.price) / 1e3), 2) as tnved_import\n"
                            "from all_filters_data afd\n"
                            "where afd.direction like 'И'\n"
                            "group by 1),\n"
                            "all_export as (\n"
                            "select afd.country_name, round((sum(afd.price) / 1e3), 2) as tnved_export\n"
                            "from all_filters_data afd\n"
                            "where afd.direction like 'Э'\n"
                            "group by 1)\n"
                            "select distinct afd.country_name as \"country\",\n"
                            "		   coalesce(ai.tnved_import, 0) as \"import_volume\",\n"
                            "		   coalesce(ae.tnved_export, 0) as \"export_volume\",\n"
                            "		   coalesce(ai.tnved_import, 0) + coalesce(ae.tnved_export, 0) as trade_volume\n"
                            "from all_filters_data afd\n"
                            "left join all_import ai\n"
                            "on afd.country_name = ai.country_name\n"
                            "left join all_export ae\n"
                            "on afd.country_name = ae.country_name\n"
                            "order by 4 desc;"
                            )

sanction_goods_volume_by_region = ("with all_filters_data as (\n"
                                   "select ctc.tnved_code, cc.price, coalesce(cs.sanction_id, -1) sanction_id\n"
                                   "from customs_customdata cc\n"
                                   "join customs_customtnvedcode ctc\n"
                                   "on cc.custom_data_tnved_id = ctc.tnved_id \n"
                                   "join customs_region cr \n"
                                   "on cc.custom_data_region_id = cr.region_id \n"
                                   "left join customs_sanction cs  \n"
                                   "on cc.custom_data_tnved_id = cs.sanction_tnved_id and cc.custom_data_country_id = cs.country_id and cc.direction = cs.direction \n"
                                   "where cc.direction like 'И'"
                                   " {} \n"
                                   "	  {}\n"
                                   "),\n"
                                   "sanctions_import as (\n"
                                   "select afd.tnved_code, sum(afd.price) sanction_sum\n"
                                   "from all_filters_data afd\n"
                                   "where sanction_id <> -1\n"
                                   "group by 1),\n"
                                   "non_sanctions_import as (\n"
                                   "select afd.tnved_code, sum(afd.price) non_sanction_sum\n"
                                   "from all_filters_data afd\n"
                                   "where sanction_id = -1\n"
                                   "group by 1)\n"
                                   "select si.tnved_code tnved_code, si.sanction_sum sanction_sum, nsi.non_sanction_sum non_sanction_sum\n"
                                   "from sanctions_import si\n"
                                   "join non_sanctions_import nsi\n"
                                   "on si.tnved_code = nsi.tnved_code;")
