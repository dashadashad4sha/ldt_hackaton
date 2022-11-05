main_customs_partner = ("with top_countries as (\n"
                        "    select ccd.custom_data_country_id \n"
                        "     from customs_customdata ccd \n"
                        "     group by 1\n"
                        "     order by sum(ccd.price) desc\n"
                        "     limit 15)\n"
                        "     select cc.country_name as \"country\", round((sum(ccd.price) / 1e6), 2) as \"volume_of_trade\"\n"
                        "     from customs_customdata ccd \n"
                        "     left join customs_country cc\n"
                        "     on ccd.custom_data_country_id = cc.country_id\n"
                        "     where ccd.custom_data_country_id in (select * from top_countries)\n"
                        "     group by 1\n"
                        "     union \n"
                        "     select 'Остальные страны', round((sum(ccd.price) / 1e6), 2)\n"
                        "     from customs_customdata ccd \n"
                        "     where ccd.custom_data_country_id not in (select * from top_countries)\n"
                        "     order by 2 desc;")

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

sanction_goods_volume_by_region: str = ("with all_filters_data as (\n"
                                   "select ctc.tnved_code, cc.price, coalesce(cs.sanction_id, -1) sanction_id\n"
                                   "from customs_customdata cc\n"
                                   "join customs_customtnvedcode ctc\n"
                                   "on cc.custom_data_tnved_id = ctc.tnved_id \n"
                                   "join customs_region cr \n"
                                   "on cc.custom_data_region_id = cr.region_id \n"
                                   "left join customs_sanction cs  \n"
                                   "on cc.custom_data_tnved_id = cs.sanction_tnved_id and cc.custom_data_country_id = cs.sanction_country_id and cc.direction = cs.direction \n"
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
                                   "select si.tnved_code code, si.sanction_sum sanction_sum, nsi.non_sanction_sum non_sanction_sum\n"
                                   "from sanctions_import si\n"
                                   "join non_sanctions_import nsi\n"
                                   "on si.tnved_code = nsi.tnved_code;")


clear_import = ("with all_filters_data as (\n"
                "select cc.\"period\", cc.price, cc.direction\n"
                "from customs_customdata cc\n"
                "join customs_customtnvedcode ctc\n"
                "on cc.custom_data_tnved_id = ctc.tnved_id \n"
                "join customs_region cr \n"
                "on cc.custom_data_region_id = cr.region_id \n"
                "{}\n"
                "	  {}\n"
                "	   {}),\n"
                "tnved_import as (\n"
                "select afd.period, round((sum(afd.price) / 1e3), 2) as tnved_import\n"
                "from all_filters_data afd\n"
                "where afd.direction like 'И'\n"
                "group by 1),\n"
                "tnved_export as (\n"
                "select afd.period, round((sum(afd.price) / 1e3), 2) as tnved_export\n"
                "from all_filters_data afd\n"
                "where afd.direction like 'Э'\n"
                "group by 1),\n"
                "all_dates as (\n"
                "select distinct cc.period \n"
                "from customs_customdata cc\n"
                "where cc.period between '2019-01-01' and '2019-12-31'\n"
                ")\n"
                "select ad.period as date, (coalesce(ti.tnved_import, 0) - coalesce(te.tnved_export, 0)) as import_volume \n"
                "from tnved_import ti\n"
                "full join tnved_export te\n"
                "on ti.period=te.period\n"
                "right join all_dates ad\n"
                "on ti.period=ad.period\n"
                "order by 1;")


ananytic_three = ("with all_import as (select coalesce(round(sum(cc.price) / 1e3, 2), 0) import_tnved\n"
                  "from customs_customdata cc\n"
                  "join customs_customtnvedcode ctc\n"
                  "on cc.custom_data_tnved_id = ctc.tnved_id \n"
                  "join customs_region cr \n"
                  "on cc.custom_data_region_id = cr.region_id \n"
                  "where "
                  "cc.direction like 'И'"
                  "{}\n"
                  "	{}\n"
                  "	 {}\n"
                  "	   ),\n"
                  "all_export as (select coalesce(round(sum(cc.price) / 1e3, 2), 0) export_tnved\n"
                  "from customs_customdata cc\n"
                  "join customs_customtnvedcode ctc\n"
                  "on cc.custom_data_tnved_id = ctc.tnved_id \n"
                  "join customs_region cr \n"
                  "on cc.custom_data_region_id = cr.region_id \n"
                  "where "
                  "cc.direction like 'Э'"
                  "{}\n"
                  "	 {} \n"
                  "	   {}\n"
                  "	   )\n"
                  "select ai.import_tnved - ae.export_tnved as net_import\n"
                  "from all_import ai, all_export ae;")


analytic_four = ("with import_2021 as (select coalesce(round(sum(cc.price) / 1e3, 2), 1e-3) imp_2021\n"
                 "from customs_customdata cc\n"
                 "join customs_customtnvedcode ctc\n"
                 "on cc.custom_data_tnved_id = ctc.tnved_id \n"
                 "join customs_region cr \n"
                 "on cc.custom_data_region_id = cr.region_id \n"
                 "where (cc.direction like 'И'\n"
                 "and cc.period between '2021-01-01' and '2021-12-31') \n"
                 "	   {} \n"
                 "	   {}\n"
                 "	   ),\n"
                 "import_2020 as (select coalesce(round(sum(cc.price) / 1e3, 2), 1e-3) imp_2020\n"
                 "from customs_customdata cc\n"
                 "join customs_customtnvedcode ctc\n"
                 "on cc.custom_data_tnved_id = ctc.tnved_id \n"
                 "join customs_region cr \n"
                 "on cc.custom_data_region_id = cr.region_id \n"
                 "where (cc.period between '2020-01-01' and '2020-12-31') and \n"
                 "cc.direction like 'И'\n"
                 "	   {}\n"
                 "	   {}\n"
                 "	   )\n"
                 "select round((	i1.imp_2021 / i0.imp_2020 - 1) * 100, 2) as import_growth\n"
                 "from import_2021 i1, import_2020 i0;")
