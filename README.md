# Zenith Gully Cricket League (ZGCL) - Tournament Management System

## 🏏 Overview

A complete tournament management system for the Zenith Gully Cricket League with JSON-based data management, live scoring, and team tracking capabilities.

## 📁 Files Included

- **index.html** - Main application interface
- **script.js** - JavaScript functionality for all features
- **teams.json** - Team rosters and statistics
- **rules.json** - Tournament rules and scoring system
- **tournament.json** - Match fixtures and schedule
- **matches.json** - Match results and live scoring data

## 🚀 Deployment Instructions

### Option 1: GitHub Pages Deployment

1. Create a new repository on GitHub (or use your existing `zgcl` repository)

2. Upload all files to your repository:
   ```bash
   git add index.html script.js *.json
   git commit -m "Update ZGCL tournament system with JSON editing"
   git push origin main
   ```

3. Enable GitHub Pages:
   - Go to Settings > Pages
   - Select source: Deploy from branch
   - Select branch: main (or master)
   - Select folder: / (root)
   - Save

4. Your site will be available at: `https://cspdgrit.github.io/zgcl/`

### Option 2: Local Testing

1. Save all files in a local directory
2. Open `index.html` in a web browser
3. The application will work with localStorage for data persistence

## ✨ Features

### 1. **Dashboard**
- Live leaderboard with team standings
- Tournament statistics
- Match completion tracking

### 2. **Teams Management**
- View all 6 teams with complete rosters
- Captain designation
- Team statistics (Played, Won, Lost, Points)

### 3. **Fixtures**
- Complete tournament schedule
- Round-robin format (each team plays every other team)
- Best of 3 games per fixture
- Finals for top 2 teams

### 4. **JSON Editor**
- Direct editing of all JSON files
- Real-time validation
- Save changes to localStorage
- Automatic UI updates after saving

### 5. **Download System**
- Download all JSON files with timestamp
- Individual file downloads
- Timestamped folders prevent data overwriting
- Format: `zgcl-data-YYYY-MM-DD_HH-MM-SS`

### 6. **Live Scoring** (Ready for implementation)
- Framework for live match scoring
- Real-time updates
- Score tracking

## 📝 Data Structure

### teams.json
```json
{
  "teams": [
    {
      "id": 1,
      "name": "Team 1",
      "players": [
        {"name": "Sandeep", "role": "Captain"},
        {"name": "Praveen", "role": "Player"}
      ],
      "wins": 0,
      "losses": 0,
      "points": 0,
      "played": 0
    }
  ]
}
```

### tournament.json
```json
{
  "fixtures": [
    {
      "match_id": 1,
      "round": "Round Robin",
      "date": "2025-11-02",
      "time": "09:00",
      "team1": "Team 1",
      "team2": "Team 2",
      "venue": "Ground A",
      "status": "scheduled",
      "result": null,
      "games": []
    }
  ],
  "current_round": "Round Robin",
  "tournament_status": "ongoing"
}
```

## 🎮 How to Use

### Editing Team Data
1. Go to **JSON Editor** tab
2. Select `teams.json` from dropdown
3. Click **Load File**
4. Edit the JSON data
5. Click **Validate JSON** to check syntax
6. Click **Save Changes** to apply

### Downloading Data Backup
1. Go to **Download** tab
2. Click **Download All JSON Files**
3. All files will be downloaded with timestamp
4. Use for backup or data migration

### Updating Match Results
1. Edit `tournament.json` in JSON Editor
2. Change match `status` from "scheduled" to "completed"
3. Add `result` field with winner information
4. Update team statistics in `teams.json`
5. Save both files

## 🔄 Auto-Refresh

The application automatically refreshes data every 30 seconds to ensure all users see the latest updates when multiple people are accessing the site.

## 🛠️ Technical Notes

### Data Persistence
- **localStorage**: Data saved locally in browser
- **Server**: For production, implement backend API for centralized data storage

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- localStorage support required

## 📊 Current Teams

**Team 1:** Sandeep (C), Praveen, Ashish Pandey, Sriram Moka, Damoder, Somashekhar

**Team 2:** Raja (C), Bhargav, Srinivasu BV, Gopal, Satish Adapa, Goutham

**Team 3:** Vijay (C), Kiran, Srinivas, Amit, Ashok, Cheris

**Team 4:** PD (C), Ramesh, Chaitanya, VenKee, Srinivasa Reddy Eeda, Jeevan

**Team 5:** Satish Patil (C), Vihang, Nagireddy, Ravindra, Sanjay, KSK

**Team 6:** Varun (C), Guna, Surya Sathi, Ramesh Naidu, Suryaprakash, Siva Kaku

## 🔮 Future Enhancements

1. **Backend Integration**: Connect to a database for centralized data
2. **Live Scoring**: Complete implementation of ball-by-ball scoring
3. **Player Statistics**: Individual player performance tracking
4. **Authentication**: Admin panel for authorized updates
5. **Mobile App**: Progressive Web App for mobile devices
6. **Push Notifications**: Real-time match updates

## 📧 Support

For any issues or questions, please check the GitHub repository or create an issue.

## 📄 License

This project is open-source and available for the Zenith Gully Cricket League tournament.

---

**Enjoy your tournament! 🏏🎉**
