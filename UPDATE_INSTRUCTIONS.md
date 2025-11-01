# 📝 HOW TO UPDATE MATCH RESULTS & STANDINGS

## ✨ AUTOMATIC STANDINGS CALCULATION

The website now automatically calculates all standings based on match results. You don't need to manually update wins, losses, points, or NRR anymore!

---

## 🎯 QUICK UPDATE GUIDE

### To Add a New Match Result:

1. **Go to the JSON Editor tab** on the website
2. **Select `matches.json`** from the dropdown
3. **Add your match result** to the `matches` array
4. **Click Save Changes**
5. **Standings will automatically update!**

---

## 📋 MATCH RESULT FORMAT

Add matches to the `matches` array in `matches.json`:

```json
{
  "match_id": 4,
  "date": "2025-11-01",
  "time": "15:00",
  "pool": "B",
  "team1": "Team 4",
  "team2": "Team 5",
  "status": "completed",
  "winner": "Team 4",
  "team1_score": 55,
  "team1_wickets": 4,
  "team1_overs": 7,
  "team2_score": 48,
  "team2_wickets": 6,
  "team2_overs": 7
}
```

### Field Explanations:
- **match_id**: Unique match number
- **pool**: "A" or "B" or "Knockout"
- **status**: "completed" for finished matches
- **winner**: Name of winning team (or "tie" for tied match)
- **team1_score/team2_score**: Total runs scored
- **team1_wickets/team2_wickets**: Wickets lost
- **team1_overs/team2_overs**: Overs bowled (max 7)

---

## 🏏 CURRENT MATCH RESULTS TO UPDATE

### Pool B Matches (Afternoon Session)
When Pool B matches are completed, add them like this:

```json
{
  "match_id": 4,
  "date": "2025-11-01",
  "time": "15:00",
  "pool": "B",
  "team1": "Team 4",
  "team2": "Team 5",
  "status": "completed",
  "winner": "Team 4",
  "team1_score": 52,
  "team1_wickets": 3,
  "team1_overs": 7,
  "team2_score": 45,
  "team2_wickets": 5,
  "team2_overs": 7
}
```

---

## 🔄 ALTERNATIVE: UPDATE VIA TOURNAMENT.JSON

You can also update match results in `tournament.json` by editing the fixtures:

```json
{
  "match_id": 4,
  "round": "Pool B",
  "date": "2025-11-01",
  "time": "15:00",
  "team1": "Team 4",
  "team2": "Team 5",
  "status": "completed",
  "result": "Team 4 won by 7 runs",
  "innings": [
    {
      "batting_team": "Team 4",
      "score": 52,
      "wickets": 3,
      "overs": 7
    },
    {
      "batting_team": "Team 5",
      "score": 45,
      "wickets": 5,
      "overs": 7
    }
  ]
}
```

---

## 📊 WHAT GETS CALCULATED AUTOMATICALLY

When you save match results, the system automatically calculates:

✅ **Team Statistics:**
- Matches Played
- Wins & Losses  
- Points (2 for win, 1 for tie, 0 for loss)
- Total Runs Scored & Conceded
- Net Run Rate (NRR)

✅ **Pool Standings:**
- Position/Rank
- Qualified teams for semifinals

✅ **Tournament Progress:**
- Pool completion status
- Semifinal matchups
- Tournament statistics

---

## 💡 TIPS FOR EASY UPDATES

### Using Live Score Feature:
1. Go to **Live Score** tab
2. Select the match
3. Enter ball-by-ball scores
4. System saves automatically when match ends

### Bulk Update via JSON:
1. Download current `matches.json`
2. Edit in any text editor
3. Add multiple match results
4. Upload back via JSON Editor

### Quick Edit Method:
1. JSON Editor tab → Select file
2. Find the match in fixtures
3. Change `status` to "completed"
4. Add scores and winner
5. Save Changes

---

## 🔍 CHECKING STANDINGS

After updating matches:
1. **Dashboard Tab**: Shows current Pool standings
2. **Teams Tab**: Shows individual team stats
3. **Fixtures Tab**: Shows completed & upcoming matches

---

## 📝 EXAMPLE: Updating Pool B Match

**Before (in matches.json):**
```json
{
  "matches": [
    // existing Pool A matches here
  ]
}
```

**After adding Pool B Match 1:**
```json
{
  "matches": [
    // existing Pool A matches here,
    {
      "match_id": 4,
      "date": "2025-11-01",
      "time": "15:00",
      "pool": "B",
      "team1": "Team 4",
      "team2": "Team 5",
      "status": "completed",
      "winner": "Team 5",
      "team1_score": 43,
      "team1_wickets": 6,
      "team1_overs": 6.4,
      "team2_score": 44,
      "team2_wickets": 3,
      "team2_overs": 5.2
    }
  ]
}
```

**Result**: Team 5 gets 2 points, standings update automatically!

---

## ⚠️ IMPORTANT NOTES

1. **Don't manually edit** wins/losses/points in teams.json - they're calculated automatically
2. **Match IDs must be unique** - use 1-9 for pool/knockout matches
3. **Team names must match exactly** - "Team 1" not "team 1" or "Team1"
4. **Save changes** after editing to trigger recalculation
5. **Refresh page** if standings don't update immediately

---

## 🆘 TROUBLESHOOTING

**Standings not updating?**
- Check match has `"status": "completed"`
- Verify team names match exactly
- Ensure winner field is set
- Try refreshing the page

**JSON Editor shows error?**
- Check for missing commas
- Verify all quotes are closed
- Use JSON validator online

**Need to reset everything?**
- Download all JSON files first (backup)
- Clear browser localStorage
- Reload the page

---

## 📧 QUICK REFERENCE

**Pool A Results (Completed):**
- Match 1: Team 1 (49) beat Team 2 (32)
- Match 2: Team 3 (40) beat Team 2 (35)  
- Match 3: Team 3 (39) beat Team 1 (35)

**Pool B Matches (To Update):**
- Match 4: Team 4 vs Team 5 (3:00 PM)
- Match 5: Team 5 vs Team 6 (3:45 PM)
- Match 6: Team 4 vs Team 6 (4:30 PM)

**Semifinals Qualified:**
- Team 3 (Pool A Winner)
- Team 1 (Pool A Runner-up)
- Awaiting Pool B results...

---

*Last Updated: November 1, 2025*
*System Version: Auto-Calculate v2.0*
