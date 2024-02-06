def SM_FUNCTION_post_tagger_imp(content, parameters) -> dict:
    
    tags = parameters["options"]
    tags = [tag for tag in tags if tag in content]
        
    return {"tags": tags }
    