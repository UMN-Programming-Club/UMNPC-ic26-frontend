import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginView = () => {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Login form fields
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Client-side validation
    if (!loginUsername.trim() || !loginPassword) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)

    try {
      // We call the login function from AuthContext
      const result = await login(loginUsername, loginPassword)

      if (result.success) {
        // If successful, trigger the success callback
        navigate('/home')
      } else {
        // If the API returned a failure (invalid creds, etc.), show the message
        setError(result.message || 'Login failed. Please try again.')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // This catches network errors or unexpected crashes
      setError('Could not connect to the contest server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-primaryWhite p-6 font-sans">
      <section className="w-full max-w-md bg-white border-4 border-primaryBlack shadow-[12px_12px_0px_0px_rgba(33,31,31,1)] overflow-hidden">
        {/* Header Section */}
        <header className="bg-primaryBlue py-10 px-6 text-center border-b-4 border-primaryBlack">
          <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">
            Contest <span className="text-primaryYellow">Arena</span>
          </h1>
          <p className="text-blue-100 mt-2 text-xs font-bold uppercase tracking-widest opacity-80">
            Internal Authentication System
          </p>
        </header>

        <div className="p-8">
          {/* Error Alert Messaging */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-primaryBlack shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] text-red-700 text-xs font-black uppercase">
              <p className="flex items-center gap-2">
                <span>⚠️</span> {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="login-username"
                className="block text-xs font-black uppercase text-primaryBlack tracking-widest"
              >
                Contestant Username
              </label>
              <input
                id="login-username"
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                disabled={loading}
                placeholder="e.g. team01"
                className="w-full px-4 py-3 rounded-none border-2 border-primaryBlack focus:bg-primaryYellowLight outline-none transition-all disabled:bg-gray-100 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="block text-xs font-black uppercase text-primaryBlack tracking-widest"
              >
                Access Password
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-none border-2 border-primaryBlack focus:bg-primaryYellowLight outline-none transition-all disabled:bg-gray-100 font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-4 border-2 border-primaryBlack font-black uppercase tracking-[0.2em] text-sm transition-all transform active:translate-x-1 active:translate-y-1 active:shadow-none
                ${loading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-primaryBlue text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0528cc]'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Verifying...
                </span>
              ) : 'Enter Arena'}
            </button>
          </form>

          <footer className="mt-10 text-center border-t-2 border-dashed border-gray-200 pt-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-tight">
              Authorized personnel only. <br />
              All login attempts are logged by the system.
            </p>
          </footer>
        </div>
      </section>
    </main>
  )
}

export default LoginView;