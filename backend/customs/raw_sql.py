main_customs_partner = raw_sql = """with top_countries as (
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
