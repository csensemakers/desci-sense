"""Script to run evaluation of label prediction models.

Usage:
  eval_benchmark_v0.py [--config=<config>] [--dataset=<dataset>] [--file=<file>]


Options:
--config=<config>  Optional path to configuration file.
--dataset=<dataset> Optional path to a wandb artifact.
--file=<file> Optional file name e.g. labeled_dataset.table.json indeed it should be a table.json format

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
from sklearn.metrics import precision_recall_fscore_support, accuracy_score, multilabel_confusion_matrix




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

    #calculate accuracy
    accuracy = accuracy_score(y_pred=y_pred,y_true=y_true)

    # Calculate the confusion matrix using sklearn for each class/label
    cms = multilabel_confusion_matrix(y_true, y_pred)

    # Get class labels
    labels = mlb.classes_

    return precision,recall,f1_score,support,accuracy, labels, cms
#def create_evaluation_artifact(df,)
      
arguments = docopt.docopt(__doc__)
#tqdm on prediction for loop
# initialize config
config_path = arguments.get('--config')
dataset_path = arguments.get('--dataset')
file_name = arguments.get('--file')
config = load_config(config_path)

# initialize table path

wandb.login()

api = wandb.Api()

run = wandb.init(project="evaluation_benchmark",job_type="evaluation")

#get artifact path
if dataset_path:
    dataset_artifact_id = dataset_path
else:
    dataset_artifact_id = 'common-sense-makers/evaluation_benchmark/dataset_for_eval:latest'

#set artifact as input artifact
dataset_artifact = run.use_artifact(dataset_artifact_id)

# initialize table path
#add the option to call table_path =  arguments.get('--dataset')

#download path to table
a_path = dataset_artifact.download()

#get file name
if file_name:
    table_path = Path(f"{a_path}/{file_name}")
else:
    table_path = Path(f"{a_path}/labeled_data.table.json")

#return the pd df from the table
df = get_dataset(table_path)

pred_labels(df)

#make sure df can be binarized
normalize_df(df)



precision,recall,f1_score,support,accuracy, labels, cms = calculate_scores(df)

#Create the evaluation artifact
artifact = wandb.Artifact("prediction_evaluation", type="evaluation")

# Create a wandb.Table from the Pandas DataFrame
table = wandb.Table(dataframe=df)

# Add the wandb.Table to the artifact
artifact.add(table, "prediction_evaluation")

#meta data and scores to log
meta_data = {
    'dataest_size':len(df),
    'precision':precision,
    'recall':recall,
    'f1_score':f1_score,
    'accuracy':accuracy
    }

#add the scores as metadata
artifact.metadata.update(meta_data)

# model_info is your model metadata
run.config.update(config) 

# Log the confusion matrices to wandb
for label, cm in zip(labels, cms):
    wandb.log({f"confusion_matrix_{label}": wandb.plots.HeatMap(
        ["False", "True"], 
        ["False", "True"], 
        cm, 
        show_text=True
    )})

#log scores as summary of the run
#note that the scores are actually calculated in the cells above.
run.summary.update(meta_data)


# Log the artifact
wandb.log_artifact(artifact, aliases=["latest"])

wandb.run.finish()