// Global data storage
let appData = {
    teams: null,
    rules: null,
    tournament: null,
    matches: null
};

// Initialize the application
window.onload = function() {
    loadAllData();
    setInterval(loadAllData, 30000); // Auto-refresh every 30 seconds
};

// Load all JSON data
async function loadAllData() {
    try {
        // Try to load from server first, fallback to localStorage or defaults
        appData.teams = await loadJSONData('teams');
        appData.rules = await loadJSONData('rules');
        appData.tournament = await loadJSONData('tournament');
        appData.matches = await loadJSONData('matches');
        
        updateDashboard();
        updateTeamsDisplay();
        updateFixtures();
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
            teams: [
                {
                    id: 1,
                    name: "Team 1",
                    players: [
                        {name: "Sandeep", role: "Captain"},
                        {name: "Praveen", role: "Player"},
                        {name: "Ashish Pandey", role: "Player"},
                        {name: "Sriram Moka", role: "Player"},
                        {name: "Damoder", role: "Player"},
                        {name: "Somashekhar", role: "Player"}
                    ],
                    wins: 0,
                    losses: 0,
                    points: 0,
                    played: 0
                },
                {
                    id: 2,
                    name: "Team 2",
                    players: [
                        {name: "Raja", role: "Captain"},
                        {name: "Bhargav", role: "Player"},
                        {name: "Srinivasu BV", role: "Player"},
                        {name: "Gopal", role: "Player"},
                        {name: "Satish Adapa", role: "Player"},
                        {name: "Goutham", role: "Player"}
                    ],
                    wins: 0,
                    losses: 0,
                    points: 0,
                    played: 0
                },
                {
                    id: 3,
                    name: "Team 3",
                    players: [
                        {name: "Vijay", role: "Captain"},
                        {name: "Kiran", role: "Player"},
                        {name: "Srinivas", role: "Player"},
                        {name: "Amit", role: "Player"},
                        {name: "Ashok", role: "Player"},
                        {name: "Cheris", role: "Player"}
                    ],
                    wins: 0,
                    losses: 0,
                    points: 0,
                    played: 0
                },
                {
                    id: 4,
                    name: "Team 4",
                    players: [
                        {name: "PD", role: "Captain"},
                        {name: "Ramesh", role: "Player"},
                        {name: "Chaitanya", role: "Player"},
                        {name: "VenKee", role: "Player"},
                        {name: "Srinivasa Reddy Eeda", role: "Player"},
                        {name: "Jeevan", role: "Player"}
                    ],
                    wins: 0,
                    losses: 0,
                    points: 0,
                    played: 0
                },
                {
                    id: 5,
                    name: "Team 5",
                    players: [
                        {name: "Satish Patil", role: "Captain"},
                        {name: "Vihang", role: "Player"},
                        {name: "Nagireddy", role: "Player"},
                        {name: "Ravindra", role: "Player"},
                        {name: "Sanjay", role: "Player"},
                        {name: "KSK", role: "Player"}
                    ],
                    wins: 0,
                    losses: 0,
                    points: 0,
                    played: 0
                },
                {
                    id: 6,
                    name: "Team 6",
                    players: [
                        {name: "Varun", role: "Captain"},
                        {name: "Guna", role: "Player"},
                        {name: "Surya Sathi", role: "Player"},
                        {name: "Ramesh Naidu", role: "Player"},
                        {name: "Suryaprakash", role: "Player"},
                        {name: "Siva Kaku", role: "Player"}
                    ],
                    wins: 0,
                    losses: 0,
                    points: 0,
                    played: 0
                }
            ]
        },
        rules: {
            tournament: {
                name: "Zenith Gully Cricket League",
                format: "Round Robin + Finals",
                edition: "2025"
            },
            match_rules: {
                overs_per_side: 6,
                players_per_team: 6,
                powerplay_overs: 2,
                max_overs_per_bowler: 2,
                games_per_fixture: 3,
                format: "Best of 3"
            },
            scoring: {
                boundary_four: 4,
                boundary_six: 6,
                no_ball: 1,
                wide: 1,
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
        tournament: {
            fixtures: generateFixtures(),
            current_round: "Round Robin",
            tournament_status: "ongoing"
        },
        matches: {
            matches: [],
            live_match: null,
            completed_matches: [],
            upcoming_matches: [],
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

// Generate fixtures
function generateFixtures() {
    const fixtures = [];
    let matchId = 1;
    const dates = ["2025-11-02", "2025-11-03", "2025-11-09", "2025-11-10", "2025-11-16"];
    let dateIndex = 0;
    
    // Round-robin fixtures
    for (let i = 1; i <= 6; i++) {
        for (let j = i + 1; j <= 6; j++) {
            fixtures.push({
                match_id: matchId++,
                round: "Round Robin",
                date: dates[Math.floor((matchId - 1) / 3) % dates.length],
                time: ["06:30", "07:10", "07:50"][(matchId - 1) % 3],
                team1: `Team ${i}`,
                team2: `Team ${j}`,
                venue: "Ground A",
                status: "scheduled",
                result: null,
                games: []
            });
        }
    }
    
    // Final
    fixtures.push({
        match_id: matchId,
        round: "Final",
        date: "2025-11-17",
        time: "10:00",
        team1: "TBD",
        team2: "TBD",
        venue: "Ground A",
        status: "scheduled",
        result: null,
        games: []
    });
    
    return fixtures;
}

// Switch tabs
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Mark button as active
    event.target.classList.add('active');
}

// Update dashboard
function updateDashboard() {
    if (!appData.teams) return;
    
    // Update leaderboard
    const leaderboardBody = document.getElementById('leaderboard-body');
    const sortedTeams = [...appData.teams.teams].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return (b.wins / Math.max(b.played, 1)) - (a.wins / Math.max(a.played, 1));
    });
    
    leaderboardBody.innerHTML = sortedTeams.map((team, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${team.name}</strong></td>
            <td>${team.played}</td>
            <td>${team.wins}</td>
            <td>${team.losses}</td>
            <td><strong>${team.points}</strong></td>
        </tr>
    `).join('');
    
    // Update stats
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
                <h4>Remaining</h4>
                <p style="font-size: 2em; color: var(--secondary);">${totalMatches - completedMatches}</p>
            </div>
            <div>
                <h4>Tournament Status</h4>
                <p style="font-size: 1.5em; color: var(--accent);">${appData.tournament?.tournament_status || 'Ongoing'}</p>
            </div>
        </div>
    `;
}

// Update teams display
function updateTeamsDisplay() {
    if (!appData.teams) return;
    
    const teamsGrid = document.getElementById('teams-grid');
    teamsGrid.innerHTML = appData.teams.teams.map(team => `
        <div class="team-card">
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
    `).join('');
}

// Update fixtures
function updateFixtures() {
    if (!appData.tournament) return;
    
    const fixturesDiv = document.getElementById('fixtures-list');
    const groupedFixtures = {};
    
    appData.tournament.fixtures.forEach(fixture => {
        if (!groupedFixtures[fixture.date]) {
            groupedFixtures[fixture.date] = [];
        }
        groupedFixtures[fixture.date].push(fixture);
    });
    
    let html = '';
    Object.keys(groupedFixtures).sort().forEach(date => {
        html += `
            <h3 style="color: var(--secondary); margin-top: 20px;">
                📅 ${new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
        `;
        
        groupedFixtures[date].forEach(fixture => {
            const statusColor = fixture.status === 'completed' ? 'var(--success)' : 
                               fixture.status === 'live' ? 'var(--danger)' : 'var(--secondary)';
            
            html += `
                <div class="fixture-card">
                    <div class="fixture-teams">
                        <span>${fixture.team1}</span>
                        <span class="vs">VS</span>
                        <span>${fixture.team2}</span>
                    </div>
                    <div class="fixture-info">
                        <div>${fixture.time}</div>
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

// JSON Editor Functions
function loadJSONFile() {
    const selector = document.getElementById('json-file-selector');
    const textarea = document.getElementById('json-editor-textarea');
    const statusMsg = document.getElementById('status-message');
    
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
        
        // Try to save to server (if you have a backend endpoint)
        saveToServer(selector.value, data);
        
        showStatus('File saved successfully!', 'success');
        
        // Reload displays
        updateDashboard();
        updateTeamsDisplay();
        updateFixtures();
    } catch (error) {
        showStatus('Invalid JSON: ' + error.message, 'error');
    }
}

async function saveToServer(filename, data) {
    // This is where you would implement saving to your GitHub repository
    // For GitHub Pages, you might need to use GitHub API with authentication
    // or have a backend service to handle file updates
    
    try {
        // Example (would need actual implementation):
        // const response = await fetch(`/api/save/${filename}`, {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify(data)
        // });
        console.log('Saved to localStorage. Server save would go here.');
    } catch (error) {
        console.error('Error saving to server:', error);
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
    
    // For browsers that don't support downloading multiple files as a zip,
    // we'll download them individually with timestamp prefix
    const files = ['teams', 'rules', 'tournament', 'matches'];
    
    // Check if JSZip is available (you would need to include JSZip library)
    if (typeof JSZip !== 'undefined') {
        downloadAsZip(files, folderName);
    } else {
        // Download files individually
        files.forEach(filename => {
            const data = appData[filename] || getDefaultData(filename);
            const jsonStr = JSON.stringify(data, null, 2);
            
            // Create and download individual file
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
    }
    
    showStatus(`Downloaded all files with timestamp: ${timestamp}`, 'success');
}

async function downloadAsZip(files, folderName) {
    const zip = new JSZip();
    const folder = zip.folder(folderName);
    
    files.forEach(filename => {
        const data = appData[filename] || getDefaultData(filename);
        const jsonStr = JSON.stringify(data, null, 2);
        folder.file(`${filename}.json`, jsonStr);
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${folderName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

// Live scoring functions (to be implemented)
function startLiveScoring(matchId) {
    // Implementation for live scoring
    console.log('Live scoring for match:', matchId);
}

function updateLiveScore(matchId, scoreData) {
    // Implementation for updating live scores
    console.log('Updating score for match:', matchId, scoreData);
}
