from typing import TypedDict, Any

from loguru import logger

from .parsers.firebase_api_parser import FirebaseAPIParser
from .init import init_multi_stage_parser_config
from .interface import ParserResult



class SM_FUNCTION_post_parser_config(TypedDict, total=True):
    wandb_project: str
    openai_api_base: str
    max_summary_length: int
    openai_api_key: int
    openai_api_referer: int


def SM_FUNCTION_post_parser_imp(content, parameters, config) -> dict:
    paserConfig = init_multi_stage_parser_config(config, {})

    parser = FirebaseAPIParser(paserConfig)

    logger.info(f"Running parser on {content}...")

    result = parser.process_text(content)

    ref = result["post"].ref_urls[0]

    def getTriplet(label):
        return f"<_:1> <{label}> <{ref}>"

    triplets = result["answer"]["multi_tag"]
    triplets = list(map(getTriplet, triplets))

    return {"triplets": triplets}
