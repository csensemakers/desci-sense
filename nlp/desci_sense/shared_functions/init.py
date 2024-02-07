from typing import List, TypedDict

from confection import Config

class ParserInitConfig(TypedDict, total=True):
    wandb_project: str
    
class ParserInitConfigOptional(TypedDict, total=False):
    # Optional parameters
    model_name: str
    parser_type: str
    temperature: float
    versions: List[str]
    template_dir: str
    zero_ref_template_name: str
    single_ref_template_name: str
    multi_ref_template_name: str
    wandb_entity: str
    ref_metadata_method: str
    notion_db_id: str
    enable_keywords: bool
    kw_template: str
    kw_ref_metadata_method: str
    max_keywords: int
    keyword_extraction_model: str    
    

def init_multi_stage_parser_config(config: ParserInitConfig, optional: ParserInitConfigOptional):
    defaults = {
        "model_name": "mistralai/mistral-7b-instruct",
        "parser_type": "multi_stage",
        "temperature": 0.6,
        "versions": None,
        "zero_ref_template_name": "zero_ref_template.j2",
        "single_ref_template_name": "single_ref_template.j2",
        "multi_ref_template_name": "multi_ref_template.j2",
        "wandb_entity": "common-sense-makers",
        "ref_metadata_method": "citoid",
        "notion_db_id": None,
        "enable_keywords": True,
        "kw_template": "keywords_extraction.j2",
        "kw_ref_metadata_method": "citoid",
        "max_keywords": 6,
        "keyword_extraction_model": "mistralai/mistral-7b-instruct"
    }
    
    if optional is None:
        optional = {}
   
    config = {**defaults, **config, **optional}

    paserConfig = Config(
                    {
                    "general": {
                        "parser_type": config["parser_type"],
                        "ref_metadata_method": config["ref_metadata_method"]

                    },

                    "model": {
                            "model_name": config["model_name"], 
                            "temperature": config["temperature"]
                        },
                    "ontology": {
                        "versions": config["versions"],
                        "notion_db_id": config["notion_db_id"]
                    },
                    "prompt": {
                        "template_dir": config["template_dir"],
                        "zero_ref_template_name": config["zero_ref_template_name"],
                        "single_ref_template_name": config["single_ref_template_name"],
                        "multi_ref_template_name": config["multi_ref_template_name"]
                    },
                    "keyword_extraction":
                    {
                        "enabled": config["enable_keywords"],
                        "template": config["kw_template"],
                        "ref_metadata_method": config["kw_ref_metadata_method"],
                        "max_keywords": config["max_keywords"],
                        "model":
                        {
                            "model_name": config["keyword_extraction_model"], 
                            "temperature": config["temperature"]
                        }
                    },
                    "wandb": {
                        "entity": config["wandb_entity"],
                        "project": config["wandb_project"]
                        
                    },
                    
                    

                    }
                    
                    
                    )
    return paserConfig