// Generic Tournament Management System JavaScript

// Global data storage
let appData = {
    config: null,
    teams: null,
    tournament: null,
    matches: null,
    rules: null
};

// Current match data for live scoring
let currentMatch = null;
let matchData = {};

// Initialize the application
window.onload = function() {
    loadAllData();
    setInterval(loadAllData, 30000); // Auto-refresh every 30 seconds
};

// Load all data
async function loadAllData() {
    try {
        // Load configuration
        const storedConfig = localStorage.getItem('tournament_config');
        if (storedConfig) {
            appData.config = JSON.parse(storedConfig);
        } else {
            // Use default cricket config if no config exists
            appData.config = getDefaultConfig();
        }
        
        // Load other data
        appData.teams = await loadJSONData('teams');
        appData.tournament = await loadJSONData('tournament');
        appData.matches = await loadJSONData('matches');
        appData.rules = await loadJSONData('rules');
        
        // Apply configuration to UI
        applyConfiguration();
        
        // Calculate standings
        calculateStandings();
        
        // Update all displays
        updateDashboard();
        updateTeamsDisplay();
        updateFixtures();
        updateStatistics();
        populateMatchSelector();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Get default configuration
function getDefaultConfig() {
    return {
        tournament: {
            name: "Tournament",
            sport: "generic",
            format: "pools",
            status: "upcoming",
            description: "Generic Tournament",
            venue: "Venue",
            icon: "🏆"
        },
        sport_config: {
            sport_name: "Sport",
            sport_icon: "🏆",
            terminology: {
                score_unit: "points",
                period_name: "periods",
                period_unit: "period",
                team_size_name: "players",
                dismissal_name: "",
                score_display: "{score} points"
            },
            match_config: {
                periods_per_match: 1,
                max_dismissals: 0,
                players_per_team: 5,
                match_duration: "60 minutes"
            },
            scoring_fields: [
                { name: "score", display: "Score", type: "number" }
            ]
        },
        rules: {
            points_system: {
                win: 2,
                draw: 1,
                loss: 0,
                no_result: 1
            },
            tie_breakers: ["Points", "Score Difference", "Head to Head"]
        },
        theme: {
            primary_color: "#FF6B35",
            secondary_color: "#004E89"
        }
    };
}

// Apply configuration to UI
function applyConfiguration() {
    const config = appData.config;
    
    // Update tournament name and icon
    document.getElementById('tournament-name').textContent = 
        config.tournament?.name || 'Tournament';
    document.getElementById('tournament-icon').textContent = 
        config.tournament?.icon || config.sport_config?.sport_icon || '🏆';
    
    // Update tagline
    const tagline = `${config.sport_config?.sport_name || 'Sport'} | ${config.tournament?.format || 'Tournament'} Format`;
    document.getElementById('tournament-tagline').textContent = tagline;
    
    // Update page title
    document.title = config.tournament?.name || 'Tournament Management System';
    
    // Apply theme colors if specified
    if (config.theme) {
        const root = document.documentElement;
        if (config.theme.primary_color) {
            root.style.setProperty('--primary', config.theme.primary_color);
        }
        if (config.theme.secondary_color) {
            root.style.setProperty('--secondary', config.theme.secondary_color);
        }
        if (config.theme.background) {
            document.body.style.background = config.theme.background;
        }
    }
    
    // Show tournament info banner if there's important info
    updateInfoBanner();
}

// Update info banner
function updateInfoBanner() {
    const banner = document.getElementById('info-banner');
    const config = appData.config;
    
    // Check for important updates (e.g., completed pools, qualified teams)
    const poolsStatus = checkPoolsStatus();
    
    if (poolsStatus.hasCompletedPools) {
        let bannerHTML = '<h3>🎉 Tournament Update 🎉</h3><p>';
        
        if (poolsStatus.completedPools.length > 0) {
            bannerHTML += `<strong>Completed Pools:</strong> ${poolsStatus.completedPools.join(', ')}<br>`;
        }
        
        if (poolsStatus.qualifiedTeams.length > 0) {
            bannerHTML += `<strong>Qualified Teams:</strong> ${poolsStatus.qualifiedTeams.join(', ')}`;
        }
        
        bannerHTML += '</p>';
        banner.innerHTML = bannerHTML;
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

// Check pools status
function checkPoolsStatus() {
    const teams = appData.teams?.teams || [];
    const pools = {};
    const completedPools = [];
    const qualifiedTeams = [];
    
    // Group teams by pool
    teams.forEach(team => {
        if (!pools[team.pool]) {
            pools[team.pool] = [];
        }
        pools[team.pool].push(team);
    });
    
    // Check each pool
    Object.keys(pools).forEach(pool => {
        const poolTeams = pools[pool];
        const allPlayed = poolTeams.every(team => team.played >= poolTeams.length - 1);
        
        if (allPlayed && poolTeams.length > 0) {
            completedPools.push(`Pool ${pool}`);
            
            // Get top 2 teams
            const sorted = poolTeams.sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                return (b.score_difference || 0) - (a.score_difference || 0);
            });
            
            if (sorted[0]) qualifiedTeams.push(sorted[0].name);
            if (sorted[1]) qualifiedTeams.push(sorted[1].name);
        }
    });
    
    return {
        hasCompletedPools: completedPools.length > 0,
        completedPools,
        qualifiedTeams
    };
}

// Load JSON data
async function loadJSONData(filename) {
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

// Get default data
function getDefaultData(filename) {
    const defaults = {
        config: getDefaultConfig(),
        teams: { teams: [], pools: {} },
        tournament: { fixtures: [] },
        matches: { matches: [] },
        rules: {
            points_system: { win: 2, draw: 1, loss: 0 }
        }
    };
    
    return defaults[filename] || {};
}

// Calculate standings from match results
function calculateStandings() {
    if (!appData.teams || !appData.matches) return;
    
    // Reset all team statistics
    appData.teams.teams?.forEach(team => {
        team.played = 0;
        team.wins = 0;
        team.losses = 0;
        team.draws = 0;
        team.points = 0;
        team.score_for = 0;
        team.score_against = 0;
        team.score_difference = 0;
    });
    
    // Process each completed match
    if (appData.matches?.matches) {
        appData.matches.matches.forEach(match => {
            if (match.status === 'completed') {
                processMatchResult(match);
            }
        });
    }
    
    // Calculate score differences
    appData.teams.teams?.forEach(team => {
        team.score_difference = team.score_for - team.score_against;
    });
}

// Process match result
function processMatchResult(match) {
    const team1 = appData.teams.teams?.find(t => t.name === match.team1);
    const team2 = appData.teams.teams?.find(t => t.name === match.team2);
    
    if (!team1 || !team2) return;
    
    // Update played matches
    team1.played++;
    team2.played++;
    
    // Update scores
    const score1 = match.team1_score || 0;
    const score2 = match.team2_score || 0;
    
    team1.score_for += score1;
    team1.score_against += score2;
    team2.score_for += score2;
    team2.score_against += score1;
    
    // Determine winner and update stats
    if (match.winner === match.team1) {
        team1.wins++;
        team1.points += appData.rules?.points_system?.win || 2;
        team2.losses++;
        team2.points += appData.rules?.points_system?.loss || 0;
    } else if (match.winner === match.team2) {
        team2.wins++;
        team2.points += appData.rules?.points_system?.win || 2;
        team1.losses++;
        team1.points += appData.rules?.points_system?.loss || 0;
    } else if (match.winner === 'tie' || match.winner === 'draw') {
        team1.draws++;
        team2.draws++;
        team1.points += appData.rules?.points_system?.draw || 1;
        team2.points += appData.rules?.points_system?.draw || 1;
    }
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
    const standingsContainer = document.getElementById('standings-container');
    const teams = appData.teams?.teams || [];
    
    // Group teams by pool
    const pools = {};
    teams.forEach(team => {
        if (!pools[team.pool]) {
            pools[team.pool] = [];
        }
        pools[team.pool].push(team);
    });
    
    // Create standings for each pool
    let standingsHTML = '';
    Object.keys(pools).sort().forEach(pool => {
        const poolTeams = pools[pool];
        const sortedTeams = sortTeams(poolTeams);
        
        standingsHTML += `
            <div class="card">
                <h2>🏆 Pool ${pool} Standings</h2>
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Team</th>
                            <th>Played</th>
                            <th>Won</th>
                            <th>Lost</th>
                            <th>Drawn</th>
                            <th>Points</th>
                            <th>Diff</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedTeams.map((team, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td><strong>${team.name}</strong></td>
                                <td>${team.played || 0}</td>
                                <td>${team.wins || 0}</td>
                                <td>${team.losses || 0}</td>
                                <td>${team.draws || 0}</td>
                                <td><strong>${team.points || 0}</strong></td>
                                <td>${team.score_difference > 0 ? '+' : ''}${team.score_difference || 0}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    });
    
    standingsContainer.innerHTML = standingsHTML;
    
    // Update tournament statistics
    updateTournamentStats();
}

// Sort teams by ranking
function sortTeams(teams) {
    return [...teams].sort((a, b) => {
        // Sort by points
        if (b.points !== a.points) return b.points - a.points;
        // Then by score difference
        if (b.score_difference !== a.score_difference) {
            return b.score_difference - a.score_difference;
        }
        // Then by wins
        if (b.wins !== a.wins) return b.wins - a.wins;
        // Finally by total score
        return b.score_for - a.score_for;
    });
}

// Update tournament statistics
function updateTournamentStats() {
    const statsDiv = document.getElementById('tournament-stats');
    const totalMatches = appData.tournament?.fixtures?.length || 0;
    const completedMatches = appData.matches?.matches?.filter(m => m.status === 'completed').length || 0;
    
    const config = appData.config?.sport_config;
    const scoreUnit = config?.terminology?.score_unit || 'points';
    
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
                <p style="font-size: 1.5em; color: var(--accent);">
                    ${appData.config?.tournament?.status || 'Ongoing'}
                </p>
            </div>
        </div>
    `;
}

// Update teams display
function updateTeamsDisplay() {
    const container = document.getElementById('teams-pools-container');
    const teams = appData.teams?.teams || [];
    
    // Group teams by pool
    const pools = {};
    teams.forEach(team => {
        if (!pools[team.pool]) {
            pools[team.pool] = [];
        }
        pools[team.pool].push(team);
    });
    
    let html = '';
    Object.keys(pools).sort().forEach(pool => {
        const poolClass = `pool-${pool.toLowerCase()}-header`;
        html += `
            <div class="pool-section">
                <div class="pool-header ${poolClass}">
                    <h2>🔵 Pool ${pool} Teams</h2>
                </div>
                <div class="teams-grid">
                    ${pools[pool].map(team => createTeamCard(team)).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Create team card
function createTeamCard(team) {
    return `
        <div class="team-card">
            <div class="pool-badge">Pool ${team.pool}</div>
            <div class="team-header">
                <div class="team-name">${team.name}</div>
                <div style="font-size: 1.5em;">${appData.config?.sport_config?.sport_icon || '🏆'}</div>
            </div>
            <div class="team-stats">
                <span>P: ${team.played || 0}</span>
                <span>W: ${team.wins || 0}</span>
                <span>L: ${team.losses || 0}</span>
                <span>D: ${team.draws || 0}</span>
                <span>Pts: ${team.points || 0}</span>
            </div>
            <div class="player-list">
                ${team.players?.map(player => `
                    <div class="player ${player.role === 'Captain' ? 'captain' : ''}">
                        ${player.name} ${player.role === 'Captain' ? '(C)' : ''}
                    </div>
                `).join('') || 'No players'}
            </div>
        </div>
    `;
}

// Update fixtures
function updateFixtures() {
    const fixturesDiv = document.getElementById('fixtures-list');
    const fixtures = appData.tournament?.fixtures || [];
    
    if (fixtures.length === 0) {
        fixturesDiv.innerHTML = '<p>No fixtures scheduled. Please use the admin panel to create fixtures.</p>';
        return;
    }
    
    const groupedFixtures = {};
    fixtures.forEach(fixture => {
        if (!groupedFixtures[fixture.round]) {
            groupedFixtures[fixture.round] = [];
        }
        groupedFixtures[fixture.round].push(fixture);
    });
    
    let html = '';
    Object.keys(groupedFixtures).forEach(round => {
        html += `<h3 style="color: var(--secondary); margin-top: 20px;">${round}</h3>`;
        
        groupedFixtures[round].forEach(fixture => {
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
                        <div>📅 ${fixture.date} | ⏰ ${fixture.time}</div>
                        <div style="color: ${statusColor}; font-weight: bold;">
                            ${fixture.status.toUpperCase()}
                        </div>
                        ${fixture.result ? `<div style="color: var(--success);">${fixture.result}</div>` : ''}
                    </div>
                </div>
            `;
        });
    });
    
    fixturesDiv.innerHTML = html;
}

// Update statistics
function updateStatistics() {
    const statsContent = document.getElementById('statistics-content');
    const matches = appData.matches?.matches || [];
    const config = appData.config?.sport_config;
    
    // Calculate various statistics
    const totalMatches = matches.filter(m => m.status === 'completed').length;
    const totalScore = matches.reduce((sum, m) => sum + (m.team1_score || 0) + (m.team2_score || 0), 0);
    
    // Find highest scores
    let highestScore = { team: '', score: 0, match: '' };
    let closestMatch = { teams: '', difference: Infinity };
    
    matches.forEach(match => {
        if (match.team1_score > highestScore.score) {
            highestScore = { team: match.team1, score: match.team1_score, match: `vs ${match.team2}` };
        }
        if (match.team2_score > highestScore.score) {
            highestScore = { team: match.team2, score: match.team2_score, match: `vs ${match.team1}` };
        }
        
        const diff = Math.abs((match.team1_score || 0) - (match.team2_score || 0));
        if (diff < closestMatch.difference && match.status === 'completed') {
            closestMatch = { teams: `${match.team1} vs ${match.team2}`, difference: diff };
        }
    });
    
    const scoreUnit = config?.terminology?.score_unit || 'points';
    
    statsContent.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            <div class="card" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
                <h4>Total Matches Played</h4>
                <p style="font-size: 2.5em;">${totalMatches}</p>
            </div>
            <div class="card" style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white;">
                <h4>Total ${scoreUnit.charAt(0).toUpperCase() + scoreUnit.slice(1)} Scored</h4>
                <p style="font-size: 2.5em;">${totalScore}</p>
            </div>
            <div class="card" style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white;">
                <h4>Highest Team Score</h4>
                <p style="font-size: 1.5em;">${highestScore.team}</p>
                <p>${highestScore.score} ${scoreUnit} ${highestScore.match}</p>
            </div>
            <div class="card" style="background: linear-gradient(135deg, #43e97b, #38f9d7); color: white;">
                <h4>Closest Match</h4>
                <p style="font-size: 1.2em;">${closestMatch.teams}</p>
                <p>Difference: ${closestMatch.difference} ${scoreUnit}</p>
            </div>
        </div>
    `;
}

// Populate match selector for live scoring
function populateMatchSelector() {
    const matchSelect = document.getElementById('match-select');
    const fixtures = appData.tournament?.fixtures || [];
    
    const upcomingMatches = fixtures.filter(f => 
        f.status === 'scheduled' && 
        !f.team1.includes('Winner') && 
        !f.team1.includes('TBD') &&
        !f.team2.includes('Winner') &&
        !f.team2.includes('TBD')
    );
    
    matchSelect.innerHTML = '<option value="">Choose a match...</option>' + 
        upcomingMatches.map(match => `
            <option value="${match.match_id}">
                ${match.round}: ${match.team1} vs ${match.team2} (${match.time})
            </option>
        `).join('');
}

// Select match for scoring
function selectMatch() {
    const matchId = document.getElementById('match-select').value;
    if (!matchId) return;
    
    currentMatch = appData.tournament?.fixtures?.find(f => f.match_id == matchId);
    if (currentMatch) {
        document.getElementById('match-title').textContent = 
            `${currentMatch.team1} vs ${currentMatch.team2}`;
        
        // Initialize match data
        matchData = {
            team1_score: 0,
            team2_score: 0
        };
        
        // Setup sport-specific scoring interface
        setupScoringInterface();
    }
}

// Setup scoring interface based on sport
function setupScoringInterface() {
    const config = appData.config?.sport_config;
    const scoreDisplay = document.getElementById('score-display');
    const inputFields = document.getElementById('score-input-fields');
    const controls = document.getElementById('sport-specific-controls');
    
    // Create score display
    scoreDisplay.innerHTML = `
        <div class="score-box">
            <h3>${currentMatch.team1}</h3>
            <div class="score-value" id="team1-score">0</div>
        </div>
        <div class="score-box">
            <h3>VS</h3>
            <div style="font-size: 1.5em;">⚔️</div>
        </div>
        <div class="score-box">
            <h3>${currentMatch.team2}</h3>
            <div class="score-value" id="team2-score">0</div>
        </div>
    `;
    
    // Create input fields based on sport configuration
    let inputHTML = '';
    
    config?.scoring_fields?.forEach(field => {
        inputHTML += `
            <div class="score-input-group">
                <label>${currentMatch.team1} ${field.display}</label>
                <input type="${field.type === 'decimal' ? 'number' : field.type}" 
                       step="${field.type === 'decimal' ? '0.1' : '1'}"
                       id="team1_${field.name}" 
                       value="0">
            </div>
            <div class="score-input-group">
                <label>${currentMatch.team2} ${field.display}</label>
                <input type="${field.type === 'decimal' ? 'number' : field.type}" 
                       step="${field.type === 'decimal' ? '0.1' : '1'}"
                       id="team2_${field.name}" 
                       value="0">
            </div>
        `;
    });
    
    inputFields.innerHTML = inputHTML || `
        <div class="score-input-group">
            <label>${currentMatch.team1} Score</label>
            <input type="number" id="team1_score" value="0">
        </div>
        <div class="score-input-group">
            <label>${currentMatch.team2} Score</label>
            <input type="number" id="team2_score" value="0">
        </div>
    `;
    
    // Add sport-specific controls if needed
    controls.innerHTML = '';
}

// Start match
function startMatch() {
    if (!currentMatch) {
        alert('Please select a match first!');
        return;
    }
    
    currentMatch.status = 'live';
    document.getElementById('live-score-area').style.display = 'block';
    
    showStatus('Match started!', 'success');
}

// Update score
function updateScore() {
    const config = appData.config?.sport_config;
    
    // Get scores from input fields
    if (config?.scoring_fields) {
        config.scoring_fields.forEach(field => {
            if (field.name === 'score' || field.name === 'runs' || field.name === 'goals' || field.name === 'points') {
                const team1Value = document.getElementById(`team1_${field.name}`)?.value;
                const team2Value = document.getElementById(`team2_${field.name}`)?.value;
                
                if (team1Value) matchData.team1_score = parseInt(team1Value);
                if (team2Value) matchData.team2_score = parseInt(team2Value);
            }
        });
    } else {
        // Fallback to generic score fields
        matchData.team1_score = parseInt(document.getElementById('team1_score')?.value || 0);
        matchData.team2_score = parseInt(document.getElementById('team2_score')?.value || 0);
    }
    
    // Update display
    document.getElementById('team1-score').textContent = matchData.team1_score;
    document.getElementById('team2-score').textContent = matchData.team2_score;
    
    showStatus('Score updated!', 'success');
}

// End match
function endMatch() {
    if (!currentMatch) return;
    
    // Determine winner
    let winner, result;
    if (matchData.team1_score > matchData.team2_score) {
        winner = currentMatch.team1;
        result = `${currentMatch.team1} won by ${matchData.team1_score - matchData.team2_score} ${appData.config?.sport_config?.terminology?.score_unit || 'points'}`;
    } else if (matchData.team2_score > matchData.team1_score) {
        winner = currentMatch.team2;
        result = `${currentMatch.team2} won by ${matchData.team2_score - matchData.team1_score} ${appData.config?.sport_config?.terminology?.score_unit || 'points'}`;
    } else {
        winner = 'draw';
        result = 'Match Drawn';
    }
    
    currentMatch.status = 'completed';
    currentMatch.result = result;
    
    // Create match record
    const matchRecord = {
        match_id: currentMatch.match_id,
        date: currentMatch.date,
        time: currentMatch.time,
        pool: currentMatch.round.includes('Pool') ? currentMatch.round.replace('Pool ', '') : 'Knockout',
        team1: currentMatch.team1,
        team2: currentMatch.team2,
        status: 'completed',
        winner: winner,
        team1_score: matchData.team1_score,
        team2_score: matchData.team2_score
    };
    
    // Add to matches
    if (!appData.matches) appData.matches = { matches: [] };
    
    // Check if match already exists
    const existingIndex = appData.matches.matches.findIndex(m => m.match_id === matchRecord.match_id);
    if (existingIndex >= 0) {
        appData.matches.matches[existingIndex] = matchRecord;
    } else {
        appData.matches.matches.push(matchRecord);
    }
    
    saveMatch();
    
    alert(`Match Complete! ${result}`);
    
    // Reset and reload
    currentMatch = null;
    document.getElementById('live-score-area').style.display = 'none';
    loadAllData();
}

// Save match
function saveMatch() {
    if (!currentMatch) return;
    
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
    
    let data;
    if (selector.value === 'config') {
        data = appData.config;
    } else {
        data = appData[selector.value];
    }
    
    if (data) {
        textarea.value = JSON.stringify(data, null, 2);
        showStatus('File loaded successfully', 'success');
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
        
        if (selector.value === 'config') {
            appData.config = data;
            localStorage.setItem('tournament_config', JSON.stringify(data));
        } else {
            appData[selector.value] = data;
            localStorage.setItem(`zgcl_${selector.value}`, JSON.stringify(data));
        }
        
        showStatus('File saved successfully!', 'success');
        
        // Reload everything
        loadAllData();
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

// Download functions
function downloadAllJSON() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    
    const files = ['config', 'teams', 'tournament', 'matches', 'rules'];
    
    files.forEach(filename => {
        const data = filename === 'config' ? appData.config : appData[filename];
        if (data) {
            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${timestamp}_${filename}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });
    
    showStatus('All files downloaded successfully!', 'success');
}

function downloadFile(filename) {
    const data = filename === 'config' ? appData.config : appData[filename];
    if (!data) {
        showStatus(`No data found for ${filename}`, 'error');
        return;
    }
    
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

// Show status message
function showStatus(message, type) {
    const statusDiv = document.getElementById('status-message');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type}`;
        
        setTimeout(() => {
            statusDiv.className = 'status-message';
        }, 3000);
    }
}
