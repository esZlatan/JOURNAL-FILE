import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export type NewsImpactLevel = "high" | "medium" | "low" | "all"

interface NewsFilterProps {
  selectedLevels: NewsImpactLevel[]
  setSelectedLevels: (levels: NewsImpactLevel[]) => void
}

export function NewsFilter({ selectedLevels, setSelectedLevels }: NewsFilterProps) {
  const [open, setOpen] = React.useState(false)

  const impactLevels = [
    { value: "all", label: "All Impact Levels" },
    { value: "high", label: "High Impact", color: "bg-red-500" },
    { value: "medium", label: "Medium Impact", color: "bg-yellow-500" },
    { value: "low", label: "Low Impact", color: "bg-blue-500" },
  ]

  const toggleLevel = (value: NewsImpactLevel) => {
    if (value === "all") {
      // If "all" is selected, toggle between all and none
      setSelectedLevels(selectedLevels.includes("all") ? [] : ["all"]);
      return;
    }
    
    // Remove "all" if it exists
    const withoutAll = selectedLevels.filter(l => l !== "all");
    
    // Toggle the selected value
    const isSelected = withoutAll.includes(value);
    const newLevels = isSelected 
      ? withoutAll.filter(l => l !== value)
      : [...withoutAll, value];
      
    // If all individual levels are selected, use "all" instead
    if (newLevels.length === 3) {
      setSelectedLevels(["all"]);
    } else {
      setSelectedLevels(newLevels);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 text-xs flex">
          <div className="flex items-center space-x-2">
            {selectedLevels.includes("all") ? (
              <span>All Impact Levels</span>
            ) : selectedLevels.length > 0 ? (
              <div className="flex items-center space-x-1">
                {selectedLevels.includes("high") && (
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                )}
                {selectedLevels.includes("medium") && (
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                )}
                {selectedLevels.includes("low") && (
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                )}
                <span>
                  {selectedLevels.map(level => 
                    level.charAt(0).toUpperCase() + level.slice(1)
                  ).join(", ")} Impact
                </span>
              </div>
            ) : (
              <span>Select Impact Levels</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search impact levels..." />
          <CommandEmpty>No impact level found.</CommandEmpty>
          <CommandGroup>
            {impactLevels.map((level) => (
              <CommandItem
                key={level.value}
                value={level.value}
                onSelect={() => toggleLevel(level.value as NewsImpactLevel)}
              >
                <div className="flex items-center">
                  {level.value !== "all" && (
                    <div className={`h-3 w-3 rounded-full ${level.color} mr-2`}></div>
                  )}
                  {level.label}
                </div>
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedLevels.includes(level.value as NewsImpactLevel) 
                      ? "opacity-100" 
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}