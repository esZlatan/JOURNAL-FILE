"""
Stats services for trading journal backend
Provides methods for calculating various statistics on trading data
"""

from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Union
from enum import Enum
import math


class TradeOutcome(str, Enum):
    WIN = "win"
    LOSS = "loss"
    BREAKEVEN = "breakeven"


class Stats:
    """Stats service for trading data analysis"""

    @staticmethod
    def get_week_range(date_str: Optional[str] = None) -> Dict[str, str]:
        """
        Get week start and end dates from a given date
        If no date provided, uses current date
        
        Args:
            date_str: Date string in format YYYY-MM-DD (optional)
            
        Returns:
            Dict with week_start, week_end and display_week
        """
        if date_str:
            date = datetime.strptime(date_str, "%Y-%m-%d")
        else:
            date = datetime.now()
            
        # Find the Monday (start) of the week
        start = date - timedelta(days=date.weekday())
        # Find the Sunday (end) of the week
        end = start + timedelta(days=6)
        
        return {
            "week_start": start.strftime("%Y-%m-%d"),
            "week_end": end.strftime("%Y-%m-%d"),
            "display_week": f"{start.strftime('%b %d')} - {end.strftime('%b %d, %Y')}"
        }

    @staticmethod
    def is_breakeven_trade(profit: float, threshold: float = 0.5) -> bool:
        """
        Determine if a trade is breakeven based on profit threshold
        
        Args:
            profit: Trade profit/loss amount
            threshold: Amount threshold to consider a trade breakeven
            
        Returns:
            Boolean indicating if trade is breakeven
        """
        return abs(profit) < threshold

    @staticmethod
    def get_weekly_trades(trades: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Group trades by week and calculate stats
        
        Args:
            trades: List of trade objects with date, outcome and profit
            
        Returns:
            List of weekly trade stats
        """
        weekly_trades = {}
        
        for trade in trades:
            trade_date = datetime.fromisoformat(trade["date"].replace("Z", "+00:00"))
            week_range = Stats.get_week_range(trade_date.strftime("%Y-%m-%d"))
            week_key = f"{week_range['week_start']}|{week_range['week_end']}"
            
            if week_key not in weekly_trades:
                weekly_trades[week_key] = {
                    "trades": [],
                    "week_start": week_range["week_start"],
                    "week_end": week_range["week_end"],
                    "display_week": week_range["display_week"]
                }
            
            weekly_trades[week_key]["trades"].append(trade)
        
        # Calculate stats for each week
        weekly_stats = []
        for week_key, week_data in weekly_trades.items():
            trades = week_data["trades"]
            total_trades = len(trades)
            win_count = sum(1 for t in trades if t.get("outcome") == TradeOutcome.WIN)
            loss_count = sum(1 for t in trades if t.get("outcome") == TradeOutcome.LOSS)
            breakeven_count = sum(1 for t in trades if t.get("outcome") == TradeOutcome.BREAKEVEN)
            
            # Calculate total profit for the week
            total_profit = sum(t.get("profit", 0) for t in trades)
            is_breakeven = Stats.is_breakeven_trade(total_profit, threshold=1.0)
            
            # Calculate win rate with one decimal place
            win_rate = 0
            if total_trades > 0:
                win_rate = round((win_count / total_trades) * 100, 1)
            
            weekly_stats.append({
                "week_start": week_data["week_start"],
                "week_end": week_data["week_end"],
                "display_week": week_data["display_week"],
                "total_trades": total_trades,
                "win_count": win_count,
                "loss_count": loss_count,
                "breakeven_count": breakeven_count,
                "win_rate": win_rate,
                "is_breakeven": is_breakeven,
                "total_profit": total_profit
            })
        
        # Sort by week start date
        return sorted(weekly_stats, key=lambda x: x["week_start"])

    @staticmethod
    def get_weekly_wins(trades: List[Dict[str, Any]]) -> List[Dict[str, Union[str, int]]]:
        """
        Get weekly win counts and totals
        
        Args:
            trades: List of trade objects
            
        Returns:
            List of weekly win stats
        """
        weekly_stats = Stats.get_weekly_trades(trades)
        
        return [
            {
                "week_display": week["display_week"],
                "wins": week["win_count"],
                "total": week["total_trades"]
            }
            for week in weekly_stats
        ]

    @staticmethod
    def filter_trades_by_date_range(
        trades: List[Dict[str, Any]],
        start_date: str,
        end_date: str
    ) -> List[Dict[str, Any]]:
        """
        Filter trades by date range
        
        Args:
            trades: List of trade objects
            start_date: Start date in format YYYY-MM-DD
            end_date: End date in format YYYY-MM-DD
            
        Returns:
            Filtered list of trades
        """
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        end = end.replace(hour=23, minute=59, second=59)  # Include full end day
        
        return [
            trade for trade in trades
            if start <= datetime.fromisoformat(trade["date"].replace("Z", "+00:00")) <= end
        ]