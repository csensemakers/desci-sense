
import re
from langchain.schema import BaseOutputParser

def convert_string_to_list(input_string):
    """ 
    convert a string representing a list of names into a list of the names. 
    """
    names_list = [name.strip() for name in input_string.split(',') if name.strip()]
    return names_list


class TagTypeParser(BaseOutputParser):
    """Parse the output of an LLM call to a dict ."""


    def parse(self, text: str):
        """Parse the output of an LLM call."""
       # Define the regular expressions for the three sections
        reasoning_steps_pattern = r"Reasoning Steps:(.*?)Candidate Tags:"
        candidate_tags_pattern = r"Candidate Tags:(.*?)Final Answer:"
        final_answer_pattern = r"Final Answer:(.*)"

        # Extract content using regular expressions with error handling
        try:
            reasoning_steps = re.search(reasoning_steps_pattern, text, re.DOTALL).group(1).strip()
        except AttributeError:
            reasoning_steps = "[System error: failed to extract reasoning steps since the generated output was in an invalid format]"

        try:
            candidate_tags = re.search(candidate_tags_pattern, text, re.DOTALL).group(1).strip()
        except AttributeError:
            candidate_tags = "[System error: failed to extract candidate tags since the generated output was in an invalid format.]"

        try:
            final_answer = re.search(final_answer_pattern, text, re.DOTALL).group(1).strip()
        except AttributeError:
            final_answer = "<error>"

        final_reasoning = "[Reasoning Steps]\n\n" + reasoning_steps.strip() + "\n\n[Candidate Tags]\n\n" + candidate_tags.strip()

        # TODO force final answer to conform to closed set of tags

        # Combine into a tuple
        extracted_content = {"reasoning": final_reasoning, 
                             "final_answer": final_answer}
        # print("Extracted Content Tuple:", extracted_content)
        return extracted_content