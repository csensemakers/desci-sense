import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parents[2]))

import streamlit as st
from desci_sense.parsers.base_parser import BaseParser
from desci_sense.twitter import scrape_tweet

st.title("LLM Nanopublishing assistant demo")


section_title = "### 🐦 Extracted Tweet"
result_title = "### 🤖 Nanopub Parser Prediction"



def print_tweet(tweet):

    author = "👤 **Author:** :gray[{}]".format(tweet["user_name"])
    tweet_text = "📝 **Tweet text:** :gray[{}]".format(tweet["text"])
    tweet_url = "🔗 **Tweet URL:** `{}`".format(tweet["tweetURL"])
    st.markdown(f"{section_title} \n {author} \n\n  {tweet_text} \n\n  {tweet_url}")


def process_tweet(tweet_url, api_key, openai_referer):
    # create model
    model_name = "mistralai/mistral-7b-instruct"
    tweet_parser = BaseParser(model_name=model_name, api_key=api_key, openapi_referer=openai_referer)

    # scrape tweet
    with st.spinner('Scraping tweet...'):
        tweet = scrape_tweet(tweet_url)
    st.success('Done!')  

    print_tweet(tweet)

    # parse tweet
    with st.spinner('Parsing tweet...'):
        result = tweet_parser.process_tweet(tweet)
        st.markdown(f"{result_title}")
        st.write(result["answer"])


with st.form("myform"):
    api_key = st.text_input("Enter OpenRouter API Key:", "")
    openapi_referer = st.text_input("Enter OpenRouter Referer:", "https://ai-nanopub.streamlit.app/")
    tweet_url = st.text_input("Enter Twitter post URL:", "")
    submitted = st.form_submit_button("Submit")
    if submitted:
        process_tweet(tweet_url, api_key, openapi_referer)