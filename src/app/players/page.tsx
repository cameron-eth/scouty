"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "../utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

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
  adp: number;
};

const heightToCm = (height: string): number => {
  const [feet, inches] = height.split("-").map(Number);
  return Math.round(feet * 30.48 + inches * 2.54);
};

const cmToHeight = (cm: number): string => {
  const inches = Math.round(cm / 2.54);
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}-${remainingInches}`;
};

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

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Omit<Player, "id">>({
    name: "",
    position: "",
    speed: 0,
    route_running: 0,
    pass_defense: 0,
    tackling: 0,
    height: 0,
    weight: 0,
    adp: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("id", { ascending: true });

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

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPlayerData: Omit<Player, "id"> = {
        ...newPlayer,
        height: heightToCm(newPlayer.height.toString()),
      };
      const { data, error } = await supabase.from("players").insert([newPlayerData]).select();

      if (error) throw error;

      setPlayers([...players, data[0] as Player]);
      setNewPlayer({
        name: "",
        position: "",
        height: 0,
        weight: 0,
        speed: 0,
        route_running: 0,
        pass_defense: 0,
        tackling: 0,
        adp: 0,
      });
    } catch (error) {
      console.error("Error adding new player:", error);
    }
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
      className="max-w-4xl mx-auto space-y-8 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Commented out Add New Player form */}
      {/* <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Add New Player</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPlayer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Name"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Position"
                value={newPlayer.position}
                onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Height (e.g., 6-0)"
                value={newPlayer.height ? newPlayer.height.toString() : ""}
                onChange={(e) => setNewPlayer({ ...newPlayer, height: parseFloat(e.target.value) || 0 })}
              />
              <Input
                type="number"
                placeholder="Weight"
                value={newPlayer.weight || ""}
                onChange={(e) => setNewPlayer({ ...newPlayer, weight: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Speed (0-100)"
                value={newPlayer.speed || ""}
                onChange={(e) => setNewPlayer({ ...newPlayer, speed: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Route Running (0-100)"
                value={newPlayer.route_running || ""}
                onChange={(e) => setNewPlayer({ ...newPlayer, route_running: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Pass Defense (0-100)"
                value={newPlayer.pass_defense || ""}
                onChange={(e) => setNewPlayer({ ...newPlayer, pass_defense: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Tackling (0-100)"
                value={newPlayer.tackling || ""}
                onChange={(e) => setNewPlayer({ ...newPlayer, tackling: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="ADP"
                value={newPlayer.adp || ""}
                onChange={(e) => setNewPlayer({ ...newPlayer, adp: parseFloat(e.target.value) })}
              />
              <Button type="submit" className="md:col-span-2">
                Add Player
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div> */}

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
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Speed</TableHead>
                        <TableHead>Route Running</TableHead>
                        <TableHead>Pass Defense</TableHead>
                        <TableHead>Tackling</TableHead>
                        <TableHead>Height</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>ADP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {players.map((player) => (
                        <motion.tr key={player.id} variants={itemVariants}>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>{player.position}</TableCell>
                          <TableCell>{cmToHeight(player.height)}</TableCell>
                          
                          <TableCell>{player.speed}</TableCell>
                          <TableCell>{player.route_running}</TableCell>

                          <TableCell>{player.pass_defense}</TableCell>
                          <TableCell>{player.tackling}</TableCell>
                          <TableCell>{player.height}</TableCell>

                          <TableCell>{player.weight} kg</TableCell>
                          <TableCell>{player.adp}</TableCell>
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

