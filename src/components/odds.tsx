"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { createClient } from "@/app/utils/supabase/client"
import { motion, AnimatePresence } from "framer-motion"

const supabase = createClient()

type Team = {
  id: number
  name: string
  odds: number
}

type Player = {
  id: number
  name: string
  team_id: number
  anytime_td: number | null
}

export function Odds() {
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [showTeamOdds, setShowTeamOdds] = useState(true)
  const [showPlayerOdds, setShowPlayerOdds] = useState(true)

  useEffect(() => {
    fetchTeamsAndPlayers()
  }, [])

  async function fetchTeamsAndPlayers() {
    try {
      setLoading(true)
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("id, name, odds")
        .order("odds", { ascending: true })

      if (teamsError) throw teamsError

      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("id, name, team_id, anytime_td")
        .order("anytime_td", { ascending: true })
        .not("anytime_td", "is", null)

      if (playersError) throw playersError

      setTeams(teamsData || [])
      setPlayers(playersData || [])
    } catch (error) {
      console.error("Error fetching teams and players:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatOdds = (odds: number): string => {
    return odds > 0 ? `+${odds}` : odds.toString()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex space-x-4" variants={itemVariants}>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showTeamOdds" 
            checked={showTeamOdds} 
            onCheckedChange={(checked) => setShowTeamOdds(checked as boolean)}
          />
          <Label htmlFor="showTeamOdds">Show Team Odds</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showPlayerOdds" 
            checked={showPlayerOdds} 
            onCheckedChange={(checked) => setShowPlayerOdds(checked as boolean)}
          />
          <Label htmlFor="showPlayerOdds">Show Player Odds</Label>
        </div>
      </motion.div>

      {loading ? (
        <motion.p 
          className="text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Loading odds...
        </motion.p>
      ) : (
        <AnimatePresence>
          {showTeamOdds && (
            <motion.div
              key="teamOdds"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Card className="bg-zinc-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Team Odds</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white">Team</TableHead>
                        <TableHead className="text-white">Odds</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teams.map((team) => (
                        <motion.tr key={team.id} variants={itemVariants}>
                          <TableCell className="text-white">Team {team.name}</TableCell>
                          <TableCell className="text-white">{formatOdds(team.odds)}</TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {showPlayerOdds && (
            <motion.div
              key="playerOdds"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Card className="bg-zinc-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Player Anytime TD Odds</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white">Player</TableHead>
                        <TableHead className="text-white">Team</TableHead>
                        <TableHead className="text-white">Anytime TD Odds</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {players.map((player) => (
                        <motion.tr key={player.id} variants={itemVariants}>
                          <TableCell className="text-white">{player.name}</TableCell>
                          <TableCell className="text-white">
                            {teams.find(t => t.id === player.team_id)?.name || 'N/A'}
                          </TableCell>
                          <TableCell className="text-white">{formatOdds(player.anytime_td!)}</TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}

