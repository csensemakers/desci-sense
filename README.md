# DeSci Sensemaking Networks

## Installation

Code is being developed on Ubuntu 22.04 with Python 3.11

- Create a new environment (here we’re using Anaconda as package manager):
    
    ```
    conda create -n ENV_NAME python=3.11
    ```
    
- Activate the environment
- From repo root, install requirements:
    
    ```
    pip install -r requirements.txt
    ```
    
- Add the following lines to your terminal config file (e.g., edit it using `nano ~/.bashrc`)
    
    ```
    export MASTODON_ACCESS_TOKEN="<your-mastodon-api-key-here>" # for accessing Mastodon API
    export OPENROUTER_API_KEY="<your-openrouter-api-key-here>" # for running LLM inference
    export OPENROUTER_REFERRER="http://localhost:3000"
    
    ```
    
    (you may need to close and re-open your terminal for changes to take effect)
    

## Streamlit Demo

### Local Usage

- From repo root, run:
    
    ```
    streamlit run desci_sense/demos/st_demo.py
    ```
    

### Hosted App

TODO