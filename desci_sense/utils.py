import re
import requests

# based on ChatGPT and https://stackoverflow.com/a/6041965
def extract_urls(text):
    """ takes a string text as input and uses the regular expression pattern to find all 
    occurrences of URLs in the text. returns a list of all non-overlapping matches of the regular expression pattern in the string.
    """
    url_regex = r'((http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-]))'
    res = re.findall(url_regex, text)
    final_res = [r[0] for r in res]
    return final_res


def unshorten_url(url):
    try:
        response = requests.head(url, allow_redirects=True)
        return response.url
    except requests.RequestException as e:
        # return original url in case of errors
        return url
    

def extract_and_expand_urls(text):
    """_summary_

    Args:
        text (_type_): _description_
    """

    expanded_urls = [unshorten_url(url) for url in extract_urls(text)]
    return expanded_urls
        


    
