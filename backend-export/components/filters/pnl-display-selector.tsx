import * as React from "react"
import { CheckIcon, DollarSign, Percent, Hash, LineChart } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"

export type PnLDisplayMode = "dollar" | "percentage" | "ticks" | "points" | "rr"

interface PnLDisplaySelectorProps {
  value: PnLDisplayMode
  onChange: (value: PnLDisplayMode) => void
}

export function PnLDisplaySelector({ value, onChange }: PnLDisplaySelectorProps) {
  const [open, setOpen] = React.useState(false)

  const displayModes = [
    { 
      value: "dollar", 
      label: "Dollar ($)", 
      icon: DollarSign 
    },
    { 
      value: "percentage", 
      label: "Percentage (%)", 
      icon: Percent 
    },
    { 
      value: "ticks", 
      label: "Ticks", 
      icon: Hash 
    },
    { 
      value: "points", 
      label: "Points", 
      icon: Hash 
    },
    { 
      value: "rr", 
      label: "Risk/Reward (R:R)", 
      icon: LineChart 
    },
  ]

  const selectedMode = displayModes.find(mode => mode.value === value) || displayModes[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 text-xs">
          <selectedMode.icon className="mr-2 h-4 w-4" />
          {selectedMode.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandGroup>
            {displayModes.map((mode) => {
              const Icon = mode.icon
              return (
                <CommandItem
                  key={mode.value}
                  value={mode.value}
                  onSelect={() => {
                    onChange(mode.value as PnLDisplayMode)
                    setOpen(false)
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {mode.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === mode.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}