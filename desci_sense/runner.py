import os

from confection import Config

from desci_sense.configs import ST_OPENROUTER_REFERRER, init_config
from desci_sense.parsers.base_parser import BaseParser
from desci_sense.parsers.multi_tag_parser import MultiTagParser
from desci_sense.schema.templates import PREDICATE_LABELS

def load_config(config_path: str = None) -> Config:
    """
    Create configuration for this run. If config file path is provided, use that.
    Otherwise use a default config.
    If WAND_PROJECT environment key is set, update config with it (used for deployed app).
    """
    if config_path:
        config = Config().from_disk(config_path)
    else:
        # use a default config - this is the config loaded in the streamlit demo app
        config = init_config(parser_type="base",
                         model_name="fireworks/mixtral-8x7b-fw-chat",
                         template_path="desci_sense/prompting/templates/p7.txt")
        if "WANDB_PROJECT" in os.environ:
            wandb_proj = os.environ.get("WANDB_PROJECT")
            config["wandb"]["project"] = wandb_proj
    
    # add set of possible predicate labels available in this run
    config["prompt"]["tags"] = PREDICATE_LABELS


    return config



def init_model(config: Config):

    # if fail to get from environment config, default to streamlit referrer
    openrouter_referrer = os.environ.get("OPENROUTER_REFERRER", ST_OPENROUTER_REFERRER)
    api_key = os.environ.get("OPENROUTER_API_KEY")

    # create parser
    if config["general"]["parser_type"] == "base":
        parser = BaseParser(config=config, api_key=api_key, openapi_referer=openrouter_referrer)
    elif config["general"]["parser_type"] == "multi":
        parser = MultiTagParser(config=config, api_key=api_key, openapi_referer=openrouter_referrer)
    else:
        raise ValueError(f"Unknown parser type: {config['parser_type']}")
    

    return parser