  
# Twitter scraping based on https://github.com/JustAnotherArchivist/snscrape/issues/996#issuecomment-1777981568

from typing import Optional, Union

import requests


def do_work(data: dict) -> None:
    # do actual work with data
    return data


def scrape_tweet(tweet_id: Union[str, int]) -> Optional[dict]:
    response = requests.get(url=f"https://api.vxtwitter.com/Twitter/status/{tweet_id}")
    if not response.ok:
        print("Couldn't get tweet.")
        return
    try:
        data = do_work(response.json())
        return data
    except requests.JSONDecodeError:
        print("Couldn't decode response.")
        return

