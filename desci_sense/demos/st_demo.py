import sys
import os
from pathlib import Path

sys.path.append(str(Path(__file__).parents[2]))

import streamlit as st
import wandb
import shortuuid

from desci_sense.parsers.base_parser import BaseParser
from desci_sense.twitter import scrape_tweet
from desci_sense.mastodon import scrape_mastodon_post
from desci_sense.configs import ST_OPENROUTER_REFERRER, init_config
from desci_sense.utils import identify_social_media




# if fail to get from environment config, default to streamlit referrer
openrouter_referrer = os.environ.get("OPENROUTER_REFERRER", ST_OPENROUTER_REFERRER)
api_key = os.environ.get("OPENROUTER_API_KEY")

result = None


def log_pred_wandb(wandb_run, result, human_label: str = "", labeler_name: str = ""):

    # get a unique ID for this prediction
    pred_uid = shortuuid.ShortUUID().random(length=8)

    artifact = wandb.Artifact(f"pred_{wandb_run.id}_{pred_uid}", type="prediction")

    columns = ["User", "URL", "Text", "Reasoning Steps", "Predicted Label", "True Label", "Name of Label Provider" , "Tweet ID"]

    # check if prediction was tweet or simple text
    if "tweet" in result:
        post = result["tweet"]
        if post["sm_type"] == "mastodon":
            author = post["account"]["display_name"]
            text = post["plain_content"]
            url = post["url"]
            post_id = post["id"]
        else:
            # assuming Twitter for now
            author = post["user_name"]
            text = post["text"]
            url = post["tweetURL"]
            post_id = post['tweetID']

        # extract relevant columns from prediction
        pred_row = [
            author,
            url,
            text,
            result['answer']['reasoning'],
            result['answer']['final_answer'],
            human_label, # if user supplied a label
            labeler_name, # name of person who provided label
            post_id
        ]
    elif "text" in result:
        user_name = labeler_name if labeler_name != "" else "unknown app user"
        pred_row = [
            user_name,
            "",
            result["text"],
            result['answer']['reasoning'],
            result['answer']['final_answer'],
            human_label, # if user supplied a label
            labeler_name, # name of person who provided label
            ""
        ]
    else:
        raise ValueError("Result should have either text or tweet key!")

    data = [pred_row]

    # add data to table
    table =  wandb.Table(data=data, columns=columns)
    artifact.add(table, "predictions")

    # log immediately since we don't know when user will close the session
    wandb.log_artifact(artifact)
    

def init_wandb_run(model_config):

    wandb.login(key=os.environ["WANDB_API_KEY"])
    wandb_run = wandb.init(job_type="demo",project=model_config["wandb"]["project"], config=model_config, 
                                       entity=model_config["wandb"]["wand_entity"])
    
    return wandb_run

def init_model():

    # get config file
    config = init_config(template_path="desci_sense/prompting/templates/p4.txt",
                         wandb_project="st_demo-v0.2")

    # create model
    tweet_parser = BaseParser(config=config, api_key=api_key, openapi_referer=openrouter_referrer)

    return tweet_parser



def print_tweet(tweet):
    st.divider()
    section_title = "### 🐦 Extracted Tweet"
    author = "👤 **Author:** :gray[{}]".format(tweet["user_name"])
    tweet_text = "📝 **Tweet text:** :gray[{}]".format(tweet["text"])
    tweet_url = "🔗 **Tweet URL:** `{}`".format(tweet["tweetURL"])
    st.markdown(f"{section_title} \n {author} \n\n  {tweet_text} \n\n  {tweet_url}")
    st.divider()

def print_post(post):
    st.divider()
    section_title = "### 🗨️ Extracted Post"
    if post["sm_type"] == "mastodon":
        author = post["account"]["display_name"]
        text = post["plain_content"]
        url = post["url"]
        sm_type_string = "🦣 Mastodon"
    else:
        # assuming Twitter for now
        author = post["user_name"]
        text = post["text"]
        url = post["tweetURL"]
        sm_type_string = "🐦 Twitter"
        
    
    author_str = "👤 **Author:** :gray[{}]".format(author)
    post_text = "📝 **Post text:** :gray[{}]".format(text)
    post_url = "🔗 **Post URL:** `{}`".format(url)
    source_sm = f"🔉 **Source Social Media:** {sm_type_string}"
    st.markdown(f"{section_title} \n {author_str} \n\n  {post_text} \n\n  {post_url} \n\n {source_sm}")
    st.divider()

        


def scrape_tweet_post(tweet_url):
    # scrape tweet
    with st.spinner('Scraping tweet...'):
        tweet = scrape_tweet(tweet_url)
    st.success('Scraped tweet successfully!')  

    return tweet

def scrape_toot_post(toot_url):
    # scrape tweet
    with st.spinner('Scraping toot...'):
        post = scrape_mastodon_post(toot_url)
    st.success('Scraped toot successfully!')  

    return post

def scrape_post(post_url):
    """
    Scrape Twitter or Mastodon post
    """
    # check social media type
    social_type = identify_social_media(post_url)

    if social_type == "twitter":
        result = scrape_tweet(post_url)
        
    elif social_type == "mastodon":
        result = scrape_toot_post(post_url)

    else:
        st.error('Could not detect post social media type. Please try another URL.', icon="🚨")
        st.stop()

    return result


def process_text(text, model, api_key, openai_referer):
    # parse text
    with st.spinner('Parsing text...'):
        result = model.process_text(text)
        st.write(result["answer"])
        return result


def process_tweet(tweet, model, api_key, openai_referer):
    # parse tweet
    with st.spinner('Parsing tweet...'):
        result = model.process_tweet(tweet)
        st.write(result["answer"])
        return result


def process_post(post, model):
    # check whether masto or twitter and parse accordingly
    sm_type = post["sm_type"]
    assert sm_type in ["twitter", "mastodon"]
    
    with st.spinner(f"Parsing {sm_type} post..."):
        if sm_type == "twitter":
            result = model.process_tweet(post)
            st.write(result["answer"])
            return result
        else:
            # mastodon
            result = model.process_toot(post)
            st.write(result["answer"])
            return result



if __name__ == "__main__":

    st.title("LLM Nanopublishing assistant demo")

    st.markdown('''The bot will categorize a tweet as one of the following types:''')
    with st.expander("Label types"):
        st.markdown('''
        - Announcement: post announcing a paper, dataset or other type of research output.
        - Job: for a post that describes a job listing, for example a call for graduate students or faculty. applications.
        - Review: review of another reference, such as a book, article or movie. The review can be detailed or a simple short endorsement.
        - Event: Either real-world or an online event. Any kind of event is relevant, some examples of events could be seminars, meetups, or hackathons.
        - Reading: Post describes the reading status of the author in relation to a reference, such as a book or article. The author may either have read the reference in the past, is reading the reference in the present, or is looking forward to reading the reference in the future.
        - Recommendation: The author is recommending any kind of content: an article, a movie, podcast, book, another post, etc. This tag can also be used for cases of implicit recommendation, where the author is expressing enjoyment of some content but not explicitly recommending it.
        - Other: used if none of the tags above are suitable.''')
    
        st.markdown("""👷In the future, more types will be added, this is just a hacky demo!""")

    with st.spinner("Creating model..."):
        model = init_model()

    st.markdown("Sample Twitter URL for ✂️📋:")
    st.code('''
                https://twitter.com/TaniaLombrozo/status/1722709702667026865
                 ''',language='markdown')    
    
    post_url = st.text_input("Enter Twitter/Mastodon post URL:", "")
    user_text = st.text_area("Or write text here directly instead")
    if not (post_url or user_text):
        st.warning('Please input a Twitter/Mastodon URL or your own free-form text.')
        st.stop()
    if post_url:
        st.success('Post URL provided.')
    if user_text:
        st.success('Free-form text provided')
        target_text = user_text

    if post_url:
        post = scrape_post(post_url)
        print_post(post)
        target_text = post["post_text"]
        
    st.markdown("### Target text to parse:")
    st.text(target_text)
    st.divider()
    
    st.markdown("### 🎛️ Nanobot Settings")
    
    with st.form("myform"):
        # st.write(tweet)
        log_check = st.checkbox('Log run results for research purposes?')
        st.markdown('''👆 Check this box before submitting if you agree to share the data with our team for research purposes. 
                By data we mean the URL field as well as any labels you optionally provided, along with the bot response. Thanks! ''')
        manual_label = st.text_input("Add the correct label here, so we can see if Nanobot agrees with you :) Or also if you think Nanobot made a mistake, add a correct label here and then re-click the 'Run Nanobot' button! If you planned on using the <other> label, feel free to suggest a new, more specific label instead.", "")
        labeler_name = st.text_input("Optionally add your name or other identifier.", "")
        submitted = st.form_submit_button("🤖 Run Nanobot!")

        if manual_label and not log_check:
            st.warning('Please check the `log run` box since otherwise this label will not be recorded.', icon="⚠️")
        if submitted:
            st.markdown("### 🤖 Nanopub Parser Prediction")

            if post_url:
                result = process_post(post, model)
            else:
                # free text option
                result = process_text(target_text, model, api_key, openai_referer=openrouter_referrer)

            if log_check:
                # log results to wandb DB
                with st.spinner("Logging result..."):
                    wandb_run = init_wandb_run(model.config)
                    log_pred_wandb(wandb_run, result, manual_label, labeler_name)
                    wandb_run.finish()

    st.divider()
    st.markdown('''💻 Code repo: https://github.com/csensemakers/desci-sense''')