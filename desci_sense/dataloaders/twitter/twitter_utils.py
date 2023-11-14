  
# Twitter scraping based on https://github.com/JustAnotherArchivist/snscrape/issues/996#issuecomment-1777981568

from typing import Optional, Union
import re
import requests

from ...schema.post import RefPost
from ...utils import extract_and_expand_urls, extract_twitter_status_id

def do_work(data: dict) -> None:
    # do actual work with data
    return data


def scrape_tweet(tweet_id: Union[str, int]) -> RefPost:
    response = requests.get(url=f"https://api.vxtwitter.com/Twitter/status/{tweet_id}")
    if not response.ok:
        print("Couldn't get tweet.")
        return
    try:
        data = do_work(response.json())
        author = data["user_name"]
        text = data["text"]
        url = data["tweetURL"]

        # extract external reference urls from post
        ext_ref_urls = extract_external_ref_urls(data)

        post = RefPost(author=author,
                    content=text,
                    url=url,
                    source_network="twitter",
                    metadata=data,
                    ref_urls=ext_ref_urls)
        return post
    except requests.JSONDecodeError:
        print("Couldn't decode response.")
        return


def extract_status_id(url):
    """
    takes a Twitter post URL as input, uses a regular expression pattern to find the status_id, and returns it as a string. 
    If no match is found, it returns None.

    """
    pattern = r'twitter\.com\/\w+\/status\/(\d+)'
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    else:
        return None

def extract_external_ref_urls(tweet: dict, add_qrt_url: bool = True):
    """
    Extract list of non-internal URLs referenced by this tweet (in the tweet text body).
    In this context, internal URLs are URLs of media items associated with the tweet, such as images or videos.
    Internal URLs share the same ID as the referencing tweet.
    Shortened URLs are expanded to long form.
    Quote Retweets (QRTs) are treated by default as an external URL. (disable by setting `add_qrt_url`=False)
    """
    urls = extract_and_expand_urls(tweet["text"])

    # add qrt url if this was a qrt
    if add_qrt_url:
        if tweet["qrtURL"]:
            urls += [tweet["qrtURL"]]


    external = set()
    for url in urls:
        twitter_id = extract_twitter_status_id(url)
        if twitter_id: # check if a twitter url
            if twitter_id != tweet["tweetID"]: # check if url shares same status id with parsed tweet
                external.add(url)
        else:
            # not twitter url, add
            external.add(url)
    

    return list(external)

# def extract_tweet_external_ref_urls(tweet_url):
#     """
#     Extract list of non-internal URLs referenced by the tweet associated with the tweet_url (in the tweet text body).
#     In this context, internal URLs are URLs of media items associated with the tweet, such as images or videos.
#     Internal URLs share the same ID as the referencing tweet.
#     Shortened URLs are expanded to long form.
#     """
#     tweet = scrape_tweet(tweet_url)
#     return extract_external_ref_urls(tweet)

