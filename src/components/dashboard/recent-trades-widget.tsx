import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Eye, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PnLDisplayMode } from '@/components/filters/pnl-display-selector';

// Trade type definition
interface Trade {
  id: number;
  symbol: string;
  type: 'Long' | 'Short';
  entry: number;
  exit?: number; // Optional for open trades
  profit?: number; // Optional for open trades
  date: string;
  duration?: string;
  risk?: number;
  reward?: number;
  tags?: string[];
  status?: 'open' | 'closed';
}

interface RecentTradesWidgetProps {
  hideValues: boolean;
  pnlDisplayMode: PnLDisplayMode;
}

export function RecentTradesWidget({ hideValues, pnlDisplayMode }: RecentTradesWidgetProps) {
  const [selectedTab, setSelectedTab] = useState<string>('recent');
  const [hoveredTrade, setHoveredTrade] = useState<number | null>(null);

  // Sample data - would come from API in real app
  const recentTrades: Trade[] = [
    { id: 1, symbol: "EURUSD", type: "Long", entry: 1.1250, exit: 1.1320, profit: 70, date: "2025-08-10", duration: "3h 15m", risk: 1.5, reward: 2.1, tags: ["Breakout", "NFP"], status: "closed" },
    { id: 2, symbol: "GBPUSD", type: "Short", entry: 1.2610, exit: 1.2550, profit: 60, date: "2025-08-09", duration: "5h 45m", risk: 2.0, reward: 1.8, tags: ["Reversal"], status: "closed" },
    { id: 3, symbol: "XAUUSD", type: "Long", entry: 2105.75, exit: 2095.25, profit: -105, date: "2025-08-08", duration: "1d 2h", risk: 1.0, reward: 3.0, tags: ["Trend"], status: "closed" },
    { id: 4, symbol: "USDJPY", type: "Short", entry: 149.25, exit: 147.80, profit: 145, date: "2025-08-07", duration: "2d 1h", risk: 1.5, reward: 2.5, tags: ["Support/Resistance"], status: "closed" },
    { id: 5, symbol: "BTCUSD", type: "Long", entry: 41250, exit: 42500, profit: 1250, date: "2025-08-06", duration: "3h 30m", risk: 2.0, reward: 2.0, tags: ["Breakout"], status: "closed" },
  ];

  const openTrades: Trade[] = [
    { id: 6, symbol: "ETHUSD", type: "Long", entry: 2350.50, date: "2025-08-10", risk: 1.5, status: "open" },
    { id: 7, symbol: "USOIL", type: "Short", entry: 72.35, date: "2025-08-09", risk: 1.0, status: "open" },
    { id: 8, symbol: "NAS100", type: "Long", entry: 16250.75, date: "2025-08-08", risk: 2.0, status: "open" },
  ];

  // Format profit based on display mode
  const formatProfit = (profit: number) => {
    if (hideValues) {
      return "****";
    }
    
    switch (pnlDisplayMode) {
      case "dollar":
        return `$${profit.toFixed(2)}`;
      case "percentage":
        // Assume 1% is roughly $100 for this example
        return `${(profit / 100).toFixed(2)}%`;
      case "ticks":
        return `${(profit / 5).toFixed(1)} ticks`;
      case "points":
        return `${(profit / 20).toFixed(0)} pts`;
      case "rr":
        // Assuming an average risk of $100 for simplicity
        return `${(profit / 100).toFixed(1)}R`;
      default:
        return `$${profit.toFixed(2)}`;
    }
  };

  // Handle trade hover to show details
  const handleTradeHover = (id: number | null) => {
    setHoveredTrade(id);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>Trading Activity</CardTitle>
          <Button variant="ghost" size="sm" className="h-8">
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" onValueChange={setSelectedTab}>
          <TabsList className="mb-2">
            <TabsTrigger value="recent">Recent Trades</TabsTrigger>
            <TabsTrigger value="open">Open Positions ({openTrades.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-2 p-3 font-medium text-sm border-b bg-muted/50">
                <div className="col-span-2">Symbol</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-2">Entry</div>
                <div className="col-span-2">Exit</div>
                <div className="col-span-2">P/L</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1">Details</div>
              </div>
              <div className="max-h-[400px] overflow-auto">
                {recentTrades.map((trade) => (
                  <div 
                    key={trade.id} 
                    className="grid grid-cols-12 gap-2 p-3 text-sm border-b hover:bg-muted/50 relative"
                    onMouseEnter={() => handleTradeHover(trade.id)}
                    onMouseLeave={() => handleTradeHover(null)}
                  >
                    <div className="col-span-2">{trade.symbol}</div>
                    <div className="col-span-1">
                      <Badge variant={trade.type === 'Long' ? 'default' : 'destructive'} className="font-medium">
                        {trade.type}
                      </Badge>
                    </div>
                    <div className="col-span-2 financial-value">{hideValues ? "****" : trade.entry.toFixed(4)}</div>
                    <div className="col-span-2 financial-value">{hideValues ? "****" : trade.exit?.toFixed(4) || "—"}</div>
                    <div className={`col-span-2 financial-value font-medium ${trade.profit && trade.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.profit ? formatProfit(trade.profit) : "—"}
                    </div>
                    <div className="col-span-2">{trade.date}</div>
                    <div className="col-span-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                              <Info className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left" align="start" className="max-w-[300px]">
                            <div className="space-y-1">
                              <div className="font-medium">{trade.symbol} {trade.type}</div>
                              <div className="text-xs grid grid-cols-2 gap-x-4 gap-y-1">
                                <div>Duration:</div>
                                <div>{trade.duration}</div>
                                <div>Risk:</div>
                                <div className="financial-value">{hideValues ? "****" : `${trade.risk}R`}</div>
                                <div>Reward:</div>
                                <div className="financial-value">{hideValues ? "****" : `${trade.reward}R`}</div>
                                <div>R:R:</div>
                                <div className="financial-value">
                                  {hideValues ? "****" : trade.risk && trade.reward ? (trade.reward / trade.risk).toFixed(2) : "—"}
                                </div>
                              </div>
                              {trade.tags && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {trade.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    {/* Hover detail panel */}
                    {hoveredTrade === trade.id && (
                      <div className="absolute right-0 top-0 bottom-0 w-32 bg-background/95 border-l shadow-sm flex flex-col justify-center items-center p-2 text-xs">
                        <div className="font-medium">{trade.symbol}</div>
                        <div className="mt-1">Risk: {hideValues ? "****" : `${trade.risk}R`}</div>
                        <div>Reward: {hideValues ? "****" : `${trade.reward}R`}</div>
                        <div className="mt-1">
                          {trade.tags?.map(tag => (
                            <Badge key={tag} variant="outline" className="text-[10px] mr-1">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="open">
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-2 p-3 font-medium text-sm border-b bg-muted/50">
                <div className="col-span-3">Symbol</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Entry</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1">Risk</div>
                <div className="col-span-2">PnL</div>
              </div>
              <div className="max-h-[400px] overflow-auto">
                {openTrades.map((trade) => (
                  <div 
                    key={trade.id} 
                    className="grid grid-cols-12 gap-2 p-3 text-sm border-b hover:bg-muted/50 relative"
                    onMouseEnter={() => handleTradeHover(trade.id)}
                    onMouseLeave={() => handleTradeHover(null)}
                  >
                    <div className="col-span-3">{trade.symbol}</div>
                    <div className="col-span-2">
                      <Badge variant={trade.type === 'Long' ? 'default' : 'destructive'} className="font-medium">
                        {trade.type}
                      </Badge>
                    </div>
                    <div className="col-span-2 financial-value">{hideValues ? "****" : trade.entry.toFixed(5)}</div>
                    <div className="col-span-2">{trade.date}</div>
                    <div className="col-span-1 financial-value">{hideValues ? "****" : `${trade.risk}R`}</div>
                    <div className={`col-span-2 financial-value font-medium ${trade.symbol === "ETHUSD" || trade.symbol === "NAS100" ? 'text-emerald-500' : 'text-red-500'}`}>
                      {hideValues ? "****" : trade.symbol === "ETHUSD" ? '+$154.25' : trade.symbol === "USOIL" ? '-$43.20' : '+$287.50'}
                    </div>
                    
                    {/* Hover detail panel */}
                    {hoveredTrade === trade.id && (
                      <div className="absolute right-0 top-0 bottom-0 w-32 bg-background/95 border-l shadow-sm flex flex-col justify-center items-center p-2 text-xs">
                        <div className="font-medium">{trade.symbol}</div>
                        <div className="mt-1">Entry: {hideValues ? "****" : trade.entry.toFixed(5)}</div>
                        <div>Open since: {trade.date}</div>
                        <Button variant="outline" size="sm" className="mt-2 h-6 text-xs w-full">
                          <Eye className="h-3 w-3 mr-1" /> View Details
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}