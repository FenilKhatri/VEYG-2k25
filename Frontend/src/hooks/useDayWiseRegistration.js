import { useState, useEffect, useCallback } from 'react'
import { apiService } from '../services/api'

export const useDayWiseRegistration = () => {
      const [dayWiseStatus, setDayWiseStatus] = useState({
            day1: { registered: false, registration: null, availableSlots: 1 },
            day2: { registered: false, registration: null, availableSlots: 1 }
      })
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState(null)

      // Fetch day-wise registration status
      const fetchDayWiseStatus = useCallback(async () => {
            try {
                  setLoading(true)
                  setError(null)

                  const response = await apiService.getDayWiseRegistrationStatus()

                  if (response.success) {
                        setDayWiseStatus(response.data.dayWiseStatus)
                  } else {
                        throw new Error(response.message || 'Failed to fetch day-wise status')
                  }
            } catch (err) {
                  console.error('Error fetching day-wise status:', err)
                  setError(err.message)
            } finally {
                  setLoading(false)
            }
      }, [])

      // Check if user can register for a specific day
      const checkDayAvailability = useCallback(async (day) => {
            try {
                  const response = await apiService.checkDayAvailability(day)
                  return response.success ? response.data : null
            } catch (err) {
                  console.error(`Error checking day ${day} availability:`, err)
                  return null
            }
      }, [])

      // Get registration summary
      const getRegistrationSummary = useCallback(() => {
            const summary = {
                  totalRegistrations: 0,
                  registeredDays: [],
                  availableDays: [],
                  canRegisterMore: false
            }

            Object.entries(dayWiseStatus).forEach(([day, status]) => {
                  if (status.registered) {
                        summary.totalRegistrations++
                        summary.registeredDays.push({
                              day: day === 'day1' ? 1 : 2,
                              gameName: status.registration?.gameName,
                              registrationId: status.registration?.registrationId
                        })
                  } else {
                        summary.availableDays.push(day === 'day1' ? 1 : 2)
                  }
            })

            summary.canRegisterMore = summary.availableDays.length > 0

            return summary
      }, [dayWiseStatus])

      // Check if user can register for a specific day (local check)
      const canRegisterForDay = useCallback((day) => {
            const dayKey = `day${day}`
            return dayWiseStatus[dayKey] && !dayWiseStatus[dayKey].registered
      }, [dayWiseStatus])

      // Get registered game for a specific day
      const getRegisteredGameForDay = useCallback((day) => {
            const dayKey = `day${day}`
            return dayWiseStatus[dayKey]?.registration || null
      }, [dayWiseStatus])

      // Refresh status after registration
      const refreshStatus = useCallback(() => {
            fetchDayWiseStatus()
      }, [fetchDayWiseStatus])

      // Initialize on mount
      useEffect(() => {
            fetchDayWiseStatus()
      }, [fetchDayWiseStatus])

      return {
            dayWiseStatus,
            loading,
            error,
            fetchDayWiseStatus,
            checkDayAvailability,
            getRegistrationSummary,
            canRegisterForDay,
            getRegisteredGameForDay,
            refreshStatus
      }
}

export default useDayWiseRegistration