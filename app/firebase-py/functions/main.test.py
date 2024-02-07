from shared_functions.main import SM_FUNCTION_post_parser_imp, SM_FUNCTION_post_parser_config
from config import openai_api_key

content = 'This is definititely an announcement of https://www.alink.com'
parameters = {}

config: SM_FUNCTION_post_parser_config = {
        "wandb_project": "st-demo-sandbox",
        "max_summary_length": 500,
        "openai_api_key": openai_api_key,
        "openai_api_base": "https://openrouter.ai/api/v1",
        "openai_api_referer": "https://127.0.0.1:3000/"
    }
    
semantics = SM_FUNCTION_post_parser_imp(content, parameters, config)

print("semantics: {}", semantics)