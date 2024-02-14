"""Script to load ontology data from Notion and write to JSON ouput.

Usage:
  load_ontology.py [--config=<config> --outdir=<outdir>]
  load_ontology.py (-h | --help)


Options:
  -h --help     Show this screen.
  --config=<config>  Optional path to configuration file.
  --outdir=<outdir>  dir to file to save data to [default: desci_sense/shared_functions/schema/]

"""

import sys
import pandas as pd
from typing import List
from docopt import docopt
from pathlib import Path
from loguru import logger

ROOT = Path(__file__).parents[1]
sys.path.append(str(ROOT))

from desci_sense.schema.notion_ontology_base import (
    NotionOntologyConfig,
    load_notion_config_json,
    load_ontology_from_config,
    write_ontology_to_json,
)

if __name__ == "__main__":
    arguments = docopt(__doc__)

    # get args
    out_dir = Path(arguments.get("--outdir"))
    config_path = arguments.get("--config")

    # initialize config
    if config_path:
        # load config
        config = load_notion_config_json(config_path)
    else:
        # create default config
        config = NotionOntologyConfig()

    ontology = load_ontology_from_config(config)

    # prepare output dir
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = ROOT / out_dir / "ontology.json"
    logger.info(f"Writing output to {out_path.absolute()}...")

    # write output
    write_ontology_to_json(ontology, str(out_path))

    logger.info("Done!")
