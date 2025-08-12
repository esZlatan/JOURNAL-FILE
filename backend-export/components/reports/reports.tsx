import { useState } from 'react'
import { Calendar, Download, BarChart, PieChart, LineChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useDisplaySettings } from '@/context/display-settings-context'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock performance data
const mockPerformanceData = {
  totalTrades: 124,
  winningTrades: 76,
  losingTrades: 48,
  winRate: 61.29,
  totalProfit: 15248.32,
  totalLoss: 7452.18,
  netProfit: 7796.14,
  profitFactor: 2.05,
  averageWin: 200.64,
  averageLoss: 155.25,
  largestWin: 1245.87,
  largestLoss: 845.32,
  averageTradeDuration: '3h 15m',
  monthlyData: [
    { month: 'Jan', profit: 950.23, winRate: 58 },
    { month: 'Feb', profit: 1230.45, winRate: 62 },
    { month: 'Mar', profit: 875.12, winRate: 59 },
    { month: 'Apr', profit: 1450.36, winRate: 67 },
    { month: 'May', profit: -350.21, winRate: 42 },
    { month: 'Jun', profit: 1825.75, winRate: 73 },
    { month: 'Jul', profit: 1240.38, winRate: 64 },
    { month: 'Aug', profit: 574.06, winRate: 57 },
  ],
  weekdayPerformance: [
    { day: 'Monday', profit: 1540.25, winRate: 58 },
    { day: 'Tuesday', profit: 2150.75, winRate: 65 },
    { day: 'Wednesday', profit: 1875.42, winRate: 62 },
    { day: 'Thursday', profit: 2350.18, winRate: 67 },
    { day: 'Friday', profit: -120.46, winRate: 51 },
  ],
  strategyPerformance: [
    { name: 'Breakout', profit: 3245.18, winRate: 68, trades: 42 },
    { name: 'Trend Following', profit: 2756.32, winRate: 63, trades: 38 },
    { name: 'Reversal', profit: 1245.87, winRate: 57, trades: 25 },
    { name: 'Scalping', profit: 548.77, winRate: 52, trades: 19 },
  ]
}

export default function Reports() {
  const { privacyMode, displayUnit } = useDisplaySettings()
  const [timeframe, setTimeframe] = useState('ytd')
  
  const formatValue = (value: number): string => {
    if (privacyMode) return '****'
    switch (displayUnit) {
      case 'currency':
        return formatCurrency(value)
      case 'percentage':
        // Simple percentage calculation based on a hypothetical account size of $100,000
        return ((value / 100000) * 100).toFixed(2) + '%'
      case 'pips':
        return `${(value / 10).toFixed(0)} pips` // Simplified conversion
      default:
        return formatCurrency(value)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(new Date())}
          </Button>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              mockPerformanceData.netProfit >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatValue(mockPerformanceData.netProfit)}
            </div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <span>Win: {formatValue(mockPerformanceData.totalProfit)}</span>
              <span className="mx-1">|</span>
              <span>Loss: {formatValue(mockPerformanceData.totalLoss)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPerformanceData.winRate}%</div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <span>W: {mockPerformanceData.winningTrades}</span>
              <span className="mx-1">|</span>
              <span>L: {mockPerformanceData.losingTrades}</span>
              <span className="mx-1">|</span>
              <span>Total: {mockPerformanceData.totalTrades}</span>
            </div>
            <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${mockPerformanceData.winRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPerformanceData.profitFactor}</div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <span>Avg Win: {formatValue(mockPerformanceData.averageWin)}</span>
              <span className="mx-1">|</span>
              <span>Avg Loss: {formatValue(mockPerformanceData.averageLoss)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatValue(mockPerformanceData.largestWin)}
            </div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <span>Worst: {formatValue(-mockPerformanceData.largestLoss)}</span>
              <span className="mx-1">|</span>
              <span>Avg Duration: {mockPerformanceData.averageTradeDuration}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Performance</TabsTrigger>
          <TabsTrigger value="weekday">Day of Week</TabsTrigger>
          <TabsTrigger value="strategy">Strategy Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Monthly Profit</CardTitle>
              <CardDescription>Performance breakdown by month</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] relative">
              <div className="p-6 pt-0 h-[300px] relative">
                <div className="flex flex-col h-full justify-end">
                  <div className="flex items-end h-[220px] space-x-2">
                    {mockPerformanceData.monthlyData.map((month) => (
                      <div key={month.month} className="flex flex-col items-center flex-1">
                        <div 
                          className={`w-full rounded-t-sm ${
                            month.profit >= 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ 
                            height: `${Math.min(Math.abs(month.profit) / 2000 * 100, 100)}%`,
                            opacity: privacyMode ? 0.5 : 0.8
                          }}
                        ></div>
                        <div className="text-xs mt-2">{month.month}</div>
                        {!privacyMode && (
                          <div className="text-xs text-muted-foreground">
                            {formatValue(month.profit)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Monthly Win Rate</CardTitle>
              <CardDescription>Win rate percentage by month</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] relative">
              <div className="flex h-[200px] items-end space-x-2">
                {mockPerformanceData.monthlyData.map((month) => (
                  <div key={month.month} className="flex flex-col items-center flex-1">
                    <div className="text-xs mb-1">{month.winRate}%</div>
                    <div 
                      className="w-full bg-primary rounded-t-sm"
                      style={{ 
                        height: `${month.winRate}%`,
                        opacity: 0.8
                      }}
                    ></div>
                    <div className="text-xs mt-2">{month.month}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekday" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Performance by Day of Week</CardTitle>
              <CardDescription>Trading results broken down by weekday</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] relative">
              <div className="flex flex-col h-full justify-end">
                <div className="flex items-end h-[220px] space-x-8">
                  {mockPerformanceData.weekdayPerformance.map((day) => (
                    <div key={day.day} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-full rounded-t-sm ${
                          day.profit >= 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          height: `${Math.min(Math.abs(day.profit) / 2500 * 100, 100)}%`,
                          opacity: privacyMode ? 0.5 : 0.8
                        }}
                      ></div>
                      <div className="text-xs mt-2">{day.day}</div>
                      {!privacyMode && (
                        <div className="text-xs text-muted-foreground">
                          {formatValue(day.profit)}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Win: {day.winRate}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategy" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Strategy Comparison</CardTitle>
              <CardDescription>Performance metrics by trading strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPerformanceData.strategyPerformance.map((strategy) => (
                  <div key={strategy.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">{strategy.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ({strategy.trades} trades)
                        </div>
                      </div>
                      <div className={strategy.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {!privacyMode && formatValue(strategy.profit)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-muted-foreground">Win rate: {strategy.winRate}%</div>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${strategy.winRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}