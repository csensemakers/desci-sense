
import re
from langchain.schema import BaseOutputParser

def convert_string_to_list(input_string):
    """ 
    convert a string representing a list of names into a list of the names. 
    """
    names_list = [name.strip() for name in input_string.split(',') if name.strip()]
    return names_list


class TypeTagParser(BaseOutputParser):
    """Parse the output of an LLM call to a dict ."""


    def parse(self, text: str):
        """Parse the output of an LLM call."""
        # print(text)
        # Define the regex patterns for the three sections
        sections_re = re.compile(r"Reasoning Steps:(.*?)Candidate Tags:(.*?)Final Answer:(.*)", re.DOTALL)

        # Extract the content using regex
        sections_match = sections_re.search(text)

        reasoning_steps = sections_match.group(1).strip()
        candidate_tags = sections_match.group(2).strip()
        final_answer = sections_match.group(3).strip()

        final_reasoning = reasoning_steps.strip() + "\n\nCandidate Tags:\n\n" + candidate_tags.strip()

        # TODO force final answer to conform to closed set of tags

        # Combine into a tuple
        extracted_content = {"reasoning": final_reasoning, 
                             "final_answer": final_answer}
        # print("Extracted Content Tuple:", extracted_content)
        return extracted_content