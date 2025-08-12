import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface RecentTradesTableProps {
  hideValues?: boolean;
  trades?: any[];
  pnlDisplayMode?: "dollar" | "percentage" | "ticks" | "points" | "rr";
}

// Sample data for recent trades
const defaultTrades = [
  { id: 1, symbol: "XAUUSD", type: "Long", entry: 180.25, exit: 185.75, profit: 550, date: "2025-08-07" },
  { id: 2, symbol: "XAUUSD", type: "Short", entry: 420.50, exit: 415.25, profit: 525, date: "2025-08-07" },
  { id: 3, symbol: "XAUUSD", type: "Long", entry: 245.75, exit: 238.50, profit: -725, date: "2025-08-06" },
  { id: 4, symbol: "XAUUSD", type: "Long", entry: 510.25, exit: 525.50, profit: 1525, date: "2025-08-06" },
  { id: 5, symbol: "XAUUSD", type: "Short", entry: 175.25, exit: 178.75, profit: -350, date: "2025-08-05" },
];

export function RecentTradesTable({ 
  hideValues = false, 
  trades = defaultTrades,
  pnlDisplayMode = "dollar"
}: RecentTradesTableProps) {
  
  // Format PnL based on display mode
  const formatPnL = (value: number) => {
    if (hideValues) return "***";
    
    switch (pnlDisplayMode) {
      case "dollar":
        return `$${value.toFixed(2)}`;
      case "percentage":
        // Assume 1% is $100 for simplicity
        return `${(value / 100).toFixed(2)}%`;
      case "ticks":
        // Assume 1 tick is $10 for simplicity
        return `${(value / 10).toFixed(0)} ticks`;
      case "points":
        // Assume 1 point is $50 for simplicity
        return `${(value / 50).toFixed(2)} pts`;
      case "rr":
        // Assume R=100 for simplicity
        return `${(value / 100).toFixed(2)}R`;
      default:
        return `$${value.toFixed(2)}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent trades</CardTitle>
            <CardDescription>
              Open positions & recent trades
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            <ChevronDown className="h-4 w-4 mr-1" />
            View More
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead>Exit</TableHead>
              <TableHead>P/L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{trade.date}</TableCell>
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>
                  <Badge 
                    variant={trade.type === "Long" ? "default" : "outline"}
                    className={trade.type === "Short" ? "border-rose-500 text-rose-500" : ""}
                  >
                    {trade.type}
                  </Badge>
                </TableCell>
                <TableCell>{hideValues ? "***" : `$${trade.entry}`}</TableCell>
                <TableCell>{hideValues ? "***" : `$${trade.exit}`}</TableCell>
                <TableCell className={trade.profit >= 0 ? "text-emerald-500" : "text-rose-500"}>
                  {formatPnL(trade.profit)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}