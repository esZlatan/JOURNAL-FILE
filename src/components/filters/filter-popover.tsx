import * as React from "react"
import { FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"

interface FilterPopoverProps {
  onFilter: (filters: FilterOptions) => void
  className?: string
}

export interface FilterOptions {
  dateRange: {
    start?: Date;
    end?: Date;
  };
  moneyRange: {
    min?: number;
    max?: number;
  };
  type?: string;
}

export function FilterPopover({ onFilter = () => {}, className }: Partial<FilterPopoverProps>) {
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined)
  const [minAmount, setMinAmount] = React.useState<string>("")
  const [maxAmount, setMaxAmount] = React.useState<string>("")
  const [tradeType, setTradeType] = React.useState<string>("")

  const handleApplyFilter = () => {
    onFilter({
      dateRange: {
        start: startDate,
        end: endDate,
      },
      moneyRange: {
        min: minAmount ? parseFloat(minAmount) : undefined,
        max: maxAmount ? parseFloat(maxAmount) : undefined,
      },
      type: tradeType || undefined
    })
  }

  const handleReset = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setMinAmount("")
    setMaxAmount("")
    setTradeType("")
    onFilter({
      dateRange: {},
      moneyRange: {},
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <FilterIcon className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter Options</h4>
            <p className="text-sm text-muted-foreground">
              Filter by date range and amount
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="date-range">Date Range</Label>
              <div className="grid gap-2">
                <div className="space-y-1">
                  <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                  <DatePicker 
                    date={startDate} 
                    setDate={setStartDate} 
                    size="sm" 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="end-date" className="text-xs">End Date</Label>
                  <DatePicker 
                    date={endDate} 
                    setDate={setEndDate} 
                    size="sm" 
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount-range">Amount Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="min-amount" className="sr-only">Min Amount</Label>
                <Input
                  id="min-amount"
                  placeholder="Min $"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div>
                <Label htmlFor="max-amount" className="sr-only">Max Amount</Label>
                <Input
                  id="max-amount"
                  placeholder="Max $"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="trade-type">Trade Type</Label>
            <Select value={tradeType} onValueChange={setTradeType}>
              <SelectTrigger id="trade-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="long">Long</SelectItem>
                <SelectItem value="short">Short</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={handleApplyFilter}>
              Apply Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}