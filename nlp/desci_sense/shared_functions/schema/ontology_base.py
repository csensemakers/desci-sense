from typing import List, Dict
import pandas as pd

from .ontology import ontology

def load_ontology_from_dict(ont_dict):
    loaded_df = pd.DataFrame(ont_dict)
    loaded_df.set_index('Name', inplace=True)
    return loaded_df

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

class OntologyBase:
    def __init__(self, versions: List[str] = None) -> None:
        
        # Process the results into a format suitable for DataFrame
        ont_df = load_ontology_from_dict(ontology)

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