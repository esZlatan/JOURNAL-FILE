"""
Routes for broker-related functionality
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from ..services.brokers.mt_servers import search_servers, add_custom_server

router = APIRouter(prefix="/brokers", tags=["brokers"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Request/Response models
class ServerSearchResponse(BaseModel):
    servers: List[Dict[str, str]]


class AddServerRequest(BaseModel):
    name: str
    platform: str = "MT5"


class AddServerResponse(BaseModel):
    success: bool
    server: Optional[Dict[str, str]] = None
    error: Optional[str] = None


# MT4/MT5 server routes
@router.get("/mt5/servers", response_model=ServerSearchResponse)
async def get_mt5_servers(q: str = Query(""), limit: int = Query(25)):
    """
    Search for MT5 servers
    """
    servers = search_servers(q=q, platform="MT5", limit=limit)
    return {"servers": servers}


@router.get("/mt4/servers", response_model=ServerSearchResponse)
async def get_mt4_servers(q: str = Query(""), limit: int = Query(25)):
    """
    Search for MT4 servers
    """
    servers = search_servers(q=q, platform="MT4", limit=limit)
    return {"servers": servers}


@router.post("/mt5/servers", response_model=AddServerResponse)
async def add_mt5_server(request: AddServerRequest, token: str = Depends(oauth2_scheme)):
    """
    Add a custom MT5 server (admin only)
    """
    # TODO: Add proper admin check
    is_admin = True
    
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can add custom servers"
        )
    
    success = add_custom_server(name=request.name, platform="MT5", added_by="admin")
    
    if success:
        return {
            "success": True,
            "server": {"name": request.name}
        }
    else:
        return {
            "success": False,
            "error": "Failed to add custom server"
        }


@router.post("/mt4/servers", response_model=AddServerResponse)
async def add_mt4_server(request: AddServerRequest, token: str = Depends(oauth2_scheme)):
    """
    Add a custom MT4 server (admin only)
    """
    # TODO: Add proper admin check
    is_admin = True
    
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can add custom servers"
        )
    
    success = add_custom_server(name=request.name, platform="MT4", added_by="admin")
    
    if success:
        return {
            "success": True,
            "server": {"name": request.name}
        }
    else:
        return {
            "success": False,
            "error": "Failed to add custom server"
        }