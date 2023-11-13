
import os
import sys
from pathlib import Path
ROOT = Path(__file__).parents[1]
sys.path.append(str(ROOT))

from desci_sense.twitter import extract_external_ref_urls, scrape_tweet

def test_ext_urls():
    test_urls = [

    ("https://twitter.com/maksym_andr/status/1722235666724192688", True),
    ("https://twitter.com/mpshanahan/status/1722283975450722407", False),
    ("https://twitter.com/victorveitch/status/1722303746397409698", False),
    ("https://twitter.com/HarvardPSC/status/1722102271792603452", False),
    ("https://twitter.com/cognazor/status/1722598121887117753", True), #qrt,
    ("https://twitter.com/soldni/status/1724094517970882959", False)
    ]

    for case, label in test_urls:
        tweet = scrape_tweet(case)
        r = extract_external_ref_urls(tweet)
        assert((len(r) > 0) == label), f"{case} extracted to {r} - mismatch with {label}"


def test_problem_tweet_i31():
    # https://github.com/csensemakers/desci-sense/issues/31
    test_urls = [

    ("https://twitter.com/victorveitch/status/1722300572554969090", True)

    ]

    for case, label in test_urls:
        tweet = scrape_tweet(case)
        r = extract_external_ref_urls(tweet)
        assert((len(r) > 0) == label), f"{case} extracted to {r} - mismatch with {label}"