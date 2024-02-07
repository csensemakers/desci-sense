from typing import TypedDict

from loguru import logger

from .parsers.firebase_api_parser import FirebaseAPIParser
from .init import init_multi_stage_parser_config

class TemplatesType(TypedDict, total=True): 
    zero_ref_template_name: str
    single_ref_template_name: str
    multi_ref_template_name: str

class SM_FUNCTION_post_parser_config(TypedDict, total=True):
    wandb_project: str
    openai_api_base: str
    templates: TemplatesType
    max_summary_length: int

def SM_FUNCTION_post_parser_imp(content, parameters, config) -> dict:
    paserConfig = init_multi_stage_parser_config(config)
    
    parser = FirebaseAPIParser(paserConfig, 
                               openai_api_key=config["openai_api_key"],
                               openapi_referer=config["openapi_referer"]
                               )
    logger.info(f"Running parser on {content}...")
    
    result = parser.process_text(content)
        
    return {"tags": result["answer"]["multi_tag"] }
    
    