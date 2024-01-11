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

    rows = []
    i = 0
    exception = 1
    while exception:
        try:
            #assume x<y
            row_d = dict(zip(["Text",'True Label'],
                            [raw_data["data"][i][x],raw_data["data"][i][y]]))
            #print(row_d)
            rows.append(row_d)
            i=i+1
            exception = 1
        except:
            print("exceprion")
            exception = 0


    df = pd.DataFrame(rows)
    return df

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