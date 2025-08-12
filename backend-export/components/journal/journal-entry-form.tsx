import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, formatDate } from '@/lib/utils'

interface JournalEntryFormProps {
  onClose: () => void
}

export function JournalEntryForm({ onClose }: JournalEntryFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState('09:30')
  const [formData, setFormData] = useState({
    ticker: '',
    direction: 'long',
    lotSize: '',
    entryPrice: '',
    exitPrice: '',
    strategy: '',
    emotion: 'neutral',
    notes: '',
    tags: ''
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here we would normally save the data
    console.log({ ...formData, date, time })
    onClose()
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? formatDate(date) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ticker">Ticker/Symbol</Label>
          <Input
            id="ticker"
            name="ticker"
            value={formData.ticker}
            onChange={handleChange}
            placeholder="e.g. AAPL, EUR/USD"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="direction">Direction</Label>
          <Select
            value={formData.direction}
            onValueChange={(value) => handleSelectChange('direction', value)}
          >
            <SelectTrigger id="direction">
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lotSize">Lot Size / Quantity</Label>
          <Input
            id="lotSize"
            name="lotSize"
            type="number"
            step="0.01"
            value={formData.lotSize}
            onChange={handleChange}
            placeholder="1.0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="entryPrice">Entry Price</Label>
          <Input
            id="entryPrice"
            name="entryPrice"
            type="number"
            step="0.01"
            value={formData.entryPrice}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="exitPrice">Exit Price</Label>
          <Input
            id="exitPrice"
            name="exitPrice"
            type="number"
            step="0.01"
            value={formData.exitPrice}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="strategy">Strategy</Label>
          <Select
            value={formData.strategy}
            onValueChange={(value) => handleSelectChange('strategy', value)}
          >
            <SelectTrigger id="strategy">
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Breakout">Breakout</SelectItem>
              <SelectItem value="Price Action">Price Action</SelectItem>
              <SelectItem value="Trend Following">Trend Following</SelectItem>
              <SelectItem value="Reversal">Reversal</SelectItem>
              <SelectItem value="Scalping">Scalping</SelectItem>
              <SelectItem value="Swing">Swing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emotion">Emotion</Label>
          <Select
            value={formData.emotion}
            onValueChange={(value) => handleSelectChange('emotion', value)}
          >
            <SelectTrigger id="emotion">
              <SelectValue placeholder="Select emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confident">Confident</SelectItem>
              <SelectItem value="nervous">Nervous</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="excited">Excited</SelectItem>
              <SelectItem value="fearful">Fearful</SelectItem>
              <SelectItem value="disappointed">Disappointed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. momentum, breakout, news"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter your trade notes and observations..."
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="images">Upload Chart/Screenshot</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save Entry</Button>
      </div>
    </form>
  )
}