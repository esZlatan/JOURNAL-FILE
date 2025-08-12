import { Link, useLocation, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useDisplaySettings } from '@/context/display-settings-context'
import {
  PenLine,
  History,
  BookOpen,
  PieChart,
  BookOpenText,
  Trophy,
  Library,
  Menu,
  X,
  User,
  LogOut,
  Moon,
  Sun,
  Settings,
} from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SettingsDialog } from '@/components/filters/settings-dialog'

export default function MainLayout() {
  const location = useLocation()
  const { isCollapsed, toggleSidebar } = useDisplaySettings()
  const { theme, setTheme } = useTheme()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: PieChart,
      badge: false,
    },
    {
      name: 'Daily Journal',
      href: '/journal',
      icon: PenLine,
      badge: false,
    },
    {
      name: 'Trades',
      href: '/history',
      icon: History,
      badge: false,
    },
    {
      name: 'Notebook',
      href: '/notebook',
      icon: BookOpen,
      badge: false,
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: PieChart,
      badge: true,
    },
    {
      name: 'Playbooks',
      href: '/playbooks',
      icon: BookOpenText,
      badge: true,
    },
    {
      name: 'Progress Tracker',
      href: '/progress',
      icon: Trophy,
      badge: false,
    },
    {
      name: 'Resource Center',
      href: '/resources',
      icon: Library,
      badge: false,
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-[#1c2033] h-full relative flex flex-col border-r border-[#2a2f43] transition-all duration-300",
          isCollapsed ? "w-[60px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="h-[64px] flex items-center justify-between px-4 border-b border-[#2a2f43]">
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-white">Trading Journal</h1>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-400 hover:text-white">
            {isCollapsed ? <Menu /> : <X />}
          </Button>
        </div>

        {/* User profile */}
        <div className="flex items-center px-4 py-4 border-b border-[#2a2f43]">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/images/photo1754681217.jpg" alt="User avatar" />
            <AvatarFallback className="bg-blue-600">TD</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Trader Name</p>
              <Button variant="outline" className="mt-1 w-full text-sm bg-blue-600 hover:bg-blue-700 text-white border-0">
                + Add Trading Account
              </Button>
            </div>
          )}
        </div>
          
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href === '/dashboard' && location.pathname === '/');
              
              return (
                <li key={item.name}>
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center h-10 my-1 mx-2 px-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-[#2a2f43] text-white"
                        : "text-gray-400 hover:bg-[#2a2f43]/50 hover:text-white",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        isCollapsed ? "mx-auto" : "mr-3"
                      )}
                      aria-hidden="true"
                    />
                    {!isCollapsed && (
                      <>
                        <span>{item.name}</span>
                        {item.badge && (
                          <Badge variant="default" className="ml-auto bg-blue-600 text-white border-0 text-[10px] font-bold px-1.5">
                            NEW
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a2f43] flex justify-between items-center">
          <SettingsDialog />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[64px] border-b px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {navigation.find(item => 
              location.pathname === item.href || (item.href === '/dashboard' && location.pathname === '/'))?.name || 'Trading Journal'
            }
          </h1>
          
          <div className="flex items-center space-x-2">
            {/* Privacy button removed as requested */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-2 h-4 w-4">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                  <span>Add Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}