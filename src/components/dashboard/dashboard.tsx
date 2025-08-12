import { useState } from "react";
import { Calendar, Filter, Settings, DollarSign, RefreshCcw, ChevronDown, Plus, TrendingUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TradingCalendar } from "./trading-calendar";
import { ProgressTrackerEnhanced } from "./progress-tracker-enhanced";
import { StatsCard, WidgetControls, AdditionalStatsCards } from "./dashboard-widgets";
import { UpcomingEvents } from "./upcoming-events";
import { SnapshotWidget } from "./snapshot-widget";
import { format } from "date-fns";
import { CalendarDatePicker } from "@/components/ui/calendar-date-picker";
import { FilterPopover } from "@/components/filters/filter-popover";
import { 
  SettingsDialog,
  PnLDisplayMode 
} from "@/components/ui/settings-dialog";
import { PnLDisplaySelector } from "@/components/filters/pnl-display-selector";
import { ZeltaScore } from "@/components/dashboard/zelta-score";
import { 
  CumulativePnLChart, 
  DrawdownChart, 
  MonthlyCalendar, 
  TradeTimePerformance, 
  TradeDurationPerformance, 
  DayOfWeekPerformance 
} from "@/components/dashboard/performance-charts";
import { RecentTradesTable } from "@/components/dashboard/recent-trades-table";
import { RecentTradesWidget } from "@/components/dashboard/recent-trades-widget";
import { AccountBalance } from "@/components/dashboard/account-balance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data for recent trades
const recentTrades = [
  { id: 1, symbol: "XAUUSD", type: "Long", entry: 180.25, exit: 185.75, profit: 550, date: "2025-08-07" },
  { id: 2, symbol: "XAUUSD", type: "Short", entry: 420.50, exit: 415.25, profit: 525, date: "2025-08-07" },
  { id: 3, symbol: "XAUUSD", type: "Long", entry: 245.75, exit: 238.50, profit: -725, date: "2025-08-06" },
  { id: 4, symbol: "XAUUSD", type: "Long", entry: 510.25, exit: 525.50, profit: 1525, date: "2025-08-06" },
  { id: 5, symbol: "XAUUSD", type: "Short", entry: 175.25, exit: 178.75, profit: -350, date: "2025-08-05" },
];

export default function Dashboard() {
  const [startDate, setStartDate] = useState<Date>(new Date(2025, 6, 9)); // July 9th, 2025
  const [endDate, setEndDate] = useState<Date>(new Date(2025, 7, 8)); // August 8th, 2025
  const [showAdditionalStats, setShowAdditionalStats] = useState<boolean>(true);
  const [showWidgetDialog, setShowWidgetDialog] = useState<boolean>(false);
  const [pnlDisplayMode, setPnlDisplayMode] = useState<PnLDisplayMode>("dollar");
  const [lastSyncDate, setLastSyncDate] = useState<string>("2025-08-08 10:15 AM");
  const [hideValues, setHideValues] = useState(false); // Note: This is now controlled by the privacy mode
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(["winningStreak", "profitFactor", "dayWinPercentage", "maxDrawdown"]);

  // Calculate summary metrics
  const totalProfit = recentTrades.reduce((sum, trade) => sum + trade.profit, 0);
  const winningTrades = recentTrades.filter(trade => trade.profit > 0);
  const winRate = (winningTrades.length / recentTrades.length) * 100;
  const averageWin = winningTrades.reduce((sum, trade) => sum + trade.profit, 0) / winningTrades.length;
  const averageLoss = recentTrades.filter(trade => trade.profit < 0).reduce((sum, trade) => sum + trade.profit, 0) / 
    (recentTrades.length - winningTrades.length) || 0;

  // This would be called when syncing data
  const handleSync = () => {
    // In a real app, this would trigger an API call to fetch the latest data
    setLastSyncDate(`${format(new Date(), "yyyy-MM-dd h:mm a")}`);
  };

  const handleAddWidget = () => {
    setShowWidgetDialog(true);
  };

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId) 
        : [...prev, widgetId]
    );
    setShowWidgetDialog(false);
  };

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
    <main className="flex-1 overflow-y-auto p-6">
      <div className="space-y-6">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Trading Dashboard</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <CalendarDatePicker 
                date={startDate}
                setDate={(date) => date && setStartDate(date)} 
              />
              <span className="text-sm text-muted-foreground">to</span>
              <CalendarDatePicker 
                date={endDate}
                setDate={(date) => date && setEndDate(date)} 
              />
            </div>
            <FilterPopover />
            <PnLDisplaySelector value={pnlDisplayMode} onChange={setPnlDisplayMode} />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-gray-400 hover:text-white"
              onClick={() => setShowAdditionalStats(!showAdditionalStats)}
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <div className="text-sm text-gray-500">
            Last sync: {lastSyncDate}
          </div>
          <Button size="sm" variant="outline" onClick={handleSync} className="ml-2">
            <RefreshCcw className="h-4 w-4 mr-1" /> Sync
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                Add widget <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Add widgets</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toggleWidget("winningStreak")}>
                <div className="flex items-center">
                  {selectedWidgets.includes("winningStreak") ? "✓ " : ""} Winning Streak
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleWidget("losingStreak")}>
                <div className="flex items-center">
                  {selectedWidgets.includes("losingStreak") ? "✓ " : ""} Losing Streak
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleWidget("profitFactor")}>
                <div className="flex items-center">
                  {selectedWidgets.includes("profitFactor") ? "✓ " : ""} Profit Factor
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleWidget("dayWinPercentage")}>
                <div className="flex items-center">
                  {selectedWidgets.includes("dayWinPercentage") ? "✓ " : ""} Day Win %
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleWidget("avgDrawdown")}>
                <div className="flex items-center">
                  {selectedWidgets.includes("avgDrawdown") ? "✓ " : ""} Average Drawdown
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleWidget("maxDrawdown")}>
                <div className="flex items-center">
                  {selectedWidgets.includes("maxDrawdown") ? "✓ " : ""} Maximum Drawdown
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total P/L"
            value={formatPnL(totalProfit)}
            trend={totalProfit >= 0 ? "up" : "down"}
            valueClass={totalProfit >= 0 ? "text-emerald-500" : "text-rose-500"}
            description={`${format(startDate, "MM/dd/yyyy")} - ${format(endDate, "MM/dd/yyyy")}`}
            hideValues={hideValues}
          />
          <StatsCard
            title="Win Rate"
            value={`${winRate.toFixed(1)}%`}
            description={`${recentTrades.length} total trades`}
            hideValues={hideValues}
          />
          <StatsCard
            title="Avg Win"
            value={formatPnL(averageWin)}
            trend="up"
            valueClass="text-emerald-500"
            description={`${winningTrades.length} winning trades`}
            hideValues={hideValues}
          />
          <StatsCard
            title="Avg Loss"
            value={formatPnL(Math.abs(averageLoss))}
            trend="down"
            valueClass="text-rose-500"
            description={`${recentTrades.length - winningTrades.length} losing trades`}
            hideValues={hideValues}
          />
          
          {showAdditionalStats && (
            <>
              {selectedWidgets.includes("winningStreak") && (
                <StatsCard
                  title="Winning Streak"
                  value="3 trades"
                  trend="up"
                  description="Current streak"
                  hideValues={hideValues}
                />
              )}
              {selectedWidgets.includes("losingStreak") && (
                <StatsCard
                  title="Losing Streak"
                  value="0 trades"
                  description="Current streak"
                  hideValues={hideValues}
                />
              )}
              {selectedWidgets.includes("profitFactor") && (
                <StatsCard
                  title="Profit Factor"
                  value="1.62"
                  trend="up"
                  description="Gross profit / Gross loss"
                  hideValues={hideValues}
                />
              )}
              {selectedWidgets.includes("dayWinPercentage") && (
                <StatsCard
                  title="Day Win %"
                  value="60%"
                  icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                  description="3/5 winning days"
                  hideValues={hideValues}
                />
              )}
              {selectedWidgets.includes("avgDrawdown") && (
                <StatsCard
                  title="Avg Drawdown"
                  value="-2.8%"
                  trend="down"
                  valueClass="text-rose-500"
                  description="Average peak to trough"
                  hideValues={hideValues}
                />
              )}
              {selectedWidgets.includes("maxDrawdown") && (
                <StatsCard
                  title="Max Drawdown"
                  value="-5.2%"
                  trend="down"
                  valueClass="text-rose-500"
                  description="$-725.00 peak to trough"
                  hideValues={hideValues}
                />
              )}
              {selectedWidgets.includes("accountPnL") && (
                <StatsCard
                  title="Account P&L"
                  value="$12,450.75"
                  trend="up"
                  valueClass="text-emerald-500"
                  description="+8.3% all time"
                  hideValues={hideValues}
                />
              )}
              {selectedWidgets.includes("tradeExpectancy") && (
                <StatsCard
                  title="Trade Expectancy"
                  value="$85.20"
                  trend="up"
                  valueClass="text-emerald-500"
                  description="Average profit per trade"
                  hideValues={hideValues}
                />
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Zlatan score</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ZeltaScore hideValues={hideValues} />
              </CardContent>
            </Card>
            <div className="mt-6">
              <ProgressTrackerEnhanced hideValues={hideValues} />
            </div>
            <div className="mt-6">
              <SnapshotWidget hideValues={hideValues} />
            </div>
          </div>
          <div className="md:col-span-3">
            <Tabs defaultValue="recent-trades" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recent-trades">Recent Trades</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profit/Loss</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <CumulativePnLChart hideValues={hideValues} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Win Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <DayOfWeekPerformance hideValues={hideValues} />
                    </CardContent>
                  </Card>
                </div>
                <RecentTradesWidget 
                  hideValues={hideValues} 
                  pnlDisplayMode={pnlDisplayMode} 
                />
              </TabsContent>
              <TabsContent value="recent-trades">
                <RecentTradesWidget 
                  hideValues={hideValues} 
                  pnlDisplayMode={pnlDisplayMode} 
                />
              </TabsContent>
              <TabsContent value="upcoming">
                <UpcomingEvents />
              </TabsContent>
              <TabsContent value="calendar">
                <div className="grid gap-4 md:grid-cols-1">
                  <TradingCalendar hideValues={hideValues} />
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <AccountBalance hideValues={hideValues} />
                  <DrawdownChart hideValues={hideValues} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <TradeTimePerformance hideValues={hideValues} />
                  <TradeDurationPerformance hideValues={hideValues} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={showWidgetDialog} onOpenChange={setShowWidgetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Dashboard Widgets</DialogTitle>
            <DialogDescription>
              Select which widgets to display on your trading dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "winningStreak", name: "Winning Streak" },
                { id: "losingStreak", name: "Losing Streak" },
                { id: "profitFactor", name: "Profit Factor" },
                { id: "dayWinPercentage", name: "Day Win %" },
                { id: "avgDrawdown", name: "Average Drawdown" },
                { id: "maxDrawdown", name: "Maximum Drawdown" },
                { id: "accountPnL", name: "Account P&L" },
                { id: "tradeExpectancy", name: "Trade Expectancy" }
              ].map(widget => (
                <div key={widget.id} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id={`widget-${widget.id}`} 
                    checked={selectedWidgets.includes(widget.id)}
                    onChange={() => toggleWidget(widget.id)}
                    className="h-4 w-4"
                  />
                  <label htmlFor={`widget-${widget.id}`}>{widget.name}</label>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowWidgetDialog(false)} className="w-full">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}