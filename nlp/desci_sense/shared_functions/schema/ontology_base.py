from typing import List, Dict, Union
import pandas as pd
import json
from pydantic import Field, BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

from .ontology import ontology
from ..utils import render_to_py_dict


# TODO fix using alias for env var default loading
class NotionOntologyConfig(BaseSettings):
    model_config = SettingsConfigDict(populate_by_name=True)
    db_id: str = Field(
        default=None,
        description="Database ID of Notion ontology",
        validate_default=False,
    )
    notion_api_token: str = Field(
        default=None,
        description="Notion integration API key",
        validate_default=False,
        exclude=True,
    )
    versions: List[str] = Field(
        default_factory=lambda: ["v0"],
        description="Versions for which to take rows from ontology",
    )


class OntologyPredicateDefinition(BaseModel):
    name: str = Field(description="Predicate name.")
    uri: Union[str, None] = Field(description="Linked data URI for this predicate.")
    versions: List[str] = Field(
        description="Which ontology versions is this item included in."
    )


class KeywordPredicateDefinition(OntologyPredicateDefinition):
    """
    Special OntologyPredicateDefinition class intialized to represent
    a keyword concept.
    """

    name: str = Field("hasKeyword", description="Predicate name.")
    uri: str = Field(
        "https://pcp-on-web.de/ontology/0.2/index-en.html#hasKeyword",
        description="Linked data URI for this predicate.",
    )
    versions: List[str] = Field(
        ["v0"], description="Which ontology versions is this item included in."
    )


class LLMOntologyPredicateDefinition(OntologyPredicateDefinition):
    label: str = Field(description="Output label model should use for this predicate")
    display_name: str = Field(description="Name to display in app front-ends.")
    prompt: str = Field(description="Description to use in prompt for this predicate")
    valid_subject_types: List[str] = Field(
        description="List of valid subject entity types for this predicate"
    )
    valid_object_types: List[str] = Field(
        description="List of valid object entity types for this predicate"
    )


class OntologyInterface(BaseModel):
    semantic_predicates: List[LLMOntologyPredicateDefinition]
    keyword_predicate: KeywordPredicateDefinition = Field(
        default_factory=KeywordPredicateDefinition
    )
    ontology_config: NotionOntologyConfig = Field(default_factory=NotionOntologyConfig)


def load_ontology_from_model(ont_model: dict) -> OntologyInterface:
    ontology_interface = OntologyInterface.model_validate(ont_model)
    return ontology_interface


def create_ont_df_from_interface(ontology_interface: OntologyInterface) -> pd.DataFrame:
    # convert ontology to dataframe format
    records = [x.model_dump() for x in ontology_interface.semantic_predicates]
    df = pd.DataFrame(records)
    df.set_index("name", inplace=True, drop=False)
    return df


# TODO to be deprecated - should use load_ontology_from_model
def load_ontology_from_dict(ont_dict):
    """_summary_

    Args:
        ont_dict (_type_): _description_

    Returns:
        _type_: _description_
    """
    loaded_df = pd.DataFrame(ont_dict)
    loaded_df.set_index("name", inplace=True, drop=False)
    return loaded_df


def get_llm_predicate_defs_from_df(
    df: pd.DataFrame,
) -> List[LLMOntologyPredicateDefinition]:
    records = df.to_dict(orient="records")
    return [LLMOntologyPredicateDefinition(**r) for r in records]


def filter_ontology_by_version(
    ont_df: pd.DataFrame, allowed_versions: List[str] = None
) -> pd.DataFrame:
    """Takes ontology df `ont_df` and list of allowed versions `allowed_versions`, and returns a filtered ontology df
    including only templates for which at least one of the versions in `versions` is in `allowed_versions`.
    """
    # If allowed_versions is None or empty, return the original DataFrame
    if not allowed_versions:
        return ont_df

    # Filter the DataFrame based on the versions column
    filtered_df = ont_df[
        ont_df["versions"].apply(
            lambda versions: any(version in allowed_versions for version in versions)
        )
    ]

    return filtered_df


def write_ontology_to_py(ontology: OntologyInterface, outpath: str):
    # convert to dict format
    ont_dict = ontology.model_dump()

    # write to py file
    render_to_py_dict(ont_dict, obj_name="ontology", out_path=outpath)


def write_ontology_to_json(ontology: OntologyInterface, outpath: str):
    # convert to dict format
    ont_dict = ontology.model_dump()

    # Convert the dictionary to JSON format
    json_data = json.dumps(ont_dict, indent=4, ensure_ascii=False)

    # Save the JSON data to a file
    with open(outpath, "w") as file:
        file.write(json_data)


class OntologyBase:
    def __init__(self, versions: List[str] = None) -> None:
        self.ontology_interface = load_ontology_from_model(ontology)

        # Process the results into a format suitable for DataFrame
        ont_df = create_ont_df_from_interface(self.ontology_interface)

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

    def get_valid_templates(
        self, subject_type: str, object_type: str, as_dict: bool = True
    ) -> List[Dict]:
        """
        Given `subject_type` and `object_type`, return list of templates where `subject_type` is in template['valid_subject_types'] and
        `object_type` is in template['valid_object_types'].
        Templates are the rows of the Notion ontology table provided on initialization.
        """
        # Filter the dataframe based on the subject_type and object_type
        valid_templates = self.ont_df[
            self.ont_df["valid_subject_types"].apply(
                lambda types: subject_type in types
            )
            & self.ont_df["valid_object_types"].apply(
                lambda types: object_type in types
            )
        ]

        res = valid_templates

        if as_dict:
            # Convert the filtered DataFrame to a list of dictionaries
            res = valid_templates.to_dict(orient="records")

        return res

    def get_all_labels(self) -> List[str]:
        return self.ont_df.label.to_list()

    def get_all_display_names(self) -> List[str]:
        return self.ont_df.display_name.to_list()
