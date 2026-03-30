import { useAuth } from "../contexts/AuthContext";
import type { Judgements, Submissions } from "../utils/types";

interface TeamStats {
  rank: string | number;
  solved: number;
  points: number;
  totalSubmissions: Submissions[];
}

interface HomepageViewProps {
  teammap: Map<string, string>;
  teamstats: TeamStats;
  submissionjudgements: Map<string, Judgements>;
}

const HomepageView = ({ teammap, teamstats, submissionjudgements }: HomepageViewProps) => {
  const { user } = useAuth();

  // Logic to map the judgement_type_id to human-readable labels and colors
  const getVerdictStyles = (submissionId: string) => {
    const judgement = submissionjudgements.get(submissionId);

    if (!judgement) {
      return {
        label: "PENDING",
        color: "bg-blue-100 text-blue-700 border-blue-200 animate-pulse"
      };
    }

    // Standard ICPC / DOMJudge Verdicts
    switch (judgement.judgement_type_id) {
      case "AC":
        return { label: "CORRECT", color: "bg-green-100 text-green-700 border-green-200" };
      case "WA":
        return { label: "WRONG ANSWER", color: "bg-red-100 text-red-700 border-red-200" };
      case "TLE":
        return { label: "TIME LIMIT", color: "bg-orange-100 text-orange-700 border-orange-200" };
      case "RE":
        return { label: "RUN ERROR", color: "bg-purple-100 text-purple-700 border-purple-200" };
      case "CE":
        return { label: "COMPILE ERROR", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
      default:
        return { label: judgement.judgement_type_id, color: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 px-4 py-8">
      <header className="text-center md:text-left border-b-2 border-slate-100 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back, <span className="text-blue-600">{user?.username || 'Contestant'}</span>
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Team: <span className="text-slate-900">{teammap.get(user?.team_id || '') || 'Unassigned'}</span>
        </p>
      </header>

      {/* Team Summary Table */}
      <section className="bg-white rounded-xl shadow-xl border-2 border-slate-900 overflow-hidden">
        <div className="bg-slate-900 px-6 py-3">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Team Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-900 text-xs font-bold text-slate-600 uppercase">
                <th className="px-6 py-4">Current Rank</th>
                <th className="px-6 py-4 border-l-2 border-slate-900">Solved</th>
                <th className="px-6 py-4 border-l-2 border-slate-900">Penalty</th>
                <th className="px-6 py-4 border-l-2 border-slate-900">Submissions</th>
              </tr>
            </thead>
            <tbody className="text-2xl font-black text-slate-900">
              <tr>
                <td className="px-6 py-6 text-blue-600 font-mono">#{teamstats.rank}</td>
                <td className="px-6 py-6 border-l-2 border-slate-900 text-green-600">{teamstats.solved}</td>
                <td className="px-6 py-6 border-l-2 border-slate-900">{teamstats.points}</td>
                <td className="px-6 py-6 border-l-2 border-slate-900 text-slate-400">{teamstats.totalSubmissions.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Activity Log */}
      <section className="bg-white rounded-xl shadow-xl border-2 border-slate-900 overflow-hidden">
        <div className="bg-slate-900 px-6 py-3 flex justify-between items-center">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Recent Submissions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Problem</th>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamstats.totalSubmissions.map((sub) => {
                const verdict = getVerdictStyles(sub.id || '');
                return (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{sub.contest_time}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{sub.problem_id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">#{sub.id}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black border-2 ${verdict.color}`}>
                        {verdict.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default HomepageView;