import { useCallback, useState } from 'react'
import Notification from '../components/Notification/Index'

const useNotification = (position = 'top-right') => {
  const [notification, setNotification] = useState(null)
  let timer

  const triggerNotification = useCallback((notificationProps) => {
    clearTimeout(timer)
    setNotification(notificationProps)
    timer = setTimeout(() => {
      setNotification(null)
    }, notificationProps.duration || 3000)
  }, [])

  const NotificationComponent = notification ? (
    <div className={`notification-container ${position}`}>
      <Notification {...notification} />
    </div>
  ) : null

  return { NotificationComponent, triggerNotification }
}

export default useNotification
