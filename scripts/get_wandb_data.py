"""Script to download and process the data stored on wandb by the streamlit Nanopubbot app.

Usage:
  get_wandb_data.py [--projects=<projects> --outpath=<outpath>]
  get_wandb_data.py (-h | --help)


Options:
  -h --help     Show this screen.
  --projects=<projects>  wandb projects to save data from, seperated by commas [default: st_demo-v0.2].
  --outpath=<outpath>  path to file to save data to [default: etc/data/st_data.csv].

"""

from pathlib import Path
import json
from docopt import docopt
import pandas as pd
import wandb
from tqdm import tqdm


TYPE = "prediction"

def parse_projects(projects_string):
    return projects_string.split(',')

def get_artifacts_from_proj(wandb_api, project_name: str):
    # get all artifacts from specified project
    artifacts = []
    collections = [
        coll for coll in wandb_api.artifact_type(type_name=TYPE, project=project_name).collections()
    ]


    for coll in collections:
        for artifact in coll.versions():
            artifacts += [artifact]
        
    return artifacts


def load_data_from_artifacts(artifacts):
    # load predictions data from artifacts and return joined data as DataFrame
    rows = []
    cols = None
    for artifact in tqdm(artifacts, total=len(artifacts)):
        a_path = artifact.download()
        table_path = Path(f"{a_path}/predictions.table.json")
        raw_data = json.load(table_path.open())
        if not cols:
            cols = raw_data["columns"]
        else:
            assert cols == raw_data["columns"]

        # add wandb name to identify each artifact    
        row = raw_data["data"][0] + [artifact.name]
        rows += [row]

    # add column for wandb name
    cols += ["wandb name"]

    df = pd.DataFrame(data=rows, columns=cols)

    return df

if __name__ == "__main__":

    arguments = docopt(__doc__, version='Wandb Collector 0.1')

    projects_string = arguments.get('--projects')
    projects_list = parse_projects(projects_string)
    print("Collect data from projects: ", projects_list)
    
    out_path = Path(arguments.get("--outpath"))
    print(f"Making output dirs to path {str(out_path)}")
    out_path.parent.mkdir(parents=True,exist_ok=True)

    api = wandb.Api()

    all_artifacts = []
    for project in projects_list:
        artifacts = get_artifacts_from_proj(api, project)
        all_artifacts += artifacts
    
    df = load_data_from_artifacts(all_artifacts)
    
    print("Saving output...")
    df.to_csv(str(out_path))
    
    print("Done!")


    


