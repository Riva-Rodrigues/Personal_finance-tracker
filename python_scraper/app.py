import streamlit as st
from streamlit_tags import st_tags_sidebar
import pandas as pd
import json
from datetime import datetime
from scraper import fetch_html_selenium, save_raw_data, format_data, save_formatted_data, calculate_price, html_to_markdown_with_readability, create_dynamic_listing_model, create_listings_container_model, scrape_url
import re
from urllib.parse import urlparse
import os

URLS = ["https://www.moneycontrol.com/markets/indian-indices/"]  
MODEL_SELECTION = "gemini-1.5-flash"  
TAGS = ["Name", "LTP", "%Chg", "Chg", "Buy Price", "Sell Price", "Buy Qty", "Sell Qty"]

if 'results' not in st.session_state:
    st.session_state['results'] = None
if 'perform_scrape' not in st.session_state:
    st.session_state['perform_scrape'] = False

def generate_unique_folder_name(url):
    timestamp = datetime.now().strftime('%Y_%m_%d__%H_%M_%S')
    domain = urlparse(url).netloc or url.split('/')[0]
    clean_domain = re.sub(r'\W+', '_', re.sub(r'^www\.', '', domain))
    return f"{clean_domain}_{timestamp}"

def scrape_multiple_urls(urls, fields, selected_model):
    output_folder = os.path.join('output', generate_unique_folder_name(urls[0]))
    os.makedirs(output_folder, exist_ok=True)
    
    total_input_tokens = 0
    total_output_tokens = 0
    total_cost = 0
    all_data = []
    first_url_markdown = None
    
    for i, url in enumerate(urls, start=1):
        raw_html = fetch_html_selenium(url)
        markdown = html_to_markdown_with_readability(raw_html)
        if i == 1:
            first_url_markdown = markdown
        
        input_tokens, output_tokens, cost, formatted_data = scrape_url(url, fields, selected_model, output_folder, i, markdown)
        total_input_tokens += input_tokens
        total_output_tokens += output_tokens
        total_cost += cost
        all_data.append(formatted_data)
    
    return output_folder, total_input_tokens, total_output_tokens, total_cost, all_data, first_url_markdown

if not st.session_state['perform_scrape']:
    with st.spinner('Scraping in progress...'):
        output_folder, total_input_tokens, total_output_tokens, total_cost, all_data, first_url_markdown = scrape_multiple_urls(URLS, TAGS, MODEL_SELECTION)
        st.session_state['results'] = (all_data, None, first_url_markdown, total_input_tokens, total_output_tokens, total_cost, output_folder)
        st.session_state['perform_scrape'] = True

if st.session_state['results']:
    all_data, _, _, input_tokens, output_tokens, total_cost, output_folder = st.session_state['results']
    
    st.subheader("Live Stock Market")
    for i, data in enumerate(all_data, start=1):        
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except json.JSONDecodeError:
                st.error(f"Failed to parse data as JSON for URL {i}")
                continue
        
        if isinstance(data, dict) and 'listings' in data:
            df = pd.DataFrame(data['listings'])
        elif isinstance(data, dict):
            df = pd.DataFrame([data])
        else:
            st.error(f"Unexpected data format for URL {i}")
            continue

        st.dataframe(df, use_container_width=True)

hide_menu_style = """
        <style>
        #MainMenu {visibility: hidden;}
        header {visibility: hidden;}
        </style>
        """
st.markdown(hide_menu_style, unsafe_allow_html=True)
