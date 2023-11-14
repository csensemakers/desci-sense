
import requests
import re

from urllib.parse import urlparse

from ...schema.post import RefPost
from ...utils import convert_html_to_plain_text, extract_and_expand_urls


def extract_external_masto_ref_urls(post: RefPost, add_qrt_url: bool = True):
    """
    Extract list of URLs referenced by this post (in the post text body).
    Shortened URLs are expanded to long form.
    """
    urls = extract_and_expand_urls(post["plain_content"])

    # extract URL from mastodon post card
    if post["card"]:
        if post["card"]["url"]:
            urls += [post["card"]["url"]]

    # remove dups
    urls = list(set(urls))

    return urls


def extract_instance_and_status(url):
    # Define the regex pattern to extract instance and status ID
    pattern = re.compile(r'https://([^/]+)/@([^/]+)/(\d+)')

    # Use the pattern to find matches in the URL
    match = pattern.match(url)

    if match:
        instance_url = "https://" + match.group(1)
        status_id = match.group(3)
        return instance_url, status_id
    else:
        return None, None

# based on chat gpt
def get_mastodon_post_by_instance(instance_url, status_id, access_token=None) -> RefPost:
    """
    Get a single Mastodon post given its status ID.

    Parameters:
        instance_url (str): The URL of the Mastodon instance (e.g., "https://mastodon.social").
        status_id (int): The ID of the Mastodon post.
        access_token (str, optional): An optional access token if the post is on a private account.

    Returns:
        RefPost: The Mastodon post in RefPost format.
    """
    endpoint = f"{instance_url}/api/v1/statuses/{status_id}"
    headers = {"Authorization": f"Bearer {access_token}"} if access_token else {}

    response = requests.get(endpoint, headers=headers)

    if response.status_code == 200:
        raw_post = response.json()

        # convert post html to plaintext
        raw_post["plain_content"] = convert_html_to_plain_text(raw_post["content"])
        raw_post["post_text"] = raw_post["plain_content"]

        author = raw_post["account"]["display_name"]
        text = raw_post["plain_content"]
        url = raw_post["url"]
        

        # extract external reference urls from post
        ext_ref_urls = extract_external_masto_ref_urls(raw_post)

        post = RefPost(author=author,
                    content=text,
                    url=url,
                    source_network="mastodon",
                    metadata=raw_post,
                    ref_urls=ext_ref_urls)



        return post
    else:
        print(f"Failed to get Mastodon post. Status code: {response.status_code}")
        return None

def scrape_mastodon_post(post_url: str) -> RefPost:

    # get instance url and status ID
    instance_url, status_id = extract_instance_and_status(post_url)

    post = get_mastodon_post_by_instance(instance_url, status_id)

    return post


