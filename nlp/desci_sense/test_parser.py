from shared_functions.main import (
    SM_FUNCTION_post_parser_imp,
    SM_FUNCTION_post_parser_config,
)
from configs import environ

content = "Test post"
parameters = {}

config: SM_FUNCTION_post_parser_config = {
    "wandb_project": "st-demo-sandbox",
    "max_summary_length": 500,
    "openai_api_key": environ["OPENROUTER_API_KEY"],
    "openai_api_base": "https://openrouter.ai/api/v1",
    "openai_api_referer": "https://127.0.0.1:3000/",
}

semantics = SM_FUNCTION_post_parser_imp(content, parameters, config)

print("semantics {}", semantics)
