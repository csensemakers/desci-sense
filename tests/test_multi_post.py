import os
import sys
from pathlib import Path
ROOT = Path(__file__).parents[1]
sys.path.append(str(ROOT))




from desci_sense.schema.post import MultiTagRefPost
from desci_sense.postprocessing.output_parsers import TagTypeParser


# def test_simple_1():
#     post = MultiTagRefPost(author='Jane Doe', content='This is a tagged post.', url='http://example.com', date="", ref_urls=['www.ref1.com'], tags={'event', 'job', 'unknown-tag'})
#     assert post.tags == {'event', 'job'}


def test_unique_tags():
    tag_parser = TagTypeParser()
    text = "Final Answer: \n <event> <discussion> <discussion>"
    answer = tag_parser.parse(text)
    assert set(answer["multi_tag"]) == set(["event", "discussion"])

if __name__ == "__main__":
    post = MultiTagRefPost(author='Jane Doe', content='This is a tagged post.', url='http://example.com', tags={'event', 'job', 'unknown-tag'})

