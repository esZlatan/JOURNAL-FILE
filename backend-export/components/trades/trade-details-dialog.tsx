import { formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { useDisplaySettings } from '@/context/display-settings-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { TradeChart } from './trade-chart'

interface TradeDetailsDialogProps {
  trade: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TradeDetailsDialog({ trade, open, onOpenChange }: TradeDetailsDialogProps) {
  const { privacyMode, displayUnit } = useDisplaySettings()
  
  const formatValue = (value: number): string => {
    switch (displayUnit) {
      case 'currency':
        return formatCurrency(value)
      case 'percentage':
        return ((value / 10000) * 100).toFixed(2) + '%'
      case 'pips':
        return `${(value / 10).toFixed(1)} pips`
      default:
        return formatCurrency(value)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">{trade.ticker}</span>
              <span className={`text-sm px-2 py-0.5 rounded-full ${
                trade.direction === 'long' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {trade.direction.toUpperCase()}
              </span>
            </div>
            <span className={`text-lg ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {privacyMode ? '****' : formatValue(trade.pnl)}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(trade.date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{formatTime(trade.date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{trade.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Strategy</p>
                <p className="font-medium">{trade.strategy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entry Price</p>
                <p className="font-medium">{privacyMode ? '****' : trade.entryPrice}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exit Price</p>
                <p className="font-medium">{privacyMode ? '****' : trade.exitPrice}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lot Size</p>
                <p className="font-medium">{privacyMode ? '****' : trade.lotSize}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pips</p>
                <p className={`font-medium ${trade.pips >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {privacyMode ? '****' : `${trade.pips}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emotion</p>
                <p className="font-medium capitalize">{trade.emotion}</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {trade.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-secondary rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chart" className="mt-4">
            <div className="h-[300px]">
              {trade.images.length > 0 ? (
                <div className="flex justify-center">
                  <img 
                    src={trade.images[0]} 
                    alt="Trade chart" 
                    className="max-h-[300px] object-contain border rounded-md"
                  />
                </div>
              ) : (
                <TradeChart ticker={trade.ticker} direction={trade.direction} />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-4">
            <p className="text-sm whitespace-pre-line">{trade.notes}</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}