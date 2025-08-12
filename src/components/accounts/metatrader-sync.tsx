import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RefreshCcw, Server, ShieldCheck, Search, Plus, AlertCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { searchMTServers, addCustomMTServer, MTServer } from '@/services/brokers';
import { useToast } from '@/components/ui/use-toast';

interface MetaTraderSyncProps {
  className?: string;
}

export function MetaTraderSync({ className }: MetaTraderSyncProps) {
  const { toast } = useToast();
  const [formStep, setFormStep] = useState<'login' | 'connecting' | 'connected'>('login');
  const [serverType, setServerType] = useState<'demo' | 'live'>('demo');
  const [platformType, setPlatformType] = useState<'mt4' | 'mt5'>('mt5');
  const [broker, setBroker] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [serverSearch, setServerSearch] = useState<string>('');
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [syncInterval, setSyncInterval] = useState<number>(30); // 30 minutes default
  const [isLoadingServers, setIsLoadingServers] = useState<boolean>(false);
  const [serversList, setServersList] = useState<MTServer[]>([]);
  const [customServerName, setCustomServerName] = useState<string>('');
  const [customServerDialogOpen, setCustomServerDialogOpen] = useState<boolean>(false);

  const popularBrokers = [
    'IC Markets',
    'FXCM',
    'Pepperstone',
    'FxPro',
    'OANDA',
    'XM',
    'IG',
    'ThinkMarkets',
    'AvaTrade',
    'Axiory',
    'BlackBull Markets',
    'CMC Markets',
    'Darwinex',
    'Exness',
    'FP Markets',
    'FTMO',
    'FXTM',
    'GBE Brokers',
    'Hantec Markets',
    'HotForex',
    'IronFX',
    'LMAX',
    'NAGA Markets',
    'Tickmill',
    'Trading212',
    'Vantage',
    'Other'
  ];

  // Function to fetch MT servers
  const fetchServers = useCallback(async (search: string = '') => {
    if (!platformType) return;

    setIsLoadingServers(true);
    try {
      const servers = await searchMTServers(platformType, search);
      
      // Filter by server type if needed (demo/live)
      const filteredServers = servers.filter((server) => {
        const serverName = server.name.toLowerCase();
        return (
          (serverType === 'demo' && serverName.includes('demo')) || 
          (serverType === 'live' && !serverName.includes('demo'))
        );
      });
      
      setServersList(filteredServers);
    } catch (error) {
      console.error('Error fetching servers:', error);
      setServersList([]);
    } finally {
      setIsLoadingServers(false);
    }
  }, [platformType, serverType]);

  // Handle platform type change
  const handlePlatformChange = (platform: 'mt4' | 'mt5') => {
    setPlatformType(platform);
    setSelectedServer('');
    setServerSearch('');
    setServersList([]);
  };

  // Handle server type change
  const handleServerTypeChange = (type: 'demo' | 'live') => {
    setServerType(type);
    setSelectedServer('');
    fetchServers(serverSearch);
  };

  // Handle server search
  const handleServerSearch = (value: string) => {
    setServerSearch(value);
    fetchServers(value);
  };

  // Add custom server
  const handleAddCustomServer = async () => {
    if (!customServerName.trim()) {
      toast({
        title: "Error",
        description: "Server name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      const newServer = await addCustomMTServer(platformType, customServerName);
      if (newServer) {
        setServersList(prev => [...prev, newServer]);
        setSelectedServer(newServer.name);
        setCustomServerName('');
        setCustomServerDialogOpen(false);
        
        toast({
          title: "Server added",
          description: `Custom server ${newServer.name} has been added successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add custom server. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Effect to load servers when platform or broker changes
  useEffect(() => {
    if (broker && platformType) {
      fetchServers();
    }
  }, [broker, platformType, fetchServers]);

  // Handle form submission
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!broker) {
      setError('Please select a broker');
      return;
    }
    
    if (!account) {
      setError('Please enter your account number');
      return;
    }
    
    if (!password) {
      setError('Please enter your investor password');
      return;
    }
    
    if (!selectedServer) {
      setError('Please select a server');
      return;
    }
    
    // Simulated connection process
    setIsConnecting(true);
    setFormStep('connecting');
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Simulate successful connection (in real app, this would be an API response)
      setIsConnecting(false);
      setFormStep('connected');
    }, 2000);
  };

  const handleDisconnect = () => {
    setFormStep('login');
    setAccount('');
    setPassword('');
  };

  const handleManualSync = () => {
    // Simulate syncing
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      toast({
        title: "Sync Complete",
        description: "Your trades have been synchronized successfully",
      });
    }, 1500);
  };

  return (
    <div className={className}>
      {formStep === 'login' && (
        <form onSubmit={handleConnect} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="broker">Select Broker</Label>
            <Select value={broker} onValueChange={setBroker}>
              <SelectTrigger id="broker">
                <SelectValue placeholder="Select your broker" />
              </SelectTrigger>
              <SelectContent>
                {popularBrokers.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 mb-4">
            <Label>Platform Type</Label>
            <div className="flex items-center space-x-4 mb-2">
              <Button 
                type="button"
                variant={platformType === 'mt4' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handlePlatformChange('mt4')}
              >
                MetaTrader 4
              </Button>
              <Button 
                type="button"
                variant={platformType === 'mt5' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handlePlatformChange('mt5')}
              >
                MetaTrader 5
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Server Type</Label>
              <div className="flex items-center space-x-4">
                <Button 
                  type="button"
                  variant={serverType === 'demo' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleServerTypeChange('demo')}
                >
                  Demo
                </Button>
                <Button 
                  type="button"
                  variant={serverType === 'live' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleServerTypeChange('live')}
                >
                  Live
                </Button>
              </div>
              
              <div className="mt-2">
                <Label className="mb-1 block">Search Servers</Label>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Search for servers..." 
                    className="pr-8"
                    value={serverSearch}
                    onChange={(e) => handleServerSearch(e.target.value)}
                  />
                  <Search 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  />
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    {isLoadingServers 
                      ? "Loading servers..." 
                      : serversList.length > 0 
                        ? `${serversList.length} servers found`
                        : "No servers found"}
                  </p>
                  
                  <Dialog open={customServerDialogOpen} onOpenChange={setCustomServerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="px-2 h-6"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Add Server</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Custom Server</DialogTitle>
                        <DialogDescription>
                          Enter the name of your {platformType.toUpperCase()} server.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="custom-server" className="mb-2 block">Server Name</Label>
                        <Input
                          id="custom-server"
                          placeholder="e.g., MyBroker-MT5-Live"
                          value={customServerName}
                          onChange={(e) => setCustomServerName(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCustomServerDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddCustomServer}>Add Server</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {serversList.length > 0 && (
                  <div className="mt-2 border rounded-md max-h-32 overflow-y-auto">
                    {serversList.map((server) => (
                      <div 
                        key={server.name} 
                        className={`px-2 py-1 text-sm cursor-pointer hover:bg-accent ${selectedServer === server.name ? 'bg-accent' : ''}`}
                        onClick={() => setSelectedServer(server.name)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{server.name}</span>
                          {server.custom && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-1 rounded">Custom</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {broker && serversList.length === 0 && !isLoadingServers && (
                  <div className="mt-2 text-center py-2 border rounded-md">
                    <p className="text-xs text-muted-foreground">
                      No servers found. Try a different search or add a custom server.
                    </p>
                  </div>
                )}
                
                {!broker && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Select a broker first to view available servers.
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account">Account Number</Label>
              <Input 
                id="account" 
                type="text" 
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="12345678"
              />
              
              {selectedServer && (
                <div className="flex items-center mt-2 text-xs">
                  <Server className="h-3 w-3 mr-1 text-green-500" />
                  <span>Selected server: <span className="font-medium">{selectedServer}</span></span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">
              <div className="flex items-center">
                Investor Password
                <ShieldCheck className="h-4 w-4 ml-1 text-muted-foreground" />
              </div>
            </Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Investor password only"
            />
            <p className="text-xs text-muted-foreground">
              We only require the investor password which provides read-only access to your account data.
            </p>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
              <Label htmlFor="auto-sync">
                Automatically sync trades {autoSync && `(every ${syncInterval} minutes)`}
              </Label>
            </div>
            
            {autoSync && (
              <div className="pt-2 px-1">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Sync Interval</span>
                  <span>{syncInterval} minutes</span>
                </div>
                <Slider
                  defaultValue={[syncInterval]}
                  min={5}
                  max={120}
                  step={5}
                  onValueChange={(value: number[]) => setSyncInterval(value[0])}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5m</span>
                  <span>60m</span>
                  <span>120m</span>
                </div>
              </div>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Account'}
          </Button>
        </form>
      )}
      
      {formStep === 'connecting' && (
        <div className="flex flex-col items-center justify-center py-8">
          <RefreshCcw className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <h3 className="text-lg font-medium">Connecting to MetaTrader</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Establishing secure connection to your account...
          </p>
        </div>
      )}
      
      {formStep === 'connected' && (
        <div className="space-y-4">
          <div className="flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md p-3 mb-2">
            <Server className="h-5 w-5 mr-2" />
            <span className="font-medium">Successfully Connected</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform</span>
              <span className="font-medium">
                {platformType === 'mt4' ? 'MetaTrader 4' : 'MetaTrader 5'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Broker</span>
              <span className="font-medium">{broker}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account</span>
              <span className="font-medium">{account}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Server</span>
              <span className="font-medium">{selectedServer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Server Type</span>
              <span className="font-medium capitalize">{serverType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto-Sync</span>
              <span className="font-medium">
                {autoSync ? `Enabled (every ${syncInterval} minutes)` : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Synced</span>
              <span className="font-medium">Just now</span>
            </div>
          </div>
          
          <div className="pt-2 flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
            <Button 
              variant="default" 
              className="flex-1"
              onClick={handleManualSync}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Sync Now
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}