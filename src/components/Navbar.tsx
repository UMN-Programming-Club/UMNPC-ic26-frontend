import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/UseAuth";

const Navbar = () => {
  const { user } = useAuth();
  const [currPage, setCurrPage] = useState('home');
  const navigate = useNavigate();

  return (
    <header className="bg-primaryWhite border-b-4 border-primaryBlack sticky top-0 z-50">
      <div className="max-w-480 mx-auto flex items-center h-20 px-6">

        {/* 1. Brand & Contest Identity (Left) */}
        <div className="flex items-center gap-4 shrink-0 pr-6 mr-6 border-r-4 border-primaryBlack h-full">
          <div className="flex items-center gap-3">
            <img
              className="h-10 w-auto object-contain block shrink-0"
              src="/InternalContestLogo.svg"
              alt="ICLogo"
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-black uppercase tracking-tighter text-primaryBlack leading-none">
                Internal Contest UMNPC
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

        {/* 2. Primary Navigation (Center) */}
        <nav className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { navigate('/home'); setCurrPage('home') }}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border-2 
              ${currPage === 'home'
                ? 'bg-primaryYellow border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-transparent border-transparent hover:bg-white hover:border-black'}`}
          >
            Homepage
          </button>
          <button
            type="button"
            onClick={() => { navigate('/leaderboard'); setCurrPage('leaderboard') }}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border-2 
              ${currPage === 'leaderboard'
                ? 'bg-primaryYellow border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-transparent border-transparent hover:bg-white hover:border-black'}`}
          >
            Leaderboards
          </button>
          <button
            type="button"
            onClick={() => { navigate('/problemset'); setCurrPage('problemset') }}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border-2 
              ${currPage === 'problemset'
                ? 'bg-primaryYellow border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-transparent border-transparent hover:bg-white hover:border-black'}`}
          >
            Problemset
          </button>
        </nav>

        {/* 3. Timer (Middle-Right) */}
        <div className="ml-auto text-right pr-8">
          <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">Time Remaining</p>
          <span className="text-3xl font-mono font-black text-primaryBlack tabular-nums leading-none tracking-tighter">
            {liveContestTime}
          </span>
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
            onClick={onLogout}
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