import type { Scoreboard, Problems, ScoreboardProblem } from "../utils/types";

interface LeaderboardViewProps {
  scoreboard: Scoreboard | null;
  problemset: Problems[];
  teammap: Map<string, string>;
}

const LeaderboardView = ({ scoreboard, problemset, teammap }: LeaderboardViewProps) => {

  const getStatusColor = (p: ScoreboardProblem) => {
    if (p.solved) {
      return p.first_to_solve ? "bg-green-600 text-white" : "bg-green-500 text-white";
    }
    if (p.num_pending > 0) {
      return "bg-blue-500 text-white animate-pulse";
    }
    if (p.num_judged > 0) {
      return "bg-red-500 text-white";
    }
    return "bg-transparent text-gray-400";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <div className="inline-block">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Scoreboard <span className="text-blue-600">Standings</span>
          </h2>
          <div className="mt-2 h-1.5 w-full bg-blue-600 rounded-full" />
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white border-b-2 border-slate-900">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-center w-16">Rank</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider border-l border-slate-700/50">Team Name</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-center border-l border-slate-700/50">Solved</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-center border-l border-slate-700/50">Time</th>
                {problemset.map(p => (
                  <th key={p.id} className="p-4 text-xs font-bold uppercase tracking-wider text-center min-w-18.75 border-l border-slate-700/50">
                    <div className="flex flex-col items-center">
                      <span>{p.label}</span>
                      <span className="w-4 h-1 mt-1 rounded-full" style={{ backgroundColor: p.rgb || '#cbd5e1' }}></span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-900">
              {scoreboard?.rows.map((row) => (
                <tr key={row.team_id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 text-center font-bold text-slate-900">{row.rank}</td>
                  <td className="p-4 border-l-2 border-slate-900 font-semibold text-slate-800">
                    {teammap.get(row.team_id) || row.team_id}
                  </td>
                  <td className="p-4 text-center border-l-2 border-slate-900">
                    <span className="bg-slate-100 px-3 py-1 rounded-md text-sm font-black border border-slate-200">
                      {row.score.num_solved}
                    </span>
                  </td>
                  <td className="p-4 text-center font-mono text-sm border-l-2 border-slate-900">
                    {row.score.total_time ?? 0}
                  </td>
                  {row.problems.map((p, idx) => (
                    <td key={idx} className="p-1 border-l-2 border-slate-900">
                      <div className={`h-12 w-full flex flex-col items-center justify-center rounded-md transition-all shadow-sm border border-black/5 ${getStatusColor(p)}`}>
                        {p.solved ? (
                          <>
                            <span className="text-sm font-black leading-none">{p.num_judged}</span>
                            <span className="text-[10px] font-medium opacity-80">{p.time}</span>
                          </>
                        ) : p.num_pending > 0 ? (
                          <span className="text-xs font-black italic">pending</span>
                        ) : p.num_judged > 0 ? (
                          <span className="text-sm font-black">{p.num_judged}</span>
                        ) : (
                          <span className="text-slate-200">·</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardView;