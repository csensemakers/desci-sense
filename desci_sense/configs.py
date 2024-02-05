from typing import List

from dataclasses import dataclass
# import pydantic as pyd
from confection import Config

OPENROUTER_API_BASE = "https://openrouter.ai/api/v1"

# Streamlit App URL
ST_OPENROUTER_REFERRER = "https://ai-nanopub.streamlit.app/"

# project to save data from deployed web app
WEB_APP_WANDB_PROJ = "st-app-multi-v1"

# sandbox project
WANDB_SANDBOX_PROJ = "st-demo-sandbox"

# max number of chars for extracted summaries in URL metadata
MAX_SUMMARY_LEN = 500
    

def init_config(model_name: str = "mistralai/mistral-7b-instruct",
                parser_type: str = "base",
                temperature: float = 0.6,
                template_path: str = "desci_sense/prompting/templates/p4.txt",
                wandb_entity: str = "common-sense-makers",
                wandb_project: str = WANDB_SANDBOX_PROJ
                ):
    config = Config(
                    {
                    "general": {
                        "parser_type": parser_type

                    },

                    "model": {
                            "model_name": model_name, 
                            "temperature": temperature
                        },
                    "prompt": {
                        "template_path": template_path
                    },
                    "wandb": {
                        "entity": wandb_entity,
                        "project": wandb_project
                        
                    },
                    
                    

                    }
                    
                    
                    )
    return config

def init_multi_stage_parser_config(model_name: str = "mistralai/mistral-7b-instruct",
                parser_type: str = "multi_stage",
                temperature: float = 0.6,
                versions: List[str] = None,
                template_dir: str = "desci_sense/prompting/jinja/",
                zero_ref_template_name: str = "zero_ref_template.j2",
                single_ref_template_name: str = "single_ref_template.j2",
                multi_ref_template_name: str = "multi_ref_template.j2",
                wandb_entity: str = "common-sense-makers",
                wandb_project: str = WANDB_SANDBOX_PROJ,
                ref_metadata_method: str = "citoid",
                notion_db_id: str = None
                ):
    config = Config(
                    {
                    "general": {
                        "parser_type": parser_type,
                        "ref_metadata_method": ref_metadata_method

                    },

                    "model": {
                            "model_name": model_name, 
                            "temperature": temperature
                        },
                    "ontology": {
                        "versions": versions,
                        "notion_db_id": notion_db_id
                    },
                    "prompt": {
                        "template_dir": template_dir,
                        "zero_ref_template_name": zero_ref_template_name,
                        "single_ref_template_name": single_ref_template_name,
                        "multi_ref_template_name": multi_ref_template_name
                    },
                    "wandb": {
                        "entity": wandb_entity,
                        "project": wandb_project
                        
                    },
                    
                    

                    }
                    
                    
                    )
    return config

def init_crawler_config(
        

    ):
    pass
