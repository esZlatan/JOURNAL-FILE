import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { DisplaySettingsProvider } from '@/context/display-settings-context'
import MainLayout from '@/components/layout/main-layout'
import Dashboard from '@/components/dashboard/dashboard'
import DailyJournal from '@/components/journal/daily-journal'
import TradesHistory from '@/components/trades/trades-history'
import Notebook from '@/components/notebook/notebook'
import Reports from '@/components/reports/reports'
import Playbooks from '@/components/playbooks/playbooks'
import ProgressTracker from '@/components/progress/progress-tracker'
import ResourceCenter from '@/components/resources/resource-center'
import AddAccount from '@/pages/accounts/add-account'
import Profile from '@/pages/profile/profile'
import RulesPage from '@/pages/rules'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="trading-journal-theme">
      <DisplaySettingsProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Match the routes to the navigation hrefs in main-layout.tsx */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="journal" element={<DailyJournal />} />
            <Route path="history" element={<TradesHistory />} />
            <Route path="notebook" element={<Notebook />} />
            <Route path="reports" element={<Reports />} />
            <Route path="playbooks" element={<Playbooks />} />
            <Route path="progress" element={<ProgressTracker />} />
            <Route path="resources" element={<ResourceCenter />} />
            <Route path="accounts/add" element={<AddAccount />} />
            <Route path="profile" element={<Profile />} />
            <Route path="rules" element={<RulesPage />} />
          </Route>
        </Routes>
        <Toaster />
      </DisplaySettingsProvider>
    </ThemeProvider>
  )
}

export default App