import json

from firebase_functions import https_fn
from firebase_admin import initialize_app

from shared_functions.main import SM_FUNCTION_post_parser_config, SM_FUNCTION_post_parser_imp
from shared_functions.interface import ParserResult
from shared_functions.schema.ontology import keyWordsOntology, refLabelsOntoloty
from config import openai_api_key

app = initialize_app()


@https_fn.on_request(min_instances=1)
def SM_FUNCTION_post_parser(request):
    """
    Wrapper on SM_FUNCTION_post_parser_imp
    """
    request_json = request.get_json()
    content = request_json["content"]
    parameters = request_json["parameters"]

    config: SM_FUNCTION_post_parser_config = {
        "wandb_project": "st-demo-sandbox",
        "max_summary_length": 500,
        "openai_api_key": openai_api_key,
        "openai_api_base": "https://openrouter.ai/api/v1",
        "openai_api_referer": "https://127.0.0.1:3000/",
    }

    # semantics = SM_FUNCTION_post_parser_imp(content, parameters, config)
    semantics = {
        "triplets": [
            "<_:1> <https://sparontologies.github.io/cito/current/cito.html#d4e441> <happy>",
            "<_:1> <https://sparontologies.github.io/cito/current/cito.html#d4e449> <https://www.alink.com/>",
            "<_:1> <https://sparontologies.github.io/cito/current/cito.html#d4e100> <https://www.anotherlink.com/>",
        ]
    }

    support = {
        "keywords": {"keyWordsOntology": keyWordsOntology},
        "refLabels": {
            "labelsOntology": refLabelsOntoloty,
            "refsMeta": {
                "https://www.alink.com/": {
                    "title": "A link",
                    "description": "Citoid is a citation tool integrated in VisualEditor's visual and wikitext modes. The newest version supports URLs, DOIs, ISBNs and PMC/PMIDs, and can search by title or full citation for books and journal articles in the Crossref and WorldCat databases. It will attempt to generate a full, template-supported citation after an editor pastes either of these identifiers into the VisualEditor citation tool. The Editing Team would like feedback on this iteration of Citoid, especially from experienced editors familiar with Wikipedia's citation standards.",
                    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Citoid_logo.svg/270px-Citoid_logo.svg.png",
                },
                "https://www.anotherlink.com/": {
                    "title": "Another link",
                    "description": "Another description.",
                    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Citoid_logo.svg/270px-Citoid_logo.svg.png",
                },
            },
        },
    }

    parser_result: ParserResult = {"semantics": semantics, "support": support}

    return https_fn.Response(
        json.dumps(
            {
                "semantics": parser_result["semantics"],
                "support": parser_result["support"],
            }
        ),
        status=200,
        headers={"Content-Type": "application/json"},
    )
