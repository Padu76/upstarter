'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, BarChart3, Users, TrendingUp, Settings, 
  FileText, PlusCircle, Lightbulb, Target, LogOut 
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [projectCount, setProjectCount] = useState(0)

  useEffect(() => {
    const updateCount = () => {
      try {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]')
        setProjectCount(projects.length)
      } catch (error) {
        console.error('Error reading projects count:', error)
        setProjectCount(0)
      }
    }
    
    // Aggiorna all'avvio
    updateCount()
    
    // Listener per aggiornamenti localStorage (da altre tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'projects') {
        updateCount()
      }
    }
    
    // Listener custom per aggiornamenti interni
    const handleProjectsUpdate = () => {
      updateCount()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('projectsUpdated', handleProjectsUpdate)
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('projectsUpdated', handleProjectsUpdate)
    }
  }, [])

  const menuItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      description: 'Panoramica generale'
    },
    {
      name: 'Analizza Idea',
      icon: Lightbulb,
      path: '/dashboard/guided',
      description: 'Questionario guidato'
    },
    {
      name: 'I Miei Progetti',
      icon: BarChart3,
      path: '/dashboard/projects',
      description: 'Gestisci i tuoi progetti',
      badge: projectCount > 0 ? projectCount : null
    },
    {
      name: 'Team',
      icon: Users,
      path: '/dashboard/team',
      description: 'Gestione team',
      comingSoon: true
    },
    {
      name: 'Investitori',
      icon: TrendingUp,
      path: '/dashboard/investors',
      description: 'Database investitori',
      comingSoon: true
    },
    {
      name: 'Impostazioni',
      icon: Settings,
      path: '/dashboard/settings',
      description: 'Configurazioni',
      comingSoon: true
    }
  ]

  const quickActions = [
    {
      name: 'Nuova Analisi',
      icon: PlusCircle,
      path: '/dashboard/guided',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Upload Documento',
      icon: FileText,
      path: '/dashboard/document',
      color: 'bg-green-500 hover:bg-green-600'
    }
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">UpStarter</h1>
            <p className="text-xs text-gray-500">Startup Analyzer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Menu Principale
          </p>
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (!item.comingSoon) {
                  router.push(item.path)
                }
              }}
              className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : item.comingSoon
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              disabled={item.comingSoon}
            >
              <item.icon className={`mr-3 flex-shrink-0 h-4 w-4 ${
                isActive(item.path) ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className="flex-1 text-left">{item.name}</span>
              {item.badge && (
                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                  {item.badge}
                </span>
              )}
              {item.comingSoon && (
                <span className="ml-2 bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Azioni Rapide
          </p>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={() => router.push(action.path)}
                className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white transition-colors ${action.color}`}
              >
                <action.icon className="mr-3 flex-shrink-0 h-4 w-4" />
                {action.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">User</p>
              <p className="text-xs text-gray-500">Startup Founder</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}