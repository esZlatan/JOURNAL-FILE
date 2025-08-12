import { useState } from 'react'
import { Calendar, Filter, Plus, Book, Bookmark, Edit, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock data for notebook entries
const mockNotebookEntries = [
  {
    id: '1',
    title: 'Morning Market Analysis',
    date: new Date('2025-08-08T08:15:00'),
    content: `Today's focus is on tech stocks following the positive earnings reports yesterday. Key levels to watch:

- AAPL: Support at $180, resistance at $190
- MSFT: Watch for a breakout above $395
- NVDA: Potential pullback to $445 support level

My strategy today will be to look for momentum plays in these names if market sentiment remains positive.`,
    category: 'Analysis',
    tags: ['tech', 'earnings', 'strategy']
  },
  {
    id: '2',
    title: 'Trading Psychology Reflection',
    date: new Date('2025-08-07T18:30:00'),
    content: `I've noticed that I'm still making the same mistake of cutting winners too early while letting losers run. Today I had a great entry on TSLA but exited too soon, only to see it continue in my predicted direction for another 2 hours.

Things to work on:
1. Set clear price targets before entering trades
2. Use trailing stops instead of fixed exits
3. Review win/loss ratio weekly to track improvement

Remember: The goal is consistent profitability, not being right on every trade.`,
    category: 'Psychology',
    tags: ['reflection', 'mistakes', 'improvement']
  },
  {
    id: '3',
    title: 'New Trading Setup for Forex',
    date: new Date('2025-08-06T14:20:00'),
    content: `I've been working on a new setup for EUR/USD that looks promising:

Entry criteria:
- 1H timeframe crosses above 4H moving average
- RSI between 40-60 (neutral territory)
- London or NY session active
- At least 20 pips from major support/resistance

Initial results show a 67% win rate with 1:1.5 risk/reward. Will continue testing this for another week before adding to my regular strategies.`,
    category: 'Strategy',
    tags: ['forex', 'setup', 'testing']
  },
]

export default function Notebook() {
  const [activeEntry, setActiveEntry] = useState(mockNotebookEntries[0])
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(activeEntry.content)
  const [editedTitle, setEditedTitle] = useState(activeEntry.title)
  
  const handleEntrySelect = (entry: any) => {
    if (isEditing) {
      // Ask for confirmation before switching
      if (confirm("You have unsaved changes. Do you want to discard them?")) {
        setActiveEntry(entry)
        setIsEditing(false)
        setEditedContent(entry.content)
        setEditedTitle(entry.title)
      }
    } else {
      setActiveEntry(entry)
      setEditedContent(entry.content)
      setEditedTitle(entry.title)
    }
  }
  
  const handleStartEditing = () => {
    setIsEditing(true)
  }
  
  const handleSaveChanges = () => {
    // In a real app, we would save to API/localStorage here
    setActiveEntry({
      ...activeEntry,
      title: editedTitle,
      content: editedContent
    })
    setIsEditing(false)
  }
  
  const handleCancelEditing = () => {
    setEditedContent(activeEntry.content)
    setEditedTitle(activeEntry.title)
    setIsEditing(false)
  }
  
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
          <Select defaultValue="All Categories">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              <SelectItem value="Analysis">Analysis</SelectItem>
              <SelectItem value="Psychology">Psychology</SelectItem>
              <SelectItem value="Strategy">Strategy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Journal Entry</DialogTitle>
              <DialogDescription>
                Document your trading ideas, strategies, or reflections.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input
                  id="title"
                  placeholder="Entry Title"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Select defaultValue="Analysis">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Analysis">Market Analysis</SelectItem>
                    <SelectItem value="Psychology">Trading Psychology</SelectItem>
                    <SelectItem value="Strategy">Strategy Development</SelectItem>
                    <SelectItem value="Journal">Daily Journal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Input
                  id="tags"
                  placeholder="Tags (comma separated)"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Textarea
                  id="content"
                  placeholder="Write your notes here..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="text-sm font-medium">Your Entries</div>
          {mockNotebookEntries.map((entry) => (
            <Card 
              key={entry.id} 
              className={`cursor-pointer hover:border-primary ${
                activeEntry.id === entry.id ? 'border-primary' : ''
              }`}
              onClick={() => handleEntrySelect(entry)}
            >
              <CardHeader className="py-4 px-4">
                <CardTitle className="text-sm font-medium line-clamp-2">
                  {entry.title}
                </CardTitle>
                <CardDescription className="flex items-center text-xs">
                  <Book className="h-3 w-3 mr-1" />
                  {entry.category} · {formatDate(entry.date)}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-xl font-semibold"
                />
              ) : (
                <CardTitle>{activeEntry.title}</CardTitle>
              )}
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={handleSaveChanges}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEditing}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={handleStartEditing}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-2">
                  <span>{formatDate(activeEntry.date)}</span>
                  <span>·</span>
                  <span>{activeEntry.category}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {activeEntry.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {isEditing ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[400px]"
                />
              ) : (
                <div className="whitespace-pre-line">{activeEntry.content}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}