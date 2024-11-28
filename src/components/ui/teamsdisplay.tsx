"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/app/utils/supabase/client";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

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
      "qblbrbrwrdb": "Flex",
      "dete": "DE/TE"
    };
    return positionMap[position.toLowerCase()] || position.toUpperCase();
  };

  const formatOdds = (odds: number): string => {
    return odds > 0 ? `+${odds}` : odds.toString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-white"
          >
            <Progress value={33} className="w-[60%] mx-auto" />
          </motion.div>
        ) : (
          teams.map((team) => (
            <motion.div key={team.id} variants={itemVariants}>
              <Card className="bg-zinc-900 border-gray-700">
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
                        <TableHead className="text-white">Anytime TD</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {players
                        .filter(player => player.team_id === team.id)
                        .map(player => (
                          <motion.tr 
                            key={player.id}
                            variants={itemVariants}
                          >
                            <TableCell className="text-white">{player.name}</TableCell>
                            <TableCell className="text-white">{formatPosition(player.position)}</TableCell>
                            <TableCell className="text-white">
                              {player.anytime_td !== null ? formatOdds(player.anytime_td) : 'N/A'}
                            </TableCell>
                          </motion.tr>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}

