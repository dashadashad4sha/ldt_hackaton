# pip install pandas
# pip install bs4
# pip install requeats

import requests
from bs4 import BeautifulSoup as BS
import pandas as pd

# получаем html код таблицы
r = requests.get(f'https://www.alta.ru/tnved/forbidden_codes/')
html = BS(r.content, 'html.parser')

table1 = html.find("div", class_="responsive-table")

# получаем заоловки с сайта
headers = []
for i in table1.find_all("th"):
    title = i.text
    headers.append(title)


headers[-1] = "Направление"

# Можно сделать по-другому:
# headers = ["code", "english_name", "russian_name", "country", "import_or_export"]

# заполняем наш датафрейм

mydata = pd.DataFrame(columns = headers)

for j in table1.find_all("tr")[1:]:
    try:
        row_data = j.find_all("td")
        row = [i.text for i in row_data]
        length = len(mydata)
        mydata.loc[length] = row
    except:
        continue

        
# скачиваем файл, если надо.
# mydata.to_csv(r"sanctions.csv", index=False)
