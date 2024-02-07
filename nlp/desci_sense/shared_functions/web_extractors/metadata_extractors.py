from typing import List
from enum import Enum
from dataclasses import dataclass

from .citoid import fetch_citation, fetch_all_citations

class MetadataExtractionType(Enum):
    NONE = "none"
    CITOID = "citoid"

@dataclass
class RefMetadata:
    url: str
    item_type: str = None
    title: str = ""
    summary: str = ""

    def to_str(self):
        """
        Prints each attribute on a new line in the form: attribute: value
        """
        result = []
        for attr, value in vars(self).items():
            if isinstance(value, str) or value is None:
                value = value or "None"  # Convert None or empty strings to "None"
                result.append(f"{attr}: {value}")
        return "\n".join(result)
        


def normalize_citoid_metadata(metadata_list: List[dict], max_summary_length):
    results = []
    for metadata in metadata_list:
        results.append(RefMetadata(**
            {
                "url": metadata.get("url", None),
                "item_type": metadata.get("itemType", None),
                "title": metadata.get("title", ""),
                "summary": metadata.get("abstractNote", "")[:max_summary_length]
             })
        )
    return results


def extract_citoid_metadata(target_url, max_summary_length):
    
    citoid_metadata = [fetch_citation(target_url)]
    assert len(citoid_metadata) == 1
    return normalize_citoid_metadata(citoid_metadata, max_summary_length)[0]



def extract_metadata_by_type(target_url, md_type: MetadataExtractionType, max_summary_length) -> List[RefMetadata]:
    """_summary_

    Args:
        target_url (_type_): _description_
        md_type (MetadataExtractionType): _description_

    Returns:
        List[RefMetadata]: _description_
    """
    if md_type == MetadataExtractionType.NONE:
        return []
    if md_type == MetadataExtractionType.CITOID:
        return [extract_citoid_metadata(target_url, max_summary_length)]
    else:
        raise ValueError(f"Unsupported extraaction type:{md_type.value}")
    

def extract_urls_citoid_metadata(target_urls: List[str]):
    """_summary_

    Args:
        target_urls (List[str]): _description_
    """
    if len(target_urls) == 0:
        return []
    if len(target_urls) == 1:
        return [extract_citoid_metadata(target_urls[0])]
    else:
        # use parallel call
        metadatas_raw = fetch_all_citations(target_urls)
        return [normalize_citoid_metadata(md) for md in metadatas_raw]
    

def extract_all_metadata_by_type(target_urls, md_type: MetadataExtractionType) -> List[RefMetadata]:
    """_summary_

    Args:
        target_url (_type_): _description_
        md_type (MetadataExtractionType): _description_

    Returns:
        List[RefMetadata]: _description_
    """
    if md_type == MetadataExtractionType.NONE:
        return []
    if md_type == MetadataExtractionType.CITOID:
        return extract_urls_citoid_metadata(target_urls)
    else:
        raise ValueError(f"Unsupported extraction type:{md_type.value}")