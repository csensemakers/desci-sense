from pathlib import Path
# APP_ROOT = Path(__file__).parents[3]
# NLP_PATH = APP_ROOT / "nlp"
import sys

# TODO fix this hard import!
sys.path.insert(1, "/Users/ronentamari/Documents/dev/common_sense/sensemaker_app/firebase_branch/nlp")

from loguru import logger

from desci_sense.parsers.firebase_api_parser import FirebaseAPIParser
from desci_sense.configs import init_multi_stage_parser_config, environ
# from ..configs import init_multi_stage_parser_config

def SM_FUNCTION_post_tagger_imp(content, parameters) -> dict:
    config = init_multi_stage_parser_config()
    parser = FirebaseAPIParser(config, 
                               openai_api_key=environ.get("OPENROUTER_API_KEY"),
                               openapi_referer=environ.get("OPENROUTER_REFERRER")
                               )
    logger.info(f"Running parser on {content}...")
    result = parser.process_text(content)
    # tags = parameters["options"]
    # tags = [tag for tag in tags if tag in content]
        
    return {"tags": result["answer"]["multi_tag"] }
    