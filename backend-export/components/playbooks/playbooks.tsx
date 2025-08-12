import { useState } from 'react'
import { Plus, Search, Edit, ChevronRight, BookOpen, Trash, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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

// Mock data for playbooks
const mockPlaybooks = [
  {
    id: '1',
    name: 'Bull Flag Breakout',
    description: 'Trading bull flags in trending markets',
    favorite: true,
    steps: [
      'Identify a strong uptrend with momentum',
      'Look for consolidation with lower volume (the flag)',
      'Wait for price to break above the upper flag trendline',
      'Enter long with a stop below the flag low',
      'Target 1: 1.618 Fibonacci extension of the flag',
      'Target 2: Previous swing high'
    ],
    rules: [
      'Only enter if RSI is above 50',
      'Avoid if major resistance is within 5% of entry',
      'Risk max 1% of account per trade'
    ],
    setupImg: '/assets/bull-flag.png',
    tags: ['momentum', 'breakout', 'trend-following'],
    winRate: 68,
    trades: 25
  },
  {
    id: '2',
    name: 'Gap Fill Strategy',
    description: 'Trading morning gaps for quick profits',
    favorite: false,
    steps: [
      'Identify stocks that gap up or down at market open',
      'Check volume and news to confirm no fundamental change',
      'Enter in the direction of the anticipated gap fill',
      'Set stop loss beyond the opening price',
      'Target the previous day\'s closing price'
    ],
    rules: [
      'Only trade gaps less than 3%',
      'Avoid earnings gaps',
      'Close position by end of day if not filled'
    ],
    setupImg: '/assets/gap-fill.png',
    tags: ['gap', 'mean-reversion', 'intraday'],
    winRate: 72,
    trades: 36
  },
  {
    id: '3',
    name: 'Support/Resistance Bounce',
    description: 'Trading bounces off key levels',
    favorite: true,
    steps: [
      'Identify major support or resistance levels',
      'Look for price rejection with confirming candlestick pattern',
      'Enter after confirmation candle closes',
      'Place stop loss beyond the support/resistance level',
      'Take profit at next major level or 1:2 risk/reward'
    ],
    rules: [
      'Multiple timeframe confirmation required',
      'Volume should increase on bounce',
      'Avoid during high-impact news events'
    ],
    setupImg: '/assets/sr-bounce.png',
    tags: ['reversal', 'technical', 'price-action'],
    winRate: 65,
    trades: 42
  },
]

export default function Playbooks() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activePlaybook, setActivePlaybook] = useState(mockPlaybooks[0])
  const [editingPlaybook, setEditingPlaybook] = useState<typeof mockPlaybooks[0] | null>(null)
  const [playbooks, setPlaybooks] = useState(mockPlaybooks)
  
  const filteredPlaybooks = playbooks.filter(playbook => 
    playbook.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    playbook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playbook.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  const toggleFavorite = (id: string) => {
    setPlaybooks(prev => prev.map(playbook => 
      playbook.id === id ? { ...playbook, favorite: !playbook.favorite } : playbook
    ))
    
    // Update active playbook if it's the one being toggled
    if (activePlaybook.id === id) {
      setActivePlaybook(prev => ({ ...prev, favorite: !prev.favorite }))
    }
  }

  const handleEditPlaybook = (playbook: typeof mockPlaybooks[0]) => {
    setEditingPlaybook({ ...playbook })
  }

  const handleSaveEdit = () => {
    if (!editingPlaybook) return
    
    setPlaybooks(prev => prev.map(playbook => 
      playbook.id === editingPlaybook.id ? editingPlaybook : playbook
    ))
    
    // Update active playbook if it's the one being edited
    if (activePlaybook.id === editingPlaybook.id) {
      setActivePlaybook(editingPlaybook)
    }
    
    setEditingPlaybook(null)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search playbooks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Playbook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Playbook</DialogTitle>
              <DialogDescription>
                Document your trading strategies for consistent execution.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input
                  id="name"
                  placeholder="Strategy Name"
                  className="w-full"
                  onChange={(e) => setEditingPlaybook(prev => prev ? {...prev, name: e.target.value} : {
                    id: `${Date.now()}`,
                    name: e.target.value,
                    description: '',
                    favorite: false,
                    steps: [],
                    rules: [],
                    setupImg: '',
                    tags: [],
                    winRate: 0,
                    trades: 0
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Textarea
                  id="description"
                  placeholder="Brief description of the strategy..."
                  className="h-20"
                  onChange={(e) => setEditingPlaybook(prev => prev ? {...prev, description: e.target.value} : prev)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Trading Steps</label>
                <Textarea
                  id="steps"
                  placeholder="Enter each step on a new line..."
                  className="h-32"
                  onChange={(e) => setEditingPlaybook(prev => prev ? {
                    ...prev, 
                    steps: e.target.value.split('\n').filter(step => step.trim() !== '')
                  } : prev)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Trading Rules</label>
                <Textarea
                  id="rules"
                  placeholder="Enter each rule on a new line..."
                  className="h-32"
                  onChange={(e) => setEditingPlaybook(prev => prev ? {
                    ...prev, 
                    rules: e.target.value.split('\n').filter(rule => rule.trim() !== '')
                  } : prev)}
                />
              </div>
              <div className="grid gap-2">
                <Input
                  id="tags"
                  placeholder="Tags (comma separated)"
                  className="w-full"
                  onChange={(e) => setEditingPlaybook(prev => prev ? {
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                  } : prev)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Chart Setup Image URL (optional)</label>
                <Input
                  id="image"
                  placeholder="Image URL"
                  onChange={(e) => setEditingPlaybook(prev => prev ? {...prev, setupImg: e.target.value} : prev)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Win Rate (%)</label>
                  <Input
                    id="winRate"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    onChange={(e) => setEditingPlaybook(prev => prev ? {
                      ...prev, 
                      winRate: Number(e.target.value)
                    } : prev)}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Number of Trades</label>
                  <Input
                    id="trades"
                    type="number"
                    min="0"
                    placeholder="0"
                    onChange={(e) => setEditingPlaybook(prev => prev ? {
                      ...prev, 
                      trades: Number(e.target.value)
                    } : prev)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={() => {
                  if (editingPlaybook && editingPlaybook.name) {
                    // Add the new playbook
                    setPlaybooks(prev => [...prev, editingPlaybook]);
                    setEditingPlaybook(null);
                  }
                }}
              >
                Save Playbook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="text-sm font-medium">Your Strategies</div>
          {filteredPlaybooks.map((playbook) => (
            <Card 
              key={playbook.id} 
              className={`cursor-pointer hover:border-primary ${
                activePlaybook.id === playbook.id ? 'border-primary' : ''
              }`}
              onClick={() => setActivePlaybook(playbook)}
            >
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium">{playbook.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(playbook.id)
                    }}
                  >
                    <Star 
                      className={`h-4 w-4 ${
                        playbook.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                </div>
                <CardDescription className="text-xs line-clamp-2">
                  {playbook.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                <div className="flex justify-between w-full">
                  <span>Win: {playbook.winRate}%</span>
                  <span>{playbook.trades} trades</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader className="flex flex-row justify-between items-start space-y-0">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {activePlaybook.name}
                  {activePlaybook.favorite && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  )}
                </CardTitle>
                <CardDescription>{activePlaybook.description}</CardDescription>
              </div>
              
              <div className="flex space-x-2">
                <Dialog open={editingPlaybook?.id === activePlaybook.id} onOpenChange={(open) => !open && setEditingPlaybook(null)}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => handleEditPlaybook(activePlaybook)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Edit Playbook</DialogTitle>
                      <DialogDescription>
                        Update your trading strategy for better results.
                      </DialogDescription>
                    </DialogHeader>
                    {editingPlaybook && (
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Input
                            id="name"
                            placeholder="Strategy Name"
                            className="w-full"
                            value={editingPlaybook.name}
                            onChange={(e) => setEditingPlaybook({ ...editingPlaybook, name: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Textarea
                            id="description"
                            placeholder="Brief description of the strategy..."
                            className="h-20"
                            value={editingPlaybook.description}
                            onChange={(e) => setEditingPlaybook({ ...editingPlaybook, description: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Trading Steps</label>
                          <Textarea
                            id="steps"
                            placeholder="Enter each step on a new line..."
                            className="h-32"
                            value={editingPlaybook.steps.join('\n')}
                            onChange={(e) => setEditingPlaybook({ 
                              ...editingPlaybook, 
                              steps: e.target.value.split('\n').filter(step => step.trim() !== '') 
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Trading Rules</label>
                          <Textarea
                            id="rules"
                            placeholder="Enter each rule on a new line..."
                            className="h-32"
                            value={editingPlaybook.rules.join('\n')}
                            onChange={(e) => setEditingPlaybook({ 
                              ...editingPlaybook, 
                              rules: e.target.value.split('\n').filter(rule => rule.trim() !== '') 
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Input
                            id="tags"
                            placeholder="Tags (comma separated)"
                            className="w-full"
                            value={editingPlaybook.tags.join(', ')}
                            onChange={(e) => setEditingPlaybook({ 
                              ...editingPlaybook, 
                              tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') 
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Chart Setup Image URL (optional)</label>
                          <Input
                            id="image"
                            placeholder="Image URL"
                            value={editingPlaybook.setupImg || ''}
                            onChange={(e) => setEditingPlaybook({ ...editingPlaybook, setupImg: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Win Rate (%)</label>
                            <Input
                              id="winRate"
                              type="number"
                              min="0"
                              max="100"
                              value={editingPlaybook.winRate}
                              onChange={(e) => setEditingPlaybook({ 
                                ...editingPlaybook, 
                                winRate: Number(e.target.value) 
                              })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Number of Trades</label>
                            <Input
                              id="trades"
                              type="number"
                              min="0"
                              value={editingPlaybook.trades}
                              onChange={(e) => setEditingPlaybook({ 
                                ...editingPlaybook, 
                                trades: Number(e.target.value) 
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingPlaybook(null)}>Cancel</Button>
                      <Button type="submit" onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Playbook</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this playbook? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          setPlaybooks(prev => prev.filter(p => p.id !== activePlaybook.id));
                          // Select the first playbook after deletion or set to null if none left
                          if (playbooks.length > 1) {
                            const nextPlaybook = playbooks.find(p => p.id !== activePlaybook.id) || null;
                            if (nextPlaybook) setActivePlaybook(nextPlaybook);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="steps">
                <TabsList>
                  <TabsTrigger value="steps">Setup & Execution</TabsTrigger>
                  <TabsTrigger value="rules">Trading Rules</TabsTrigger>
                </TabsList>
                <TabsContent value="steps" className="mt-4 space-y-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="space-y-4 flex-1">
                      <h3 className="text-sm font-medium">Trading Steps</h3>
                      <ol className="list-decimal pl-4 space-y-2 text-sm">
                        {activePlaybook.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    {activePlaybook.setupImg && (
                      <div className="flex-1">
                        <h3 className="text-sm font-medium mb-3">Chart Setup</h3>
                        <div className="border rounded-lg p-1 overflow-hidden">
                          <img 
                            src={activePlaybook.setupImg}
                            alt="Chart setup"
                            className="w-full object-cover rounded-md"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="rules" className="mt-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Key Rules</h3>
                    <ul className="list-disc pl-4 space-y-2 text-sm">
                      {activePlaybook.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2 mt-2">
                  {activePlaybook.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}