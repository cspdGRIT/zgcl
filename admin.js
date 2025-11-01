// Admin Panel JavaScript - Complete Tournament Configuration System

// Global configuration object
let config = {
    tournament: {
        name: "Tournament Name",
        sport: "cricket",
        format: "pools",
        status: "upcoming",
        description: "",
        venue: "",
        start_date: "",
        end_date: "",
        icon: "🏆"
    },
    sport_config: {
        sport_name: "Cricket",
        sport_icon: "🏏",
        terminology: {
            score_unit: "runs",
            period_name: "overs",
            period_unit: "over",
            team_size_name: "players",
            dismissal_name: "wickets",
            score_display: "{score}/{wickets} ({overs} ov)"
        },
        match_config: {
            periods_per_match: 7,
            max_dismissals: 6,
            players_per_team: 6,
            match_duration: "40 minutes"
        },
        scoring_fields: [
            { name: "runs", display: "Runs", type: "number" },
            { name: "wickets", display: "Wickets", type: "number" },
            { name: "overs", display: "Overs", type: "decimal" }
        ]
    },
    rules: {
        points_system: {
            win: 2,
            draw: 1,
            loss: 0,
            no_result: 1
        },
        tie_breakers: [
            "Points",
            "Net Run Rate",
            "Head to Head",
            "Total Scored"
        ]
    },
    theme: {
        primary_color: "#FF6B35",
        secondary_color: "#004E89",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
};

// Sport Templates
const sportTemplates = {
    cricket: {
        sport_name: "Cricket",
        sport_icon: "🏏",
        terminology: {
            score_unit: "runs",
            period_name: "overs",
            period_unit: "over",
            team_size_name: "players",
            dismissal_name: "wickets",
            score_display: "{score}/{wickets} ({overs} ov)"
        },
        match_config: {
            periods_per_match: 7,
            max_dismissals: 6,
            players_per_team: 6,
            match_duration: "40 minutes"
        },
        scoring_fields: [
            { name: "runs", display: "Runs", type: "number" },
            { name: "wickets", display: "Wickets", type: "number" },
            { name: "overs", display: "Overs", type: "decimal" }
        ]
    },
    football: {
        sport_name: "Football",
        sport_icon: "⚽",
        terminology: {
            score_unit: "goals",
            period_name: "halves",
            period_unit: "minute",
            team_size_name: "players",
            dismissal_name: "red cards",
            score_display: "{score}"
        },
        match_config: {
            periods_per_match: 2,
            max_dismissals: 0,
            players_per_team: 11,
            match_duration: "90 minutes"
        },
        scoring_fields: [
            { name: "goals", display: "Goals", type: "number" },
            { name: "shots", display: "Shots", type: "number" },
            { name: "possession", display: "Possession %", type: "number" }
        ]
    },
    carrom: {
        sport_name: "Carrom",
        sport_icon: "🎯",
        terminology: {
            score_unit: "points",
            period_name: "boards",
            period_unit: "board",
            team_size_name: "players",
            dismissal_name: "",
            score_display: "{score} points"
        },
        match_config: {
            periods_per_match: 3,
            max_dismissals: 0,
            players_per_team: 2,
            match_duration: "45 minutes"
        },
        scoring_fields: [
            { name: "points", display: "Points", type: "number" },
            { name: "queens", display: "Queens", type: "number" },
            { name: "boards_won", display: "Boards Won", type: "number" }
        ]
    },
    chess: {
        sport_name: "Chess",
        sport_icon: "♟️",
        terminology: {
            score_unit: "points",
            period_name: "games",
            period_unit: "game",
            team_size_name: "players",
            dismissal_name: "",
            score_display: "{score} points"
        },
        match_config: {
            periods_per_match: 1,
            max_dismissals: 0,
            players_per_team: 1,
            match_duration: "30 minutes"
        },
        scoring_fields: [
            { name: "result", display: "Result", type: "select", options: ["Win", "Draw", "Loss"] },
            { name: "moves", display: "Moves", type: "number" },
            { name: "time_left", display: "Time Left", type: "time" }
        ]
    },
    badminton: {
        sport_name: "Badminton",
        sport_icon: "🏸",
        terminology: {
            score_unit: "points",
            period_name: "sets",
            period_unit: "set",
            team_size_name: "players",
            dismissal_name: "",
            score_display: "{sets_won}-{sets_lost} ({score})"
        },
        match_config: {
            periods_per_match: 3,
            max_dismissals: 0,
            players_per_team: 2,
            match_duration: "45 minutes"
        },
        scoring_fields: [
            { name: "sets_won", display: "Sets Won", type: "number" },
            { name: "points", display: "Points", type: "number" },
            { name: "rallies_won", display: "Rallies Won", type: "number" }
        ]
    },
    "table-tennis": {
        sport_name: "Table Tennis",
        sport_icon: "🏓",
        terminology: {
            score_unit: "points",
            period_name: "sets",
            period_unit: "set",
            team_size_name: "players",
            dismissal_name: "",
            score_display: "{sets_won}-{sets_lost} ({score})"
        },
        match_config: {
            periods_per_match: 5,
            max_dismissals: 0,
            players_per_team: 1,
            match_duration: "30 minutes"
        },
        scoring_fields: [
            { name: "sets_won", display: "Sets Won", type: "number" },
            { name: "points", display: "Points", type: "number" },
            { name: "serves_won", display: "Serves Won", type: "number" }
        ]
    },
    volleyball: {
        sport_name: "Volleyball",
        sport_icon: "🏐",
        terminology: {
            score_unit: "points",
            period_name: "sets",
            period_unit: "set",
            team_size_name: "players",
            dismissal_name: "",
            score_display: "{sets_won}-{sets_lost} ({score})"
        },
        match_config: {
            periods_per_match: 5,
            max_dismissals: 0,
            players_per_team: 6,
            match_duration: "90 minutes"
        },
        scoring_fields: [
            { name: "sets_won", display: "Sets Won", type: "number" },
            { name: "points", display: "Points", type: "number" },
            { name: "blocks", display: "Blocks", type: "number" },
            { name: "aces", display: "Aces", type: "number" }
        ]
    }
};

// App data storage
let appData = {
    config: null,
    teams: null,
    tournament: null,
    matches: null,
    rules: null
};

// Initialize admin panel
window.onload = function() {
    loadAllData();
    setupEventListeners();
    updateDashboard();
};

// Load all data
async function loadAllData() {
    try {
        // Load configuration
        const storedConfig = localStorage.getItem('tournament_config');
        if (storedConfig) {
            config = JSON.parse(storedConfig);
        }
        
        // Load other data
        appData.teams = JSON.parse(localStorage.getItem('zgcl_teams') || '{}');
        appData.tournament = JSON.parse(localStorage.getItem('zgcl_tournament') || '{}');
        appData.matches = JSON.parse(localStorage.getItem('zgcl_matches') || '{}');
        appData.rules = JSON.parse(localStorage.getItem('zgcl_rules') || '{}');
        
        updateDashboard();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add event listeners for forms
    const tournamentForm = document.getElementById('tournament-form');
    if (tournamentForm) {
        tournamentForm.addEventListener('submit', (e) => e.preventDefault());
    }
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remove active from nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected section
    const selectedSection = document.getElementById(sectionName);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Mark nav button as active
    event.target.classList.add('active');
    
    // Load section-specific data
    loadSectionData(sectionName);
}

// Load section-specific data
function loadSectionData(section) {
    switch(section) {
        case 'tournament':
            loadTournamentSettings();
            break;
        case 'teams':
            loadTeamsList();
            break;
        case 'fixtures':
            loadFixturesList();
            break;
        case 'scoring':
            loadScoringRules();
            break;
    }
}

// Load template
function loadTemplate(sportType) {
    if (sportTemplates[sportType]) {
        config.sport_config = sportTemplates[sportType];
        config.tournament.sport = sportType;
        
        // Update form fields
        document.getElementById('sport-type').value = sportType;
        updateSportFields();
        
        showStatus('Template loaded successfully!', 'success');
        saveTournamentConfig();
    }
}

// Update sport-specific fields
function updateSportFields() {
    const sportType = document.getElementById('sport-type').value;
    const sportConfig = sportTemplates[sportType] || sportTemplates['cricket'];
    
    const fieldsContainer = document.getElementById('sport-specific-fields');
    
    let fieldsHTML = '<h3>Sport-Specific Settings</h3><div class="form-row">';
    
    // Add sport-specific configuration fields
    fieldsHTML += `
        <div class="form-group">
            <label>${sportConfig.terminology.period_name} per match</label>
            <input type="number" id="periods-per-match" value="${sportConfig.match_config.periods_per_match}" min="1">
        </div>
        <div class="form-group">
            <label>${sportConfig.terminology.team_size_name} per team</label>
            <input type="number" id="team-size" value="${sportConfig.match_config.players_per_team}" min="1">
        </div>
    `;
    
    if (sportConfig.match_config.max_dismissals > 0) {
        fieldsHTML += `
            <div class="form-group">
                <label>Max ${sportConfig.terminology.dismissal_name}</label>
                <input type="number" id="max-dismissals" value="${sportConfig.match_config.max_dismissals}" min="0">
            </div>
        `;
    }
    
    fieldsHTML += '</div>';
    fieldsContainer.innerHTML = fieldsHTML;
    
    // Update scoring fields
    updateScoringFields(sportConfig);
}

// Update scoring fields
function updateScoringFields(sportConfig) {
    const scoringFieldsContainer = document.getElementById('scoring-fields');
    if (!scoringFieldsContainer) return;
    
    let fieldsHTML = '<div class="form-row">';
    
    sportConfig.scoring_fields.forEach(field => {
        fieldsHTML += `
            <div class="form-group">
                <label>${field.display}</label>
                ${getFieldInput(field)}
            </div>
        `;
    });
    
    fieldsHTML += '</div>';
    scoringFieldsContainer.innerHTML = fieldsHTML;
}

// Get field input HTML
function getFieldInput(field) {
    switch(field.type) {
        case 'select':
            return `<select id="field-${field.name}">
                ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>`;
        case 'time':
            return `<input type="time" id="field-${field.name}">`;
        case 'decimal':
            return `<input type="number" step="0.1" id="field-${field.name}">`;
        default:
            return `<input type="number" id="field-${field.name}">`;
    }
}

// Save tournament configuration
function saveTournamentConfig() {
    const sportType = document.getElementById('sport-type').value;
    
    config.tournament = {
        name: document.getElementById('tournament-name').value || 'Tournament',
        sport: sportType,
        format: document.getElementById('tournament-format').value,
        status: 'upcoming',
        description: document.getElementById('description').value,
        venue: document.getElementById('venue').value,
        start_date: document.getElementById('start-date').value,
        end_date: document.getElementById('end-date').value,
        icon: sportTemplates[sportType]?.sport_icon || '🏆'
    };
    
    config.sport_config = sportTemplates[sportType] || config.sport_config;
    
    // Update match config with form values
    if (document.getElementById('periods-per-match')) {
        config.sport_config.match_config.periods_per_match = 
            parseInt(document.getElementById('periods-per-match').value);
    }
    if (document.getElementById('team-size')) {
        config.sport_config.match_config.players_per_team = 
            parseInt(document.getElementById('team-size').value);
    }
    if (document.getElementById('max-dismissals')) {
        config.sport_config.match_config.max_dismissals = 
            parseInt(document.getElementById('max-dismissals').value);
    }
    
    // Save to localStorage
    localStorage.setItem('tournament_config', JSON.stringify(config));
    
    // Update tournament.json structure
    const tournamentData = {
        ...config.tournament,
        ...config.sport_config,
        fixtures: appData.tournament?.fixtures || [],
        current_round: appData.tournament?.current_round || 'Pool Stage',
        tournament_status: config.tournament.status
    };
    
    localStorage.setItem('zgcl_tournament', JSON.stringify(tournamentData));
    
    showStatus('Tournament configuration saved successfully!', 'success');
    updateDashboard();
}

// Load tournament settings
function loadTournamentSettings() {
    if (config.tournament) {
        document.getElementById('tournament-name').value = config.tournament.name || '';
        document.getElementById('sport-type').value = config.tournament.sport || 'cricket';
        document.getElementById('tournament-format').value = config.tournament.format || 'pools';
        document.getElementById('venue').value = config.tournament.venue || '';
        document.getElementById('description').value = config.tournament.description || '';
        document.getElementById('start-date').value = config.tournament.start_date || '';
        document.getElementById('end-date').value = config.tournament.end_date || '';
    }
    updateSportFields();
}

// Update dashboard
function updateDashboard() {
    // Update tournament info
    document.getElementById('current-tournament-name').textContent = 
        config.tournament?.name || 'Not Set';
    document.getElementById('current-sport').textContent = 
        config.sport_config?.sport_name || 'Not Set';
    document.getElementById('current-format').textContent = 
        config.tournament?.format || 'Not Set';
    
    // Count teams
    const teamCount = appData.teams?.teams?.length || 0;
    document.getElementById('current-teams').textContent = teamCount;
    
    document.getElementById('current-status').textContent = 
        config.tournament?.status || 'Not Started';
}

// Load teams list
function loadTeamsList() {
    const teamsContainer = document.getElementById('teams-list');
    if (!teamsContainer) return;
    
    const teams = appData.teams?.teams || [];
    
    if (teams.length === 0) {
        teamsContainer.innerHTML = '<p>No teams added yet. Click "Add Team" to create teams.</p>';
        return;
    }
    
    teamsContainer.innerHTML = teams.map(team => `
        <div class="team-card">
            <div class="team-header">
                <div class="team-name">${team.name}</div>
                <div class="team-actions">
                    <button class="icon-btn edit-btn" onclick="editTeam(${team.id})">✏️</button>
                    <button class="icon-btn delete-btn" onclick="deleteTeam(${team.id})">🗑️</button>
                </div>
            </div>
            <div class="player-list">
                Pool: ${team.pool || 'Not assigned'} | 
                Players: ${team.players?.map(p => p.name).join(', ') || 'No players'}
            </div>
        </div>
    `).join('');
}

// Show add team modal
function showAddTeamModal() {
    document.getElementById('add-team-modal').classList.add('active');
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Add new team
function addNewTeam() {
    const teamName = document.getElementById('new-team-name').value;
    const pool = document.getElementById('new-team-pool').value;
    const playersText = document.getElementById('new-team-players').value;
    
    if (!teamName) {
        showStatus('Please enter a team name', 'error');
        return;
    }
    
    // Parse players
    const players = playersText.split(',').map((name, index) => ({
        name: name.trim(),
        role: index === 0 ? 'Captain' : 'Player'
    })).filter(p => p.name);
    
    // Get current teams
    if (!appData.teams) {
        appData.teams = { teams: [], pools: {} };
    }
    
    // Add new team
    const newTeam = {
        id: appData.teams.teams.length + 1,
        name: teamName,
        pool: pool,
        players: players,
        wins: 0,
        losses: 0,
        points: 0,
        played: 0
    };
    
    appData.teams.teams.push(newTeam);
    
    // Update pools
    if (!appData.teams.pools[pool]) {
        appData.teams.pools[pool] = [];
    }
    appData.teams.pools[pool].push(teamName);
    
    // Save
    localStorage.setItem('zgcl_teams', JSON.stringify(appData.teams));
    
    showStatus('Team added successfully!', 'success');
    closeModal('add-team-modal');
    loadTeamsList();
    
    // Clear form
    document.getElementById('new-team-name').value = '';
    document.getElementById('new-team-players').value = '';
}

// Delete team
function deleteTeam(teamId) {
    if (!confirm('Are you sure you want to delete this team?')) return;
    
    appData.teams.teams = appData.teams.teams.filter(t => t.id !== teamId);
    localStorage.setItem('zgcl_teams', JSON.stringify(appData.teams));
    
    showStatus('Team deleted successfully!', 'success');
    loadTeamsList();
}

// Edit team
function editTeam(teamId) {
    const team = appData.teams.teams.find(t => t.id === teamId);
    if (!team) return;
    
    // Open modal with team data
    document.getElementById('new-team-name').value = team.name;
    document.getElementById('new-team-pool').value = team.pool;
    document.getElementById('new-team-players').value = 
        team.players.map(p => p.name).join(', ');
    
    showAddTeamModal();
    
    // Change button to update
    const addBtn = document.querySelector('#add-team-modal button.btn-success');
    addBtn.textContent = 'Update Team';
    addBtn.onclick = () => updateTeam(teamId);
}

// Update team
function updateTeam(teamId) {
    const team = appData.teams.teams.find(t => t.id === teamId);
    if (!team) return;
    
    team.name = document.getElementById('new-team-name').value;
    team.pool = document.getElementById('new-team-pool').value;
    
    const playersText = document.getElementById('new-team-players').value;
    team.players = playersText.split(',').map((name, index) => ({
        name: name.trim(),
        role: index === 0 ? 'Captain' : 'Player'
    })).filter(p => p.name);
    
    localStorage.setItem('zgcl_teams', JSON.stringify(appData.teams));
    
    showStatus('Team updated successfully!', 'success');
    closeModal('add-team-modal');
    loadTeamsList();
    
    // Reset button
    const addBtn = document.querySelector('#add-team-modal button.btn-success');
    addBtn.textContent = 'Add Team';
    addBtn.onclick = addNewTeam;
}

// Generate fixtures automatically
function generateFixtures() {
    if (!appData.teams?.teams || appData.teams.teams.length < 2) {
        showStatus('Please add at least 2 teams first', 'error');
        return;
    }
    
    const teams = appData.teams.teams;
    const fixtures = [];
    let matchId = 1;
    
    // Generate round-robin fixtures for each pool
    const pools = {};
    teams.forEach(team => {
        if (!pools[team.pool]) pools[team.pool] = [];
        pools[team.pool].push(team);
    });
    
    Object.keys(pools).forEach(pool => {
        const poolTeams = pools[pool];
        for (let i = 0; i < poolTeams.length; i++) {
            for (let j = i + 1; j < poolTeams.length; j++) {
                fixtures.push({
                    match_id: matchId++,
                    round: `Pool ${pool}`,
                    date: config.tournament.start_date,
                    time: `${9 + (matchId - 1) * 1}:00`,
                    team1: poolTeams[i].name,
                    team2: poolTeams[j].name,
                    venue: config.tournament.venue || 'Ground A',
                    status: 'scheduled',
                    duration: config.sport_config.match_config.match_duration
                });
            }
        }
    });
    
    // Add knockout fixtures
    if (config.tournament.format === 'pools') {
        // Semi-finals
        fixtures.push({
            match_id: matchId++,
            round: 'Semi Final 1',
            date: config.tournament.end_date,
            time: '09:00',
            team1: 'Pool A Winner',
            team2: 'Pool B Runner-up',
            venue: config.tournament.venue || 'Ground A',
            status: 'scheduled'
        });
        
        fixtures.push({
            match_id: matchId++,
            round: 'Semi Final 2',
            date: config.tournament.end_date,
            time: '11:00',
            team1: 'Pool B Winner',
            team2: 'Pool A Runner-up',
            venue: config.tournament.venue || 'Ground A',
            status: 'scheduled'
        });
        
        // Final
        fixtures.push({
            match_id: matchId++,
            round: 'Final',
            date: config.tournament.end_date,
            time: '15:00',
            team1: 'SF1 Winner',
            team2: 'SF2 Winner',
            venue: config.tournament.venue || 'Ground A',
            status: 'scheduled'
        });
    }
    
    // Update tournament data
    if (!appData.tournament) appData.tournament = {};
    appData.tournament.fixtures = fixtures;
    
    localStorage.setItem('zgcl_tournament', JSON.stringify(appData.tournament));
    
    showStatus('Fixtures generated successfully!', 'success');
    loadFixturesList();
}

// Load fixtures list
function loadFixturesList() {
    const fixturesContainer = document.getElementById('fixtures-list');
    if (!fixturesContainer) return;
    
    const fixtures = appData.tournament?.fixtures || [];
    
    if (fixtures.length === 0) {
        fixturesContainer.innerHTML = '<p>No fixtures created yet. Click "Auto Generate Fixtures" to create schedule.</p>';
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
        html += `<h3 style="margin-top: 20px; color: var(--secondary);">${round}</h3>`;
        html += '<div class="teams-container">';
        
        groupedFixtures[round].forEach(fixture => {
            html += `
                <div class="team-card">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${fixture.team1}</strong> vs <strong>${fixture.team2}</strong>
                        </div>
                        <span class="badge badge-${fixture.status === 'completed' ? 'success' : 'warning'}">
                            ${fixture.status}
                        </span>
                    </div>
                    <div style="margin-top: 8px; font-size: 13px; color: #6b7280;">
                        📅 ${fixture.date} | ⏰ ${fixture.time} | 📍 ${fixture.venue}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    fixturesContainer.innerHTML = html;
}

// Load scoring rules
function loadScoringRules() {
    if (config.rules) {
        document.getElementById('points-win').value = config.rules.points_system.win;
        document.getElementById('points-draw').value = config.rules.points_system.draw;
        document.getElementById('points-loss').value = config.rules.points_system.loss;
    }
    
    updateScoringFields(config.sport_config);
}

// Save scoring rules
function saveScoringRules() {
    config.rules.points_system = {
        win: parseInt(document.getElementById('points-win').value),
        draw: parseInt(document.getElementById('points-draw').value),
        loss: parseInt(document.getElementById('points-loss').value),
        no_result: parseInt(document.getElementById('points-draw').value)
    };
    
    localStorage.setItem('tournament_config', JSON.stringify(config));
    localStorage.setItem('zgcl_rules', JSON.stringify(config.rules));
    
    showStatus('Scoring rules saved successfully!', 'success');
}

// JSON Editor functions
function loadJSONFile() {
    const selector = document.getElementById('json-file-selector');
    const textarea = document.getElementById('json-editor-textarea');
    
    if (!selector.value) {
        textarea.value = '';
        return;
    }
    
    let data;
    switch(selector.value) {
        case 'config':
            data = config;
            break;
        case 'teams':
            data = appData.teams;
            break;
        case 'tournament':
            data = appData.tournament;
            break;
        case 'matches':
            data = appData.matches;
            break;
        case 'rules':
            data = config.rules;
            break;
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
        
        switch(selector.value) {
            case 'config':
                config = data;
                localStorage.setItem('tournament_config', JSON.stringify(config));
                break;
            case 'teams':
                appData.teams = data;
                localStorage.setItem('zgcl_teams', JSON.stringify(data));
                break;
            case 'tournament':
                appData.tournament = data;
                localStorage.setItem('zgcl_tournament', JSON.stringify(data));
                break;
            case 'matches':
                appData.matches = data;
                localStorage.setItem('zgcl_matches', JSON.stringify(data));
                break;
            case 'rules':
                config.rules = data;
                localStorage.setItem('zgcl_rules', JSON.stringify(data));
                break;
        }
        
        showStatus('File saved successfully!', 'success');
        updateDashboard();
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

// Export all data
function exportAllData() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const allData = {
        config: config,
        teams: appData.teams,
        tournament: appData.tournament,
        matches: appData.matches,
        rules: config.rules,
        exported_at: timestamp
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament-data-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showStatus('Data exported successfully!', 'success');
}

// Apply template
function applyTemplate(templateName) {
    const templates = {
        'cricket-t20': {
            tournament: {
                name: 'T20 Cricket Championship',
                sport: 'cricket',
                format: 'pools'
            },
            sport_config: {
                ...sportTemplates.cricket,
                match_config: {
                    periods_per_match: 20,
                    max_dismissals: 10,
                    players_per_team: 11,
                    match_duration: '3 hours'
                }
            }
        },
        'cricket-gully': {
            tournament: {
                name: 'Gully Cricket League',
                sport: 'cricket',
                format: 'pools'
            },
            sport_config: {
                ...sportTemplates.cricket,
                match_config: {
                    periods_per_match: 7,
                    max_dismissals: 6,
                    players_per_team: 6,
                    match_duration: '40 minutes'
                }
            }
        },
        'football-5aside': {
            tournament: {
                name: '5-a-side Football Tournament',
                sport: 'football',
                format: 'league'
            },
            sport_config: {
                ...sportTemplates.football,
                match_config: {
                    periods_per_match: 2,
                    max_dismissals: 0,
                    players_per_team: 5,
                    match_duration: '30 minutes'
                }
            }
        },
        'chess-rapid': {
            tournament: {
                name: 'Rapid Chess Championship',
                sport: 'chess',
                format: 'swiss'
            },
            sport_config: sportTemplates.chess
        },
        'carrom-singles': {
            tournament: {
                name: 'Carrom Singles Tournament',
                sport: 'carrom',
                format: 'knockout'
            },
            sport_config: {
                ...sportTemplates.carrom,
                match_config: {
                    periods_per_match: 3,
                    max_dismissals: 0,
                    players_per_team: 1,
                    match_duration: '30 minutes'
                }
            }
        },
        'badminton-singles': {
            tournament: {
                name: 'Badminton Championship',
                sport: 'badminton',
                format: 'pools'
            },
            sport_config: {
                ...sportTemplates.badminton,
                match_config: {
                    periods_per_match: 3,
                    max_dismissals: 0,
                    players_per_team: 1,
                    match_duration: '45 minutes'
                }
            }
        }
    };
    
    if (templates[templateName]) {
        const template = templates[templateName];
        config.tournament = { ...config.tournament, ...template.tournament };
        config.sport_config = template.sport_config;
        
        localStorage.setItem('tournament_config', JSON.stringify(config));
        
        showStatus(`${templateName} template applied successfully!`, 'success');
        showSection('tournament');
        loadTournamentSettings();
    }
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
