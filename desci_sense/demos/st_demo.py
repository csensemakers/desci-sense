import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parents[2]))
print(sys.path)




import streamlit as st
from desci_sense.parsers.base_parser import BaseParser
from desci_sense.twitter import scrape_tweet

st.title("LLM Nanopublishing assistant demo")

# api_key, selected_model = sidebar(constants.OPENROUTER_DEFAULT_INSTRUCT_MODEL)

# def blog_outline(topic):
#     # Instantiate LLM model
#     chat = ChatOpenAI(
#         model_name=selected_model,
#         openai_api_key=api_key,
#         openai_api_base=constants.OPENROUTER_API_BASE,
#         headers={"HTTP-Referer": constants.OPENROUTER_REFERRER},
#     )
#     # Prompt
#     template="As an experienced data scientist and technical writer, generate an outline for a blog about {topic}."
#     system_message_prompt = SystemMessagePromptTemplate.from_template(template)
#     chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt])
#     prompt = chat_prompt.format_prompt(topic=topic).to_messages()
#     st.write(chat(prompt))




section_title = "### 🐦 Extracted Tweet"



result_title = "### 🤖 Nanopub Parser Prediction"

def print_tweet(tweet):

    author = "👤 **Author:** :gray[{}]".format(tweet["user_name"])
    tweet_text = "📝 **Tweet text:** :gray[{}]".format(tweet["text"])
    tweet_url = "🔗 **Tweet URL:** `{}`".format(tweet["tweetURL"])
    st.markdown(f"{section_title} \n {author} \n\n  {tweet_text} \n\n  {tweet_url}")


def process_tweet(tweet_url, api_key):
    # create model
    model_name = "mistralai/mistral-7b-instruct"
    tweet_parser = BaseParser(model_name=model_name, api_key=api_key)

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
    tweet_url = st.text_input("Enter Twitter post URL:", "")
    submitted = st.form_submit_button("Submit")
    if submitted:
        process_tweet(tweet_url, api_key)