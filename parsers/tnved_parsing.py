import os

import requests
from bs4 import BeautifulSoup as BS
import pandas as pd


def tnved_parsing():

    res = requests.get(f'https://economy.gov.ru/material/file/08d71eb4ee2c8160078d51700e7454bb/%D0%A2%D0%9D%D0%92%D0%AD%D0%94_%D0%9E%D0%9A%D0%9F%D0%942.xlsx').content
    os.chdir(r'/ldt_hackaton-backend/preprocessing/tnved_data')
    with open(f"Коды_тнвэд_окпдэ.xlsx", 'wb') as file:
        file.write(res)


# tnved_parsing()
