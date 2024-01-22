
DEFAULT_PREDICATE_LABEL = "default"

# map between the predicted label types and corresponding template name
LABEL_TEMPLATE_MAP = {
    'job': 'announcement-job',
    'announce': 'Announcement-research',
    'event': 'Announcement-event',
    'discussion': 'Discussion',
    'quote': 'Includes-quotation-from',
    'question': 'asks-question-about',
    'recommendation': 'recommends',
    'review': 'reviews',
    'default': 'links to',
    'listening': 'listening-consumption-status',
    'reading': 'reading-consumption-status',
    'watching': 'watching-consumption-status'
 }

TEMPLATES = {
    "announcement-job": {
        "prompt": "",
        "description": "",
        "display_name": "📢 announces-job",
        "label": "job",
        "URI": ""
    },
    "Announcement-research": {
        "prompt": "",
        "description": "",
        "display_name": "📢 announces-research",
        "label": "announce",
        "URI": ""
    },
    "Announcement-event": {
        "prompt": "",
        "description": "",
        "display_name": "🗓️ announces-event",
        "label": "event",
        "URI": ""
    },
    "Discussion": {
        "prompt": "",
        "description": "",
        "display_name": "🗣️ discusses",
        "label": "discussion",
        "URI": ""
    },
    "Includes-quotation-from": {
        "prompt": "",
        "description": "",
        "display_name": "📝 quotes-from",
        "label": "quote",
        "URI": ""
    },
    "asks-question-about": {
        "prompt": "",
        "description": "",
        "display_name": "❔ ask-question-about",
        "label": "question",
        "URI": ""
    },
    "recommends": {
        "prompt": "",
        "description": "",
        "display_name": "👌 recommends",
        "label": "recommendation",
        "URI": ""
    },
    "reviews": {
        "prompt": "",
        "description": "",
        "display_name": "🧐 reviews",
        "label": "review",
        "URI": ""
    },
    "links to": {
        "prompt": "",
        "description": "",
        "display_name": "⬛ links-to",
        "label": "default",
        "URI": "https://sparontologies.github.io/cito/current/cito.html#d4e1159"
    },
    "listening-consumption-status": {
        "prompt": "",
        "description": "",
        "display_name": "🎧 listening-status",
        "label": "listening",
        "URI": ""
    },
    "reading-consumption-status": {
        "prompt": "",
        "description": "",
        "display_name": "📑 reading-status",
        "label": "reading",
        "URI": ""
    },
    "watching-consumption-status": {
        "prompt": "",
        "description": "",
        "display_name": "👀 watching-status",
        "label": "watching",
        "URI": ""
    }
}

PREDICATE_LABELS = [x["label"] for x in TEMPLATES.values()]