"use client"

import { useState } from "react"
import { usePlayers } from "@/playerscontext"
interface DraftedPlayer {
  id: number
  name: string
  position: string
  team: string
}

export default function Draft() {
  const { players, removePlayer } = usePlayers()
  const [draftOrder] = useState([
    "Team A",
    "Team B",
    "Team C",
    "Team D",
  ])
  const [currentPick, setCurrentPick] = useState(0)
  const [draftedPlayers, setDraftedPlayers] = useState<DraftedPlayer[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<typeof players[0] | null>(null)

  const nextPick = () => {
    setCurrentPick((prev) => (prev + 1) % draftOrder.length)
    setSelectedPlayer(null)
  }

  const selectPlayer = (player: typeof players[0]) => {
    setSelectedPlayer(player)
  }

  const draftPlayer = () => {
    if (selectedPlayer) {
      const draftedPlayer: DraftedPlayer = {
        id: selectedPlayer.id,
        name: selectedPlayer.name,
        position: selectedPlayer.position,
        team: draftOrder[currentPick]
      }
      setDraftedPlayers([...draftedPlayers, draftedPlayer])
      removePlayer(selectedPlayer.id)
      nextPick()
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Draft</h2>
      <p className="mb-4">Current Pick: {draftOrder[currentPick]}</p>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-2">Available Players</h3>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Position</th>
                <th className="border p-2">ADP</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className={selectedPlayer?.id === player.id ? "bg-blue-100" : ""}>
                  <td className="border p-2">{player.name}</td>
                  <td className="border p-2">{player.position}</td>
                  <td className="border p-2">{player.adp}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => selectPlayer(player)}
                      className="bg-green-500 text-white p-1 rounded"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Drafted Players</h3>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Position</th>
                <th className="border p-2">Team</th>
              </tr>
            </thead>
            <tbody>
              {draftedPlayers.map((player) => (
                <tr key={player.id}>
                  <td className="border p-2">{player.name}</td>
                  <td className="border p-2">{player.position}</td>
                  <td className="border p-2">{player.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Selected Player</h3>
        {selectedPlayer ? (
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Name:</strong> {selectedPlayer.name}</p>
            <p><strong>Position:</strong> {selectedPlayer.position}</p>
            <p><strong>Height:</strong> {selectedPlayer.height} cm</p>
            <p><strong>Weight:</strong> {selectedPlayer.weight} kg</p>
            <p><strong>Speed:</strong> {selectedPlayer.speed}</p>
            <p><strong>Route Running:</strong> {selectedPlayer.route_running}</p>
            <p><strong>Pass Defense:</strong> {selectedPlayer.pass_def}</p>
            <p><strong>Tackling:</strong> {selectedPlayer.tackling}</p>
            <p><strong>ADP:</strong> {selectedPlayer.adp}</p>
            <button
              onClick={draftPlayer}
              className="mt-2 bg-blue-500 text-white p-2 rounded"
            >
              Draft Player
            </button>
          </div>
        ) : (
          <p>No player selected</p>
        )}
      </div>
    </div>
  )
}