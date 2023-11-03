import os

from typing import Optional, Dict
import configs

from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate
from langchain.schema import BaseOutputParser
from langchain.schema import (
    HumanMessage,
)


from ..twitter import scrape_tweet

from ..postprocessing.output_parsers import TagTypeParser

template = """You are an expert annotator who tags social media posts related to academic research, according to a predefined set of tags. 
The available tag types are:
<announce>: this post contains an announcement of new research. The announcement is likely made by the authors but may be a third party. The research should be a paper, dataset or other type of research output that is being announced publicly.
<review>: this post contains a review of another reference, such as a book, article or movie. The review could be positive or negative. A review can be detailed or a simple short endorsement.
<job>: this post describes a job listing, for example a call for graduate students or faculty applications.
<other>: This is a special tag. Use this tag if none of the tags above are suitable. If you tag a post with <other>, no other tag should be assigned to the post.

A user will pass in a post, and you should think step by step, before a single tag that best matches the post.

Your final answer should be structured as follows:
Reasoning Steps: (your reasoning steps)
Candidate Tags: (For potential each tag you choose, explain why you chose it.)
Final Answer: (a final single tag, based on the Candidate Tags. The final tag must be included in the Candidate Tags list!)

Remember:
Do not make up any new tags that are not in the list above!
Only choose one final tag!
"""
human_template = "{text}"


class BaseParser:
    def __init__(self, model_name="mistralai/mistral-7b-instruct", 
                 api_key: Optional[str]=None,
                 openapi_referer: Optional[str]=None,
                 ) -> None:
        
        # if no api key passed as arg, default to environment config
        openai_api_key = api_key if api_key else os.environ["OPENROUTER_API_KEY"]
        
        openapi_referer = openapi_referer if openapi_referer else os.environ["OPENROUTER_REFERRER"]


        # init model
        self.model = ChatOpenAI(
            model=model_name, 
            temperature=0.6,
            openai_api_key=openai_api_key,
            openai_api_base=configs.OPENROUTER_API_BASE,
            headers={"HTTP-Referer": openapi_referer}, 
        )

        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", template),
            ("human", human_template),
        ])

        self.output_parser = TagTypeParser()

        self.chain = self.prompt_template | self.model | self.output_parser
        

    def process_tweet(self, tweet: Dict):
        # process tweet in the format of the output of scrape_tweet

        answer = self.chain.invoke({"text": tweet["text"]})

        result = {"tweet": tweet,
                  "answer": answer
                  }

        return result



    def process_tweet_url(self, tweet_url: str):

        # get tweet in json format
        tweet = scrape_tweet(tweet_url)

        answer = self.chain.invoke({"text": tweet["text"]})

        result = {"tweet": tweet,
                  "answer": answer
                  }

        return result








