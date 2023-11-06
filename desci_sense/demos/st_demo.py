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


# def get_wandb

def log_pred_wandb(wandb_run, result):

    # get a unique ID for this prediction
    pred_uid = shortuuid.ShortUUID().random(length=8)

    artifact = wandb.Artifact(f"pred_{wandb_run.id}_{pred_uid}", type="prediction")

    columns = ["User", "URL", "Text", "Reasoning Steps", "Predicted Label", "True Label", "Tweet ID"]

    # extract relevant columns from prediction
    pred_row = [
        result['tweet']['user_name'],
        result['tweet']['tweetURL'],
        result['tweet']['text'],
        result['answer']['reasoning'],
        result['answer']['final_answer'],
        "", # no gold label meanwhile
        result['tweet']['tweetID']
    ]
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
    config = init_config(template_path="desci_sense/prompting/templates/p1.txt",
                         wandb_project="st_demo-v0.1")

    # create model
    tweet_parser = BaseParser(config=config, api_key=api_key, openapi_referer=openrouter_referrer)

    return tweet_parser




st.title("LLM Nanopublishing assistant demo")


INTRO_TEXT = """The bot will categorize a tweet as one of the following types:

- Announcement: post announcing a paper, dataset or other type of research output.
- Job: for a post that describes a job listing, for example a call for graduate students or faculty. applications.
- Review: review of another reference, such as a book, article or movie. The review can be detailed or a simple short endorsement.
- Other: used if none of the tags above are suitable.

👷In the future, more types will be added, this is just a hacky demo!"""

st.markdown(INTRO_TEXT)

section_title = "### 🐦 Extracted Tweet"
result_title = "### 🤖 Nanopub Parser Prediction"





def print_tweet(tweet):

    author = "👤 **Author:** :gray[{}]".format(tweet["user_name"])
    tweet_text = "📝 **Tweet text:** :gray[{}]".format(tweet["text"])
    tweet_url = "🔗 **Tweet URL:** `{}`".format(tweet["tweetURL"])
    st.markdown(f"{section_title} \n {author} \n\n  {tweet_text} \n\n  {tweet_url}")


def process_tweet(tweet_url, model, api_key, openai_referer):
    # create model
    # model_name = "mistralai/mistral-7b-instruct"
    # tweet_parser = BaseParser(model_name=model_name, api_key=api_key, openapi_referer=openai_referer)

    # scrape tweet
    with st.spinner('Scraping tweet...'):
        tweet = scrape_tweet(tweet_url)
    st.success('Done!')  

    print_tweet(tweet)

    # parse tweet
    with st.spinner('Parsing tweet...'):
        result = model.process_tweet(tweet)
        st.markdown(f"{result_title}")
        st.write(result["answer"])
        return result

with st.spinner("Creating model..."):
    model = init_model()

with st.spinner("Setting up logging..."):
    wandb_run = init_wandb_run(model.config)

with st.form("myform"):
    # api_key = st.text_input("Enter OpenRouter API Key:", "")
    tweet_url = st.text_input("Enter Twitter post URL:", "https://twitter.com/ClaypoolLab/status/1720165099992961224")
    submitted = st.form_submit_button("Submit")
    log_check = st.checkbox('Log results for research purposes?')
    st.markdown('''👆 Check this box before submitting if you agree to share the data with our team for research purposes. 
            By data we mean the URL field as well as any labels you optionally provided, along with the bot response. Thanks! ''')
    
    # done = st.form_submit_button("Finish")

    if submitted:
        result = process_tweet(tweet_url, model, api_key, openai_referer=openrouter_referrer)

        if log_check:
            # log results to wandb DB
            log_pred_wandb(wandb_run, result)


    





st.divider()
st.markdown('''💻 Code repo: https://github.com/csensemakers/desci-sense''')