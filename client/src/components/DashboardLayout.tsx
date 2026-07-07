import { useState } from 'react'
import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  

  return (
  <div className="flex flex-col min-h-screen bg-[#f4f6f8] dark:bg-[#1E293B] overflow-hidden">
    
    <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    
    <div className="flex flex-1 min-h-full overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>

  </div>
)
}

export default DashboardLayout