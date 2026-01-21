import React, { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const PlusCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const AlertCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Download = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const TrendingUp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const ExternalLink = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const BarChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

function App() {
  const [bets, setBets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
    sport: '',
    betType: '',
    description: '',
    units: '',
    odds: '',
    result: 'pending',
    favoriteTeam: false,
    primeTime: false,
    systemPlay: 'none',
    notes: ''
  });

  const unitValue = 50;

  useEffect(() => {
    const q = query(collection(db, 'bets'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const betsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBets(betsData);
      setLoading(false);
    }, (error) => {
      console.error("Error loading bets:", error);
      setLoading(false);
      alert("Error connecting to database. Check your Firebase config in src/firebase.js");
    });

    return () => unsubscribe();
  }, []);

  const calculateRiskAndWin = (units, odds) => {
    const unitNum = parseFloat(units);
    const oddsNum = parseFloat(odds);
    
    if (oddsNum < 0) {
      const riskAmount = unitNum * unitValue * (Math.abs(oddsNum) / 100);
      const winAmount = unitNum * unitValue;
      return { risk: riskAmount, win: winAmount };
    } else {
      const riskAmount = unitNum * unitValue;
      const winAmount = unitNum * unitValue * (oddsNum / 100);
      return { risk: riskAmount, win: winAmount };
    }
  };

  const addBet = async () => {
    if (!formData.sport || !formData.betType || !formData.description || !formData.units || !formData.odds) {
      alert('Please fill in all required fields');
      return;
    }
    if (formData.betType === 'longshot-parlay' && parseFloat(formData.odds) < 500) {
      alert('Long shot parlays must be +500 or greater. Converting to regular parlay.');
      setFormData({...formData, betType: 'parlay'});
      return;
    }

    const { risk, win } = calculateRiskAndWin(formData.units, formData.odds);
    
    const newBet = {
      ...formData,
      units: parseFloat(formData.units),
      odds: parseFloat(formData.odds),
      riskAmount: risk,
      winAmount: win,
      timestamp: new Date(),
      payout: formData.result === 'win' 
        ? win
        : formData.result === 'loss'
        ? -risk
        : 0
    };

    try {
      await addDoc(collection(db, 'bets'), newBet);
      setFormData({
        date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        sport: '',
        betType: '',
        description: '',
        units: '',
        odds: '',
        result: 'pending',
        favoriteTeam: false,
        primeTime: false,
        systemPlay: 'none',
        notes: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding bet:", error);
      alert("Error adding bet: " + error.message);
    }
  };

  const updateBetResult = async (id, result) => {
    const bet = bets.find(b => b.id === id);
    if (!bet) return;

    const payout = result === 'win'
      ? bet.winAmount
      : result === 'loss'
      ? -bet.riskAmount
      : 0;

    try {
      await updateDoc(doc(db, 'bets', id), { result, payout });
    } catch (error) {
      console.error("Error updating bet:", error);
    }
  };

  const deleteBet = async (id) => {
    if (window.confirm('Are you sure you want to delete this bet?')) {
      try {
        await deleteDoc(doc(db, 'bets', id));
      } catch (error) {
        console.error("Error deleting bet:", error);
      }
    }
  };

  const stats = useMemo(() => {
    const settledBets = bets.filter(b => b.result !== 'pending');
    const totalDollars = settledBets.reduce((sum, bet) => sum + bet.payout, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthBets = settledBets.filter(bet => {
      const betDate = new Date(bet.date);
      return betDate.getMonth() === currentMonth && betDate.getFullYear() === currentYear;
    });
    const monthlyLoss = monthBets.reduce((sum, bet) => sum + bet.payout, 0);

    const byType = {};
    const bySport = {};
    settledBets.forEach(bet => {
      byType[bet.betType] = (byType[bet.betType] || 0) + bet.payout;
      bySport[bet.sport] = (bySport[bet.sport] || 0) + bet.payout;
    });

    const favoriteTeamBets = settledBets.filter(b => b.favoriteTeam);
    const primeTimeBets = settledBets.filter(b => b.primeTime);
    
    const systemBets = settledBets.filter(b => b.systemPlay !== 'none' && b.systemPlay !== 'not-system');
    const clearSystemBets = settledBets.filter(b => b.systemPlay === 'clear');
    const kindOfSystemBets = settledBets.filter(b => b.systemPlay === 'kind-of');
    const notSystemBets = settledBets.filter(b => b.systemPlay === 'not-system');

    return {
      totalDollars: totalDollars.toFixed(2),
      monthlyLoss: monthlyLoss.toFixed(2),
      totalBets: settledBets.length,
      wins: settledBets.filter(b => b.result === 'win').length,
      losses: settledBets.filter(b => b.result === 'loss').length,
      winRate: settledBets.length ? ((settledBets.filter(b => b.result === 'win').length / settledBets.length) * 100).toFixed(1) : 0,
      byType,
      bySport,
      favoriteTeamDollars: favoriteTeamBets.reduce((sum, bet) => sum + bet.payout, 0).toFixed(2),
      favoriteTeamRecord: `${favoriteTeamBets.filter(b => b.result === 'win').length}-${favoriteTeamBets.filter(b => b.result === 'loss').length}`,
      primeTimeDollars: primeTimeBets.reduce((sum, bet) => sum + bet.payout, 0).toFixed(2),
      primeTimeRecord: `${primeTimeBets.filter(b => b.result === 'win').length}-${primeTimeBets.filter(b => b.result === 'loss').length}`,
      systemDollars: systemBets.reduce((sum, bet) => sum + bet.payout, 0).toFixed(2),
      systemRecord: `${systemBets.filter(b => b.result === 'win').length}-${systemBets.filter(b => b.result === 'loss').length}`,
      systemWinRate: systemBets.length ? ((systemBets.filter(b => b.result === 'win').length / systemBets.length) * 100).toFixed(1) : 0,
      clearSystemDollars: clearSystemBets.reduce((sum, bet) => sum + bet.payout, 0).toFixed(2),
      clearSystemRecord: `${clearSystemBets.filter(b => b.result === 'win').length}-${clearSystemBets.filter(b => b.result === 'loss').length}`,
      kindOfSystemDollars: kindOfSystemBets.reduce((sum, bet) => sum + bet.payout, 0).toFixed(2),
      notSystemDollars: notSystemBets.reduce((sum, bet) => sum + bet.payout, 0).toFixed(2),
      kindOfSystemRecord: `${kindOfSystemBets.filter(b => b.result === 'win').length}-${kindOfSystemBets.filter(b => b.result === 'loss').length}`,
      notSystemRecord: `${notSystemBets.filter(b => b.result === 'win').length}-${notSystemBets.filter(b => b.result === 'loss').length}`,
      monthlyLossWarning: monthlyLoss < -1500,
      totalLossWarning: totalDollars < -5000
    };
  }, [bets]);

  const exportToCSV = () => {
    const headers = ['Date', 'Sport', 'Bet Type', 'Description', 'Units', 'Odds', 'Risk', 'To Win', 'Result', 'Payout', 'Favorite Team', 'Prime Time', 'System Play', 'Notes'];
    const rows = bets.map(bet => [
      bet.date,
      bet.sport,
      bet.betType,
      `"${bet.description}"`,
      bet.units,
      bet.odds,
      bet.riskAmount.toFixed(2),
      bet.winAmount.toFixed(2),
      bet.result,
      bet.payout.toFixed(2),
      bet.favoriteTeam ? 'Yes' : 'No',
      bet.primeTime ? 'Yes' : 'No',
      bet.systemPlay,
      `"${bet.notes || ''}"`
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `betting_tracker_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const resources = [
    { name: 'Scores & Odds', url: 'https://www.scoresandodds.com/', icon: '🎲' },
    { name: 'Action Network', url: 'https://www.actionnetwork.com/nfl/public-betting', icon: '📊' },
    { name: 'John Ewing', url: 'https://twitter.com/johnewing', icon: '🎯' },
    { name: 'Patrick Everson', url: 'https://twitter.com/PatrickE_Vegas', icon: '📈' },
    { name: 'DraftKings', url: 'https://sportsbook.draftkings.com/', icon: '🏈' }
  ];

  const quickAddButtons = [
    { label: '0.5u', value: 0.5 },
    { label: '1u', value: 1 },
    { label: '2u', value: 2 },
    { label: '3u', value: 3 },
    { label: '5u', value: 5 }
  ];

  const getSystemLabel = (systemPlay) => {
    const labels = {
      'clear': 'Clear System',
      'kind-of': 'Kind Of',
      'no-system': 'No System',
      'not-system': 'Anti System',
      'none': ''
    };
    return labels[systemPlay] || '';
  };

  const getSystemColor = (systemPlay) => {
    const colors = {
      'clear': 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      'kind-of': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      'no-system': 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
      'not-system': 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    };
    return colors[systemPlay] || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-xl text-gray-300">Loading your bets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-4 md:p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Sports Betting Tracker</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResources(!showResources)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-purple-700/80 transition-all text-sm md:text-base shadow-lg"
              >
                <BarChart />
                Resources
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-emerald-700/80 transition-all text-sm md:text-base shadow-lg"
              >
                <Download />
                Export
              </button>
            </div>
          </div>

          {showResources && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-white">
                <BarChart />
                Betting Intel Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all border border-white/20"
                  >
                    <span className="text-2xl">{resource.icon}</span>
                    <span className="text-sm font-medium flex-1 text-white">{resource.name}</span>
                    <ExternalLink />
                  </a>
                ))}
              </div>
            </div>
          )}

          {(stats.monthlyLossWarning || stats.totalLossWarning) && (
            <div className="mb-4 p-4 bg-rose-500/20 border border-rose-500/50 rounded-xl flex items-start gap-3 backdrop-blur-sm">
              <div className="flex-shrink-0 mt-0.5 text-rose-300">
                <AlertCircle />
              </div>
              <div>
                {stats.monthlyLossWarning && (
                  <p className="text-rose-200 font-medium text-sm md:text-base">⚠️ Monthly loss limit: ${Math.abs(stats.monthlyLoss)} / $1,500</p>
                )}
                {stats.totalLossWarning && (
                  <p className="text-rose-200 font-medium text-sm md:text-base">⚠️ Total loss threshold: ${Math.abs(stats.totalDollars)} / $5,000</p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 rounded-xl backdrop-blur-sm border border-blue-500/30 shadow-lg">
              <div className="text-xs md:text-sm text-blue-200 mb-1">Total P/L</div>
              <div className={`text-xl md:text-2xl font-bold ${parseFloat(stats.totalDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${stats.totalDollars}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-xl backdrop-blur-sm border border-purple-500/30 shadow-lg">
              <div className="text-xs md:text-sm text-purple-200 flex items-center gap-1 mb-1">
                This Month
                {stats.monthlyLossWarning && <span className="text-rose-400">⚠️</span>}
              </div>
              <div className={`text-xl md:text-2xl font-bold ${parseFloat(stats.monthlyLoss) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${stats.monthlyLoss}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 rounded-xl backdrop-blur-sm border border-emerald-500/30 shadow-lg">
              <div className="text-xs md:text-sm text-emerald-200 mb-1">Win Rate</div>
              <div className="text-xl md:text-2xl font-bold text-white">{stats.winRate}%</div>
              <div className="text-xs md:text-sm text-emerald-300">{stats.wins}W-{stats.losses}L</div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-4 rounded-xl backdrop-blur-sm border border-amber-500/30 shadow-lg">
              <div className="text-xs md:text-sm text-amber-200 mb-1">Total Bets</div>
              <div className="text-xl md:text-2xl font-bold text-white">{stats.totalBets}</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-4 rounded-xl mb-6 border border-purple-500/30 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp />
              <h3 className="font-bold text-base md:text-lg text-white">THE SYSTEM (Fade the Public)</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <div>
                <div className="text-xs md:text-sm text-purple-200">All System</div>
                <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.systemDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${stats.systemDollars}
                </div>
                <div className="text-xs text-purple-300">{stats.systemWinRate}%</div>
              </div>
              <div>
                <div className="text-xs md:text-sm text-purple-200">Clear</div>
                <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.clearSystemDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${stats.clearSystemDollars}
                </div>
                <div className="text-xs text-purple-300">{stats.clearSystemRecord}</div>
              </div>
              <div>
                <div className="text-xs md:text-sm text-purple-200">Kind Of</div>
                <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.kindOfSystemDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${stats.kindOfSystemDollars}
                </div>
                <div className="text-xs text-purple-300">{stats.kindOfSystemRecord}</div>
              </div>
              <div>
                <div className="text-xs md:text-sm text-purple-200">Anti System</div>
                <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.notSystemDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${stats.notSystemDollars}
                </div>
                <div className="text-xs text-purple-300">{stats.notSystemRecord}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 shadow-lg">
              <h3 className="font-semibold mb-2 text-sm md:text-base text-white">By Bet Type</h3>
              {Object.keys(stats.byType).length === 0 ? (
                <p className="text-sm text-slate-400">No settled bets</p>
              ) : (
                Object.entries(stats.byType).map(([type, dollars]) => (
                  <div key={type} className="flex justify-between text-sm py-1">
                    <span className="capitalize text-slate-300">{type}</span>
                    <span className={dollars >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {dollars >= 0 ? '+' : ''}${dollars.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 shadow-lg">
              <h3 className="font-semibold mb-2 text-sm md:text-base text-white">By Sport</h3>
              {Object.keys(stats.bySport).length === 0 ? (
                <p className="text-sm text-slate-400">No settled bets</p>
              ) : (
                Object.entries(stats.bySport).map(([sport, dollars]) => (
                  <div key={sport} className="flex justify-between text-sm py-1">
                    <span className="capitalize text-slate-300">{sport.toUpperCase()}</span>
                    <span className={dollars >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {dollars >= 0 ? '+' : ''}${dollars.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 p-3 rounded-xl backdrop-blur-sm border border-orange-500/30 shadow-lg">
              <div className="text-xs md:text-sm text-orange-200">Favorite Team</div>
              <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.favoriteTeamDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${stats.favoriteTeamDollars}
              </div>
              <div className="text-xs text-orange-300">{stats.favoriteTeamRecord}</div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 p-3 rounded-xl backdrop-blur-sm border border-indigo-500/30 shadow-lg">
              <div className="text-xs md:text-sm text-indigo-200">Prime Time</div>
              <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.primeTimeDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${stats.primeTimeDollars}
              </div>
              <div className="text-xs text-indigo-300">{stats.primeTimeRecord}</div>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg transition-all"
          >
            <PlusCircle />
            Add New Bet
          </button>
        </div>

        {showForm && (
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-4 md:p-6 mb-6 border border-white/20">
            <h2 className="text-xl font-bold mb-4 text-white">New Bet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">Sport</label>
                <select
                  value={formData.sport}
                  onChange={(e) => setFormData({...formData, sport: e.target.value})}
                  className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="nfl">NFL</option>
                  <option value="nba">NBA</option>
                  <option value="mlb">MLB</option>
                  <option value="nhl">NHL</option>
                  <option value="ncaaf">NCAAF</option>
                  <option value="ncaab">NCAAB</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">Bet Type</label>
                <select
                  value={formData.betType}
                  onChange={(e) => setFormData({...formData, betType: e.target.value})}
                  className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="straight">Straight</option>
                  <option value="over-under">Over/Under</option>
                  <option value="teaser">Teaser</option>
                  <option value="parlay">Parlay</option>
                  <option value="longshot-parlay">Long Shot Parlay (+500)</option>
                  <option value="prop">Prop</option>
                  <option value="future">Future</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">Units</label>
                <input
                  type="number"
                  step="0.25"
                  value={formData.units}
                  onChange={(e) => setFormData({...formData, units: e.target.value})}
                  className="w-full p-2 border border-slate-600 rounded-lg mb-2 bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 1, 2, 0.5"
                />
                <div className="flex gap-1 flex-wrap">
                  {quickAddButtons.map(btn => (
                    <button
                      key={btn.value}
                      type="button"
                      onClick={() => setFormData({...formData, units: btn.value.toString()})}
                      className="px-2 py-1 text-xs bg-slate-700/50 hover:bg-slate-600/50 rounded backdrop-blur-sm text-white transition-all"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
                {formData.units && formData.odds && (
                  <div className="text-xs text-slate-300 mt-2">
                    Risk: ${calculateRiskAndWin(formData.units, formData.odds).risk.toFixed(2)} | 
                    Win: ${calculateRiskAndWin(formData.units, formData.odds).win.toFixed(2)}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">Odds (American)</label>
                <input
                  type="number"
                  value={formData.odds}
                  onChange={(e) => setFormData({...formData, odds: e.target.value})}
                  className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., -110, +150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">Result</label>
                <select
                  value={formData.result}
                  onChange={(e) => setFormData({...formData, result: e.target.value})}
                  className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="win">Win</option>
                  <option value="loss">Loss</option>
                  <option value="push">Push</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-slate-200">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Chiefs -3 vs Bills"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-slate-200">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Reverse line movement from -7 to -6.5"
                  rows="2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-slate-200">System Play Classification</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, systemPlay: 'clear'})}
                    className={`p-2 border-2 rounded-lg text-sm transition-all ${formData.systemPlay === 'clear' ? 'border-purple-500 bg-purple-500/30 text-white' : 'border-slate-600 bg-slate-800/30 text-slate-300'}`}
                  >
                    Clear System
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, systemPlay: 'kind-of'})}
                    className={`p-2 border-2 rounded-lg text-sm transition-all ${formData.systemPlay === 'kind-of' ? 'border-blue-500 bg-blue-500/30 text-white' : 'border-slate-600 bg-slate-800/30 text-slate-300'}`}
                  >
                    Kind Of
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, systemPlay: 'no-system'})}
                    className={`p-2 border-2 rounded-lg text-sm transition-all ${formData.systemPlay === 'no-system' ? 'border-slate-500 bg-slate-500/30 text-white' : 'border-slate-600 bg-slate-800/30 text-slate-300'}`}
                  >
                    No System
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, systemPlay: 'not-system'})}
                    className={`p-2 border-2 rounded-lg text-sm transition-all ${formData.systemPlay === 'not-system' ? 'border-rose-500 bg-rose-500/30 text-white' : 'border-slate-600 bg-slate-800/30 text-slate-300'}`}
                  >
                    Anti System
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.favoriteTeam}
                    onChange={(e) => setFormData({...formData, favoriteTeam: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800/50 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-200">Favorite Team</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.primeTime}
                    onChange={(e) => setFormData({...formData, primeTime: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800/50 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-200">Prime Time Game</span>
                </label>
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button
                  onClick={addBet}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Add Bet
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-slate-700/50 text-slate-200 py-2 rounded-lg hover:bg-slate-600/50 backdrop-blur-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20">
          <h2 className="text-xl font-bold mb-4 text-white">Bet History</h2>
          <div className="space-y-3">
            {bets.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No bets yet. Add your first bet above!</p>
            ) : (
              bets.map(bet => (
                <div key={bet.id} className="border border-slate-700/50 rounded-xl p-4 hover:bg-white/5 transition-all backdrop-blur-sm bg-slate-800/30">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-white">{bet.description}</span>
                        {bet.favoriteTeam && <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded border border-orange-500/30">Fav Team</span>}
                        {bet.primeTime && <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">Prime Time</span>}
                        {bet.systemPlay !== 'none' && (
                          <span className={`text-xs px-2 py-0.5 rounded ${getSystemColor(bet.systemPlay)}`}>
                            {getSystemLabel(bet.systemPlay)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-300">
                        {bet.date} • {bet.sport.toUpperCase()} • {bet.betType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} • {bet.units} units @ {bet.odds > 0 ? '+' : ''}{bet.odds}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Risk: ${bet.riskAmount.toFixed(2)} | To Win: ${bet.winAmount.toFixed(2)}
                      </div>
                      {bet.notes && (
                        <div className="text-xs text-slate-400 mt-1 italic">
                          Note: {bet.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {bet.result === 'pending' ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateBetResult(bet.id, 'win')}
                            className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded hover:bg-emerald-500/30 border border-emerald-500/30 transition-all"
                          >
                            Win
                          </button>
                          <button
                            onClick={() => updateBetResult(bet.id, 'loss')}
                            className="px-2 py-1 bg-rose-500/20 text-rose-300 text-xs rounded hover:bg-rose-500/30 border border-rose-500/30 transition-all"
                          >
                            Loss
                          </button>
                          <button
                            onClick={() => updateBetResult(bet.id, 'push')}
                            className="px-2 py-1 bg-slate-500/20 text-slate-300 text-xs rounded hover:bg-slate-500/30 border border-slate-500/30 transition-all"
                          >
                            Push
                          </button>
                        </div>
                      ) : (
                        <div className={`font-semibold ${bet.payout > 0 ? 'text-emerald-400' : bet.payout < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                          {bet.payout > 0 ? '+' : ''}${bet.payout.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-700/50">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      bet.result === 'win' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      bet.result === 'loss' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      bet.result === 'push' ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {bet.result.toUpperCase()}
                    </span>
                    <button
                      onClick={() => deleteBet(bet.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
