import { useEffect, useMemo, useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './middleware/ProtectedRoute'
import LoginView from './views/LoginView'
import HomepageView from './views/HomepageView'
import LeaderboardView from './views/LeaderboardView'
import ProblemsetView from './views/ProblemsetView'
import { loadAppConfig, type AppConfig } from './utils/config'
import type { Contest, Scoreboard, Team, Problems, Submissions, Judgements } from './utils/types'
import { requestJson } from './utils/utils'
import { useAuth } from './contexts/AuthContext'

const App = () => {
	const { user } = useAuth();
	const [appConfig, setAppConfig] = useState<AppConfig | null>(null)
	const [currContest, setCurrContest] = useState<Contest | null>(null)
	const [scoreboard, setScoreboard] = useState<Scoreboard | null>(null)
	const [submissions, setSubmissions] = useState<Submissions[]>([])
	const [allTeams, setAllTeams] = useState<Team[]>([])
	const [problems, setProblems] = useState<Problems[]>([])
	const [judgements, setJudgements] = useState<Judgements[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let timerInterval: number | null = null
		const loadData = async () => {
			const abortController = new AbortController()
			try {
				const config = appConfig || await loadAppConfig()
				if (!appConfig)
					setAppConfig(config)

				if (!user || !user.token) {
					setLoading(false)
					return;
				}

				const configuredContestId = config.contestId?.trim()
				let contest: Contest | undefined

				if (configuredContestId) {
					try {
						contest = await requestJson<Contest>(
							config,
							`/contests/${configuredContestId}?strict=false`,
							user.token,
							abortController.signal,
						)
					} catch {
						contest = undefined
					}
				}

				if (!contest) {
					const contests = await requestJson<Contest[]>(
						config,
						`/contests?onlyActive=false`,
						user.token,
						abortController.signal,
					)

					contest = configuredContestId
						? contests.find((item) => item.id === configuredContestId)
						: contests[0]
				}

				if (!contest)
					throw new Error(
						configuredContestId
							? `Contest not found: ${configuredContestId}`
							: "No contests found",
					)

				setCurrContest(contest)

				const activeContestId = contest.id

				const [nextScoreboard, nextTeams, nextProblems, nextSubmissions, nextJudgements] = await Promise.all([
					requestJson<Scoreboard>(config, `/contests/${activeContestId}/scoreboard`, user.token, abortController.signal),
					requestJson<Team[]>(config, `/contests/${activeContestId}/teams`, user.token, abortController.signal),
					requestJson<Problems[]>(config, `/contests/${activeContestId}/problems`, user.token, abortController.signal),
					requestJson<Submissions[]>(config, `/contests/${activeContestId}/submissions`, user.token, abortController.signal),
					requestJson<Judgements[]>(config, `/contests/${activeContestId}/judgements`, user.token, abortController.signal),
				])

				setScoreboard(nextScoreboard)
				setAllTeams(nextTeams)
				setProblems(nextProblems)
				setSubmissions(nextSubmissions)
				setJudgements(nextJudgements)
				setError(null)
			} catch (error) {
				setError(error instanceof Error ? error.message : 'API Error');
			} finally {
				setLoading(false)
			}
		}

		loadData()
		timerInterval = window.setInterval(loadData, 15000)
		return () => {
			if (timerInterval) clearInterval(timerInterval)
		}
	}, [appConfig, user])

	const teamMap = useMemo(() => new Map(allTeams.map(t => [t.id, t.name])), [allTeams])

	const submissionJudgements = useMemo(() => new Map(judgements.map(j => [j.submission_id, j])), [judgements])

	const teamStats = useMemo(() => {
		const row = scoreboard?.rows.find(r => r.team_id === user?.team_id)
		const userSubs = submissions.filter(s => s.team_id === user?.team_id)
		const solvedFromProblems = row?.problems.filter((problem) => problem.solved).length ?? 0
		const solvedFromScore = typeof row?.score.num_solved === 'number' ? row.score.num_solved : 0
		const solvedCount = Math.max(solvedFromScore, solvedFromProblems)
		const derivedTime = row?.problems.reduce((sum, problem) => {
			if (!problem.solved) {
				return sum
			}
			return sum + (problem.time ?? problem.runtime ?? 0)
		}, 0) ?? 0
		const totalTime = Math.max(row?.score.total_time ?? 0, row?.score.total_runtime ?? 0, derivedTime)
		return {
			solved: solvedCount,
			points: totalTime,
			rank: row?.rank || '-',
			totalSubmissions: userSubs
		}
	}, [scoreboard, submissions, user])

	if (loading) {
		return (
			<div className="text-center font-black animate-pulse py-20">INITIALIZING SYSTEMS...</div>
		)
	}

	if (error) {
		return (
			<div className="bg-red-100 border-4 border-black p-4 font-bold">{error}</div>
		)
	}

	return (
		<HashRouter>
			<Routes>
				<Route path="/login" element={<LoginView />} />
				<Route element={<ProtectedRoute />}>
					<Route element={<Layout currentcontest={currContest} />}>
						<Route path="/home" element={<HomepageView teammap={teamMap} teamstats={teamStats} submissionjudgements={submissionJudgements} currentcontest={currContest} />} />
						<Route path="/leaderboard" element={<LeaderboardView scoreboard={scoreboard} problemset={problems} teammap={teamMap} />} />
						<Route path="/problemset" element={<ProblemsetView problemset={problems} currentcontest={currContest} teammap={teamMap} appconfig={appConfig} />} />
						<Route path="/" element={<Navigate replace to="/home" />} />
					</Route>
				</Route>
				<Route path="*" element={<Navigate replace to="/" />} />
			</Routes>
		</HashRouter>
	)
}

export default App;