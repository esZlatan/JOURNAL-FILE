import { useState } from 'react'
import { Calendar, Filter, Download, Upload, ArrowUpDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useDisplaySettings } from '@/context/display-settings-context'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TradeDetailsDialog } from './trade-details-dialog'

// Mock data for trades history
const mockTrades = [
  {
    id: '1',
    date: new Date('2025-08-08T09:30:00'),
    ticker: 'AAPL',
    direction: 'long',
    lotSize: 1.5,
    entryPrice: 185.75,
    exitPrice: 187.25,
    pnl: 1.5 * (187.25 - 185.75) * 100,
    pips: 150,
    duration: '2h 15m',
    strategy: 'Breakout',
    notes: 'Momentum play after earnings, followed the trend',
    tags: ['momentum', 'earnings'],
    emotion: 'confident',
    images: ['/assets/trade1.png']
  },
  {
    id: '2',
    date: new Date('2025-08-08T11:15:00'),
    ticker: 'MSFT',
    direction: 'short',
    lotSize: 2,
    entryPrice: 390.50,
    exitPrice: 388.25,
    pnl: 2 * (390.50 - 388.25) * 100,
    pips: 225,
    duration: '1h 40m',
    strategy: 'Price Action',
    notes: 'Reversal at resistance level, good risk/reward',
    tags: ['reversal', 'resistance'],
    emotion: 'neutral',
    images: []
  },
  {
    id: '3',
    date: new Date('2025-08-08T14:45:00'),
    ticker: 'NVDA',
    direction: 'long',
    lotSize: 1,
    entryPrice: 450.25,
    exitPrice: 448.75,
    pnl: 1 * (448.75 - 450.25) * 100,
    pips: -150,
    duration: '3h 10m',
    strategy: 'Breakout',
    notes: 'Failed breakout, should have waited for confirmation',
    tags: ['failed breakout', 'lesson'],
    emotion: 'disappointed',
    images: ['/assets/trade3.png']
  },
  {
    id: '4',
    date: new Date('2025-08-07T10:20:00'),
    ticker: 'AMZN',
    direction: 'long',
    lotSize: 0.8,
    entryPrice: 178.50,
    exitPrice: 180.75,
    pnl: 0.8 * (180.75 - 178.50) * 100,
    pips: 225,
    duration: '5h 30m',
    strategy: 'Trend Following',
    notes: 'Caught the uptrend after market open, held through the day',
    tags: ['trend', 'swing'],
    emotion: 'excited',
    images: []
  },
  {
    id: '5',
    date: new Date('2025-08-07T13:45:00'),
    ticker: 'TSLA',
    direction: 'short',
    lotSize: 1.2,
    entryPrice: 245.75,
    exitPrice: 243.25,
    pnl: 1.2 * (245.75 - 243.25) * 100,
    pips: 250,
    duration: '0h 45m',
    strategy: 'Scalping',
    notes: 'Quick scalp on technical rejection at resistance',
    tags: ['scalp', 'technical'],
    emotion: 'neutral',
    images: []
  },
  {
    id: '6',
    date: new Date('2025-08-06T09:15:00'),
    ticker: 'META',
    direction: 'long',
    lotSize: 0.5,
    entryPrice: 467.00,
    exitPrice: 473.50,
    pnl: 0.5 * (473.50 - 467.00) * 100,
    pips: 650,
    duration: '4h 20m',
    strategy: 'Swing',
    notes: 'Entered on support level, strong uptrend resumed',
    tags: ['swing', 'support'],
    emotion: 'confident',
    images: []
  },
]

export default function TradesHistory() {
  const { privacyMode, displayUnit } = useDisplaySettings()
  const [selectedTrade, setSelectedTrade] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  
  const formatValue = (value: number): string => {
    switch (displayUnit) {
      case 'currency':
        return formatCurrency(value)
      case 'percentage':
        // Simple percentage calculation based on a hypothetical account size of $10,000
        return ((value / 10000) * 100).toFixed(2) + '%'
      case 'pips':
        return `${(value / 10).toFixed(1)} pips` // Simplified conversion
      default:
        return formatCurrency(value)
    }
  }
  
  const handleRowClick = (trade: any) => {
    setSelectedTrade(trade)
    setIsDetailsOpen(true)
  }
  
  const calculateStats = () => {
    const totalTrades = mockTrades.length
    const winningTrades = mockTrades.filter(trade => trade.pnl > 0).length
    const losingTrades = totalTrades - winningTrades
    
    const winRate = (winningTrades / totalTrades) * 100
    
    const totalProfit = mockTrades.reduce((sum, trade) => sum + (trade.pnl > 0 ? trade.pnl : 0), 0)
    const totalLoss = Math.abs(mockTrades.reduce((sum, trade) => sum + (trade.pnl < 0 ? trade.pnl : 0), 0))
    
    const avgWin = totalProfit / winningTrades
    const avgLoss = totalLoss / (losingTrades || 1)
    
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit
    
    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate: winRate.toFixed(1),
      totalProfit,
      totalLoss,
      netPnl: totalProfit - totalLoss,
      avgWin,
      avgLoss,
      profitFactor: profitFactor.toFixed(2),
    }
  }
  
  const stats = calculateStats()
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(new Date())}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trades..."
              className="pl-8 w-[200px] h-9"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>Add Trade</Button>
        </div>
      </div>
      
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Exit</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        P/L
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Strategy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTrades.map((trade) => (
                    <TableRow 
                      key={trade.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(trade)}
                    >
                      <TableCell>{formatDate(trade.date)}</TableCell>
                      <TableCell>{trade.ticker}</TableCell>
                      <TableCell>
                        <span className={trade.direction === 'long' ? 'text-green-500' : 'text-red-500'}>
                          {trade.direction.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{privacyMode ? '***' : trade.lotSize}</TableCell>
                      <TableCell>{privacyMode ? '***' : trade.entryPrice}</TableCell>
                      <TableCell>{privacyMode ? '***' : trade.exitPrice}</TableCell>
                      <TableCell className="text-right">
                        <span className={trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {privacyMode ? '***' : formatValue(trade.pnl)}
                        </span>
                      </TableCell>
                      <TableCell>{trade.strategy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTrades}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.winningTrades} winning / {stats.losingTrades} losing
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.winRate}%</div>
                <div className="mt-1 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${stats.winRate}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net P/L</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.netPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {privacyMode ? '****' : formatValue(stats.netPnl)}
                </div>
                {!privacyMode && (
                  <p className="text-xs text-muted-foreground">
                    Profit: {formatValue(stats.totalProfit)} / Loss: {formatValue(stats.totalLoss)}
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{privacyMode ? '**' : stats.profitFactor}</div>
                <p className="text-xs text-muted-foreground">
                  Avg Win: {privacyMode ? '****' : formatValue(stats.avgWin)} / Avg Loss: {privacyMode ? '****' : formatValue(stats.avgLoss)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedTrade && (
        <TradeDetailsDialog 
          trade={selectedTrade}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  )
}