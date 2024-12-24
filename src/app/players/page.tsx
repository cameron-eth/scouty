"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "../utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from 'lucide-react';

const supabase = createClient();

type Player = {
  id: number;
  name: string;
  position: string;
  height: number;
  weight: number;
  speed: number;
  route_running: number;
  pass_defense: number;
  tackling: number;
  overall: number;
};

type SortConfig = {
  key: keyof Player;
  direction: 'asc' | 'desc';
} | null;

const formatPosition = (position: string): string => {
  if (position.toLowerCase() === "wrdb") {
    return "WR/DB";
  }
  if (position.toLowerCase() === "qblb") {
    return "QB/LB";
  }
  if (position.toLowerCase() === "qblbrbrwrdb") {
    return "Flex";
  }
  if (position.toLowerCase() === "dete") {
    return "DE/TE";
  }
  return position.toUpperCase();
};

const cmToHeight = (cm: number): string => {
  const inches = Math.round(cm / 2.54);
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}-${remainingInches}`;
};

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'overall', direction: 'desc' });

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("players")
        .select("id, name, position, height, weight, speed, route_running, pass_defense, tackling, overall")
        .order("overall", { ascending: false });

      if (error) throw error;

      const formattedData = data.map((player: Player) => ({
        ...player,
        position: formatPosition(player.position),
      }));

      setPlayers(formattedData || []);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (key: keyof Player) => {
    setSortConfig(prevConfig => {
      if (prevConfig && prevConfig.key === key) {
        if (prevConfig.direction === 'desc') {
          return { key, direction: 'asc' };
        }
        return null;
      }
      return { key, direction: 'desc' };
    });
  };

  const sortedPlayers = useMemo(() => {
    if (!sortConfig) return players;
    
    return [...players].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [players, sortConfig]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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

  const columns: (keyof Player)[] = [
    "overall", "name", "position", "height", "weight", "speed", "route_running", "pass_defense", "tackling"
  ];

  return (
    <motion.div 
      className="max-w-full mx-auto space-y-8 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Player Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {loading ? (
                <motion.p
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Loading players...
                </motion.p>
              ) : (
                <motion.div 
                  className="overflow-x-auto"
                  key="table"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead 
                            key={column}
                            className="cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSort(column)}
                          >
                            <div className="flex items-center justify-between">
                              <span>{column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                              {sortConfig && sortConfig.key === column && (
                                sortConfig.direction === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPlayers.map((player) => (
                        <motion.tr key={player.id} variants={itemVariants}>
                          {columns.map((column) => (
                            <TableCell key={column}>
                              {column === 'height' ? cmToHeight(player[column]) : player[column]}
                            </TableCell>
                          ))}
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}


