"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createClient } from "@/app/utils/supabase/client"
const supabase = createClient()

type Player = {
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

// Function to convert feet-inches to centimeters
const heightToCm = (height: string): number => {
  const [feet, inches] = height.split('-').map(Number)
  return Math.round((feet * 30.48) + (inches * 2.54))
}

// Function to convert centimeters to feet-inches
const cmToHeight = (cm: number): string => {
  const inches = Math.round(cm / 2.54)
  const feet = Math.floor(inches / 12)
  const remainingInches = inches % 12
  return `${feet}-${remainingInches}`
}

export default function ScoutingPortal() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    position: "",
    minHeight: "",
    maxHeight: "",
    minWeight: "",
    maxWeight: "",
  })

  useEffect(() => {
    fetchPlayers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [players, filters])

  async function fetchPlayers() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('id', { ascending: true })
      
      if (error) throw error
      setPlayers(data as Player[] || [])
    } catch (error) {
      console.error('Error fetching players:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = players

    if (filters.position) {
      filtered = filtered.filter(player => player.position === filters.position)
    }

    if (filters.minHeight) {
      const minHeightCm = heightToCm(filters.minHeight)
      filtered = filtered.filter(player => player.height >= minHeightCm)
    }

    if (filters.maxHeight) {
      const maxHeightCm = heightToCm(filters.maxHeight)
      filtered = filtered.filter(player => player.height <= maxHeightCm)
    }

    if (filters.minWeight) {
      filtered = filtered.filter(player => player.weight >= parseInt(filters.minWeight))
    }

    if (filters.maxWeight) {
      filtered = filtered.filter(player => player.weight <= parseInt(filters.maxWeight))
    }

    setFilteredPlayers(filtered)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Scouting Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <Label htmlFor="position">Position</Label>
              <Select onValueChange={(value) => handleFilterChange("position", value)}>
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="QB">QB</SelectItem>
                  <SelectItem value="RB">RB</SelectItem>
                  <SelectItem value="WR">WR</SelectItem>
                  <SelectItem value="TE">TE</SelectItem>
                  <SelectItem value="OL">OL</SelectItem>
                  <SelectItem value="DL">DL</SelectItem>
                  <SelectItem value="LB">LB</SelectItem>
                  <SelectItem value="DB">DB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="minHeight">Min Height</Label>
              <Input
                id="minHeight"
                type="text"
                placeholder="e.g., 5-10"
                value={filters.minHeight}
                onChange={(e) => handleFilterChange("minHeight", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maxHeight">Max Height</Label>
              <Input
                id="maxHeight"
                type="text"
                placeholder="e.g., 6-5"
                value={filters.maxHeight}
                onChange={(e) => handleFilterChange("maxHeight", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="minWeight">Min Weight (kg)</Label>
              <Input
                id="minWeight"
                type="number"
                placeholder="Min weight"
                value={filters.minWeight}
                onChange={(e) => handleFilterChange("minWeight", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maxWeight">Max Weight (kg)</Label>
              <Input
                id="maxWeight"
                type="number"
                placeholder="Max weight"
                value={filters.maxWeight}
                onChange={(e) => handleFilterChange("maxWeight", e.target.value)}
              />
            </div>
          </div>
          {loading ? (
            <p>Loading players...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Height</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Route Running</TableHead>
                    <TableHead>Pass Defense</TableHead>
                    <TableHead>Tackling</TableHead>
                    <TableHead>ADP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.position}</TableCell>
                      <TableCell>{cmToHeight(player.height)}</TableCell>
                      <TableCell>{player.weight} kg</TableCell>
                      <TableCell>{player.speed}</TableCell>
                      <TableCell>{player.route_running}</TableCell>
                      <TableCell>{player.pass_def}</TableCell>
                      <TableCell>{player.tackling}</TableCell>
                      <TableCell>{player.adp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

