import os
import requests
from bs4 import BeautifulSoup as BS
import pandas as pd
BASE_DIR = Path(__file__).resolve().parent.parent
def sanctions_parsing():
    
    """Это парсер для санкций. Для запуска нужно использовать функцию sanctions_parsing,
и все данные сохранятся в нужной директории, разделенные по странам"""
    
    r = requests.get(f'https://wto.ru/uchastnikam-ved-sanktsii/')
    html = BS(r.content, 'html.parser')

    table1 = html.find("table")

    headers = ['country_name', 'what_i_need', 'other']

    mydata = pd.DataFrame(columns=headers)

    for j in table1.find_all("tr")[:]:
        try:
            row_data = j.find_all("td")
            row = [i for i in row_data]
            length = len(mydata)
            mydata.loc[length] = row
        except:
            continue

    mydata['country_name'][0].text.replace("\n", "").replace("\t", "").replace("\xa0", "").strip()

    list_of_hrefs_html = mydata["what_i_need"]

    dict_of_hrefs = {}

    l = len(list_of_hrefs_html)
    
    
    
    for i in range(l):
        s = list_of_hrefs_html[i].p
        a = s.find("a").get("href")
        name = mydata['country_name'][i].text.replace("\n", "").replace("\t", "").replace("\xa0", "").strip()
        dict_of_hrefs[name] = a

    for name in dict_of_hrefs:
        href = dict_of_hrefs[name]
        res = requests.get(f'https://wto.ru{href}').content

        with open(f"{BASE_DIR}/preprocessing/custom_data/{year}/{code}/{name}_санкции.xlsx", 'wb') as file:
            file.write(res)

    return "Done"

if __name__ == "__main__":
    sanctions_parsing()
