"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from '@/app/utils/supabase/client';
const supabase = createClient();

interface PlayerStats {
  id: string;
  name: string;
  position: string;
  rec_yards: number | null;
  pass_yds: number | null;
  rec_tds: number | null;
  rush_yds: number | null;
  pass_tds: number | null;
  rush_tds: number | null;
  rec: number | null;
}

export function PlayerStatsTable() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("players")
        .select("id, name, position, rec_yards, pass_yds, rec_tds, rush_yds, pass_tds, rush_tds, rec")
        .order("id", { ascending: true });

      if (error) throw error;

      setPlayers(data || []);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  }

  // Function to convert positions like "wrdb" into "WR/DB"
  const formatPosition = (position: string): string => {
    if (position.toLowerCase() === "wrdb") {
      return "WR/DB";
    }
    if (position.toLowerCase() === "qblb") {
      return "QB/LB";
    }
    if (position.toLowerCase() === "qblbrbrwrdb") {
      return "QB/LB/RB/WR/DB";
    }
    if (position.toLowerCase() === "dete") {
      return "DE/TE";
    }
    // Add more conversions if necessary
    return position.toUpperCase();
  };

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <p className="text-center text-white">Loading player stats...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Position</TableHead>
              <TableHead className="text-white">Rec Yards</TableHead>
              <TableHead className="text-white">Pass Yards</TableHead>
              <TableHead className="text-white">Rec TDs</TableHead>
              <TableHead className="text-white">Rush Yards</TableHead>
              <TableHead className="text-white">Pass TDs</TableHead>
              <TableHead className="text-white">Rush TDs</TableHead>
              <TableHead className="text-white">Receptions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="text-white">{player.name}</TableCell>
                <TableCell className="text-white">{formatPosition(player.position)}</TableCell>
                <TableCell className="text-white">{player.rec_yards ?? 0}</TableCell>
                <TableCell className="text-white">{player.pass_yds ?? 0}</TableCell>
                <TableCell className="text-white">{player.rec_tds ?? 0}</TableCell>
                <TableCell className="text-white">{player.rush_yds ?? 0}</TableCell>
                <TableCell className="text-white">{player.pass_tds ?? 0}</TableCell>
                <TableCell className="text-white">{player.rush_tds ?? 0}</TableCell>
                <TableCell className="text-white">{player.rec ?? 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
