import { useMemo } from 'react'
import { getGameById } from '../data/gamesData'

export const useDayWiseRegistration = (registeredGames, user) => {
      return useMemo(() => {
            // Early return if no data
            if (!registeredGames || !Array.isArray(registeredGames) || !user) {
                  return {
                        hasDay1Registration: false,
                        hasDay2Registration: false,
                        day1GameName: null,
                        day2GameName: null,
                        isGameRegistered: () => false,
                        canRegisterForDay: () => true
                  }
            }

            console.log('=== Day-wise Registration Debug ===')
            console.log('User:', { username: user.username, name: user.name, id: user.id })
            console.log('Registered Games:', registeredGames)

            // Find user's registrations with comprehensive matching
            const userRegistrations = registeredGames.filter(reg => {
                  const matches = [
                        reg.userId === user.username,
                        reg.userId === user.name,
                        reg.userId === user.id,
                        reg.teamLeader?.fullName === user.username,
                        reg.teamLeader?.fullName === user.name,
                        reg.teamLeader?.name === user.username,
                        reg.teamLeader?.name === user.name,
                        String(reg.userId) === String(user.username),
                        String(reg.userId) === String(user.name),
                        String(reg.userId) === String(user.id)
                  ]

                  const isMatch = matches.some(Boolean)
                  console.log(`Registration ${reg.gameName}: ${isMatch ? 'MATCH' : 'NO MATCH'}`, {
                        regUserId: reg.userId,
                        teamLeader: reg.teamLeader?.fullName,
                        matches
                  })

                  return isMatch
            })

            console.log('User Registrations Found:', userRegistrations)

            // Check day-wise registrations
            let hasDay1Registration = false
            let hasDay2Registration = false
            let day1GameName = null
            let day2GameName = null

            userRegistrations.forEach(reg => {
                  const gameData = getGameById(parseInt(reg.gameId))
                  console.log(`Game ${reg.gameName} (ID: ${reg.gameId}):`, gameData)

                  if (gameData) {
                        if (gameData.day === 1) {
                              hasDay1Registration = true
                              day1GameName = reg.gameName
                              console.log('Found Day 1 registration:', reg.gameName)
                        } else if (gameData.day === 2) {
                              hasDay2Registration = true
                              day2GameName = reg.gameName
                              console.log('Found Day 2 registration:', reg.gameName)
                        }
                  }
            })

            // Helper functions
            const isGameRegistered = (gameId) => {
                  return userRegistrations.some(reg =>
                        parseInt(reg.gameId) === parseInt(gameId) ||
                        String(reg.gameId) === String(gameId)
                  )
            }

            const canRegisterForDay = (day) => {
                  return day === 1 ? !hasDay1Registration : !hasDay2Registration
            }

            const result = {
                  hasDay1Registration,
                  hasDay2Registration,
                  day1GameName,
                  day2GameName,
                  isGameRegistered,
                  canRegisterForDay,
                  userRegistrations // For debugging
            }

            console.log('Final Result:', result)
            console.log('=== End Debug ===')

            return result
      }, [registeredGames, user])
}