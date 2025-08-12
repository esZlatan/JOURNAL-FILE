"""
MetaTrader client for connecting to MT4/MT5 terminal
"""

import socket
import json
import time
import logging
from typing import Dict, List, Any, Optional, Tuple, Union
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MTClientError(Exception):
    """Custom exception for MT client errors"""
    pass

class MTClient:
    """
    Client for connecting to MetaTrader terminal via socket
    Uses a custom EA (Expert Advisor) that should be installed in the MT terminal
    The EA opens a socket server that this client connects to
    """
    
    def __init__(
        self, 
        host: str = "localhost", 
        port: int = 9876,
        timeout: int = 10,
        reconnect_attempts: int = 3
    ):
        """
        Initialize MT client
        
        Args:
            host: Host address where MT EA socket server is running
            port: Port number for the socket connection
            timeout: Socket timeout in seconds
            reconnect_attempts: Number of reconnection attempts
        """
        self.host = host
        self.port = port
        self.timeout = timeout
        self.reconnect_attempts = reconnect_attempts
        self.socket = None
        self.connected = False
        self.last_error = None
        self.last_sync = None
    
    def connect(self) -> bool:
        """
        Connect to MT terminal
        
        Returns:
            True if connection successful, False otherwise
        """
        for attempt in range(self.reconnect_attempts):
            try:
                logger.info(f"Connecting to MT terminal at {self.host}:{self.port} (attempt {attempt+1})")
                self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                self.socket.settimeout(self.timeout)
                self.socket.connect((self.host, self.port))
                self.connected = True
                logger.info("Connected to MT terminal")
                return True
            except socket.error as e:
                self.last_error = str(e)
                logger.error(f"Failed to connect to MT terminal: {e}")
                if self.socket:
                    self.socket.close()
                time.sleep(1)  # Wait before retrying
        
        logger.error(f"Failed to connect after {self.reconnect_attempts} attempts")
        return False
    
    def disconnect(self) -> bool:
        """
        Disconnect from MT terminal
        
        Returns:
            True if disconnection successful, False otherwise
        """
        if not self.connected or not self.socket:
            return True
            
        try:
            self.socket.close()
            self.connected = False
            self.socket = None
            logger.info("Disconnected from MT terminal")
            return True
        except socket.error as e:
            self.last_error = str(e)
            logger.error(f"Error disconnecting from MT terminal: {e}")
            return False
    
    def send_command(self, command: Dict[str, Any]) -> Dict[str, Any]:
        """
        Send command to MT terminal and get response
        
        Args:
            command: Command dictionary to send
            
        Returns:
            Response from MT terminal
            
        Raises:
            MTClientError: If not connected or command fails
        """
        if not self.connected or not self.socket:
            raise MTClientError("Not connected to MT terminal")
            
        try:
            # Send command as JSON
            command_json = json.dumps(command) + "\n"
            self.socket.sendall(command_json.encode())
            
            # Receive response
            response_data = b""
            while True:
                chunk = self.socket.recv(4096)
                if not chunk:
                    break
                response_data += chunk
                if b"\n" in chunk:  # End of message marker
                    break
            
            response = json.loads(response_data.decode().strip())
            return response
        except (socket.error, json.JSONDecodeError) as e:
            self.last_error = str(e)
            logger.error(f"Error sending command to MT terminal: {e}")
            self.connected = False
            raise MTClientError(f"Failed to communicate with MT terminal: {e}")
    
    def get_account_info(self) -> Dict[str, Any]:
        """
        Get account information from MT terminal
        
        Returns:
            Account information
        """
        command = {"command": "GET_ACCOUNT_INFO"}
        return self.send_command(command)
    
    def get_open_trades(self) -> List[Dict[str, Any]]:
        """
        Get open trades from MT terminal
        
        Returns:
            List of open trades
        """
        command = {"command": "GET_OPEN_TRADES"}
        response = self.send_command(command)
        return response.get("trades", [])
    
    def get_closed_trades(
        self, 
        from_date: Optional[Union[datetime, str]] = None,
        to_date: Optional[Union[datetime, str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Get closed trades from MT terminal
        
        Args:
            from_date: Start date for trade history (optional)
            to_date: End date for trade history (optional)
            
        Returns:
            List of closed trades
        """
        if isinstance(from_date, datetime):
            from_date = from_date.strftime("%Y-%m-%d %H:%M:%S")
        
        if isinstance(to_date, datetime):
            to_date = to_date.strftime("%Y-%m-%d %H:%M:%S")
            
        command = {
            "command": "GET_CLOSED_TRADES",
            "from_date": from_date,
            "to_date": to_date
        }
        response = self.send_command(command)
        self.last_sync = datetime.now().isoformat()
        return response.get("trades", [])
    
    def get_instruments(self) -> List[Dict[str, Any]]:
        """
        Get available trading instruments from MT terminal
        
        Returns:
            List of instruments
        """
        command = {"command": "GET_INSTRUMENTS"}
        response = self.send_command(command)
        return response.get("instruments", [])
    
    def get_historical_data(
        self,
        symbol: str,
        timeframe: str,
        from_date: Union[datetime, str],
        to_date: Union[datetime, str]
    ) -> List[Dict[str, Any]]:
        """
        Get historical price data from MT terminal
        
        Args:
            symbol: Instrument symbol
            timeframe: Chart timeframe (e.g., "M1", "H1", "D1")
            from_date: Start date
            to_date: End date
            
        Returns:
            List of historical price data points
        """
        if isinstance(from_date, datetime):
            from_date = from_date.strftime("%Y-%m-%d %H:%M:%S")
        
        if isinstance(to_date, datetime):
            to_date = to_date.strftime("%Y-%m-%d %H:%M:%S")
            
        command = {
            "command": "GET_HISTORICAL_DATA",
            "symbol": symbol,
            "timeframe": timeframe,
            "from_date": from_date,
            "to_date": to_date
        }
        response = self.send_command(command)
        return response.get("data", [])