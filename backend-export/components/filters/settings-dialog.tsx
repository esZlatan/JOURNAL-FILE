import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function SettingsDialog() {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [displayUnit, setDisplayUnit] = useState("percentage");

  // Toggle privacy mode
  const handleTogglePrivacy = () => {
    const newState = !privacyMode;
    setPrivacyMode(newState);
    // Apply blur effect to all financial values
    document.querySelectorAll('.financial-value').forEach(el => {
      if (newState) {
        el.classList.add('blur-financial');
      } else {
        el.classList.remove('blur-financial');
      }
    });
    // Dispatch the privacy toggle event for other components
    const event = new CustomEvent('toggle-dashboard-privacy', { detail: { isPrivate: newState } });
    window.dispatchEvent(event);
  };

  // Handle display unit change
  const handleDisplayUnitChange = (value: string) => {
    setDisplayUnit(value);
    // In a real application, this would update the global state
    // and trigger re-renders of relevant components
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Privacy Mode Setting */}
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base" htmlFor="privacy-mode">
                Privacy Mode
              </label>
              <p className="text-sm text-muted-foreground">
                Hide sensitive financial information
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <button 
                type="button" 
                role="switch" 
                aria-checked={privacyMode}
                data-state={privacyMode ? "checked" : "unchecked"}
                value="on" 
                className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input" 
                id="privacy-mode"
                onClick={handleTogglePrivacy}
              >
                <span 
                  data-state={privacyMode ? "checked" : "unchecked"} 
                  className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
                ></span>
              </button>
            </div>
          </div>

          {/* Display Unit Setting */}
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base" htmlFor="display-unit">
                Display Unit
              </label>
              <p className="text-sm text-muted-foreground">
                Choose how to display trade results
              </p>
            </div>
            <Select value={displayUnit} onValueChange={handleDisplayUnitChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Display unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="pips">Pips</SelectItem>
                <SelectItem value="points">Points</SelectItem>
                <SelectItem value="ticks">Ticks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Removed Date Range Setting */}
        </div>
      </DialogContent>
    </Dialog>
  );
}