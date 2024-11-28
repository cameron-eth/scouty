export default function Leaderboard() {
    const leaderboard = [
      { name: "John Doe", wins: 5, losses: 1 },
      { name: "Jane Smith", wins: 4, losses: 2 },
      { name: "Bob Johnson", wins: 3, losses: 3 },
      // Add more mock data here
    ];
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Legacy Leaderboard</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-900">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Wins</th>
              <th className="p-2 text-left">Losses</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="p-2">{player.name}</td>
                <td className="p-2">{player.wins}</td>
                <td className="p-2">{player.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }