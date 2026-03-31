import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Contest } from "../utils/types";
import { formatSecondsAsDuration } from "../utils/utils";

interface NavbarProps {
  currentcontest: Contest | null;
}

const Navbar = ({ currentcontest }: NavbarProps) => {
  const { user, logout } = useAuth();
  const logoSrc = `${import.meta.env.BASE_URL}InternalContestLogo.svg`;
  const [liveContestTime, setLiveContestTime] = useState('--:--:--');
  const [contestTimeLabel, setContestTimeLabel] = useState('Loading...');
  const [isConcluded, setIsConcluded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentcontest) return;

    // Parse the DOMjudge absolute timestamps
    const start = currentcontest.start_time ? new Date(currentcontest.start_time).getTime() : 0;
    const end = currentcontest.end_time ? new Date(currentcontest.end_time).getTime() : Infinity;

    const updateTimer = () => {
      const now = Date.now();

      if (now < start) {
        // 1. Pre-Contest
        setContestTimeLabel('Starting In');
        setLiveContestTime(formatSecondsAsDuration(Math.floor((start - now) / 1000)));
        setIsConcluded(false);
      } else if (now >= start && now < end) {
        // 2. Active Contest
        setContestTimeLabel('Remaining');
        setLiveContestTime(formatSecondsAsDuration(Math.floor((end - now) / 1000)));
        setIsConcluded(false);
      } else {
        // 3. Post-Contest
        setContestTimeLabel('Status');
        setLiveContestTime('Concluded');
        setIsConcluded(true);
      }
    };

    updateTimer(); // Run immediately
    const interval = setInterval(updateTimer, 1000); // Tick every second

    return () => clearInterval(interval);
  }, [currentcontest]);

  return (
    <header className="bg-primaryWhite border-b-4 border-primaryBlack sticky top-0 z-50">
      <div className="max-w-480 mx-auto flex items-center h-20 px-6">

        <div className="flex items-center gap-4 shrink-0 pr-6 mr-6 border-r-4 border-primaryBlack h-full">
          <div className="flex items-center gap-3">
            <img
              className="h-16 w-auto object-contain block shrink-0"
              src={logoSrc}
              alt="ICLogo"
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-black uppercase tracking-tighter text-primaryBlack leading-none">
                {currentcontest?.formal_name || 'Contest Arena'}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primaryBlue animate-pulse border border-black/20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Live Arena
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          {[
            { name: 'Homepage', path: '/home' },
            { name: 'Leaderboards', path: '/leaderboard' },
            { name: 'Problemset', path: '/problemset' }
          ].map(pathing => (
            <button
              type="button"
              onClick={() => navigate(pathing.path)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border-2 
                ${location.pathname === pathing.path
                  ? 'bg-primaryYellow border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-transparent border-transparent hover:bg-white hover:border-black'}`}
            >
              {pathing.name}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4 pr-6 border-r-2 border-slate-100 h-10">
          <div className="text-right">
            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1">
              {contestTimeLabel}
            </p>
            {isConcluded ? (
              <span className="text-red-500 font-extrabold text-sm uppercase tracking-widest leading-none">
                {liveContestTime}
              </span>
            ) : (
              <span className="text-2xl font-mono font-black text-slate-900 tabular-nums leading-none tracking-tight">
                {liveContestTime}
              </span>
            )}
          </div>
        </div>

        {/* 4. User Section & Logout (Right) */}
        <div className="flex items-center gap-6 pl-6 border-l-4 border-primaryBlack h-full">
          <div className="hidden lg:block text-right">
            <p className="text-[9px] text-gray-400 font-black uppercase leading-none">Contestant</p>
            <p className="text-sm font-black text-primaryBlack leading-tight mt-1 uppercase tracking-tight">
              {user?.username ?? 'Guest'}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="bg-primaryBlue text-white text-[10px] font-black px-6 py-3 rounded-xl border-2 border-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar;