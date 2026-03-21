import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

/**
 * Page de lancement qui redirige automatiquement vers la bonne interface
 * en fonction du type d'application (admin, driver, user)
 */
export default function AppLauncher() {
  // Détecter le type d'application via la variable d'environnement injectée au build
  const appTarget = import.meta.env.VITE_APP_TARGET || 'admin'

  // Rediriger vers la bonne interface
  if (appTarget === 'user') {
    return <Navigate to="/mobile/user" replace />
  }
  
  if (appTarget === 'driver') {
    return <Navigate to="/mobile/driver" replace />
  }

  // Par défaut: interface admin
  return <Navigate to="/dashboard" replace />
}
