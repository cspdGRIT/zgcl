// Global data storage
let appData = {
    teams: null,
    rules: null,
    tournament: null,
    matches: null
};

// Live scoring variables
let currentMatch = null;
let currentInnings = 1;
let currentScore = 0;
let currentWickets = 0;
let currentOvers = 0;
let currentBalls = 0;
let ballsThisOver = [];
let currentOver = [];
let matchCommentary = [];
let inningsData = {
    1: {
        battingTeam: '',
        bowlingTeam: '',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        ballByBall: [],
        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
    },
    2: {
        battingTeam: '',
        bowlingTeam: '',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        ballByBall: [],
        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
    }
};

// Initialize the application
window.onload = function() {
    loadAllData();
    setInterval(loadAllData, 30000); // Auto-refresh every 30 seconds
};

// Load all JSON data
async function loadAllData() {
    try {
        appData.teams = await loadJSONData('teams');
        appData.rules = await loadJSONData('rules');
        appData.tournament = await loadJSONData('tournament');
        appData.matches = await loadJSONData('matches');
        
        updateDashboard();
        updateTeamsDisplay();
        updateFixtures();
        populateMatchSelector();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load JSON data with fallback mechanism
async function loadJSONData(filename) {
    // Try to fetch from server first
    try {
        const response = await fetch(`${filename}.json`);
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem(`zgcl_${filename}`, JSON.stringify(data));
            return data;
        }
    } catch (error) {
        console.log(`Could not fetch ${filename}.json from server, using local storage or defaults`);
    }
    
    // Try to get from localStorage
    const stored = localStorage.getItem(`zgcl_${filename}`);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error(`Error parsing stored ${filename}:`, e);
        }
    }
    
    // Return default data
    return getDefaultData(filename);
}

// Get default data for each file
function getDefaultData(filename) {
    const defaults = {
        teams: {
            pools: {
                A: ["Team 1", "Team 2", "Team 3"],
                B: ["Team 4", "Team 5", "Team 6"]
            },
            teams: [
                {
                    id: 1,
                    name: "Team 1",
                    pool: "A",
                    players: [
                        {name: "Sandeep", role: "Captain"},
                        {name: "Praveen", role: "Player"},
                        {name: "Ashish Pandey", role: "Player"},
                        {name: "Sriram Moka", role: "Player"},
                        {name: "Damoder", role: "Player"},
                        {name: "Somashekhar", role: "Player"}
                    ],
                    wins: 0, losses: 0, points: 0, played: 0,
                    runs_scored: 0, runs_conceded: 0, net_run_rate: 0
                },
                {
                    id: 2,
                    name: "Team 2",
                    pool: "A",
                    players: [
                        {name: "Raja", role: "Captain"},
                        {name: "Bhargav", role: "Player"},
                        {name: "Srinivasu BV", role: "Player"},
                        {name: "Gopal", role: "Player"},
                        {name: "Satish Adapa", role: "Player"},
                        {name: "Goutham", role: "Player"}
                    ],
                    wins: 0, losses: 0, points: 0, played: 0,
                    runs_scored: 0, runs_conceded: 0, net_run_rate: 0
                },
                {
                    id: 3,
                    name: "Team 3",
                    pool: "A",
                    players: [
                        {name: "Vijay", role: "Captain"},
                        {name: "Kiran", role: "Player"},
                        {name: "Srinivas", role: "Player"},
                        {name: "Amit", role: "Player"},
                        {name: "Ashok", role: "Player"},
                        {name: "Cheris", role: "Player"}
                    ],
                    wins: 0, losses: 0, points: 0, played: 0,
                    runs_scored: 0, runs_conceded: 0, net_run_rate: 0
                },
                {
                    id: 4,
                    name: "Team 4",
                    pool: "B",
                    players: [
                        {name: "PD", role: "Captain"},
                        {name: "Ramesh", role: "Player"},
                        {name: "Chaitanya", role: "Player"},
                        {name: "VenKee", role: "Player"},
                        {name: "Srinivasa Reddy Eeda", role: "Player"},
                        {name: "Jeevan", role: "Player"}
                    ],
                    wins: 0, losses: 0, points: 0, played: 0,
                    runs_scored: 0, runs_conceded: 0, net_run_rate: 0
                },
                {
                    id: 5,
                    name: "Team 5",
                    pool: "B",
                    players: [
                        {name: "Satish Patil", role: "Captain"},
                        {name: "Vihang", role: "Player"},
                        {name: "Nagireddy", role: "Player"},
                        {name: "Ravindra", role: "Player"},
                        {name: "Sanjay", role: "Player"},
                        {name: "KSK", role: "Player"}
                    ],
                    wins: 0, losses: 0, points: 0, played: 0,
                    runs_scored: 0, runs_conceded: 0, net_run_rate: 0
                },
                {
                    id: 6,
                    name: "Team 6",
                    pool: "B",
                    players: [
                        {name: "Varun", role: "Captain"},
                        {name: "Guna", role: "Player"},
                        {name: "Surya Sathi", role: "Player"},
                        {name: "Ramesh Naidu", role: "Player"},
                        {name: "Suryaprakash", role: "Player"},
                        {name: "Siva Kaku", role: "Player"}
                    ],
                    wins: 0, losses: 0, points: 0, played: 0,
                    runs_scored: 0, runs_conceded: 0, net_run_rate: 0
                }
            ]
        },
        rules: {
            tournament: {
                name: "Zenith Gully Cricket League",
                format: "Pool Stage + Knockouts",
                edition: "2025"
            },
            match_rules: {
                overs_per_side: 7,
                players_per_team: 6,
                max_wickets: 6,
                match_duration: "40 minutes"
            },
            scoring: {
                boundary_four: 4,
                boundary_six: 6,
                wide: 1,
                wide_boundary: 5,
                no_ball: 1,
                bye: 1,
                leg_bye: 1
            },
            points_system: {
                win: 2,
                loss: 0,
                tie: 1,
                no_result: 1
            }
        },
        tournament: generateDefaultFixtures(),
        matches: {
            matches: [],
            live_match: null,
            completed_matches: [],
            statistics: {
                total_runs: 0,
                total_wickets: 0,
                total_sixes: 0,
                total_fours: 0
            }
        }
    };
    
    return defaults[filename] || {};
}

// Generate default fixtures
function generateDefaultFixtures() {
    return {
        tournament_format: "Pool Stage + Knockouts",
        match_duration: "40 minutes",
        overs_per_side: 7,
        fixtures: [
            // Pool A matches - starting at 6:30 AM
            {
                match_id: 1,
                round: "Pool A",
                date: "2025-11-01",
                time: "06:30",
                team1: "Team 1",
                team2: "Team 2",
                venue: "Ground A",
                status: "scheduled",
                duration: "40 min"
            },
            {
                match_id: 2,
                round: "Pool A",
                date: "2025-11-01",
                time: "07:15",
                team1: "Team 2",
                team2: "Team 3",
                venue: "Ground A",
                status: "scheduled",
                duration: "40 min"
            },
            {
                match_id: 3,
                round: "Pool A",
                date: "2025-11-01",
                time: "08:00",
                team1: "Team 1",
                team2: "Team 3",
                venue: "Ground A",
                status: "scheduled",
                duration: "40 min"
            },
            // Pool B matches - starting at 3:00 PM
            {
                match_id: 4,
                round: "Pool B",
                date: "2025-11-01",
                time: "15:00",
                team1: "Team 4",
                team2: "Team 5",
                venue: "Ground A",
                status: "scheduled",
                duration: "40 min"
            },
            {
                match_id: 5,
                round: "Pool B",
                date: "2025-11-01",
                time: "15:45",
                team1: "Team 5",
                team2: "Team 6",
                venue: "Ground A",
                status: "scheduled",
                duration: "40 min"
            },
            {
                match_id: 6,
                round: "Pool B",
                date: "2025-11-01",
                time: "16:30",
                team1: "Team 4",
                team2: "Team 6",
                venue: "Ground A",
                status: "scheduled",
                duration: "40 min"
            },
            // Knockout matches
            {
                match_id: 7,
                round: "Semi Final 1",
                date: "2025-11-02",
                time: "09:00",
                team1: "Pool A Winner",
                team2: "Pool B Runner-up",
                venue: "Ground A",
                status: "scheduled",
                duration: "40 min"
            },
            {
                match_id: 8,
                round: "Semi Final 2",
                date: "2025-11-02",
                time: "10:00",
                team1: "Pool B Winner",
                team2: "Pool A Runner-up",
                venue: "Ground A",
                status: "scheduled",
                duration: "40 min"
            },
            {
                match_id: 9,
                round: "Final",
                date: "2025-11-02",
                time: "15:00",
                team1: "SF1 Winner",
                team2: "SF2 Winner",
                venue: "Ground A",
                status: "scheduled",
                duration: "40 min"
            }
        ],
        current_round: "Pool Stage",
        tournament_status: "upcoming"
    };
}

// Switch tabs
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Update dashboard
function updateDashboard() {
    if (!appData.teams) return;
    
    // Update Pool A standings
    const poolATeams = appData.teams.teams.filter(team => team.pool === 'A');
    const poolAStandings = document.getElementById('pool-a-standings');
    updatePoolStandings(poolATeams, poolAStandings);
    
    // Update Pool B standings
    const poolBTeams = appData.teams.teams.filter(team => team.pool === 'B');
    const poolBStandings = document.getElementById('pool-b-standings');
    updatePoolStandings(poolBTeams, poolBStandings);
    
    // Update tournament stats
    const statsDiv = document.getElementById('tournament-stats');
    const totalMatches = appData.tournament?.fixtures?.length || 0;
    const completedMatches = appData.tournament?.fixtures?.filter(f => f.status === 'completed').length || 0;
    
    statsDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div>
                <h4>Total Matches</h4>
                <p style="font-size: 2em; color: var(--primary);">${totalMatches}</p>
            </div>
            <div>
                <h4>Completed</h4>
                <p style="font-size: 2em; color: var(--success);">${completedMatches}</p>
            </div>
            <div>
                <h4>Pool A Matches</h4>
                <p style="font-size: 1.5em; color: var(--pool-a);">3 Matches</p>
                <p>Starting: 6:30 AM</p>
            </div>
            <div>
                <h4>Pool B Matches</h4>
                <p style="font-size: 1.5em; color: var(--pool-b);">3 Matches</p>
                <p>Starting: 3:00 PM</p>
            </div>
        </div>
    `;
}

// Update pool standings
function updatePoolStandings(teams, element) {
    const sortedTeams = [...teams].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.net_run_rate !== a.net_run_rate) return b.net_run_rate - a.net_run_rate;
        return b.wins - a.wins;
    });
    
    element.innerHTML = sortedTeams.map((team, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${team.name}</strong></td>
            <td>${team.played}</td>
            <td>${team.wins}</td>
            <td>${team.losses}</td>
            <td><strong>${team.points}</strong></td>
            <td>${team.net_run_rate.toFixed(2)}</td>
        </tr>
    `).join('');
}

// Update teams display
function updateTeamsDisplay() {
    if (!appData.teams) return;
    
    // Pool A teams
    const poolATeams = appData.teams.teams.filter(team => team.pool === 'A');
    const poolAGrid = document.getElementById('pool-a-teams');
    if (poolAGrid) {
        poolAGrid.innerHTML = poolATeams.map(team => createTeamCard(team)).join('');
    }
    
    // Pool B teams
    const poolBTeams = appData.teams.teams.filter(team => team.pool === 'B');
    const poolBGrid = document.getElementById('pool-b-teams');
    if (poolBGrid) {
        poolBGrid.innerHTML = poolBTeams.map(team => createTeamCard(team)).join('');
    }
}

// Create team card HTML
function createTeamCard(team) {
    return `
        <div class="team-card">
            <div class="pool-badge">Pool ${team.pool}</div>
            <div class="team-header">
                <div class="team-name">${team.name}</div>
                <div style="font-size: 1.5em;">🏏</div>
            </div>
            <div class="team-stats">
                <span>P: ${team.played}</span>
                <span>W: ${team.wins}</span>
                <span>L: ${team.losses}</span>
                <span>Pts: ${team.points}</span>
            </div>
            <div class="player-list">
                ${team.players.map(player => `
                    <div class="player ${player.role === 'Captain' ? 'captain' : ''}">
                        ${player.name} ${player.role === 'Captain' ? '(C)' : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Update fixtures display
function updateFixtures() {
    if (!appData.tournament) return;
    
    const fixturesDiv = document.getElementById('fixtures-list');
    const groupedFixtures = {};
    
    // Group fixtures by round
    appData.tournament.fixtures.forEach(fixture => {
        if (!groupedFixtures[fixture.round]) {
            groupedFixtures[fixture.round] = [];
        }
        groupedFixtures[fixture.round].push(fixture);
    });
    
    let html = '';
    
    // Display by rounds
    Object.keys(groupedFixtures).forEach(round => {
        const roundColor = round.includes('Pool A') ? 'var(--pool-a)' : 
                          round.includes('Pool B') ? 'var(--pool-b)' : 'var(--secondary)';
        
        html += `<h3 style="color: ${roundColor}; margin-top: 20px;">${round}</h3>`;
        
        groupedFixtures[round].forEach(fixture => {
            const statusColor = fixture.status === 'completed' ? 'var(--success)' : 
                               fixture.status === 'live' ? 'var(--danger)' : 'var(--secondary)';
            
            const dateStr = new Date(fixture.date + 'T' + fixture.time).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
            
            html += `
                <div class="fixture-card">
                    <div class="fixture-teams">
                        <span>${fixture.team1}</span>
                        <span class="vs">VS</span>
                        <span>${fixture.team2}</span>
                    </div>
                    <div class="fixture-info">
                        <div>${dateStr}</div>
                        <div class="fixture-time">Duration: ${fixture.duration}</div>
                        <div style="color: ${statusColor}; font-weight: bold;">
                            ${fixture.status.toUpperCase()}
                        </div>
                        ${fixture.result ? `<div>${fixture.result}</div>` : ''}
                    </div>
                </div>
            `;
        });
    });
    
    fixturesDiv.innerHTML = html;
}

// Live Scoring Functions

// Populate match selector
function populateMatchSelector() {
    if (!appData.tournament) return;
    
    const matchSelect = document.getElementById('match-select');
    const upcomingMatches = appData.tournament.fixtures.filter(f => 
        f.status === 'scheduled' && !f.team1.includes('Winner')
    );
    
    matchSelect.innerHTML = '<option value="">Choose a match...</option>' + 
        upcomingMatches.map(match => `
            <option value="${match.match_id}">
                ${match.round}: ${match.team1} vs ${match.team2} (${match.time})
            </option>
        `).join('');
}

// Select a match for scoring
function selectMatch() {
    const matchId = document.getElementById('match-select').value;
    if (!matchId) return;
    
    currentMatch = appData.tournament.fixtures.find(f => f.match_id == matchId);
    document.getElementById('match-title').textContent = 
        `${currentMatch.team1} vs ${currentMatch.team2}`;
}

// Start match
function startMatch() {
    if (!currentMatch) {
        alert('Please select a match first!');
        return;
    }
    
    // Initialize match data
    currentMatch.status = 'live';
    currentInnings = 1;
    currentScore = 0;
    currentWickets = 0;
    currentOvers = 0;
    currentBalls = 0;
    ballsThisOver = [];
    matchCommentary = [];
    
    // Set batting and bowling teams
    inningsData[1].battingTeam = currentMatch.team1;
    inningsData[1].bowlingTeam = currentMatch.team2;
    
    // Show scoring area
    document.getElementById('live-score-area').style.display = 'block';
    updateScoreDisplay();
    
    addCommentary(`Match Started! ${currentMatch.team1} won the toss and elected to bat first.`);
}

// Add runs
function addRuns(runs) {
    if (currentOvers >= 7) {
        alert('Maximum 7 overs reached!');
        return;
    }
    
    if (currentWickets >= 6) {
        alert('All out! End the innings.');
        return;
    }
    
    currentScore += runs;
    currentBalls++;
    
    const ballType = runs === 0 ? 'dot' : 
                     runs === 4 ? 'four' : 
                     runs === 6 ? 'six' : 'run';
    
    ballsThisOver.push({ type: ballType, runs: runs });
    inningsData[currentInnings].score = currentScore;
    inningsData[currentInnings].balls = currentBalls;
    
    updateBallDisplay(runs, ballType);
    updateScoreDisplay();
    
    if (runs === 0) {
        addCommentary(`${formatOvers()}: Dot ball.`);
    } else if (runs === 4) {
        addCommentary(`${formatOvers()}: FOUR! Boundary scored.`);
    } else if (runs === 6) {
        addCommentary(`${formatOvers()}: SIX! Maximum!`);
    } else {
        addCommentary(`${formatOvers()}: ${runs} run${runs > 1 ? 's' : ''}.`);
    }
    
    if (currentBalls % 6 === 0) {
        endOver();
    }
}

// Add wide
function addWide(runs) {
    currentScore += runs;
    inningsData[currentInnings].score = currentScore;
    inningsData[currentInnings].extras.wides += runs;
    
    const ballType = 'wide';
    ballsThisOver.push({ type: ballType, runs: runs });
    
    updateBallDisplay(runs, ballType);
    updateScoreDisplay();
    
    if (runs === 1) {
        addCommentary(`${formatOvers()}: Wide ball. 1 extra run.`);
    } else {
        addCommentary(`${formatOvers()}: Wide ball plus boundary! ${runs} extra runs.`);
    }
}

// Add no ball
function addNoBall() {
    currentScore += 1;
    inningsData[currentInnings].score = currentScore;
    inningsData[currentInnings].extras.noBalls += 1;
    
    ballsThisOver.push({ type: 'no-ball', runs: 1 });
    
    updateBallDisplay(1, 'no-ball');
    updateScoreDisplay();
    
    addCommentary(`${formatOvers()}: No ball! 1 extra run and a free hit coming up.`);
}

// Add byes
function addByes() {
    const runs = prompt('How many byes?', '1');
    if (!runs) return;
    
    const byeRuns = parseInt(runs);
    currentScore += byeRuns;
    currentBalls++;
    inningsData[currentInnings].score = currentScore;
    inningsData[currentInnings].extras.byes += byeRuns;
    
    ballsThisOver.push({ type: 'bye', runs: byeRuns });
    
    updateBallDisplay(byeRuns, 'bye');
    updateScoreDisplay();
    
    addCommentary(`${formatOvers()}: ${byeRuns} bye${byeRuns > 1 ? 's' : ''}.`);
    
    if (currentBalls % 6 === 0) {
        endOver();
    }
}

// Add leg byes
function addLegByes() {
    const runs = prompt('How many leg byes?', '1');
    if (!runs) return;
    
    const lbRuns = parseInt(runs);
    currentScore += lbRuns;
    currentBalls++;
    inningsData[currentInnings].score = currentScore;
    inningsData[currentInnings].extras.legByes += lbRuns;
    
    ballsThisOver.push({ type: 'legbye', runs: lbRuns });
    
    updateBallDisplay(lbRuns, 'legbye');
    updateScoreDisplay();
    
    addCommentary(`${formatOvers()}: ${lbRuns} leg bye${lbRuns > 1 ? 's' : ''}.`);
    
    if (currentBalls % 6 === 0) {
        endOver();
    }
}

// Add wicket
function addWicket() {
    if (currentWickets >= 6) {
        alert('Already 6 wickets down!');
        return;
    }
    
    currentWickets++;
    currentBalls++;
    inningsData[currentInnings].wickets = currentWickets;
    inningsData[currentInnings].balls = currentBalls;
    
    ballsThisOver.push({ type: 'wicket', runs: 0 });
    
    updateBallDisplay('W', 'wicket');
    updateScoreDisplay();
    
    addCommentary(`${formatOvers()}: WICKET! ${currentScore}/${currentWickets}`);
    
    if (currentWickets === 6) {
        alert('All Out!');
        endInnings();
    } else if (currentBalls % 6 === 0) {
        endOver();
    }
}

// Update ball display
function updateBallDisplay(value, type) {
    const overDiv = document.getElementById('current-over');
    const ballDiv = document.createElement('div');
    ballDiv.className = `ball ${type}`;
    
    if (type === 'wicket') {
        ballDiv.textContent = 'W';
    } else if (type === 'wide') {
        ballDiv.textContent = `Wd${value > 1 ? '+' + (value - 1) : ''}`;
    } else if (type === 'no-ball') {
        ballDiv.textContent = 'Nb';
    } else if (type === 'bye' || type === 'legbye') {
        ballDiv.textContent = type === 'bye' ? `B${value}` : `Lb${value}`;
    } else {
        ballDiv.textContent = value;
    }
    
    overDiv.appendChild(ballDiv);
}

// End over
function endOver() {
    currentOvers = Math.floor(currentBalls / 6);
    inningsData[currentInnings].overs = currentOvers;
    
    document.getElementById('current-over').innerHTML = '';
    ballsThisOver = [];
    
    addCommentary(`End of over ${currentOvers}. Score: ${currentScore}/${currentWickets}`);
    
    if (currentOvers >= 7) {
        alert('7 overs completed!');
        endInnings();
    }
}

// End innings
function endInnings() {
    inningsData[currentInnings].finalScore = currentScore;
    inningsData[currentInnings].finalWickets = currentWickets;
    inningsData[currentInnings].overs = currentOvers + (currentBalls % 6) / 10;
    
    addCommentary(`End of ${currentInnings === 1 ? '1st' : '2nd'} innings. ` +
                  `${inningsData[currentInnings].battingTeam} scored ${currentScore}/${currentWickets} ` +
                  `in ${formatOvers()} overs.`);
    
    if (currentInnings === 1) {
        // Switch to 2nd innings
        currentInnings = 2;
        inningsData[2].battingTeam = currentMatch.team2;
        inningsData[2].bowlingTeam = currentMatch.team1;
        currentScore = 0;
        currentWickets = 0;
        currentOvers = 0;
        currentBalls = 0;
        ballsThisOver = [];
        
        selectInnings(2);
        
        const target = inningsData[1].finalScore + 1;
        document.getElementById('target').textContent = target;
        
        addCommentary(`${currentMatch.team2} need ${target} runs to win from 7 overs.`);
    } else {
        // Match complete
        endMatch();
    }
}

// End match
function endMatch() {
    const team1Score = inningsData[1].finalScore;
    const team2Score = inningsData[2].finalScore;
    
    let result;
    if (team2Score > team1Score) {
        result = `${currentMatch.team2} won by ${10 - currentWickets} wickets`;
    } else if (team1Score > team2Score) {
        result = `${currentMatch.team1} won by ${team1Score - team2Score} runs`;
    } else {
        result = 'Match Tied';
    }
    
    currentMatch.status = 'completed';
    currentMatch.result = result;
    
    addCommentary(`Match Complete! ${result}`);
    
    // Update team stats
    updateTeamStats();
    
    alert(`Match Complete! ${result}`);
}

// Update team statistics
function updateTeamStats() {
    // Implementation to update team wins, losses, points, NRR
    const winner = inningsData[2].finalScore > inningsData[1].finalScore ? 
                   currentMatch.team2 : currentMatch.team1;
    const loser = winner === currentMatch.team1 ? currentMatch.team2 : currentMatch.team1;
    
    // Find teams and update stats
    const winnerTeam = appData.teams.teams.find(t => t.name === winner);
    const loserTeam = appData.teams.teams.find(t => t.name === loser);
    
    if (winnerTeam) {
        winnerTeam.wins++;
        winnerTeam.points += 2;
        winnerTeam.played++;
        winnerTeam.runs_scored += winner === currentMatch.team1 ? 
                                  inningsData[1].finalScore : inningsData[2].finalScore;
        winnerTeam.runs_conceded += winner === currentMatch.team1 ? 
                                    inningsData[2].finalScore : inningsData[1].finalScore;
    }
    
    if (loserTeam) {
        loserTeam.losses++;
        loserTeam.played++;
        loserTeam.runs_scored += loser === currentMatch.team1 ? 
                                 inningsData[1].finalScore : inningsData[2].finalScore;
        loserTeam.runs_conceded += loser === currentMatch.team1 ? 
                                   inningsData[2].finalScore : inningsData[1].finalScore;
    }
    
    // Calculate NRR
    if (winnerTeam) {
        winnerTeam.net_run_rate = (winnerTeam.runs_scored / Math.max(winnerTeam.played * 7, 1)) - 
                                  (winnerTeam.runs_conceded / Math.max(winnerTeam.played * 7, 1));
    }
    if (loserTeam) {
        loserTeam.net_run_rate = (loserTeam.runs_scored / Math.max(loserTeam.played * 7, 1)) - 
                                 (loserTeam.runs_conceded / Math.max(loserTeam.played * 7, 1));
    }
    
    // Save updated data
    localStorage.setItem('zgcl_teams', JSON.stringify(appData.teams));
    localStorage.setItem('zgcl_tournament', JSON.stringify(appData.tournament));
    
    updateDashboard();
}

// Select innings
function selectInnings(innings) {
    currentInnings = innings;
    
    const buttons = document.querySelectorAll('.innings-btn');
    buttons.forEach((btn, index) => {
        if (index + 1 === innings) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Load innings data
    if (inningsData[innings].battingTeam) {
        currentScore = inningsData[innings].score;
        currentWickets = inningsData[innings].wickets;
        currentBalls = inningsData[innings].balls;
        currentOvers = Math.floor(currentBalls / 6);
        
        updateScoreDisplay();
    }
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('batting-team').textContent = 
        inningsData[currentInnings].battingTeam || 'Team';
    document.getElementById('current-score').textContent = 
        `${currentScore}/${currentWickets}`;
    document.getElementById('current-overs').textContent = 
        `(${formatOvers()} overs)`;
    
    // Calculate run rate
    const overs = currentOvers + (currentBalls % 6) / 10;
    const runRate = overs > 0 ? (currentScore / overs).toFixed(2) : '0.00';
    document.getElementById('run-rate').textContent = runRate;
}

// Format overs
function formatOvers() {
    const overs = Math.floor(currentBalls / 6);
    const balls = currentBalls % 6;
    return `${overs}.${balls}`;
}

// Add commentary
function addCommentary(text) {
    const commentaryDiv = document.getElementById('commentary');
    const entry = document.createElement('div');
    entry.style.marginBottom = '10px';
    entry.innerHTML = `<strong>${new Date().toLocaleTimeString()}</strong>: ${text}`;
    commentaryDiv.insertBefore(entry, commentaryDiv.firstChild);
    
    matchCommentary.push({ time: new Date(), text: text });
}

// Undo last ball
function undoLastBall() {
    if (ballsThisOver.length === 0) {
        alert('No balls to undo in this over!');
        return;
    }
    
    const lastBall = ballsThisOver.pop();
    
    // Reverse the scoring
    if (lastBall.type === 'wicket') {
        currentWickets--;
        currentBalls--;
    } else if (lastBall.type === 'wide' || lastBall.type === 'no-ball') {
        currentScore -= lastBall.runs;
    } else {
        currentScore -= lastBall.runs;
        currentBalls--;
    }
    
    // Update display
    const overDiv = document.getElementById('current-over');
    if (overDiv.lastChild) {
        overDiv.removeChild(overDiv.lastChild);
    }
    
    updateScoreDisplay();
    addCommentary('Last ball undone.');
}

// Save match data
function saveMatch() {
    if (!currentMatch) return;
    
    const matchData = {
        match_id: currentMatch.match_id,
        date: currentMatch.date,
        time: currentMatch.time,
        team1: currentMatch.team1,
        team2: currentMatch.team2,
        status: currentMatch.status,
        result: currentMatch.result,
        innings: inningsData,
        commentary: matchCommentary
    };
    
    if (!appData.matches.matches) {
        appData.matches.matches = [];
    }
    
    // Remove existing match data if exists
    appData.matches.matches = appData.matches.matches.filter(
        m => m.match_id !== matchData.match_id
    );
    
    // Add updated match data
    appData.matches.matches.push(matchData);
    
    // Save to localStorage
    localStorage.setItem('zgcl_matches', JSON.stringify(appData.matches));
    localStorage.setItem('zgcl_tournament', JSON.stringify(appData.tournament));
    
    showStatus('Match data saved successfully!', 'success');
}

// JSON Editor Functions
function loadJSONFile() {
    const selector = document.getElementById('json-file-selector');
    const textarea = document.getElementById('json-editor-textarea');
    
    if (!selector.value) {
        textarea.value = '';
        return;
    }
    
    const data = appData[selector.value];
    if (data) {
        textarea.value = JSON.stringify(data, null, 2);
        showStatus('File loaded successfully', 'success');
    } else {
        showStatus('Error loading file', 'error');
    }
}

function saveJSONFile() {
    const selector = document.getElementById('json-file-selector');
    const textarea = document.getElementById('json-editor-textarea');
    
    if (!selector.value) {
        showStatus('Please select a file first', 'error');
        return;
    }
    
    try {
        const data = JSON.parse(textarea.value);
        appData[selector.value] = data;
        localStorage.setItem(`zgcl_${selector.value}`, JSON.stringify(data));
        showStatus('File saved successfully!', 'success');
        
        // Reload displays
        updateDashboard();
        updateTeamsDisplay();
        updateFixtures();
        populateMatchSelector();
    } catch (error) {
        showStatus('Invalid JSON: ' + error.message, 'error');
    }
}

function validateJSON() {
    const textarea = document.getElementById('json-editor-textarea');
    
    try {
        JSON.parse(textarea.value);
        showStatus('JSON is valid!', 'success');
    } catch (error) {
        showStatus('Invalid JSON: ' + error.message, 'error');
    }
}

function reloadFromJSON() {
    loadAllData();
    showStatus('Data reloaded from JSON files', 'success');
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    
    setTimeout(() => {
        statusDiv.className = 'status-message';
    }, 3000);
}

// Download Functions
function downloadAllJSON() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const folderName = `zgcl-data-${timestamp}`;
    
    const files = ['teams', 'rules', 'tournament', 'matches'];
    
    files.forEach(filename => {
        const data = appData[filename] || getDefaultData(filename);
        const jsonStr = JSON.stringify(data, null, 2);
        
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${folderName}_${filename}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    showStatus(`Downloaded all files with timestamp: ${timestamp}`, 'success');
}

function downloadFile(filename) {
    const data = appData[filename] || getDefaultData(filename);
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showStatus(`Downloaded ${filename}.json`, 'success');
}
