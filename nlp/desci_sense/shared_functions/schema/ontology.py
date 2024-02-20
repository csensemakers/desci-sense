keyWordsOntology = {
    "Name": "keyword",
    "display_name": "has-keyword",
    "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e441",
    "label": "has-keyword",
}

refLabelsOntoloty = [
    {
        "Name": "disagrees",
        "display_name": "👎 disagrees-with",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e449",
        "label": "disagrees",
        "prompt": "this post disputes or expresses disagreement with statements, ideas or conclusions presented in the mentioned reference.",
        "notes": None,
        "valid_subject_types": ["post", "ref"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "agrees",
        "display_name": "👍 agrees-with",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e1001",
        "label": "agrees",
        "prompt": "this post expresses agreement with statements, ideas or conclusions presented in the mentioned reference.",
        "notes": None,
        "valid_subject_types": ["post", "ref"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "possible-missing-reference",
        "display_name": "⬛ possible-missing-reference",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e1002",
        "label": "missing-ref",
        "prompt": "this post seems to be referring to a reference by name but has not explicitly provided a URL link to the reference. For example, a post that discusses a book and mentions it by title, but contains no link to the book.",
        "notes": None,
        "valid_subject_types": ["post"],
        "valid_object_types": ["nan"],
        "versions": ["v0"],
    },
    {
        "Name": "dg-observation",
        "display_name": "🔭 discourse-graph/observation",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e1003",
        "label": "dg-observation",
        "prompt": "this post is articulating a single, highly observation. The intuition is that observation notes should be as close to “the data” as possible. They should be similar to how results are described in results sections of academic publications.",
        "notes": None,
        "valid_subject_types": ["post"],
        "valid_object_types": ["nan"],
        "versions": ["v0"],
    },
    {
        "Name": "dg-claim",
        "display_name": "🫴 discourse-graph/claim",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e1004",
        "label": "dg-claim",
        "prompt": "this post is articulating an idea or a claim",
        "notes": None,
        "valid_subject_types": ["post"],
        "valid_object_types": ["nan"],
        "versions": ["v0"],
    },
    {
        "Name": "dg-question",
        "display_name": " ❓ discourse-graph/question",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e1005",
        "label": "dg-question",
        "prompt": "this post is raising a research question.",
        "notes": None,
        "valid_subject_types": ["post"],
        "valid_object_types": ["nan"],
        "versions": ["v0"],
    },
    {
        "Name": "watching-consumption-status",
        "display_name": "👀 watching-status",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e1006",
        "label": "watching",
        "prompt": "this post describes the watching status of the author in relation to a reference, such as a video or movie. The author may have watched the content in the past, is watching the content in the present, or is looking forward to watching the content in the future.",
        "notes": None,
        "valid_subject_types": ["post"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "reading-consumption-status",
        "display_name": "📑 reading-status",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e1007",
        "label": "reading",
        "prompt": "this post describes the reading status of the author in relation to a reference, such as a book or article. The author may either have read the reference in the past, is reading the reference in the present, or is looking forward to reading the reference in the future.",
        "notes": None,
        "valid_subject_types": ["post"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "listening-consumption-status",
        "display_name": "🎧 listening-status",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e1008",
        "label": "listening",
        "prompt": "this post describes the listening status of the author in relation to a reference, such as a podcast or radio station. The author may have listened to the content in the past, is listening to the content in the present, or is looking forward to listening the content in the future.",
        "notes": None,
        "valid_subject_types": ["post"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "links to",
        "display_name": "🔗 links-to",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e1159",
        "label": "default",
        "prompt": "This is a special tag. Use this tag if none of the tags above are suitable.",
        "notes": "default predicate for a mention of a URL (always applicable)",
        "valid_subject_types": ["post"],
        "valid_object_types": ["ref", "nan"],
        "versions": ["v0"],
    },
    {
        "Name": "reviews",
        "display_name": "🧐 reviews",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e1009",
        "label": "review",
        "prompt": "this post contains a review of another reference, such as a book, article or movie. The review could be positive or negative. A review can be detailed or a simple short endorsement.",
        "notes": None,
        "valid_subject_types": ["post", "ref"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "recommends",
        "display_name": "👌 recommends",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e10010",
        "label": "recommendation",
        "prompt": "The author is recommending any kind of content: an article, a movie, podcast, book, another post, etc. This tag can also be used for cases of implicit recommendation, where the author is expressing enjoyment of some content but not explicitly recommending it.",
        "notes": None,
        "valid_subject_types": ["post", "ref"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "asks-question-about",
        "display_name": "❔ ask-question-about",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e10011",
        "label": "question",
        "prompt": "this post is raising a question or questions about some content it's referring to. The content could be a research paper or other media like a podcast, video or blog post.",
        "notes": None,
        "valid_subject_types": ["post", "ref"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "Includes-quotation-from",
        "display_name": "📝 quotes-from",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e649",
        "label": "quote",
        "prompt": 'this post is quoting text from an article it\'s referring to. Symbols like ">" or quotation marks are often used to indicate quotations.',
        "notes": None,
        "valid_subject_types": ["post", "ref"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "Discussion",
        "display_name": "🗣️ discusses",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e468",
        "label": "discussion",
        "prompt": "this post discusses how the cited reference relates to other facts or claims. For example, post might discuss how the cited reference informs questions, provides evidence, or supports or opposes claims.",
        "notes": None,
        "valid_subject_types": ["post", "ref"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "Announcement-event",
        "display_name": "🗓️ announces-event",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e10012",
        "label": "event",
        "prompt": "this post includes an invitation to an event, either a real-world or an online event. Any kind of event is relevant, some examples of such events could be seminars, meetups, or hackathons. This tag shold only be used for invitations to events, not for posts describing other kinds of events.",
        "notes": None,
        "valid_subject_types": ["post"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "announcement-job",
        "display_name": "📢 announces-job",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e10013",
        "label": "job",
        "prompt": "this post describes a job listing, for example a call for graduate students or faculty applications.",
        "notes": None,
        "valid_subject_types": ["post"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
    {
        "Name": "Announcement-research",
        "display_name": "📢 announces",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e10014",
        "label": "announce",
        "prompt": "this post contains an announcement of new research. The announcement is likely made by the authors but may be a third party. We use a broad definition of research that includes classic and non-traditional outputs. Classic outputs include papers, datasets or code. Non traditional outputs can include a podcast, blog post, video explainers, etc.",
        "notes": None,
        "valid_subject_types": ["post", "ref"],
        "valid_object_types": ["ref"],
        "versions": ["v0"],
    },
]
