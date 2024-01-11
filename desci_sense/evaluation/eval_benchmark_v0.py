import wandb
from pathlib import Path
import json
import pandas as pd

#A function that get's a path to a wandb table and returns it as pd df
# restricted to the "Text" and "True label" fields.
def a_table_into_df(table_path):
    raw_data = json.load(table_path.open())

    #put it in a dataframe
    x = raw_data["columns"].index('Text')
    y = raw_data["columns"].index('True Label')

    try:
        rows = [{'Text': raw_data["data"][i][x], 'True Label': raw_data["data"][i][y]} for i in range(len(raw_data["data"]))]
    except Exception as e:
        print(f"Exception occurred: {e}")



    df = pd.DataFrame(rows)
    return df

def text_label_pred_eval(df,config:dict):
    

#artifact path
path = "common-sense-makers/testing/labeled_data_v0:v4"

wandb.login()

api = wandb.Api()
artifact = api.artifact(path)

#get path to table
a_path = artifact.download()
table_path = Path(f"{a_path}/labeled_data_table.table.json")

#return the pd df from the table
df = a_table_into_df(table_path)
print(df)