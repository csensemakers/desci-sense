import sys
import os
from pathlib import Path

sys.path.append(str(Path(__file__).parents[2]))

import streamlit as st
import wandb
import shortuuid

from desci_sense.parsers.base_parser import BaseParser
from desci_sense.twitter import scrape_tweet
from desci_sense.configs import ST_OPENROUTER_REFERRER, init_config




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
        # extract relevant columns from prediction
        pred_row = [
            result['tweet']['user_name'],
            result['tweet']['tweetURL'],
            result['tweet']['text'],
            result['answer']['reasoning'],
            result['answer']['final_answer'],
            human_label, # if user supplied a label
            labeler_name, # name of person who provided label
            result['tweet']['tweetID']
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
    config = init_config(template_path="desci_sense/prompting/templates/p3.txt",
                         wandb_project="st_demo-v0.2")

    # create model
    tweet_parser = BaseParser(config=config, api_key=api_key, openapi_referer=openrouter_referrer)

    return tweet_parser



def print_tweet(tweet):
    section_title = "### 🐦 Extracted Tweet"
    author = "👤 **Author:** :gray[{}]".format(tweet["user_name"])
    tweet_text = "📝 **Tweet text:** :gray[{}]".format(tweet["text"])
    tweet_url = "🔗 **Tweet URL:** `{}`".format(tweet["tweetURL"])
    st.markdown(f"{section_title} \n {author} \n\n  {tweet_text} \n\n  {tweet_url}")


def scrape(tweet_url):
    # scrape tweet
    with st.spinner('Scraping tweet...'):
        tweet = scrape_tweet(tweet_url)
    st.success('Scraped tweet successfully!')  

    return tweet


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





if __name__ == "__main__":

    st.title("LLM Nanopublishing assistant demo")

    st.markdown('''The bot will categorize a tweet as one of the following types:''')
    with st.expander("Label types"):
        st.markdown('''
        - Announcement: post announcing a paper, dataset or other type of research output.
        - Job: for a post that describes a job listing, for example a call for graduate students or faculty. applications.
        - Review: review of another reference, such as a book, article or movie. The review can be detailed or a simple short endorsement.
        - Other: used if none of the tags above are suitable.''')
    
        st.markdown("""👷In the future, more types will be added, this is just a hacky demo!""")

    with st.spinner("Creating model..."):
        model = init_model()

    st.markdown("Sample Twitter URL for ✂️📋:")
    st.code('''
                https://twitter.com/ClaypoolLab/status/1720165099992961224
                 ''',language='markdown')    
    
    tweet_url = st.text_input("Enter Twitter post URL:", "")
    user_text = st.text_area("Or write text here directly instead")
    if not (tweet_url or user_text):
        st.warning('Please input a Twitter URL or your own free-form text.')
        st.stop()
    if tweet_url:
        st.success('Twitter URL provided.')
    if user_text:
        st.success('Free-form text provided')
        target_text = user_text

    if tweet_url:
        tweet = scrape(tweet_url)
        print_tweet(tweet)
        target_text = tweet["text"]
        
    st.markdown("### Target text to parse:")
    st.text(target_text)
    
    st.markdown("### 🎛️ Nanobot Settings")
    
    with st.form("myform"):
        # st.write(tweet)
        log_check = st.checkbox('Log run results for research purposes?')
        st.markdown('''👆 Check this box before submitting if you agree to share the data with our team for research purposes. 
                By data we mean the URL field as well as any labels you optionally provided, along with the bot response. Thanks! ''')
        manual_label = st.text_input("Add the correct label here, so we can see if Nanobot agrees with you :) Or if you think Nanobot made a mistake, add a correct label here and then re-click the 'Run Nanobot' button! If you planned on using the <other> label, feel free to suggest a new, more specific label instead.", "")
        labeler_name = st.text_input("Optionally add your name or other identifier.", "")
        submitted = st.form_submit_button("🤖 Run Nanobot!")

        if manual_label and not log_check:
            st.warning('Please check the `log run` box since otherwise this label will not be recorded.', icon="⚠️")
        if submitted:
            st.markdown("### 🤖 Nanopub Parser Prediction")

            if tweet_url:
                result = process_tweet(tweet, model, api_key, openai_referer=openrouter_referrer)
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