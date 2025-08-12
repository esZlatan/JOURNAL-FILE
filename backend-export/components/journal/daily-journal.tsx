import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Check, Plus, PlusCircle, Trash2 } from 'lucide-react';

type TradeType = 'long' | 'short';

interface Trade {
  id: string;
  symbol: string;
  type: TradeType;
  entry: number;
  exit: number;
  pnl: number;
  notes: string;
  screenshot: string | null;
}

interface JournalEntry {
  id: string;
  date: Date;
  marketConditions: string;
  mindset: string;
  trades: Trade[];
  lessons: string;
  improvements: string;
}

// Demo data for trading journal
const demoEntries: JournalEntry[] = [
  {
    id: '1',
    date: new Date('2025-08-07'),
    marketConditions: 'Volatile market due to earnings season. SPY trending down.',
    mindset: 'Focused and calm, prepared for trading session.',
    trades: [
      {
        id: '1-1',
        symbol: 'AAPL',
        type: 'long',
        entry: 180.25,
        exit: 185.75,
        pnl: 550,
        notes: 'Strong breakout above resistance. Held through earnings announcement.',
        screenshot: null,
      },
      {
        id: '1-2',
        symbol: 'MSFT',
        type: 'short',
        entry: 420.50,
        exit: 415.25,
        pnl: 525,
        notes: 'Spotted bearish divergence on 15m chart. Market was weak overall.',
        screenshot: null,
      }
    ],
    lessons: 'Need to be more patient with entries. Wait for confirmation before entering.',
    improvements: 'Stick to trading plan and predefined levels. Reduce position size for earnings plays.'
  },
  {
    id: '2',
    date: new Date('2025-08-06'),
    marketConditions: 'Bullish trend, strong market breadth. SPY making new highs.',
    mindset: 'Slightly distracted today, had trouble focusing.',
    trades: [
      {
        id: '2-1',
        symbol: 'TSLA',
        type: 'long',
        entry: 245.75,
        exit: 238.50,
        pnl: -725,
        notes: 'Entered too early before the breakout was confirmed. Cut losses quickly.',
        screenshot: null,
      },
      {
        id: '2-2',
        symbol: 'NVDA',
        type: 'long',
        entry: 510.25,
        exit: 525.50,
        pnl: 1525,
        notes: 'Strong momentum play. Rode the trend with the market.',
        screenshot: null,
      }
    ],
    lessons: 'Must be more disciplined about confirmation signals.',
    improvements: 'Take more detailed notes about entry criteria.'
  }
];

export default function DailyJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(demoEntries);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>(demoEntries[0]);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Find entry for the selected date
  useEffect(() => {
    const entry = entries.find(e => 
      selectedDate && e.date.toDateString() === selectedDate.toDateString()
    );
    
    if (entry) {
      setCurrentEntry(entry);
      setIsNewEntry(false);
    } else if (selectedDate) {
      // Create a new empty entry template
      setCurrentEntry({
        id: `new-${Date.now()}`,
        date: selectedDate,
        marketConditions: '',
        mindset: '',
        trades: [],
        lessons: '',
        improvements: ''
      });
      setIsNewEntry(true);
    }
  }, [selectedDate, entries]);

  // Handle saving an entry
  const saveEntry = () => {
    if (isNewEntry) {
      setEntries([...entries, currentEntry]);
    } else {
      setEntries(entries.map(e => e.id === currentEntry.id ? currentEntry : e));
    }
    setIsNewEntry(false);
    setIsEditing(false);
  };

  // Handle adding a new trade
  const addTrade = () => {
    const newTrade: Trade = {
      id: `${currentEntry.id}-${currentEntry.trades.length + 1}`,
      symbol: '',
      type: 'long',
      entry: 0,
      exit: 0,
      pnl: 0,
      notes: '',
      screenshot: null
    };
    
    setCurrentEntry({
      ...currentEntry,
      trades: [...currentEntry.trades, newTrade]
    });
  };

  // Handle updating a trade
  const updateTrade = (index: number, field: keyof Trade, value: any) => {
    const updatedTrades = [...currentEntry.trades];
    updatedTrades[index] = {
      ...updatedTrades[index],
      [field]: value
    };
    
    // Auto-calculate P/L if entry and exit are both set
    if (field === 'entry' || field === 'exit') {
      const trade = updatedTrades[index];
      if (trade.entry && trade.exit) {
        const shares = 100; // Assuming 100 shares for simplicity
        const diff = trade.type === 'long' 
          ? trade.exit - trade.entry 
          : trade.entry - trade.exit;
        updatedTrades[index].pnl = Math.round(diff * shares);
      }
    }
    
    setCurrentEntry({
      ...currentEntry,
      trades: updatedTrades
    });
  };

  // Handle deleting a trade
  const deleteTrade = (index: number) => {
    const updatedTrades = currentEntry.trades.filter((_, i) => i !== index);
    setCurrentEntry({
      ...currentEntry,
      trades: updatedTrades
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Daily Trading Journal</h2>
        <div className="flex items-center gap-2">
          <DatePicker 
            date={selectedDate} 
            setDate={setSelectedDate} 
            className="w-auto" 
          />
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              {isNewEntry ? 'Create Entry' : 'Edit Entry'}
            </Button>
          ) : (
            <Button onClick={saveEntry}>
              Save Entry
            </Button>
          )}
        </div>
      </div>

      {/* Journal Entry Form */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Overview & Mindset</CardTitle>
            <CardDescription>
              Record your observations about market conditions and your trading mindset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="marketConditions">Market Conditions</Label>
                <Textarea
                  id="marketConditions"
                  value={currentEntry.marketConditions}
                  onChange={(e) => setCurrentEntry({...currentEntry, marketConditions: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Describe the overall market conditions..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mindset">Personal Mindset</Label>
                <Textarea
                  id="mindset"
                  value={currentEntry.mindset}
                  onChange={(e) => setCurrentEntry({...currentEntry, mindset: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Describe your mental state during the trading session..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Trades</CardTitle>
                <CardDescription>
                  Record your trades for the day
                </CardDescription>
              </div>
              {isEditing && (
                <Button onClick={addTrade} variant="outline" size="sm" className="h-8">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Trade
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {currentEntry.trades.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No trades recorded for this day.
              </div>
            ) : (
              <div className="space-y-4">
                {currentEntry.trades.map((trade, index) => (
                  <Card key={trade.id} className="overflow-hidden">
                    <div className="bg-muted p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{trade.symbol || 'New Trade'}</span>
                        <Badge variant={trade.type === 'long' ? 'default' : 'outline'}>
                          {trade.type === 'long' ? 'Long' : 'Short'}
                        </Badge>
                      </div>
                      {isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-destructive"
                          onClick={() => deleteTrade(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`symbol-${index}`}>Symbol</Label>
                          <Input
                            id={`symbol-${index}`}
                            value={trade.symbol}
                            onChange={(e) => updateTrade(index, 'symbol', e.target.value)}
                            disabled={!isEditing}
                            placeholder="e.g. AAPL"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`type-${index}`}>Type</Label>
                          <Select
                            value={trade.type}
                            onValueChange={(value) => updateTrade(index, 'type', value as TradeType)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger id={`type-${index}`}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="long">Long</SelectItem>
                              <SelectItem value="short">Short</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`entry-${index}`}>Entry</Label>
                          <Input
                            id={`entry-${index}`}
                            type="number"
                            step="0.01"
                            value={trade.entry}
                            onChange={(e) => updateTrade(index, 'entry', parseFloat(e.target.value) || 0)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`exit-${index}`}>Exit</Label>
                          <Input
                            id={`exit-${index}`}
                            type="number"
                            step="0.01"
                            value={trade.exit}
                            onChange={(e) => updateTrade(index, 'exit', parseFloat(e.target.value) || 0)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`pnl-${index}`}>P/L</Label>
                            <span className={`text-sm font-medium ${trade.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              ${trade.pnl.toFixed(2)}
                            </span>
                          </div>
                          <Input
                            id={`pnl-${index}`}
                            type="number"
                            value={trade.pnl}
                            onChange={(e) => updateTrade(index, 'pnl', parseFloat(e.target.value) || 0)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`notes-${index}`}>Trade Notes</Label>
                          <Textarea
                            id={`notes-${index}`}
                            value={trade.notes}
                            onChange={(e) => updateTrade(index, 'notes', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Notes about your trade..."
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lessons & Improvements</CardTitle>
            <CardDescription>
              Record your lessons learned and areas for improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lessons">Lessons Learned</Label>
                <Textarea
                  id="lessons"
                  value={currentEntry.lessons}
                  onChange={(e) => setCurrentEntry({...currentEntry, lessons: e.target.value})}
                  disabled={!isEditing}
                  placeholder="What did you learn from today's trading?"
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="improvements">Areas for Improvement</Label>
                <Textarea
                  id="improvements"
                  value={currentEntry.improvements}
                  onChange={(e) => setCurrentEntry({...currentEntry, improvements: e.target.value})}
                  disabled={!isEditing}
                  placeholder="What could you improve in your trading process?"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}