"use client"

import React, { createContext, useState, useContext, ReactNode } from "react"

// Utility function to convert feet-inches to centimeters
const heightToCm = (height: string): number => {
  const [feet, inches] = height.split('-').map(Number)
  return Math.round((feet * 30.48) + (inches * 2.54))
}

interface Player {
  id: number
  name: string
  position: string
  height: number
  weight: number
  speed: number
  route_running: number
  pass_def: number
  tackling: number
  adp: number
}

interface PlayersContextType {
  players: Player[]
  addPlayer: (player: Omit<Player, "id">) => void
  removePlayer: (id: number) => void
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined)

const seedData = [
    {
      id: 1,
      name: "JJ Johnson",
      position: "WR/DB",
      height: heightToCm("6-2"),
      weight: 195,
      speed: 98,
      route_running: 90,
      pass_def: 88,
      tackling: 81,
      adp: 9,
    },
    {
      id: 2,
      name: "Cameron Norfleet",
      position: "WR/DB",
      height: heightToCm("6-1"),
      weight: 195,
      speed: 93,
      route_running: 96,
      pass_def: 87,
      tackling: 78,
      adp: 1,
    },
    {
      id: 3,
      name: "Rob Byers",
      position: "WR/DB",
      height: heightToCm("5-9"),
      weight: 195,
      speed: 88,
      route_running: 90,
      pass_def: 88,
      tackling: 81,
      adp: 17,
    },
    {
      id: 4,
      name: "Evan Dodigon",
      position: "WR/DB",
      height: heightToCm("6-1"),
      weight: 195,
      speed: 92,
      route_running: 91,
      pass_def: 86,
      tackling: 88,
      adp: 5,
    },
    {
      id: 5,
      name: "Nick Fridel",
      position: "DE/TE",
      height: heightToCm("6-4"),
      weight: 215,
      speed: 85,
      route_running: 80,
      pass_def: 83,
      tackling: 91,
      adp: 8,
    },
    {
      id: 6,
      name: "Garret Meyer",
      position: "QB/LB/RB/WR/DB",
      height: heightToCm("5-10"),
      weight: 180,
      speed: 93,
      route_running: 96,
      pass_def: 87,
      tackling: 78,
      adp: 0,
    },
    {
      id: 7,
      name: "Justin Locklear",
      position: "QB/LB",
      height: heightToCm("6-2"),
      weight: 210,
      speed: 88,
      route_running: 90,
      pass_def: 82,
      tackling: 81,
      adp: 0,
    },
    {
      id: 8,
      name: "Justin Catson",
      position: "WR/LB",
      height: heightToCm("6-0"),
      weight: 195,
      speed: 84,
      route_running: 83,
      pass_def: 82,
      tackling: 78,
      adp: 13,
    } ,{
      id: 9,
      name: "Taylor Nanato",
      position: "WR/LB",
      height: heightToCm("5-10"),
      weight: 195,
      speed: 88,
      route_running: 83,
      pass_def: 88,
      tackling: 81,
      adp: 12,
    },
    {
      id: 10,
      name: "Arman",
      position: "WR/DB",
      height: heightToCm("6-1"),
      weight: 195,
      speed: 89,
      route_running: 89,
      pass_def: 87,
      tackling: 78,
      adp: 8,
    },
    {
      id: 11,
      name: "Tyler Huang",
      position: "WR/DB",
      height: heightToCm("6-2"),
      weight: 195,
      speed: 86,
      route_running: 84,
      pass_def: 91,
      tackling: 86,
      adp: 6,
    },
    {
      id: 12,
      name: "Kinan Alatasi",
      position: "WR/DB",
      height: heightToCm("6-1"),
      weight: 195,
      speed: 85,
      route_running: 84,
      pass_def: 87,
      tackling: 78,
      adp: 3,
    },
    {
      id: 13,
      name: "Malek Alatasi",
      position: "WR/DB",
      height: heightToCm("6-2"),
      weight: 195,
      speed: 90,
      route_running: 83,
      pass_def: 84,
      tackling: 85,
      adp: 0,
    },
    {
      id: 14,
      name: "Trevor Kheone",
      position: "WR/DB",
      height: heightToCm("6-1"),
      weight: 195,
      speed: 94,
      route_running: 76,
      pass_def: 78,
      tackling: 78,
      adp: 17,
    },
    {
      id: 15,
      name: "Mcelfresh",
      position: "WR/DB",
      height: heightToCm("5-10"),
      weight: 183,
      speed: 92,
      route_running: 83,
      pass_def: 82,
      tackling: 81,
      adp: 13,
    },
    {
      id: 16,
      name: "Claudio Rodriguez",
      position: "WR/DB",
      height: heightToCm("5-11"),
      weight: 195,
      speed: 86,
      route_running: 91,
      pass_def: 87,
      tackling: 78,
      adp: 9,
    },
  ]

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(seedData)

  const addPlayer = (player: Omit<Player, "id">) => {
    setPlayers((prevPlayers) => [...prevPlayers, { ...player, id: Date.now() }])
  }

  const removePlayer = (id: number) => {
    setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== id))
  }

  return (
    <PlayersContext.Provider value={{ players, addPlayer, removePlayer }}>
      {children}
    </PlayersContext.Provider>
  )
}

export function usePlayers() {
  const context = useContext(PlayersContext)
  if (context === undefined) {
    throw new Error("usePlayers must be used within a PlayersProvider")
  }
  return context
}
