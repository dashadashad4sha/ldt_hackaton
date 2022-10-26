# pip install pandas
# pip install bs4
# pip install requeats

import requests
from bs4 import BeautifulSoup as BS
import pandas as pd

# получаем html код таблицы
r = requests.get(f'https://wto.ru/uchastnikam-ved-sanktsii/')
html = BS(r.content, 'html.parser')

table1 = html.find("table")

# получаем заголовки
headers = ['country_name', 'what_i_need', 'other']

mydata = pd.DataFrame(columns = headers)
for j in table1.find_all("tr")[:]:
    try:
        row_data = j.find_all("td")
        row = [i for i in row_data]
        length = len(mydata)
        mydata.loc[length] = row
    except:
        continue

        
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
  res = requests.get(f'https://wto.ru/uchastnikam-ved-sanktsii{href}').content
  with open(f"{name}_санкции.xlsx", 'wb') as file:
    file.write(res)
