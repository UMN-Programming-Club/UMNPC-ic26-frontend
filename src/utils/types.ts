type Contest = {
	formal_name?: string | null;
	scoreboard_type?: string | null;
	start_time?: string | null;
	end_time?: string | null;
	scoreboard_thaw_time?: string | null;
	duration?: string | null;
	scoreboard_freeze_duration?: string | null;
	cid?: number | null;
	id: string;
	name: string;
	shortname?: string | null;
	allow_submit: boolean;
	runtime_as_score_tiebreaker: boolean;
	warning_message: string | null;
	penalty_time: number;
};

type ContestState = {
	started?: string | null;
	ended?: string | null;
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
	first_to_solve: boolean;
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
	team_id: number;
	name: string;
	display_name: string | null;
	label: string;
};

type Problems = {
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

type Submissions = {
	submitid: number | null;
	id: string | null;
	time: string;
	contest_time: string;
	team_id: string;
	problem_id: string;
};

type Judgements = {
	start_time: string;
	end_time: string | null;
	submission_id: string;
	id: string;
	valid: boolean;
	judgement_type_id: string;
};

export type {
	Contest,
	ContestState,
	Scoreboard,
	ScoreboardProblem,
	Team,
	Problems,
	Submissions,
	Judgements,
};
