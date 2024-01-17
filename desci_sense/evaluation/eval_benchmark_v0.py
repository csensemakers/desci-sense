"""Script to run evaluation of label prediction models.

Usage:
  eval_benchmark_v0.py [--config=<config>] [--dataset=<dataset>]


Options:
--config=<config>  Optional path to configuration file.
--dataset=<dataset> Optional path to table in wandb.

"""

import wandb
from pathlib import Path
import json
import pandas as pd
import sys
import os
import docopt
import re
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import precision_recall_fscore_support




sys.path.append(str(Path(__file__).parents[2]))

from desci_sense.demos.st_demo import init_model, load_config


#get a path to a wandb table and populate it in a pd data frame
def get_dataset(table_path):
    raw_data = json.load(table_path.open())

    #put it in a dataframe
    try:
        rows = [dict(zip(raw_data['columns'],raw_data['data'][i])) for i in range(len(raw_data["data"]))]
    except Exception as e:
        print(f"Exception occurred: {e}")



    df = pd.DataFrame(rows)
    return df

def pred_labels(df):
    
    model = init_model(config)
    for i in range(len(df['Text'])):
        print('in iteration',i)
        response = model.process_text({'text':df['Text'][i]})
        df['Predicted Label'][i] = response['answer']['multi_tag']
        df['Reasoning Steps'][i] = response['answer']['reasoning']
        print('Predicted Label: ',df['Predicted Label'][i])
    print(tuple(zip(df['Predicted Label'],df['True Label'])))
    
#values are returned as string, we want them as lists
def normalize_df(df):
    # Assuming each label is a single word and there are no spaces in labels
    # This will remove all non-word characters and split the string into words
    if type(df["True Label"][0])==str:
        df['True Label'] = df['True Label'].apply(lambda x: re.sub(r'\W+', ' ', x).split())

    # Replace empty list with an empty 'None' in 'Predicted label' TODO 
    #df['Predicted Label'] = df['Predicted Label'].apply(lambda x: 'None' if pd.isnull(x) else x)    
    #df['Predicted Label'] = df['Predicted Label'].apply(lambda x: re.sub(r'\W+', ' ', x).split())    

#assumes that the values on 'True Label' and 'Predicted Label' are lists 
def calculate_scores(df):
    #binarize for using skl scores
    # Assume df['True label'] and df['Predicted label'] are your true and predicted labels
    mlb = MultiLabelBinarizer()

    # Binarize the labels
    y_true = mlb.fit_transform(df['True Label'])

    #refine prediction word list to contain only allowed labels defined by all true labels
    df['Predicted Label'] = df['Predicted Label'].apply(lambda x: [label for label in x if label in mlb.classes_])
    y_pred = mlb.transform(df['Predicted Label']) 

    #calculate scores
    # Calculate precision, recall, f1_score, support
    precision, recall, f1_score, support = precision_recall_fscore_support(y_true, y_pred, average='samples')

    print('Precision: ', precision)
    print('Recall: ', recall)
    print('F1 score: ', f1_score)
    print('Support: ', support)

    return precision,recall,f1_score,support
#def create_evaluation_artifact(df,)
      
arguments = docopt.docopt(__doc__)
#tqdm on prediction for loop
# initialize config
config_path = arguments.get('--config')
config = load_config(config_path)

# initialize table path

wandb.login()

api = wandb.Api()

run = wandb.init(project="testing",job_type="evaluation")

dataset_artifact_id = "common-sense-makers/testing/labeled_data_v0:latest"

dataset_artifact = run.use_artifact(dataset_artifact_id)

# initialize table path
#add the option to call table_path =  arguments.get('--dataset')

#download path to table
a_path = dataset_artifact.download()
table_path = Path(f"{a_path}/labeled_data_table.table.json")

#return the pd df from the table
df = get_dataset(table_path)

pred_labels(df)

#make sure df can be binarized
normalize_df(df)



precision,recall,f1_score,support = calculate_scores(df)

#Create the evaluation artifact
artifact = wandb.Artifact("prediction_evaluation", type="evaluation")

# Create a wandb.Table from the Pandas DataFrame
table = wandb.Table(dataframe=df)

# Add the wandb.Table to the artifact
artifact.add(table, "prediction_evaluation")

#add the scores as metadata
artifact.metadata.update({'Precision': precision, 'Recall':recall, 'F1 score': f1_score})

# model_info is your model metadata
run.config.update(config) 

#log scores as summary of the run
#note that the scores are actually calculated in the cells above.
run.summary["precision"] = precision
run.summary["recall"] = recall
run.summary["f1_score"] = f1_score


# Log the artifact
wandb.log_artifact(artifact, aliases=["latest"])

wandb.run.finish()