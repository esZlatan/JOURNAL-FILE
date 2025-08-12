import { useState } from 'react'
import { Calendar, Search, ExternalLink, BookOpen, Video, FileText, Info, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Badge } from "@/components/ui/badge"

// Mock data for economic calendar
const mockEconomicEvents = [
  {
    id: '1',
    date: new Date('2025-08-08T12:30:00'),
    country: 'US',
    event: 'Non-Farm Payrolls',
    impact: 'high',
    forecast: '+175K',
    previous: '+142K',
  },
  {
    id: '2',
    date: new Date('2025-08-08T12:30:00'),
    country: 'US',
    event: 'Unemployment Rate',
    impact: 'high',
    forecast: '3.7%',
    previous: '3.8%',
  },
  {
    id: '3',
    date: new Date('2025-08-08T14:00:00'),
    country: 'US',
    event: 'ISM Services PMI',
    impact: 'medium',
    forecast: '52.3',
    previous: '51.4',
  },
  {
    id: '4',
    date: new Date('2025-08-09T02:30:00'),
    country: 'JP',
    event: 'GDP Growth Rate QoQ',
    impact: 'medium',
    forecast: '0.5%',
    previous: '0.7%',
  },
  {
    id: '5',
    date: new Date('2025-08-10T21:45:00'),
    country: 'NZ',
    event: 'Food Inflation YoY',
    impact: 'low',
    forecast: '4.2%',
    previous: '4.5%',
  },
  {
    id: '6',
    date: new Date('2025-08-11T08:00:00'),
    country: 'EU',
    event: 'Industrial Production MoM',
    impact: 'medium',
    forecast: '0.3%',
    previous: '-0.1%',
  },
  {
    id: '7',
    date: new Date('2025-08-12T07:00:00'),
    country: 'UK',
    event: 'Unemployment Rate',
    impact: 'high',
    forecast: '4.0%',
    previous: '4.2%',
  }
]

// Mock data for educational resources
const mockResources = [
  {
    id: '1',
    title: 'Price Action Trading Guide',
    type: 'article',
    url: 'https://example.com/price-action',
    description: 'Comprehensive guide to reading and trading based on price action patterns.',
    tags: ['price action', 'patterns', 'technical analysis'],
  },
  {
    id: '2',
    title: 'Risk Management Fundamentals',
    type: 'video',
    url: 'https://example.com/risk-management',
    description: 'Learn proper position sizing and risk management techniques for consistent profitability.',
    tags: ['risk management', 'position sizing', 'psychology'],
  },
  {
    id: '3',
    title: 'Understanding Market Structure',
    type: 'ebook',
    url: 'https://example.com/market-structure',
    description: 'Detailed explanation of how to identify and trade with market structure.',
    tags: ['market structure', 'smart money', 'technical analysis'],
  },
  {
    id: '4',
    title: 'Profitable Fibonacci Trading',
    type: 'course',
    url: 'https://example.com/fibonacci',
    description: 'How to effectively use Fibonacci retracements and extensions in your trading.',
    tags: ['fibonacci', 'technical analysis', 'indicators'],
  },
  {
    id: '5',
    title: 'Trading Psychology Mastery',
    type: 'book',
    url: 'https://example.com/trading-psychology',
    description: 'Overcome psychological barriers and develop the mindset of successful traders.',
    tags: ['psychology', 'mindset', 'discipline'],
  },
]

const getImpactColor = (impact: string) => {
  switch (impact.toLowerCase()) {
    case 'high':
      return 'bg-red-500/10 text-red-500'
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-500'
    case 'low':
      return 'bg-blue-500/10 text-blue-500'
    default:
      return 'bg-gray-500/10 text-gray-500'
  }
}

const getResourceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'article':
      return <FileText className="h-5 w-5" />
    case 'video':
      return <Video className="h-5 w-5" />
    case 'ebook':
    case 'book':
      return <BookOpen className="h-5 w-5" />
    default:
      return <Info className="h-5 w-5" />
  }
}

export default function ResourceCenter() {
  const [searchQuery, setSearchQuery] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all')
  
  // Filter economic events
  const filteredEvents = mockEconomicEvents.filter(event => {
    const matchesSearch = event.event.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCountry = countryFilter === 'all' || event.country === countryFilter
    return matchesSearch && matchesCountry
  })
  
  // Filter resources
  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = resourceTypeFilter === 'all' || resource.type === resourceTypeFilter
    return matchesSearch && matchesType
  })
  
  // Group economic events by date
  const groupedEvents = filteredEvents.reduce((acc: any, event) => {
    const dateKey = formatDate(event.date)
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(event)
    return acc
  }, {})
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(new Date())}
          </Button>
          <Button>Add Resource</Button>
        </div>
      </div>
      
      <Tabs defaultValue="economic">
        <TabsList>
          <TabsTrigger value="economic">Economic Calendar</TabsTrigger>
          <TabsTrigger value="educational">Educational Resources</TabsTrigger>
          <TabsTrigger value="market">Market News</TabsTrigger>
        </TabsList>
        
        <TabsContent value="economic" className="mt-4 space-y-6">
          <div className="flex items-center space-x-2">
            <Select 
              value={countryFilter}
              onValueChange={setCountryFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="EU">Eurozone</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="JP">Japan</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="NZ">New Zealand</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                <span>High Impact</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                <span>Medium Impact</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                <span>Low Impact</span>
              </div>
            </div>
          </div>
          
          {Object.entries(groupedEvents).length > 0 ? (
            Object.entries(groupedEvents).map(([date, events]: [string, any]) => (
              <Card key={date}>
                <CardHeader className="py-3">
                  <CardTitle className="text-md">{date}</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  <div className="space-y-2">
                    {events.map((event: any) => (
                      <div key={event.id} className="flex items-center py-2 border-b last:border-0">
                        <div className="flex items-center space-x-2 w-[120px]">
                          <div className={`h-3 w-3 rounded-full bg-${event.impact === 'high' ? 'red' : event.impact === 'medium' ? 'yellow' : 'blue'}-500`}></div>
                          <span className="font-medium">{event.country}</span>
                          <span className="text-muted-foreground">{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{event.event}</span>
                        </div>
                        <div className="w-[80px] text-right">
                          <span className="text-muted-foreground">Forecast:</span>
                          <span className="ml-1">{event.forecast}</span>
                        </div>
                        <div className="w-[80px] text-right">
                          <span className="text-muted-foreground">Previous:</span>
                          <span className="ml-1">{event.previous}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p>No economic events found matching your filters.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="educational" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <Select 
              value={resourceTypeFilter}
              onValueChange={setResourceTypeFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="ebook">E-Books</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
                <SelectItem value="book">Books</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="bg-primary/10 p-2 rounded-md">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <CardTitle className="text-md">{resource.title}</CardTitle>
                          <CardDescription className="capitalize">{resource.type}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm">{resource.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {resource.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Resource
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p>No resources found matching your filters.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="market" className="mt-4 space-y-4">
          <div className="text-center py-10">
            <p>Market news feature coming soon!</p>
            <p className="text-muted-foreground mt-2">Stay tuned for the latest market news and analysis.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}