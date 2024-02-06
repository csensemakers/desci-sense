
import sys
from pathlib import Path
ROOT = Path(__file__).parents[1]
sys.path.append(str(ROOT))

from desci_sense.dataloaders import scrape_post
from desci_sense.parsers.multi_stage_parser import MultiStageParser, PromptCase
from desci_sense.configs import init_multi_stage_parser_config


def test_parse_masto():
    url = "https://mastodon.social/@psmaldino@qoto.org/111405098400404613"
    config = init_multi_stage_parser_config()
    parser = MultiStageParser(config=config)
    result = parser.process_url(url)
    assert "answer" in result, "result not correctly extracted"

def test_parse_no_ref_masto():
    url = "https://mastodon.social/@natematias@social.coop/111410981466531543"
    config = init_multi_stage_parser_config()
    parser = MultiStageParser(config=config)
    result = parser.process_url(url)
    labels = parser.prompt_case_dict[PromptCase.ZERO_REF]["labels"]
    assert set(result["answer"]["multi_tag"]).issubset(labels)



def test_parse_tw():
    url = "https://twitter.com/bingbrunton/status/1719789465739333972"
    config = init_multi_stage_parser_config()
    parser = MultiStageParser(config=config)
    result = parser.process_url(url)
    assert "answer" in result, "result not correctly extracted"

def test_parse_no_ref_tw():
    url = "https://twitter.com/HarvardPSC/status/1722102271792603452"
    config = init_multi_stage_parser_config()
    parser = MultiStageParser(config=config)
    result = parser.process_url(url)
    labels = parser.prompt_case_dict[PromptCase.ZERO_REF]["labels"]
    assert set(result["answer"]["multi_tag"]).issubset(labels)