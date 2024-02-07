import json

from firebase_functions import https_fn
from firebase_admin import initialize_app

from shared_functions.main import SM_FUNCTION_post_parser_imp

app = initialize_app()

@https_fn.on_request(min_instances=1)
def SM_FUNCTION_post_tagger(request):
    request_json = request.get_json()
    content =  request_json['content'];
    parameters =  request_json['parameters'];
    
    meta = SM_FUNCTION_post_parser_imp(content, parameters, config)
    
    return https_fn.Response(
        json.dumps({"meta": meta }),
        status=200,
        headers={"Content-Type": "application/json"}
    )
    