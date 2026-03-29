import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './middleware/ProtectedRoute'
import LoginView from './views/LoginView'
import HomepageView from './views/HomepageView'
import LeaderboardView from './views/LeaderboardView'
import ProblemsetView from './views/ProblemsetView'

/*
function AppContent() {
	const { logout, user } = useAuth()
	const [appConfig, setAppConfig] = useState<AppConfig | null>(null)
	const [contest, setContest] = useState<Contest | null>(null)
	const [scoreboard, setScoreboard] = useState<Scoreboard | null>(null)
	const [teams, setTeams] = useState<Team[]>([])
	const [problems, setProblems] = useState<ContestProblem[]>([])
	const [submissions, setSubmissions] = useState<Submission[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [liveContestTime, setLiveContestTime] = useState('--:--:--')
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'ok' | 'error'>('idle')
	const [submitMessage, setSubmitMessage] = useState('')

	// 1. Data Fetching Logic
	useEffect(() => {
		let timerId: number | null = null
		const loadData = async () => {
			const abortController = new AbortController()
			try {
				const config = appConfig || await loadAppConfig()
				if (!appConfig) setAppConfig(config)

				const contests = await requestJson<Contest[]>(config, '/contests', abortController.signal)
				const selected = contests.find(c => c.id === config.contestId) || contests[0]
				if (!selected) throw new Error("No contests found")

				const cId = encodeURIComponent(selected.id)
				const [nextSB, nextTeams, nextProbs, nextSubs] = await Promise.all([
					requestJson<Scoreboard>(config, `/contests/${cId}/scoreboard`, abortController.signal),
					requestJson<Team[]>(config, `/contests/${cId}/teams`, abortController.signal),
					requestJson<ContestProblem[]>(config, `/contests/${cId}/problems`, abortController.signal),
					requestJson<Submission[]>(config, `/contests/${cId}/submissions`, abortController.signal),
				])

				setContest(selected)
				setScoreboard(nextSB)
				setTeams(nextTeams)
				setProblems(nextProbs)
				setSubmissions(nextSubs)
				setLoading(false)
			} catch (e) {
				setError(e instanceof Error ? e.message : 'API Error')
				setLoading(false)
			}
		}

		loadData()
		timerId = window.setInterval(loadData, 15000)
		return () => {
			clearInterval(timerId!)
		}
	}, [appConfig])

	// 2. Contest Clock Logic
	useEffect(() => {
		const baseSeconds = parseDurationToSeconds(scoreboard?.contest_time)
		if (baseSeconds === null) return
		const start = Date.now()
		const itv = setInterval(() => {
			const elapsed = Math.floor((Date.now() - start) / 1000)
			setLiveContestTime(formatSecondsAsDuration(baseSeconds + elapsed))
		}, 1000)
		return () => clearInterval(itv)
	}, [scoreboard?.contest_time])

	// 3. Derived Data for UI
	const teamNameById = useMemo(() =>
		new Map(teams.map(t => [t.id, t.display_name || t.name])), [teams]
	)

	const userStats = useMemo(() => {
		const row = scoreboard?.rows.find(r => r.team_id === user?.teamId)
		const userSubs = submissions.filter(s => s.team_id === user?.teamId)
		return {
			solved: row?.score.num_solved || 0,
			points: row?.score.total_time || 0,
			rank: row?.rank || '-',
			totalSubmissions: userSubs.length
		}
	}, [scoreboard, submissions, user])

	const submitToDomjudge = async (file: File) => {
		if (!appConfig || !contest) return
		setSubmitStatus('idle'); setSubmitMessage('Uploading...')
		try {
			const formData = new FormData()
			formData.append('code', file)
			// Note: Problem ID selection logic should be handled in ProblemsetView
			const res = await fetch(`${appConfig.apiBaseUrl}/contests/${contest.id}/submissions`, {
				method: 'POST',
				body: formData
			})
			if (!res.ok) throw new Error("Upload failed")
			setSubmitStatus('ok'); setSubmitMessage('Submitted successfully!')
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			setSubmitStatus('error'); setSubmitMessage('Error uploading file.')
		}
	}

	return (
		<div className="min-h-screen bg-primaryWhite text-primaryBlack">
			<ProtectedRoute onFallback={() => setViewMode('login')}>
				<Navbar
					contest={contest}
					liveContestTime={liveContestTime}
					currPage={viewMode}
					onViewChange={setViewMode}
					onLogout={logout}
					user={user}
				/>

				<main className="p-6">
					{loading && <div className="text-center font-black animate-pulse py-20">INITIALIZING SYSTEMS...</div>}
					{error && <div className="bg-red-100 border-4 border-black p-4 font-bold">{error}</div>}

					{!loading && !error && (
						<>
							{viewMode === 'dashboard' && (
								<HomepageView user={user} stats={userStats} submissions={submissions.slice(0, 5)} teamNameById={teamNameById} />
							)}
							{viewMode === 'contest' && (
								<LeaderboardView scoreboard={scoreboard} teamNameById={teamNameById} problems={problems} />
							)}
							{viewMode === 'workspace' && (
								<ProblemsetView
									problems={problems}
									onSubmit={submitToDomjudge}
									submitStatus={submitStatus}
									submitMessage={submitMessage}
									appConfig={appConfig}
								/>
							)}
						</>
					)}
				</main>
			</ProtectedRoute>
			{viewMode === 'login' && <LoginView onSuccess={() => setViewMode('dashboard')} />}
		</div>
	)
}
*/

const App = () => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<LoginView />} />
					<Route element={<ProtectedRoute />}>
						<Route element={<Layout />}>
							<Route path="/home" element={<HomepageView />} />
							<Route path="/leaderboard" element={<LeaderboardView />} />
							<Route path="/problemset" element={<ProblemsetView />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App;