import os
from dotenv import load_dotenv

from dataclasses import dataclass
# import pydantic as pyd
from confection import Config

load_dotenv() 

# environment
environ = {
    "OPENROUTER_API_KEY": os.environ.get("OPENROUTER_API_KEY"),
    "OPENROUTER_REFERRER": os.environ.get("OPENROUTER_API_KEY"),
    "WANDB_PROJECT": os.environ.get("WANDB_PROJECT"),
    "MASTO_CLIENT_ID": os.environ.get("MASTO_CLIENT_ID"),
    "MASTO_CLIENT_SECRET": os.environ.get("MASTO_CLIENT_SECRET"),
    "NOTION_SENSEBOT_DB": os.environ.get("NOTION_SENSEBOT_DB"),
    "NOTION_SENSEBOT_TOKEN": os.environ.get("NOTION_SENSEBOT_TOKEN"),
}

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

def init_crawler_config(
        

    ):
    pass
