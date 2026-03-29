export default function LeaderboardView() {
  return (
    <div>Leaderboard</div>
  )
}

/*
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter italic">
          Arena <span className="text-primaryBlue">Standings</span>
        </h2>
      </header>

      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white uppercase text-[10px] tracking-widest">
              <th className="p-4 border-r border-white/20">Rank</th>
              <th className="p-4 border-r border-white/20">Team Name</th>
              <th className="p-4 border-r border-white/20 text-center">Solved</th>
              <th className="p-4 border-r border-white/20 text-center">Time</th>
              {problems.map(p => (
                <th key={p.id} className="p-4 text-center border-r border-white/20 min-w-15">{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-bold">
            {scoreboard?.rows.map((row) => (
              <tr key={row.team_id} className="border-b-4 border-black hover:bg-gray-50 transition-colors">
                <td className="p-4 text-2xl font-black italic">#{row.rank}</td>
                <td className="p-4 uppercase tracking-tight">
                  {teamNameById.get(row.team_id) || row.team_id}
                </td>
                <td className="p-4 text-center">
                  <span className="bg-green-400 border-2 border-black px-3 py-1 rounded-full text-sm">
                    {row.score.num_solved}
                  </span>
                </td>
                <td className="p-4 text-center font-mono">{row.score.total_time}</td>
                {row.problems.map((p, idx) => (
                  <td key={idx} className={`p-4 text-center border-l-2 border-gray-100 ${p.solved ? 'bg-green-50' : ''}`}>
                    {p.solved ? (
                      <div className="text-green-600 font-black">
                        <p className="text-xs">OK</p>
                        <p className="text-[10px] opacity-60">{p.time}</p>
                      </div>
                    ) : p.num_judged > 0 ? (
                      <span className="text-red-400 text-xs">-{p.num_judged}</span>
                    ) : (
                      <span className="text-gray-200">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
*/