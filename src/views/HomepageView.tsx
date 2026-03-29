export default function HomepageView() {
  return (
    <div>Homepage</div>
  )
}

/* 
    <div className="max-w-6xl mx-auto space-y-8">
      < section className="bg-primaryYellow border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" >
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">
          Welcome back, <span className="text-primaryBlue">{user?.username || 'Contestant'}</span>
        </h2>
        <p className="font-bold mt-2 opacity-80 uppercase text-sm">Team: {teamNameById.get(user?.teamId) || 'Unassigned'}</p>
      </ >

      < div className="grid grid-cols-1 md:grid-cols-4 gap-6" >
        {
          [
            { label: 'Current Rank', val: `#${stats.rank}`, color: 'bg-white' },
            { label: 'Solved', val: stats.solved, color: 'bg-green-400' },
            { label: 'Total Penalty', val: stats.points, color: 'bg-white' },
            { label: 'Submissions', val: stats.totalSubmissions, color: 'bg-primaryBlue text-white' },
          ].map((s, i) => (
            <div key={i} className={`${s.color} border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
              <p className="text-[10px] font-black uppercase mb-1 opacity-70">{s.label}</p>
              <p className="text-3xl font-black">{s.val}</p>
            </div>
          ))
        }
      </ >

      < section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden" >
        <div className="bg-black p-4 text-white font-black uppercase italic tracking-widest">
          Recent Activity Log
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 font-black text-xs border-2 border-black">{sub.problem_id}</div>
                  <div>
                    <p className="font-black uppercase text-sm">Submission #{sub.id}</p>
                    <p className="text-[10px] font-bold text-gray-500">{sub.contest_time}</p>
                  </div>
                </div>
                <span className="bg-primaryYellow px-3 py-1 border-2 border-black font-black text-[10px] uppercase">
                  Processed
                </span>
              </div>
            ))}
            {submissions.length === 0 && <p className="text-center font-bold text-gray-400 py-10 uppercase">No recent submissions found.</p>}
          </div>
        </div>
      </section >
    </div >
*/