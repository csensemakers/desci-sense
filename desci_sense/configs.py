from dataclasses import dataclass
# import pydantic as pyd
from confection import Config

OPENROUTER_API_BASE = "https://openrouter.ai/api/v1"

# Streamlit App URL
ST_OPENROUTER_REFERRER = "https://ai-nanopub.streamlit.app/"
# WANDB_ENTITY = "common-sense-makers"
# WANDB_DB_NAME = "test-DB"


# @dataclass
# class ConfigSchema(pyd.BaseModel):
#     model_name: str = "mistralai/mistral-7b-instruct"
#     temperature: float = 0.6
    

def init_config(model_name: str = "mistralai/mistral-7b-instruct",
                temperature: float = 0.6,
                template_path: str = "desci_sense/prompting/templates/p4.txt",
                wandb_entity: str = "common-sense-makers",
                wandb_project: str = "st-demo",
                wandb_db_name: str = "test-DB"):
    config = Config(
                    {"model": {
                                "model_name": model_name, 
                                "temperature": temperature
                            },
                    "prompt": {
                        "template_path": template_path
                    },
                    "wandb": {
                        "wand_entity": wandb_entity,
                        "project": wandb_project,
                        "wandb_db_name": wandb_db_name
                    }

                    }
                    
                    
                    )
    return config
    