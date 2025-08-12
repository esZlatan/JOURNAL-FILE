"""
MetaTrader servers management module - handles server lists for MT4/MT5
"""

import os
import csv
import json
import logging
import time
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
DATA_DIR = Path("data")
DEFAULT_LIST_PATH = DATA_DIR / "local_list.json"
CUSTOM_LIST_PATH = DATA_DIR / "custom.csv"
CACHE_EXPIRY_SECONDS = 86400  # 24 hours

# Ensure data directory exists
DATA_DIR.mkdir(exist_ok=True)

# Cache for server lists
_server_cache = {
    "timestamp": 0,
    "servers": {}
}


def load_servers(force_reload: bool = False) -> Dict[str, List[str]]:
    """
    Load MT server lists from local files (local_list.json and custom.csv)
    
    Args:
        force_reload: Force reload from disk even if cache is valid
        
    Returns:
        Dictionary of server lists by platform type (MT4/MT5)
    """
    global _server_cache
    
    current_time = time.time()
    
    # Return cached data if it's still valid and not forced to reload
    if not force_reload and current_time - _server_cache["timestamp"] < CACHE_EXPIRY_SECONDS:
        logger.debug("Using cached server lists")
        return _server_cache["servers"]
    
    logger.info("Loading MT server lists from files")
    
    servers = {
        "MT4": [],
        "MT5": []
    }
    
    # Load default server list from JSON
    try:
        if DEFAULT_LIST_PATH.exists():
            with open(DEFAULT_LIST_PATH, 'r') as f:
                default_servers = json.load(f)
                for platform in ["MT4", "MT5"]:
                    if platform in default_servers:
                        servers[platform].extend(default_servers[platform])
            logger.info(f"Loaded {len(servers['MT4'])} MT4 and {len(servers['MT5'])} MT5 servers from default list")
        else:
            # Create empty default list if not exists
            logger.warning(f"Default server list not found at {DEFAULT_LIST_PATH}, creating empty file")
            with open(DEFAULT_LIST_PATH, 'w') as f:
                json.dump({"MT4": [], "MT5": []}, f, indent=2)
    except (json.JSONDecodeError, IOError) as e:
        logger.error(f"Error loading default server list: {e}")
    
    # Load custom server list from CSV
    try:
        if CUSTOM_LIST_PATH.exists():
            with open(CUSTOM_LIST_PATH, 'r', newline='') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    platform = row.get('platform', '').upper()
                    name = row.get('name', '')
                    if platform in ["MT4", "MT5"] and name:
                        servers[platform].append(name)
            logger.info(f"Added custom servers: total now {len(servers['MT4'])} MT4 and {len(servers['MT5'])} MT5")
        else:
            # Create empty custom list if not exists
            logger.warning(f"Custom server list not found at {CUSTOM_LIST_PATH}, creating empty file")
            with open(CUSTOM_LIST_PATH, 'w', newline='') as f:
                writer = csv.writer(f)
                writer.writerow(['platform', 'name', 'added_by', 'added_on'])
    except IOError as e:
        logger.error(f"Error loading custom server list: {e}")
    
    # Update cache
    _server_cache = {
        "timestamp": current_time,
        "servers": servers
    }
    
    return servers


def search_servers(q: str, platform: str = "MT5", limit: int = 25) -> List[Dict[str, str]]:
    """
    Search for MT servers by name
    
    Args:
        q: Search query string
        platform: Platform type (MT4 or MT5)
        limit: Maximum number of results to return
        
    Returns:
        List of matching servers
    """
    platform = platform.upper()
    if platform not in ["MT4", "MT5"]:
        logger.warning(f"Invalid platform: {platform}, defaulting to MT5")
        platform = "MT5"
    
    servers = load_servers()
    platform_servers = servers.get(platform, [])
    
    # If query is empty, return first {limit} servers
    if not q:
        return [{"name": server} for server in platform_servers[:limit]]
    
    # Filter servers by query
    q = q.lower()
    matching_servers = [
        {"name": server} for server in platform_servers
        if q in server.lower()
    ]
    
    # Return sorted results up to the limit
    return sorted(matching_servers, key=lambda x: x["name"])[:limit]


def add_custom_server(name: str, platform: str = "MT5", added_by: str = "user") -> bool:
    """
    Add a custom MT server to the list
    
    Args:
        name: Server name
        platform: Platform type (MT4 or MT5)
        added_by: User identifier who added this server
        
    Returns:
        True if successful, False otherwise
    """
    platform = platform.upper()
    if platform not in ["MT4", "MT5"]:
        logger.warning(f"Invalid platform: {platform}, defaulting to MT5")
        platform = "MT5"
    
    try:
        # Ensure the directory exists
        DATA_DIR.mkdir(exist_ok=True)
        
        # Create file with headers if it doesn't exist
        if not CUSTOM_LIST_PATH.exists():
            with open(CUSTOM_LIST_PATH, 'w', newline='') as f:
                writer = csv.writer(f)
                writer.writerow(['platform', 'name', 'added_by', 'added_on'])
        
        # Append new server
        with open(CUSTOM_LIST_PATH, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([platform, name, added_by, datetime.now().isoformat()])
        
        # Force cache reload
        load_servers(force_reload=True)
        logger.info(f"Added custom {platform} server: {name}")
        return True
    except IOError as e:
        logger.error(f"Error adding custom server: {e}")
        return False