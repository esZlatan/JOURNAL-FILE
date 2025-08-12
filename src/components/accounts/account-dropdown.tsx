import React from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, PlusCircle, BarChart3, RefreshCcw, Settings } from "lucide-react";

interface AccountDropdownProps {
  className?: string;
}

export function AccountDropdown({ className }: AccountDropdownProps) {
  // These would come from a real account context in a production app
  const accounts = [
    { 
      id: "1", 
      name: "MetaTrader 5", 
      broker: "IC Markets",
      balance: 5475.23,
      lastSync: "2025-08-08T10:15:00Z"
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={className}>
          <div className="flex items-center">
            <span className="font-medium mr-2">Accounts</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel>Trading Accounts</DropdownMenuLabel>
        
        {accounts.length > 0 ? (
          <>
            <DropdownMenuGroup>
              {accounts.map(account => (
                <DropdownMenuItem key={account.id}>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-xs text-muted-foreground">{account.broker}</div>
                    </div>
                    <div className="text-right">
                      <div className="financial-value">${account.balance.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(account.lastSync).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Sync All Accounts
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BarChart3 className="h-4 w-4 mr-2" />
              Account Stats
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Manage Accounts
            </DropdownMenuItem>
          </>
        ) : (
          <div className="px-2 py-3 text-sm text-center text-muted-foreground">
            No trading accounts configured
          </div>
        )}
        
        <DropdownMenuSeparator />
        <Link to="/accounts/add">
          <DropdownMenuItem className="cursor-pointer">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Trading Account
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}