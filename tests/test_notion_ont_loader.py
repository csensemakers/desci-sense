import sys
from pathlib import Path
ROOT = Path(__file__).parents[1]
sys.path.append(str(ROOT))

import pytest
from enum import Enum

from confection import Config

from desci_sense.schema.notion_ontology_base import load_ontology_from_config




def test_load_notion_config_by_id():
    config_path = ROOT / "tests/etc/configs/notion_test.cfg"
    config = Config().from_disk(str(config_path))
    ontology = load_ontology_from_config(config)
    assert len(ontology.ont_df) == 1
