import { PlayerStatsTable } from "@/components/playerstatstable";
export default function Stats() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">Player Stats</h1>
      <PlayerStatsTable />
    </div>
  );
}

