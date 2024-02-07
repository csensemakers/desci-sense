from typing import List, Dict
import pandas as pd
from notion_client import Client

from desci_sense.configs import environ

def load_ontology_from_config(config):
    # use keys if passed in config or otherwise take from environment settings.
    db_id = config["ontology"].get("notion_db_id", None)
    if not db_id:
        db_id = environ["NOTION_SENSEBOT_DB"] | None
    if not db_id:
        raise IOError("missing notion_db_id - must be set either in config or environment settings")
    ontology = NotionOntologyBase(versions=config["ontology"]["versions"], notion_db_id=db_id)
    return ontology


def create_df_from_notion_db(raw_notion_db) -> pd.DataFrame:
    """ Load raw notion db representing ontology into a Dataframe"""
    data = []
    for row in raw_notion_db:
        data_row = {
            "Name": row["properties"]["Name"]["title"][0]["plain_text"] if row["properties"]["Name"]["title"] else None,
            "display_name": row["properties"]["display_name"]["rich_text"][0]["plain_text"] if row["properties"]["display_name"]["rich_text"] else None,
            "URI": row["properties"]["URI"]["url"],
            "label": row["properties"]["label"]["rich_text"][0]["plain_text"] if row["properties"]["label"]["rich_text"] else None,
            "prompt": row["properties"]["prompt"]["rich_text"][0]["plain_text"] if row["properties"]["prompt"]["rich_text"] else None,
            "notes": row["properties"]["notes"]["rich_text"][0]["plain_text"] if row["properties"]["notes"]["rich_text"] else None,
            "valid_subject_types": [item["name"] for item in row["properties"]["valid_subject_types"]["multi_select"]],
            "valid_object_types": [item["name"] for item in row["properties"]["valid_object_types"]["multi_select"]],
            "versions": [tag["name"] for tag in row["properties"]["versions"]["multi_select"]]
        }
        data.append(data_row)


    # Create a DataFrame
    df = pd.DataFrame(data)

    # Set 'Name' as the index of the DataFrame
    df.set_index('Name', inplace=True)

    return df

def filter_ontology_by_version(ont_df: pd.DataFrame, allowed_versions: List[str] = None) -> pd.DataFrame:
    """Takes ontology df `ont_df` and list of allowed versions `allowed_versions`, and returns a filtered ontology df 
    including only templates for which at least one of the versions in `versions` is in `allowed_versions`.
    """
    # If allowed_versions is None or empty, return the original DataFrame
    if not allowed_versions:
        return ont_df

    # Filter the DataFrame based on the versions column
    filtered_df = ont_df[ont_df['versions'].apply(lambda versions: any(version in allowed_versions for version in versions))]

    return filtered_df

# Fetch the database information
def get_notion_db_name(notion_client, database_id: str) -> str:

    db_info = notion_client.databases.retrieve(database_id)

    # Extract the database name from the title property
    db_name = db_info['title'][0]['plain_text'] if db_info['title'] else 'Unnamed Database'
    
    return db_name

class NotionOntologyBase:
    def __init__(self, versions: List[str] = None, 
                 notion_sensebot_api_key = None,
                  notion_db_id = None) -> None:
        
        # use keys if passed as args or otherwise take from environment settings.
        sensebot_key = notion_sensebot_api_key if notion_sensebot_api_key else environ["NOTION_SENSEBOT_TOKEN"]
        self.db_id = notion_db_id if notion_db_id else environ["NOTION_SENSEBOT_DB"]

        # create Notion client
        notion = Client(auth=sensebot_key)

        # fetch db name
        self.name = get_notion_db_name(notion, self.db_id)

        # Fetch the database
        results = notion.databases.query(self.db_id)["results"]

        # Process the results into a format suitable for DataFrame
        ont_df = create_df_from_notion_db(results)

        # filter by chosen versions
        self.ont_df = filter_ontology_by_version(ont_df, allowed_versions=versions)


        # set dict versions with alternate keys for fast lookup
        self._label_map = self.ont_df.set_index("label")
        self._display_map = self.ont_df.set_index("display_name")
        self._template_type_map = self.ont_df


    @property
    def label_df(self):
        return self._label_map


    @property
    def display_name_df(self):
        return self._display_map
    
    @property
    def template_type_df(self):
        return self._template_type_map

    def get_valid_templates(self, subject_type: str, object_type: str, as_dict: bool = True) -> List[Dict]:
        """
        Given `subject_type` and `object_type`, return list of templates where `subject_type` is in template['valid_subject_types'] and
        `object_type` is in template['valid_object_types'].
        Templates are the rows of the Notion ontology table provided on initialization.
        """
        # Filter the dataframe based on the subject_type and object_type
        valid_templates = self.ont_df[
            self.ont_df['valid_subject_types'].apply(lambda types: subject_type in types) &
            self.ont_df['valid_object_types'].apply(lambda types: object_type in types)
        ]

        res = valid_templates

        if as_dict:
            # Convert the filtered DataFrame to a list of dictionaries
            res = valid_templates.to_dict(orient='records')

        return res
    

    def get_all_labels(self) -> List[str]:
        return self.ont_df.label.to_list()
    
    def get_all_display_names(self) -> List[str]:
        return self.ont_df.display_name.to_list()