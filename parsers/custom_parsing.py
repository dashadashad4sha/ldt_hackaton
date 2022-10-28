import requests
from bs4 import BeautifulSoup as BS
import os, sys

def custom_parsing(cods_of_states, year):
    """parsng of customs statistics.
    files push to idt_hackaton/preprocessing/custom_data/{code_of_region}/DATTSVT.xlsx"""

    for code in cods_of_states:
        try:
            r = requests.get("http://stat.customs.gov.ru/api/DataAnalysis/CalcEstimatedUnloadSize", params={
                "exportType":"Csv",
                 "tnved":[],
                 "tnvedLevel":10,
                 "federalDistricts":[],
                 "subjects":[f"{code}"],
                 "direction":"",
                 "period":[{"start":f"{year - 1}-12-31","end":f"{year}-12-31"}]
                 }).content
            # r = requests.get(r) # поскольку не работает, я не знаю нужно это или нет
            os.mkdir(f"/ldt_hackaton-backend/preprocessing/custom_data/{year}/{code}") # изменяйте в этих двух строчках на то, что надо
            with open(f"/ldt_hackaton-backend/preprocessing/custom_data/{year}/{code}/DATTSVT.xlsx", 'wb') as file:
                file.write(r)
        except:
         continue


coded = ['01000',
 '03000',
 '04000',
 '05000',
 '07000',
 '08000',
 '10000',
 '11000',
 '11100',
 '12000',
 '14000',
 '15000',
 '17000',
 '18000',
 '19000',
 '20000',
 '22000',
 '24000',
 '25000',
 '26000',
 '27000',
 '28000',
 '29000',
 '30000',
 '32000',
 '33000',
 '34000',
 '35000',
 '36000',
 '37000',
 '38000',
 '40000',
 '41000',
 '42000',
 '44000',
 '45000',
 '46000',
 '47000',
 '49000',
 '50000',
 '52000',
 '53000',
 '54000',
 '56000',
 '57000',
 '58000',
 '60000',
 '61000',
 '63000',
 '64000',
 '65000',
 '66000',
 '67000',
 '68000',
 '69000',
 '70000',
 '71000',
 '71100',
 '71140',
 '73000',
 '75000',
 '76000',
 '77000',
 '78000',
 '79000',
 '80000',
 '81000',
 '82000',
 '83000',
 '84000',
 '85000',
 '86000',
 '87000',
 '88000',
 '89000',
 '90000',
 '91000',
 '92000',
 '93000',
 '94000',
 '95000',
 '96000',
 '97000',
 '98000',
 '99000']
year = 2021

if __name__ == "__main__":
    custom_parsing(coded, year)
