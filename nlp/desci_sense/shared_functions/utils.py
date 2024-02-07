import re
import requests

from url_normalize import url_normalize

def unshorten_url(url):
    try:
        response = requests.head(url, allow_redirects=True)
        return response.url
    except requests.RequestException as e:
        # return original url in case of errors
        return url

# based on ChatGPT and https://stackoverflow.com/a/6041965
def extract_urls(text):
    """ takes a string text as input and uses the regular expression pattern to find all 
    occurrences of URLs in the text. returns a list of all non-overlapping matches of the regular expression pattern in the string.
    """
    url_regex = r'((http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-]))'
    res = re.findall(url_regex, text)
    final_res = [r[0] for r in res]
    return final_res


def normalize_url(url):
    """
    Process url to convert it to canonical format.

    Includes:
    - URL unshortening
    -Normalization (using https://pypi.org/project/url-normalize/)


    """
    res = unshorten_url(url)
    res = url_normalize(res)

    return res

def extract_and_expand_urls(text):
    """_summary_

    Args:
        text (_type_): _description_
    """

    expanded_urls = [normalize_url(url) for url in extract_urls(text)]
    return expanded_urls
        