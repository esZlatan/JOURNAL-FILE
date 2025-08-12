import { useState } from 'react'
import { Plus, CheckSquare, Square, Edit, Trash, ChevronDown, ChevronUp, Save } from 'lucide-react'
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock data for trading rules and progress
const mockRuleCategories = [
  {
    id: '1',
    name: 'Pre-Trade Rules',
    description: 'Rules to follow before entering a trade',
    expanded: true,
    rules: [
      {
        id: '101',
        text: 'Check economic calendar for major news events',
        compliance: {
          lastWeek: [true, true, false, true, true],
          currentWeek: [true, true, true]
        },
        notes: 'Need to be more consistent with this before each trading session'
      },
      {
        id: '102',
        text: 'Only trade in the direction of the higher timeframe trend',
        compliance: {
          lastWeek: [true, true, true, false, true],
          currentWeek: [true, false, true]
        },
        notes: 'Working on better trend identification'
      },
      {
        id: '103',
        text: 'Confirm at least 2 technical indicators align with trade direction',
        compliance: {
          lastWeek: [true, true, true, true, true],
          currentWeek: [true, true, true]
        },
        notes: 'Have been consistent with this rule'
      },
    ]
  },
  {
    id: '2',
    name: 'Trade Management Rules',
    description: 'Rules for managing open positions',
    expanded: false,
    rules: [
      {
        id: '201',
        text: 'Move stop loss to break-even after price moves 1R in favor',
        compliance: {
          lastWeek: [false, true, false, true, false],
          currentWeek: [true, true, false]
        },
        notes: 'Still struggling with moving stops too early sometimes'
      },
      {
        id: '202',
        text: 'Scale out 50% of position at first target',
        compliance: {
          lastWeek: [true, true, true, true, true],
          currentWeek: [true, true, true]
        },
        notes: 'This has been working well for profit taking'
      },
      {
        id: '203',
        text: 'Use trailing stop for remainder after 2R profit',
        compliance: {
          lastWeek: [false, true, true, false, true],
          currentWeek: [true, true, true]
        },
        notes: 'Have improved consistency recently'
      },
    ]
  },
  {
    id: '3',
    name: 'Risk Management Rules',
    description: 'Rules for managing risk exposure',
    expanded: false,
    rules: [
      {
        id: '301',
        text: 'Never risk more than 1% of account on a single trade',
        compliance: {
          lastWeek: [true, true, true, true, true],
          currentWeek: [true, true, true]
        },
        notes: 'This rule is non-negotiable and has been followed consistently'
      },
      {
        id: '302',
        text: 'Maximum 3 trades open simultaneously',
        compliance: {
          lastWeek: [true, true, false, true, true],
          currentWeek: [true, true, true]
        },
        notes: 'Overtraded last Wednesday with 4 positions'
      },
      {
        id: '303',
        text: 'Maximum 5% account risk per day',
        compliance: {
          lastWeek: [true, true, true, true, true],
          currentWeek: [true, true, true]
        },
        notes: 'Have stayed within daily risk limits'
      },
    ]
  }
]

export default function ProgressTracker() {
  const [ruleCategories, setRuleCategories] = useState(mockRuleCategories)
  const [editingRule, setEditingRule] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  const toggleCompliance = (categoryId: string, ruleId: string, week: 'lastWeek' | 'currentWeek', day: number) => {
    // In a real app, update the actual state with proper immutability
    console.log(`Toggling compliance for rule ${ruleId}, ${week} day ${day}`)
  }
  
  const startEditRule = (rule: any) => {
    setEditingRule({ ...rule })
    setIsEditing(true)
  }
  
  const saveEditRule = () => {
    // In a real app, update the actual state with proper immutability
    console.log('Saving edited rule:', editingRule)
    setIsEditing(false)
    setEditingRule(null)
  }
  
  const getDayLabel = (index: number) => {
    const days = ['M', 'T', 'W', 'Th', 'F']
    return days[index]
  }
  
  const calculateComplianceRate = (rule: any) => {
    const lastWeekCompliance = rule.compliance.lastWeek.filter(Boolean).length / rule.compliance.lastWeek.length
    const currentWeekCompliance = rule.compliance.currentWeek.filter(Boolean).length / rule.compliance.currentWeek.length
    
    // Weight current week more heavily
    return Math.round((lastWeekCompliance * 0.3 + currentWeekCompliance * 0.7) * 100)
  }
  
  const getComplianceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500'
    if (rate >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Trading Rules & Compliance</h2>
          <p className="text-muted-foreground">Track your adherence to your trading rules</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Trading Rule</DialogTitle>
              <DialogDescription>
                Create a new rule to track in your trading practice.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {ruleCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                    <SelectItem value="new">+ New Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Textarea
                  id="rule"
                  placeholder="Describe your trading rule..."
                  className="h-20"
                />
              </div>
              <div className="grid gap-2">
                <Textarea
                  id="notes"
                  placeholder="Additional notes or context for this rule..."
                  className="h-20"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {ruleCategories.map((category) => (
          <Accordion key={category.id} type="single" collapsible defaultValue={category.expanded ? category.id : undefined}>
            <AccordionItem value={category.id}>
              <AccordionTrigger>
                <div className="flex flex-col items-start">
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {category.rules.map((rule) => (
                    <Card key={rule.id}>
                      <CardHeader className="py-4 px-5">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base font-medium">{rule.text}</CardTitle>
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => startEditRule(rule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription className="text-xs mt-2">{rule.notes}</CardDescription>
                      </CardHeader>
                      <CardContent className="py-0 px-5">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Last Week</p>
                            <div className="flex items-center space-x-2">
                              {rule.compliance.lastWeek.map((compliant, idx) => (
                                <div 
                                  key={idx}
                                  className="flex flex-col items-center"
                                  onClick={() => toggleCompliance(category.id, rule.id, 'lastWeek', idx)}
                                >
                                  <span className="text-xs text-muted-foreground">{getDayLabel(idx)}</span>
                                  <div className="cursor-pointer">
                                    {compliant ? (
                                      <CheckSquare className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <Square className="h-5 w-5 text-muted" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">This Week</p>
                            <div className="flex items-center space-x-2">
                              {rule.compliance.currentWeek.map((compliant, idx) => (
                                <div 
                                  key={idx}
                                  className="flex flex-col items-center"
                                  onClick={() => toggleCompliance(category.id, rule.id, 'currentWeek', idx)}
                                >
                                  <span className="text-xs text-muted-foreground">{getDayLabel(idx)}</span>
                                  <div className="cursor-pointer">
                                    {compliant ? (
                                      <CheckSquare className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <Square className="h-5 w-5 text-muted" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="py-3 px-5">
                        <div className="flex w-full justify-between items-center">
                          <p className="text-sm">Compliance Rate:</p>
                          <p className={`text-sm font-bold ${getComplianceColor(calculateComplianceRate(rule))}`}>
                            {calculateComplianceRate(rule)}%
                          </p>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Rule to {category.name}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
      
      {isEditing && editingRule && (
        <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Trading Rule</DialogTitle>
              <DialogDescription>
                Update your trading rule details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Textarea
                  value={editingRule.text}
                  onChange={(e) => setEditingRule({...editingRule, text: e.target.value})}
                  className="h-20"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={editingRule.notes}
                  onChange={(e) => setEditingRule({...editingRule, notes: e.target.value})}
                  className="h-20"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={saveEditRule}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}