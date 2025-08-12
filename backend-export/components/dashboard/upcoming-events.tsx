import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

// Types
type Impact = 'high' | 'medium' | 'low';
type Country = 'US' | 'EU' | 'UK' | 'JP' | 'NZ' | 'All';

interface EconomicEvent {
  country: Country;
  time: string;
  name: string;
  forecast: string;
  previous: string;
  impact: Impact;
  date: string;
}

interface EducationalResource {
  title: string;
  description: string;
  url: string;
  category: string;
  date: string;
}

interface MarketNews {
  title: string;
  source: string;
  summary: string;
  url: string;
  date: string;
  impact: Impact;
}

// Sample data for economic calendar
const economicEvents: EconomicEvent[] = [
  { 
    country: 'US', 
    time: '12:30 PM', 
    name: 'Non-Farm Payrolls', 
    forecast: '+175K', 
    previous: '+142K', 
    impact: 'high',
    date: '2025-08-08'
  },
  { 
    country: 'US', 
    time: '12:30 PM', 
    name: 'Unemployment Rate', 
    forecast: '3.7%', 
    previous: '3.8%', 
    impact: 'high',
    date: '2025-08-08'
  },
  { 
    country: 'US', 
    time: '02:00 PM', 
    name: 'ISM Services PMI', 
    forecast: '52.3', 
    previous: '51.4', 
    impact: 'medium',
    date: '2025-08-08'
  },
  { 
    country: 'JP', 
    time: '02:30 AM', 
    name: 'GDP Growth Rate QoQ', 
    forecast: '0.5%', 
    previous: '0.7%', 
    impact: 'medium',
    date: '2025-08-09'
  },
  { 
    country: 'NZ', 
    time: '09:45 PM', 
    name: 'Food Inflation YoY', 
    forecast: '4.2%', 
    previous: '4.5%', 
    impact: 'low',
    date: '2025-08-10'
  },
  { 
    country: 'EU', 
    time: '08:00 AM', 
    name: 'Industrial Production MoM', 
    forecast: '0.3%', 
    previous: '-0.1%', 
    impact: 'medium',
    date: '2025-08-11'
  },
  { 
    country: 'UK', 
    time: '07:00 AM', 
    name: 'Unemployment Rate', 
    forecast: '4.0%', 
    previous: '4.2%', 
    impact: 'high',
    date: '2025-08-12'
  },
];

// Sample data for educational resources
const educationalResources: EducationalResource[] = [
  {
    title: "Understanding Risk Management",
    description: "A comprehensive guide to managing risk in trading",
    url: "#",
    category: "Risk Management",
    date: "2025-08-05"
  },
  {
    title: "Price Action Trading Fundamentals",
    description: "Learn how to read price action without indicators",
    url: "#",
    category: "Technical Analysis",
    date: "2025-08-07"
  },
  {
    title: "The Psychology of Trading",
    description: "Mastering your emotions for better trading decisions",
    url: "#",
    category: "Psychology",
    date: "2025-08-10"
  }
];

// Sample data for market news
const marketNews: MarketNews[] = [
  {
    title: "Fed Minutes Signal Potential Rate Cut",
    source: "Financial Times",
    summary: "Federal Reserve officials discussed rate cuts at their recent meeting",
    url: "#",
    date: "2025-08-07",
    impact: "high"
  },
  {
    title: "Global Markets Rally on Strong Earnings",
    source: "Bloomberg",
    summary: "Stock markets worldwide reached new highs as corporate earnings exceed expectations",
    url: "#",
    date: "2025-08-08",
    impact: "medium"
  },
  {
    title: "Oil Prices Stabilize After Supply Concerns",
    source: "Reuters",
    summary: "Crude oil trading steadies following temporary supply chain disruptions",
    url: "#",
    date: "2025-08-09",
    impact: "low"
  }
];

// Component
export function UpcomingEvents() {
  const [selectedCountry, setSelectedCountry] = useState<Country>('All');
  const [selectedImpacts, setSelectedImpacts] = useState<Impact[]>(['high', 'medium', 'low']);
  const [date, setDate] = useState<Date>(new Date());

  // Group events by date
  const groupedEvents = economicEvents
    .filter(event => selectedCountry === 'All' || event.country === selectedCountry)
    .filter(event => selectedImpacts.includes(event.impact))
    .reduce((groups: Record<string, EconomicEvent[]>, event) => {
      if (!groups[event.date]) {
        groups[event.date] = [];
      }
      groups[event.date].push(event);
      return groups;
    }, {});

  // Toggle impact filter
  const toggleImpact = (impact: Impact) => {
    setSelectedImpacts(prev => 
      prev.includes(impact)
        ? prev.filter(i => i !== impact)
        : [...prev, impact]
    );
  };

  // Get color for impact
  const getImpactColor = (impact: Impact) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Tabs defaultValue="economic" orientation="horizontal">
      <TabsList>
        <TabsTrigger value="economic">Economic Calendar</TabsTrigger>
        <TabsTrigger value="educational">Educational Resources</TabsTrigger>
        <TabsTrigger value="market">Market News</TabsTrigger>
      </TabsList>
      
      <TabsContent value="economic" className="mt-4 space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search resources..." 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8" 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "MMM dd, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="rounded-md border shadow"
                />
              </PopoverContent>
            </Popover>
            <Button className="h-9 px-4 py-2">Add Resource</Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          {/* Country filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-between">
                <span>{selectedCountry === 'All' ? 'All Countries' : selectedCountry}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-down h-4 w-4 opacity-50"><path d="m6 9 6 6 6-6"></path></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[150px]">
              <DropdownMenuCheckboxItem 
                checked={selectedCountry === 'All'} 
                onCheckedChange={() => setSelectedCountry('All')}
              >
                All Countries
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={selectedCountry === 'US'} 
                onCheckedChange={() => setSelectedCountry('US')}
              >
                US
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={selectedCountry === 'EU'} 
                onCheckedChange={() => setSelectedCountry('EU')}
              >
                EU
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={selectedCountry === 'UK'} 
                onCheckedChange={() => setSelectedCountry('UK')}
              >
                UK
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={selectedCountry === 'JP'} 
                onCheckedChange={() => setSelectedCountry('JP')}
              >
                Japan
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={selectedCountry === 'NZ'} 
                onCheckedChange={() => setSelectedCountry('NZ')}
              >
                New Zealand
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Impact filter badges */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex space-x-2">
              {[
                { impact: 'high', color: 'bg-red-500', label: 'High Impact' },
                { impact: 'medium', color: 'bg-yellow-500', label: 'Medium Impact' },
                { impact: 'low', color: 'bg-blue-500', label: 'Low Impact' }
              ].map((item) => (
                <div 
                  key={item.impact}
                  className={`flex items-center cursor-pointer px-2 py-1 rounded-md ${selectedImpacts.includes(item.impact as Impact) ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => toggleImpact(item.impact as Impact)}
                >
                  <div className={`h-3 w-3 rounded-full ${item.color} mr-1`}></div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {Object.keys(groupedEvents).sort().map(date => (
          <Card key={date}>
            <div className="flex flex-col space-y-1.5 p-6 py-3">
              <h3 className="font-semibold tracking-tight text-md">{date}</h3>
            </div>
            <div className="p-6 py-0">
              <div className="space-y-2">
                {groupedEvents[date].map((event, index) => (
                  <div key={`${event.country}-${event.name}-${index}`} className="flex items-center py-2 border-b last:border-0">
                    <div className="flex items-center space-x-2 w-[120px]">
                      <div className={`h-3 w-3 rounded-full ${getImpactColor(event.impact)}`}></div>
                      <span className="font-medium">{event.country}</span>
                      <span className="text-muted-foreground">{event.time}</span>
                    </div>
                    <div className="flex-1 truncate mr-2">
                      <span className="font-medium">{event.name}</span>
                    </div>
                    <div className="w-[90px] text-right flex flex-col">
                      <div>
                        <span className="text-xs text-muted-foreground">Forecast:</span>
                        <span className="ml-1 text-sm">{event.forecast}</span>
                      </div>
                    </div>
                    <div className="w-[90px] text-right flex flex-col">
                      <div>
                        <span className="text-xs text-muted-foreground">Previous:</span>
                        <span className="ml-1 text-sm">{event.previous}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </TabsContent>
      
      <TabsContent value="educational" className="mt-4 space-y-4">
        {educationalResources.map((resource, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">{resource.date}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-1">{resource.category}</span>
                </div>
              </div>
              <div className="mt-2">
                <Button variant="link" className="px-0 h-auto">Read more</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
      
      <TabsContent value="market" className="mt-4 space-y-4">
        {marketNews.map((news, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${getImpactColor(news.impact)}`}></div>
                    <h3 className="font-medium">{news.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{news.summary}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">{news.date}</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full mt-1">{news.source}</span>
                </div>
              </div>
              <div className="mt-2">
                <Button variant="link" className="px-0 h-auto">Read full story</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
}