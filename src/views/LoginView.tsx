import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginView = () => {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!loginUsername.trim() || !loginPassword) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)

    try {
      const result = await login(loginUsername, loginPassword)
      if (result.success) {
        navigate('/home')
      } else {
        setError(result.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError(`Could not connect to the contest server. Reason: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    /* Using --color-primaryWhite (#f3f4f1) for page background */
    <main className="min-h-screen flex flex-col items-center justify-center bg-primaryWhite p-6 font-sans">

      {/* Container with --color-primaryBlack (#211f1f) borders */}
      <section className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-primaryBlack overflow-hidden">

        {/* Header with --color-primaryBlack (#211f1f) background */}
        <header className="bg-primaryBlack py-12 px-6 text-center">
          <div className="inline-block">
            <h1 className="text-4xl font-black tracking-tight text-white uppercase italic leading-none">
              Internal <span className="text-primaryYellow">Contest</span>
            </h1>
            {/* Underline using --color-primaryYellow (#fadb5e) */}
            <div className="mt-2 h-1.5 w-full bg-primaryYellow rounded-full" />
          </div>
          <p className="text-white/60 mt-4 text-[10px] font-bold uppercase tracking-[0.2em]">
            Secure Authentication Portal
          </p>
        </header>

        <div className="p-10">
          {/* Error Alert */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg text-red-700 text-xs font-bold uppercase tracking-wide flex items-center gap-3">
              <span className="text-base">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label
                htmlFor="login-username"
                className="block text-xs font-black uppercase text-primaryBlack/50 tracking-widest ml-1"
              >
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                disabled={loading}
                placeholder="Enter your username"
                /* Focus state uses --color-primaryYellowLight (#ffff70) */
                className="w-full px-5 py-4 rounded-xl border-2 border-primaryWhite focus:border-primaryBlack focus:bg-primaryYellowLight/30 outline-none transition-all disabled:bg-primaryWhite font-bold text-primaryBlack"
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="login-password"
                className="block text-xs font-black uppercase text-primaryBlack/50 tracking-widest ml-1"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-xl border-2 border-primaryWhite focus:border-primaryBlack focus:bg-primaryYellowLight/30 outline-none transition-all disabled:bg-primaryWhite font-bold text-primaryBlack"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              /* Using --color-primaryBlue (#0736ff) for the main action */
              className={`w-full py-5 px-4 rounded-xl font-black uppercase tracking-[0.15em] text-sm transition-all
                ${loading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-primaryBlue text-white shadow-lg shadow-primaryBlue/20 hover:bg-primaryBlack hover:shadow-none active:scale-[0.98]'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Verifying
                </span>
              ) : 'Access Arena'}
            </button>
          </form>

          <footer className="mt-12 text-center">
            <p className="text-[10px] font-bold text-primaryBlack/40 uppercase leading-relaxed tracking-wider">
              Protected by system-wide encryption <br />
              <span className="opacity-60 font-medium">Session logs are active for this terminal</span>
            </p>
          </footer>
        </div>
      </section>
    </main>
  )
}

export default LoginView;