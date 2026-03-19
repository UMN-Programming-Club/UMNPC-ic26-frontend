import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { loadAppConfig, type AppConfig } from './config.ts'

type Contest = {
  id: string
  cid?: number
  name: string
  shortname?: string
  formal_name?: string
}

type ContestState = {
  frozen?: string | null
  thawed?: string | null
}

type Score = {
  num_solved: number
  total_time: number | null
}

type ScoreboardProblem = {
  label: string
  num_judged: number
  num_pending: number
  solved: boolean
  time: number | null
}

type ScoreboardRow = {
  rank: number
  team_id: string
  score: Score
  problems: ScoreboardProblem[]
}

type Scoreboard = {
  contest_time: string | null
  state: ContestState | null
  rows: ScoreboardRow[]
}

type Team = {
  id: string
  name: string
  display_name: string | null
  label: string
}

type ContestProblem = {
  ordinal: number
  label: string
  id: string
}

type Submission = {
  id: string | null
  time: string
  contest_time: string
  team_id: string
  problem_id: string
}

type Clarification = {
  id: string | null
  time: string | null
  contest_time: string
  from_team_id: string | null
  problem_id: string | null
}

async function requestJson<T>(config: AppConfig, path: string, signal: AbortSignal): Promise<T> {
  const timeoutController = new AbortController()
  const onAbort = () => timeoutController.abort()
  signal.addEventListener('abort', onAbort)
  const timeoutId = window.setTimeout(() => {
    timeoutController.abort()
  }, config.requestTimeoutMs)

  try {
    const response = await fetch(`${config.apiBaseUrl}${path}`, {
      signal: timeoutController.signal,
      credentials: config.withCredentials ? 'include' : 'omit',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed for ${path}: ${response.status} ${response.statusText}`)
    }

    return (await response.json()) as T
  } catch (error) {
    if (timeoutController.signal.aborted && !signal.aborted) {
      throw new Error(`Request timeout for ${path} after ${config.requestTimeoutMs}ms`)
    }
    throw error
  } finally {
    signal.removeEventListener('abort', onAbort)
    window.clearTimeout(timeoutId)
  }
}

function formatClock(value: string | null | undefined): string {
  if (!value) {
    return '--:--:--'
  }

  const clean = value.split('.')[0]
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(clean)) {
    return clean
  }

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.valueOf())) {
    return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return clean
}

function App() {
  const [contest, setContest] = useState<Contest | null>(null)
  const [scoreboard, setScoreboard] = useState<Scoreboard | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [problems, setProblems] = useState<ContestProblem[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [clarifications, setClarifications] = useState<Clarification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timerId: number | null = null
    let activeController: AbortController | null = null
    let isDisposed = false

    const loadContestData = async (nextConfig: AppConfig) => {
      activeController?.abort()
      const controller = new AbortController()
      activeController = controller

      setError(null)
      try {
        const contests = await requestJson<Contest[]>(nextConfig, '/contests', controller.signal)
        if (contests.length === 0) {
          throw new Error('No contests available from DOMjudge API.')
        }

        const activeContest =
          contests.find((item) => nextConfig.contestId && item.id === nextConfig.contestId) || contests[0]

        const contestId = encodeURIComponent(activeContest.id)

        const [nextScoreboard, nextTeams, nextProblems, nextSubmissions, nextClarifications] = await Promise.all([
          requestJson<Scoreboard>(nextConfig, `/contests/${contestId}/scoreboard`, controller.signal),
          requestJson<Team[]>(nextConfig, `/contests/${contestId}/teams`, controller.signal),
          requestJson<ContestProblem[]>(nextConfig, `/contests/${contestId}/problems`, controller.signal),
          requestJson<Submission[]>(nextConfig, `/contests/${contestId}/submissions`, controller.signal),
          requestJson<Clarification[]>(nextConfig, `/contests/${contestId}/clarifications`, controller.signal),
        ])

        if (controller.signal.aborted || isDisposed) {
          return
        }

        setContest(activeContest)
        setScoreboard(nextScoreboard)
        setTeams(nextTeams)
        setProblems(nextProblems)
        setSubmissions(nextSubmissions)
        setClarifications(nextClarifications)
      } catch (loadError) {
        if (controller.signal.aborted || isDisposed) {
          return
        }
        setError(loadError instanceof Error ? loadError.message : 'Failed to load DOMjudge data.')
      } finally {
        if (!controller.signal.aborted && !isDisposed) {
          setLoading(false)
        }
      }
    }

    const initialize = async () => {
      try {
        const nextConfig = await loadAppConfig()
        if (isDisposed) {
          return
        }

        await loadContestData(nextConfig)

        timerId = window.setInterval(() => {
          void loadContestData(nextConfig)
        }, nextConfig.autoRefreshMs)
      } catch (configError) {
        if (isDisposed) {
          return
        }
        setError(configError instanceof Error ? configError.message : 'Failed to load app configuration.')
        setLoading(false)
      }
    }

    void initialize()

    return () => {
      isDisposed = true
      activeController?.abort()
      if (timerId !== null) {
        window.clearInterval(timerId)
      }
    }
  }, [])

  const teamNameById = useMemo(() => {
    return new Map(teams.map((team) => [team.id, team.display_name || team.name || team.label]))
  }, [teams])

  const problemLabels = useMemo(() => {
    return [...problems].sort((a, b) => a.ordinal - b.ordinal).map((problem) => problem.label)
  }, [problems])

  const recentSubmissions = useMemo(() => {
    return [...submissions].sort((a, b) => (a.time < b.time ? 1 : -1)).slice(0, 8)
  }, [submissions])

  const recentClarifications = useMemo(() => {
    return [...clarifications].sort((a, b) => (a.contest_time < b.contest_time ? 1 : -1)).slice(0, 8)
  }, [clarifications])

  const isFrozen = Boolean(scoreboard?.state?.frozen && !scoreboard?.state?.thawed)

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo-mark" aria-hidden="true">
            DJ
          </span>
          <div>
            <p className="brand-name">DOMjudge</p>
            <p className="brand-sub">ICPC Contest Arena</p>
          </div>
        </div>
        <nav className="actions">
          <button type="button">Contest: {contest?.id ?? '...'}</button>
          <button type="button">Teams: {teams.length}</button>
          <button type="button">Problems: {problemLabels.length}</button>
          <span className="timer">{formatClock(scoreboard?.contest_time)}</span>
        </nav>
      </header>

      <section className="hero-strip">
        <h1>{contest?.formal_name || contest?.name || 'DOMjudge Contest'}</h1>
        <p>
          {isFrozen
            ? 'Scoreboard is currently frozen. Pending submissions may not be visible yet.'
            : 'Scoreboard is live. Updates refresh automatically every 15 seconds.'}
        </p>
      </section>

      <section className="problem-pills" aria-label="problem legend">
        {problemLabels.map((label) => (
          <span key={label} className="pill">
            {label}
          </span>
        ))}
      </section>

      {loading ? (
        <section className="panel loading-panel">Loading contest data from DOMjudge API...</section>
      ) : null}

      {error ? (
        <section className="panel error-panel">
          <strong>API error:</strong> {error}
        </section>
      ) : null}

      <main className="content-grid">
        <section className="panel scoreboard-panel">
          <header className="panel-header">
            <h2>Live Scoreboard</h2>
            <button type="button" className="filter-button">Auto refresh: 15s</button>
          </header>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Solved</th>
                  <th>Score</th>
                  {problemLabels.map((label) => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(scoreboard?.rows || []).map((row) => {
                  const problemByLabel = new Map(row.problems.map((problem) => [problem.label, problem]))

                  return (
                  <tr key={`${row.rank}-${row.team_id}`}>
                    <td>{row.rank}</td>
                    <td className="team">{teamNameById.get(row.team_id) || row.team_id}</td>
                    <td>{row.score.num_solved}</td>
                    <td>{row.score.total_time ?? 0}</td>
                    {problemLabels.map((label) => {
                      const scoreProblem = problemByLabel.get(label)
                      if (!scoreProblem) {
                        return <td key={`${row.team_id}-${label}`}>-</td>
                      }

                      if (scoreProblem.solved) {
                        return (
                          <td key={`${row.team_id}-${label}`}>
                            <span className="status status-ok">+{scoreProblem.time ?? ''}</span>
                          </td>
                        )
                      }

                      if (scoreProblem.num_pending > 0) {
                        return (
                          <td key={`${row.team_id}-${label}`}>
                            <span className="status status-pending">?{scoreProblem.num_pending}</span>
                          </td>
                        )
                      }

                      if (scoreProblem.num_judged > 0) {
                        return (
                          <td key={`${row.team_id}-${label}`}>
                            <span className="status status-failed">-{scoreProblem.num_judged}</span>
                          </td>
                        )
                      }

                      return <td key={`${row.team_id}-${label}`}>-</td>
                    })}
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="side-stack">
          <article className="panel">
            <header className="panel-header">
              <h2>Submissions</h2>
            </header>
            <ul className="list submissions-list">
              {recentSubmissions.map((item) => (
                <li key={`${item.id ?? item.time}-${item.problem_id}`}>
                  <span>{formatClock(item.contest_time || item.time)}</span>
                  <strong className="problem-tag">{item.problem_id}</strong>
                  <span>{teamNameById.get(item.team_id) || item.team_id}</span>
                  <span className="status status-pending">SUBMITTED</span>
                </li>
              ))}
              {recentSubmissions.length === 0 ? (
                <li className="empty-item">No submissions available.</li>
              ) : null}
            </ul>
          </article>

          <article className="panel">
            <header className="panel-header">
              <h2>Clarifications</h2>
            </header>
            <ul className="list clarifications-list">
              {recentClarifications.map((item) => (
                <li key={`${item.id ?? item.contest_time}-${item.problem_id ?? 'general'}`}>
                  <span>{formatClock(item.contest_time || item.time)}</span>
                  <strong>{item.from_team_id ? teamNameById.get(item.from_team_id) || item.from_team_id : 'Jury'}</strong>
                  <span>{item.problem_id ? `Problem ${item.problem_id}` : 'General'}</span>
                </li>
              ))}
              {recentClarifications.length === 0 ? (
                <li className="empty-item">No clarifications available.</li>
              ) : null}
            </ul>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
