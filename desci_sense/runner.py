import os

from confection import Config

from desci_sense.configs import ST_OPENROUTER_REFERRER, init_config, init_multi_stage_parser_config
from desci_sense.parsers.multi_stage_parser import MultiStageParser
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
        config = init_multi_stage_parser_config(
                         model_name="fireworks/mixtral-8x7b-fw-chat"
                        )
        if "WANDB_PROJECT" in os.environ:
            wandb_proj = os.environ.get("WANDB_PROJECT")
            config["wandb"]["project"] = wandb_proj

    return config



def init_model(config: Config):

    # if fail to get from environment config, default to streamlit referrer
    openrouter_referrer = os.environ.get("OPENROUTER_REFERRER", ST_OPENROUTER_REFERRER)
    api_key = os.environ.get("OPENROUTER_API_KEY")

    # create parser
    # if config["general"]["parser_type"] == "base":
    #     parser = BaseParser(config=config, api_key=api_key, openapi_referer=openrouter_referrer)
    if config["general"]["parser_type"] == "multi_stage":
        parser = MultiStageParser(config=config, api_key=api_key, openapi_referer=openrouter_referrer)
    else:
        raise ValueError(f"Unknown parser type: {config['parser_type']}")
    

    return parser