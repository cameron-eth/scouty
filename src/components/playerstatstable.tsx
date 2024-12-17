"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createClient } from '@/app/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';

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

type SortConfig = {
  key: keyof PlayerStats;
  direction: 'asc' | 'desc';
};

export function PlayerStatsTable() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rec_yards', direction: 'desc' });

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

  const formatPosition = (position: string): string => {
    if (position.toLowerCase() === "wrdb") {
      return "WR/DB";
    }
    if (position.toLowerCase() === "qblb") {
      return "QB/LB";
    }
    if (position.toLowerCase() === "qblbrbrwrdb") {
      return "FLEX";
    }
    if (position.toLowerCase() === "dete") {
      return "DE/TE";
    }
    return position.toUpperCase();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleSort = (key: keyof PlayerStats) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedPlayers = React.useMemo(() => {
    const sortableItems = [...players];
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] === null) return 1;
      if (b[sortConfig.key] === null) return -1;
      if (a[sortConfig.key]! < b[sortConfig.key]!) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key]! > b[sortConfig.key]!) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [players, sortConfig]);

  const statFields: (keyof PlayerStats)[] = ['rec_yards', 'pass_yds', 'rec_tds', 'rush_yds', 'pass_tds', 'rush_tds', 'rec'];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded p-2 bg-zinc-900">
        <AnimatePresence>
          {loading ? (
            <motion.p
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-white"
            >
              Loading player stats...
            </motion.p>
          ) : (
            <motion.div
              key="table"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <ScrollArea className="w-full whitespace-nowrap">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Position</TableHead>
                      {statFields.map(field => (
                        <TableHead key={field} className="text-white">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort(field)}
                            className="text-white hover:text-gray-300"
                          >
                            {field.replace('_', ' ').replace('yds', 'yards')}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPlayers.map((player) => (
                      <motion.tr key={player.id} variants={rowVariants}>
                        <TableCell className="text-white">{player.name}</TableCell>
                        <TableCell className="text-white">{formatPosition(player.position)}</TableCell>
                        {statFields.map(field => (
                          <TableCell key={field} className="text-white">{player[field] ?? 0}</TableCell>
                        ))}
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

