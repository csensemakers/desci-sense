from typing import Optional, List, Dict, TypedDict


class OntologyItem(TypedDict):
    URI: str
    Name: Optional[str]
    display_name: Optional[str]
    label: Optional[str]
    prompt: Optional[str]
    notes: Optional[str]
    valid_subject_types: Optional[str]
    valid_object_types: Optional[str]
    versions: Optional[str]


class KeywordsSupport(TypedDict):
    keyWordsOntology: OntologyItem


class RefMeta(TypedDict):
    title: str
    description: str
    image: str


class ReflabelsSupport(TypedDict):
    labelsOntology: List[OntologyItem]
    refsMeta: Dict[str, RefMeta]


class ParsedSupport(TypedDict):
    keywords: KeywordsSupport
    refLabels: ReflabelsSupport


class AppPostSemantics(TypedDict):
    triplets: List[str]


class ParserResult(TypedDict):
    semantics: AppPostSemantics
    support: ParsedSupport
