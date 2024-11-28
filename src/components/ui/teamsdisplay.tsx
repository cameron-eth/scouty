"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/app/utils/supabase/client";
const supabase = createClient();

type Team = {
  id: number;
  name: string;
  captain: string;
  odds: number;
};

type Player = {
  id: number;
  name: string;
  position: string;
  team_id: number;
  anytime_td: number | null;
};

export default function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamsAndPlayers();
  }, []);

  async function fetchTeamsAndPlayers() {
    try {
      setLoading(true);
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*")
        .order("odds", { ascending: true });

      if (teamsError) throw teamsError;

      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("id, name, position, team_id, anytime_td")
        .order("id", { ascending: true });

      if (playersError) throw playersError;

      setTeams(teamsData || []);
      setPlayers(playersData || []);
    } catch (error) {
      console.error("Error fetching teams and players:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatPosition = (position: string): string => {
    const positionMap: { [key: string]: string } = {
      "wrdb": "WR/DB",
      "qblb": "QB/LB",
      "qblbrbrwrdb": "QB/LB/RB/WR/DB",
      "dete": "DE/TE"
    };
    return positionMap[position.toLowerCase()] || position.toUpperCase();
  };

  const formatOdds = (odds: number): string => {
    return odds > 0 ? `+${odds}` : odds.toString();
  };

  return (
    <div className="space-y-8">
      {loading ? (
        <p className="text-center text-white">Loading teams...</p>
      ) : (
        teams.map((team) => (
          <Card key={team.id} className="bg-transparent border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex justify-between items-center">
                <span>{team.name}</span>
                <span className="text-xl font-normal">Odds: {formatOdds(team.odds)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Player</TableHead>
                    <TableHead className="text-white">Position</TableHead>
                    <TableHead className="text-white">Captain</TableHead>
                    <TableHead className="text-white">Anytime TD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players
                    .filter(player => player.team_id === team.id)
                    .map(player => (
                      <TableRow key={player.id}>
                        <TableCell className="text-white">{player.name}</TableCell>
                        <TableCell className="text-white">{formatPosition(player.position)}</TableCell>
                        <TableCell className="text-white">
                          {player.id.toString() === team.captain ? "Yes" : "No"}
                        </TableCell>
                        <TableCell className="text-white">
                          {player.anytime_td !== null ? formatOdds(player.anytime_td) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

