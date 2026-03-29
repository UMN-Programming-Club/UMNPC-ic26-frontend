type Contest = {
    id: string;
    cid?: number;
    name: string;
    shortname?: string;
    formal_name?: string;
};

type ContestState = {
    frozen?: string | null;
    thawed?: string | null;
};

type Score = {
    num_solved: number;
    total_time: number | null;
};

type ScoreboardProblem = {
    label: string;
    problem_id: string;
    num_judged: number;
    num_pending: number;
    solved: boolean;
    time: number | null;
};

type ScoreboardRow = {
    rank: number;
    team_id: string;
    score: Score;
    problems: ScoreboardProblem[];
};

type Scoreboard = {
    contest_time: string | null;
    state: ContestState | null;
    rows: ScoreboardRow[];
};

type Team = {
    id: string;
    name: string;
    display_name: string | null;
    label: string;
};

type ContestProblem = {
    ordinal: number;
    label: string;
    id: string;
    name: string;
    color?: string;
    rgb?: string;
    time_limit?: number;
    memory_limit?: number;
    statement?: Array<{
        href: string;
        mime?: string;
        filename?: string;
    }>;
};

type Submission = {
    id: string | null;
    time: string;
    contest_time: string;
    team_id: string;
    problem_id: string;
};

export type {
    Contest,
    ContestState,
    Scoreboard,
    Team,
    ContestProblem,
    Submission,
};
