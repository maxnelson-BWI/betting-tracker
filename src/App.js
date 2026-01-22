import React, { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import './animations.css';

// Icon Components
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

const DollarSign = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const Edit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const PowerOff = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
    <line x1="12" y1="2" x2="12" y2="12"></line>
  </svg>
);

const Home = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const Clock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const MoreHorizontal = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

const Menu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const X = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Filter = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

// SVG Horse Animations
const GallopingHorse = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="custom-bounce">
    <text x="100" y="100" fontSize="120" textAnchor="middle" dominantBaseline="middle">🐴</text>
  </svg>
);

const RearingHorse = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="custom-spin">
    <text x="100" y="100" fontSize="120" textAnchor="middle" dominantBaseline="middle">🏇</text>
  </svg>
);

const RacingHorse = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="custom-pulse">
    <text x="100" y="100" fontSize="120" textAnchor="middle" dominantBaseline="middle">🐎</text>
  </svg>
);

// SVG Bird Animations
const SoaringBird = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="custom-bounce">
    <text x="100" y="100" fontSize="120" textAnchor="middle" dominantBaseline="middle">🦅</text>
  </svg>
);

const SwoopingBird = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="custom-bounce">
    <text x="100" y="100" fontSize="120" textAnchor="middle" dominantBaseline="middle">🦜</text>
  </svg>
);

const FlyingBird = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="custom-pulse">
    <text x="100" y="100" fontSize="120" textAnchor="middle" dominantBaseline="middle">🐦</text>
  </svg>
);

// SVG Lock Animations
const ClickingLock = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="custom-pulse">
    <text x="100" y="100" fontSize="120" textAnchor="middle" dominantBaseline="middle">🔒</text>
  </svg>
);

const SparkleLock = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="custom-spin">
    <text x="100" y="100" fontSize="120" textAnchor="middle" dominantBaseline="middle">🔐</text>
  </svg>
);

const VaultLock = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="custom-bounce">
    <text x="100" y="100" fontSize="120" textAnchor="middle" dominantBaseline="middle">🔓</text>
  </svg>
);

function App() {
  const [bets, setBets] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [showAddBetModal, setShowAddBetModal] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingBet, setEditingBet] = useState(null);
  const [warningModal, setWarningModal] = useState({ show: false, message: '', type: '' });
  
  // Settings state
  const [displayMode, setDisplayMode] = useState(() => {
    return localStorage.getItem('displayMode') || 'dollars';
  });
  const [unitValue, setUnitValue] = useState(() => {
    return parseFloat(localStorage.getItem('unitValue')) || 50;
  });
  const [monthlyLimit, setMonthlyLimit] = useState(() => {
    return parseFloat(localStorage.getItem('monthlyLimit')) || 1500;
  });
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      bigBet: { enabled: true, threshold: 4 },
      favoriteTeam: { enabled: true, threshold: 0.75 },
      monthlyLimit: { enabled: true }
    };
  });
  
  const [retirementEndDate, setRetirementEndDate] = useState(() => {
    const saved = localStorage.getItem('retirementEndDate');
    return saved ? new Date(saved) : null;
  });
  const [showRetirementModal, setShowRetirementModal] = useState(false);
  const [retirementDays, setRetirementDays] = useState(7);
  
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

  // History page filters
  const [historyFilter, setHistoryFilter] = useState({
    timeRange: '30days',
    sport: 'all',
    betType: 'all',
    result: 'all',
    favoriteUnderdog: 'all',
    overUnder: 'all'
  });
  const [showAllBets, setShowAllBets] = useState(false);

  // Animation state
  const [animation, setAnimation] = useState({ show: false, type: '', content: null, isStreak: false, streakText: '' });
  const [winStreak, setWinStreak] = useState(0);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('displayMode', displayMode);
  }, [displayMode]);

  useEffect(() => {
    localStorage.setItem('unitValue', unitValue.toString());
  }, [unitValue]);

  useEffect(() => {
    localStorage.setItem('monthlyLimit', monthlyLimit.toString());
  }, [monthlyLimit]);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    if (retirementEndDate) {
      localStorage.setItem('retirementEndDate', retirementEndDate.toISOString());
    } else {
      localStorage.removeItem('retirementEndDate');
    }
  }, [retirementEndDate]);

  // Check if retirement has expired
  useEffect(() => {
    if (retirementEndDate && new Date() > retirementEndDate) {
      setRetirementEndDate(null);
    }
  }, [retirementEndDate]);

  const isRetired = retirementEndDate && new Date() < retirementEndDate;

  const daysUntilRetirementEnds = isRetired 
    ? Math.ceil((retirementEndDate - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleRetirement = () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + retirementDays);
    setRetirementEndDate(endDate);
    setShowRetirementModal(false);
  };

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

  const formatMoney = (dollarAmount) => {
    if (displayMode === 'units') {
      const units = dollarAmount / unitValue;
      return `${units >= 0 ? '+' : ''}${units.toFixed(2)}u`;
    } else {
      return `${dollarAmount >= 0 ? '+' : ''}$${Math.abs(dollarAmount).toFixed(2)}`;
    }
  };

  const formatMoneyNoSign = (dollarAmount) => {
    if (displayMode === 'units') {
      const units = Math.abs(dollarAmount) / unitValue;
      return `${units.toFixed(2)}u`;
    } else {
      return `$${Math.abs(dollarAmount).toFixed(2)}`;
    }
  };

  const toggleDisplayMode = () => {
    setDisplayMode(prev => prev === 'dollars' ? 'units' : 'dollars');
  };

  const formatBetType = (type) => {
    if (type === 'money-line') return 'ML';
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getSportEmoji = (sport) => {
    const emojis = {
      'nfl': '🏈',
      'nba': '🏀',
      'mlb': '⚾',
      'nhl': '🏒',
      'ncaaf': '🏈',
      'ncaab': '🏀',
      'other': '🎯'
    };
    return emojis[sport?.toLowerCase()] || '🎯';
  };

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

  // Parse odds to determine favorite/underdog and over/under
  const parseBetDetails = (bet) => {
    const odds = parseFloat(bet.odds);
    const favoriteUnderdog = odds < 0 ? 'favorite' : odds > 0 ? 'underdog' : 'even';
    
    // Check description or odds field for O/U notation
    const desc = bet.description?.toLowerCase() || '';
    const oddsStr = bet.odds?.toString() || '';
    let overUnder = 'none';
    
    if (desc.includes('over') || oddsStr.match(/^o\s?\d/i)) {
      overUnder = 'over';
    } else if (desc.includes('under') || oddsStr.match(/^u\s?\d/i)) {
      overUnder = 'under';
    }
    
    return { favoriteUnderdog, overUnder };
  };

  const checkWarnings = () => {
    const units = parseFloat(formData.units);
    
    // Warning 1: Betting more than threshold units
    if (notificationSettings.bigBet.enabled && units > notificationSettings.bigBet.threshold) {
      return {
        show: true,
        message: 'This is a really big bet. Are you sure?',
        type: 'big-bet'
      };
    }

    // Warning 2: Favorite team + larger than threshold of recent bets
    if (notificationSettings.favoriteTeam.enabled && formData.favoriteTeam) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const recentBets = bets.filter(bet => {
        const betDate = new Date(bet.date);
        return betDate.getMonth() === currentMonth && betDate.getFullYear() === currentYear;
      });

      if (recentBets.length > 0) {
        const sortedUnits = recentBets.map(b => b.units).sort((a, b) => a - b);
        const percentileIndex = Math.floor(sortedUnits.length * notificationSettings.favoriteTeam.threshold);
        const percentileValue = sortedUnits[percentileIndex];

        if (units > percentileValue) {
          return {
            show: true,
            message: 'Are you only doing this because your favorite team is playing?',
            type: 'favorite-team',
            buttonYes: 'No. I want to keep it',
            buttonNo: 'Yeah. I should lower it'
          };
        }
      }
    }

    // Warning 3: Down more than monthly limit
    if (notificationSettings.monthlyLimit.enabled) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthBets = bets.filter(bet => {
        const betDate = new Date(bet.date);
        return betDate.getMonth() === currentMonth && betDate.getFullYear() === currentYear && bet.result !== 'pending';
      });
      const monthlyLoss = monthBets.reduce((sum, bet) => sum + bet.payout, 0);

      if (monthlyLoss < -monthlyLimit) {
        return {
          show: true,
          message: 'You are down over your monthly limit. Are you sure you want to put this in?',
          type: 'monthly-limit'
        };
      }
    }

    return { show: false, message: '', type: '' };
  };

  const handleAddBet = () => {
    if (!formData.sport || !formData.betType || !formData.description || !formData.units || !formData.odds) {
      alert('Please fill in all required fields');
      return;
    }
    if (formData.betType === 'longshot-parlay' && parseFloat(formData.odds) < 500) {
      alert('Long shot parlays must be +500 or greater. Converting to regular parlay.');
      setFormData({...formData, betType: 'parlay'});
      return;
    }

    const warning = checkWarnings();
    if (warning.show) {
      setWarningModal(warning);
    } else {
      addBet();
    }
  };

  const addBet = async () => {
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
      setShowAddBetModal(false);
      setWarningModal({ show: false, message: '', type: '' });
    } catch (error) {
      console.error("Error adding bet:", error);
      alert("Error adding bet: " + error.message);
    }
  };

  const startEdit = (bet) => {
    setEditingBet(bet.id);
    setFormData({
      date: bet.date,
      sport: bet.sport,
      betType: bet.betType,
      description: bet.description,
      units: bet.units.toString(),
      odds: bet.odds.toString(),
      result: bet.result,
      favoriteTeam: bet.favoriteTeam || false,
      primeTime: bet.primeTime || false,
      systemPlay: bet.systemPlay || 'none',
      notes: bet.notes || ''
    });
    setShowAddBetModal(true);
  };

  const saveEdit = async () => {
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
    
    const updatedBet = {
      ...formData,
      units: parseFloat(formData.units),
      odds: parseFloat(formData.odds),
      riskAmount: risk,
      winAmount: win,
      payout: formData.result === 'win' 
        ? win
        : formData.result === 'loss'
        ? -risk
        : 0
    };

    try {
      await updateDoc(doc(db, 'bets', editingBet), updatedBet);
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
      setShowAddBetModal(false);
      setEditingBet(null);
    } catch (error) {
      console.error("Error updating bet:", error);
      alert("Error updating bet: " + error.message);
    }
  };

  const cancelEdit = () => {
    setEditingBet(null);
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
    setShowAddBetModal(false);
  };

  const getRandomWinAnimation = () => {
    const emojiAnimations = [
      { type: 'emoji', content: '🐴' },
      { type: 'emoji', content: '🏇' },
      { type: 'emoji', content: '🐎' },
      { type: 'emoji', content: '🦅' },
      { type: 'emoji', content: '🐦' },
      { type: 'emoji', content: '🦆' },
      { type: 'emoji', content: '🦜' },
      { type: 'emoji', content: '🐧' },
      { type: 'emoji', content: '💰' },
      { type: 'emoji', content: '💵' }
    ];

    const svgAnimations = [
      { type: 'svg', content: <GallopingHorse /> },
      { type: 'svg', content: <RearingHorse /> },
      { type: 'svg', content: <RacingHorse /> },
      { type: 'svg', content: <SoaringBird /> },
      { type: 'svg', content: <SwoopingBird /> },
      { type: 'svg', content: <FlyingBird /> },
      { type: 'svg', content: <ClickingLock /> },
      { type: 'svg', content: <SparkleLock /> },
      { type: 'svg', content: <VaultLock /> }
    ];

    const allAnimations = [...emojiAnimations, ...svgAnimations];
    return allAnimations[Math.floor(Math.random() * allAnimations.length)];
  };

  const getStreakText = () => {
    const texts = [
      "ON FIRE!",
      "HE'S HEATING UP!",
      "BOOMSHAKALAKA!",
      "FROM DOWNTOWN!",
      "CAN'T MISS!"
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const triggerAnimation = (result) => {
    if (result === 'win') {
      const newStreak = winStreak + 1;
      setWinStreak(newStreak);
      
      const winAnim = getRandomWinAnimation();
      setAnimation({
        show: true,
        type: 'win',
        content: winAnim.content,
        contentType: winAnim.type,
        isStreak: newStreak >= 3,
        streakText: newStreak >= 3 ? getStreakText() : ''
      });
    } else if (result === 'loss') {
      setWinStreak(0);
      setAnimation({
        show: true,
        type: 'loss',
        content: '❌',
        contentType: 'emoji',
        isStreak: false,
        streakText: ''
      });
    } else {
      return;
    }

    setTimeout(() => {
      setAnimation({ show: false, type: '', content: null, contentType: '', isStreak: false, streakText: '' });
    }, 2000);
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
      triggerAnimation(result);
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
    
    const systemBets = settledBets.filter(b => b.systemPlay === 'clear' || b.systemPlay === 'kind-of');
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
      monthlyLossWarning: monthlyLoss < -monthlyLimit,
      totalLossWarning: totalDollars < -5000
    };
  }, [bets, monthlyLimit]);

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
      'clear': 'bg-purple-500/20 text-emerald-300 border border-emerald-500/30',
      'kind-of': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      'no-system': 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
      'not-system': 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    };
    return colors[systemPlay] || '';
  };

  // Filter bets for history page
  const getFilteredBets = () => {
    let filtered = [...bets];

    // Time range filter
    if (historyFilter.timeRange === '30days' && !showAllBets) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(bet => new Date(bet.date) >= thirtyDaysAgo);
    }

    // Sport filter
    if (historyFilter.sport !== 'all') {
      filtered = filtered.filter(bet => bet.sport === historyFilter.sport);
    }

    // Bet type filter
    if (historyFilter.betType !== 'all') {
      filtered = filtered.filter(bet => bet.betType === historyFilter.betType);
    }

    // Result filter
    if (historyFilter.result !== 'all') {
      filtered = filtered.filter(bet => bet.result === historyFilter.result);
    }

    // Favorite/Underdog filter
    if (historyFilter.favoriteUnderdog !== 'all') {
      filtered = filtered.filter(bet => {
        const { favoriteUnderdog } = parseBetDetails(bet);
        return favoriteUnderdog === historyFilter.favoriteUnderdog;
      });
    }

    // Over/Under filter
    if (historyFilter.overUnder !== 'all') {
      filtered = filtered.filter(bet => {
        const { overUnder } = parseBetDetails(bet);
        return overUnder === historyFilter.overUnder;
      });
    }

    return filtered;
  };

  const filteredBets = getFilteredBets();

  // Get recent bets for home page
  const recentBets = bets.slice(0, 5);
  const pendingBets = bets.filter(b => b.result === 'pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
        <div className="text-xl text-gray-300">Loading your bets...</div>
      </div>
    );
  }

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'history':
        return <HistoryPage />;
      case 'more':
        return <MorePage />;
      default:
        return <HomePage />;
    }
  };

  // HOME PAGE COMPONENT
  const HomePage = () => (
    <div className="pb-20 animate-fadeIn">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-4 md:p-6 mb-6 border border-white/20">
        {(stats.monthlyLossWarning || stats.totalLossWarning) && (
          <div className="mb-4 p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl flex items-start gap-3 backdrop-blur-sm">
            <div className="flex-shrink-0 mt-0.5 text-rose-300">
              <AlertCircle />
            </div>
            <div>
              {stats.monthlyLossWarning && (
                <p className="text-rose-200 font-medium text-sm md:text-base">⚠️ Monthly loss limit: {formatMoneyNoSign(stats.monthlyLoss)} / ${monthlyLimit}</p>
              )}
              {stats.totalLossWarning && (
                <p className="text-rose-200 font-medium text-sm md:text-base">⚠️ Total loss threshold: {formatMoneyNoSign(stats.totalDollars)} / $5,000</p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 rounded-2xl backdrop-blur-sm border border-blue-500/30 shadow-xl">
            <div className="text-xs md:text-sm text-blue-200 mb-1">Total P/L</div>
            <div className={`text-xl md:text-2xl font-bold ${parseFloat(stats.totalDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatMoney(parseFloat(stats.totalDollars))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 rounded-2xl backdrop-blur-sm border border-emerald-500/30 shadow-xl">
            <div className="text-xs md:text-sm text-emerald-200 flex items-center gap-1 mb-1">
              This Month
              {stats.monthlyLossWarning && <span className="text-rose-400">⚠️</span>}
            </div>
            <div className={`text-xl md:text-2xl font-bold ${parseFloat(stats.monthlyLoss) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatMoney(parseFloat(stats.monthlyLoss))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 rounded-2xl backdrop-blur-sm border border-emerald-500/30 shadow-xl">
            <div className="text-xs md:text-sm text-emerald-200 mb-1">Win Rate</div>
            <div className="text-xl md:text-2xl font-bold text-white">{stats.winRate}%</div>
            <div className="text-xs md:text-sm text-emerald-300">{stats.wins}W-{stats.losses}L</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-4 rounded-2xl backdrop-blur-sm border border-amber-500/30 shadow-xl">
            <div className="text-xs md:text-sm text-amber-200 mb-1">Total Bets</div>
            <div className="text-xl md:text-2xl font-bold text-white">{stats.totalBets}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 p-4 rounded-2xl mb-6 border border-emerald-500/30 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp />
            <h3 className="font-bold text-base md:text-lg text-white">THE SYSTEM (Fade the Public)</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <div>
              <div className="text-xs md:text-sm text-emerald-200">All System</div>
              <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.systemDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatMoney(parseFloat(stats.systemDollars))}
              </div>
              <div className="text-xs text-emerald-300">{stats.systemWinRate}%</div>
            </div>
            <div>
              <div className="text-xs md:text-sm text-emerald-200">Clear</div>
              <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.clearSystemDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatMoney(parseFloat(stats.clearSystemDollars))}
              </div>
              <div className="text-xs text-emerald-300">{stats.clearSystemRecord}</div>
            </div>
            <div>
              <div className="text-xs md:text-sm text-emerald-200">Kind Of</div>
              <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.kindOfSystemDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatMoney(parseFloat(stats.kindOfSystemDollars))}
              </div>
              <div className="text-xs text-emerald-300">{stats.kindOfSystemRecord}</div>
            </div>
            <div>
              <div className="text-xs md:text-sm text-emerald-200">Anti System</div>
              <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.notSystemDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatMoney(parseFloat(stats.notSystemDollars))}
              </div>
              <div className="text-xs text-emerald-300">{stats.notSystemRecord}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 shadow-xl">
            <h3 className="font-semibold mb-2 text-sm md:text-base text-white">By Bet Type</h3>
            {Object.keys(stats.byType).length === 0 ? (
              <p className="text-sm text-slate-400">No settled bets</p>
            ) : (
              Object.entries(stats.byType).map(([type, dollars]) => (
                <div key={type} className="flex justify-between text-sm py-1">
                  <span className="text-slate-300">{formatBetType(type)}</span>
                  <span className={dollars >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {formatMoney(dollars)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 shadow-xl">
            <h3 className="font-semibold mb-2 text-sm md:text-base text-white">By Sport</h3>
            {Object.keys(stats.bySport).length === 0 ? (
              <p className="text-sm text-slate-400">No settled bets</p>
            ) : (
              Object.entries(stats.bySport).map(([sport, dollars]) => (
                <div key={sport} className="flex justify-between text-sm py-1">
                  <span className="text-slate-300">{sport.toUpperCase()}</span>
                  <span className={dollars >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {formatMoney(dollars)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 p-3 rounded-2xl backdrop-blur-sm border border-orange-500/30 shadow-xl">
            <div className="text-xs md:text-sm text-orange-200">Favorite Team</div>
            <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.favoriteTeamDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatMoney(parseFloat(stats.favoriteTeamDollars))}
            </div>
            <div className="text-xs text-orange-300">{stats.favoriteTeamRecord}</div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 p-3 rounded-2xl backdrop-blur-sm border border-indigo-500/30 shadow-xl">
            <div className="text-xs md:text-sm text-indigo-200">Prime Time</div>
            <div className={`text-lg md:text-xl font-bold ${parseFloat(stats.primeTimeDollars) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatMoney(parseFloat(stats.primeTimeDollars))}
            </div>
            <div className="text-xs text-indigo-300">{stats.primeTimeRecord}</div>
          </div>
        </div>
      </div>

      {/* Pending Bets Section */}
      {pendingBets.length > 0 && (
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-4 md:p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-bold mb-4 text-white">Pending Bets ({pendingBets.length})</h2>
          <div className="space-y-3">
            {pendingBets.map(bet => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Bets Section */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Bets</h2>
          <button
            onClick={() => setCurrentPage('history')}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {recentBets.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No bets yet. Add your first bet!</p>
          ) : (
            recentBets.map(bet => (
              <BetCard key={bet.id} bet={bet} />
            ))
          )}
        </div>
      </div>
    </div>
  );

  // HISTORY PAGE COMPONENT
  const HistoryPage = () => (
    <div className="pb-20 animate-fadeIn">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20">
        <h2 className="text-xl font-bold mb-4 text-white">Bet History</h2>
        
        {/* Filter Pills */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter />
            <button
              onClick={() => setHistoryFilter({...historyFilter, sport: 'all'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                historyFilter.sport === 'all' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              All Sports
            </button>
            {['nfl', 'nba', 'mlb', 'nhl', 'ncaaf', 'ncaab'].map(sport => (
              <button
                key={sport}
                onClick={() => setHistoryFilter({...historyFilter, sport})}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  historyFilter.sport === sport 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                {sport.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setHistoryFilter({...historyFilter, betType: 'all'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                historyFilter.betType === 'all' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              All Types
            </button>
            {['straight', 'money-line', 'over-under', 'parlay', 'teaser', 'prop'].map(type => (
              <button
                key={type}
                onClick={() => setHistoryFilter({...historyFilter, betType: type})}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  historyFilter.betType === type 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                {formatBetType(type)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setHistoryFilter({...historyFilter, result: 'all'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                historyFilter.result === 'all' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              All Results
            </button>
            {['win', 'loss', 'push', 'pending'].map(result => (
              <button
                key={result}
                onClick={() => setHistoryFilter({...historyFilter, result})}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  historyFilter.result === result 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                {result.charAt(0).toUpperCase() + result.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setHistoryFilter({...historyFilter, favoriteUnderdog: 'all'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                historyFilter.favoriteUnderdog === 'all' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              Fav/Dog
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, favoriteUnderdog: 'favorite'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                historyFilter.favoriteUnderdog === 'favorite' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, favoriteUnderdog: 'underdog'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                historyFilter.favoriteUnderdog === 'underdog' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              Underdogs
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setHistoryFilter({...historyFilter, overUnder: 'all'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                historyFilter.overUnder === 'all' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              O/U
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, overUnder: 'over'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                historyFilter.overUnder === 'over' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              Overs
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, overUnder: 'under'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                historyFilter.overUnder === 'under' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              Unders
            </button>
          </div>
        </div>

        {/* Time Range Toggle - Bigger and More Prominent */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setShowAllBets(false)}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
              !showAllBets
                ? 'bg-emerald-600 text-white shadow-xl'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setShowAllBets(true)}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
              showAllBets
                ? 'bg-emerald-600 text-white shadow-xl'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            All Time
          </button>
        </div>

        {/* Filter Stats Box */}
        {filteredBets.length > 0 && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-2xl mb-4 border border-emerald-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-200 mb-1">Current Filter</div>
                <div className="text-sm font-medium text-white">
                  {historyFilter.sport !== 'all' && `${historyFilter.sport.toUpperCase()} • `}
                  {historyFilter.betType !== 'all' && `${formatBetType(historyFilter.betType)} • `}
                  {historyFilter.result !== 'all' && `${historyFilter.result.charAt(0).toUpperCase() + historyFilter.result.slice(1)} • `}
                  {historyFilter.favoriteUnderdog !== 'all' && `${historyFilter.favoriteUnderdog === 'favorite' ? 'Favorites' : 'Underdogs'} • `}
                  {historyFilter.overUnder !== 'all' && `${historyFilter.overUnder === 'over' ? 'Overs' : 'Unders'} • `}
                  {historyFilter.sport === 'all' && historyFilter.betType === 'all' && historyFilter.result === 'all' && historyFilter.favoriteUnderdog === 'all' && historyFilter.overUnder === 'all' && 'All Bets'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-emerald-200 mb-1">Record & P/L</div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">
                    {filteredBets.filter(b => b.result === 'win').length}-{filteredBets.filter(b => b.result === 'loss').length}
                  </span>
                  <span className={`text-lg font-bold ${filteredBets.reduce((sum, b) => sum + b.payout, 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatMoney(filteredBets.reduce((sum, b) => sum + b.payout, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-slate-300 mb-4">
          Showing {filteredBets.length} {filteredBets.length === 1 ? 'bet' : 'bets'}
          {!showAllBets && ' (Last 30 days)'}
        </div>

        <div className="space-y-3">
          {filteredBets.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No bets match your filters</p>
          ) : (
            filteredBets.map(bet => (
              <BetCard key={bet.id} bet={bet} showActions />
            ))
          )}
        </div>
      </div>
    </div>
  );

  // MORE PAGE COMPONENT
  const MorePage = () => (
    <div className="pb-20 animate-fadeIn">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-4 md:p-6 mb-6 border border-white/20">
        <h2 className="text-xl font-bold mb-4 text-white">Resources</h2>
        <div className="grid grid-cols-1 gap-3">
          {resources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all border border-white/20"
            >
              <span className="text-3xl">{resource.icon}</span>
              <span className="text-base font-medium flex-1 text-white">{resource.name}</span>
              <ExternalLink />
            </a>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20">
        <h2 className="text-xl font-bold mb-4 text-white">Actions</h2>
        <div className="space-y-3">
          <button
            onClick={exportToCSV}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/80 backdrop-blur-sm text-white rounded-2xl hover:bg-emerald-700/80 transition-all shadow-xl"
          >
            <Download />
            Export Bet History
          </button>
          
          <button
            onClick={() => setShowRetirementModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-600 to-red-600 backdrop-blur-sm text-white rounded-2xl hover:from-rose-700 hover:to-red-700 transition-all shadow-xl font-semibold border-2 border-rose-500/50"
          >
            <PowerOff />
            RETIRE
          </button>
        </div>
      </div>
    </div>
  );

  // BET CARD COMPONENT
  const BetCard = ({ bet, showActions = false }) => (
    <div className="border border-slate-700/50 rounded-2xl p-4 hover:bg-white/5 hover:shadow-xl transition-all duration-200 backdrop-blur-sm bg-slate-800/40 shadow-xl">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-2xl">{getSportEmoji(bet.sport)}</span>
            <span className="font-semibold text-white">{bet.description}</span>
            {bet.favoriteTeam && <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/30">Fav Team</span>}
            {bet.primeTime && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">Prime Time</span>}
            {bet.systemPlay !== 'none' && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getSystemColor(bet.systemPlay)}`}>
                {getSystemLabel(bet.systemPlay)}
              </span>
            )}
          </div>
          <div className="text-sm text-slate-300">
            {bet.date} • {bet.sport.toUpperCase()} • {formatBetType(bet.betType)} • {bet.units} units @ {bet.odds > 0 ? '+' : ''}{bet.odds}
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
                className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-lg hover:bg-emerald-500/30 border border-emerald-500/30 transition-all"
                disabled={isRetired}
              >
                Win
              </button>
              <button
                onClick={() => updateBetResult(bet.id, 'loss')}
                className="px-2 py-1 bg-rose-500/20 text-rose-300 text-xs rounded-lg hover:bg-rose-500/30 border border-rose-500/30 transition-all"
                disabled={isRetired}
              >
                Loss
              </button>
              <button
                onClick={() => updateBetResult(bet.id, 'push')}
                className="px-2 py-1 bg-slate-500/20 text-slate-300 text-xs rounded hover:bg-slate-500/30 border border-slate-500/30 transition-all"
                disabled={isRetired}
              >
                Push
              </button>
            </div>
          ) : (
            <div className={`font-semibold ${bet.payout > 0 ? 'text-emerald-400' : bet.payout < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {formatMoney(bet.payout)}
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
        {showActions && !isRetired && (
          <div className="flex gap-2">
            <button
              onClick={() => startEdit(bet)}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Edit />
              Edit
            </button>
            <button
              onClick={() => deleteBet(bet.id)}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ADD BET MODAL COMPONENT
  const AddBetModal = () => (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={cancelEdit}
    >
      <div 
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-3xl w-full max-w-2xl overflow-y-auto border-t border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          minHeight: '80vh',
          maxHeight: '80vh'
        }}
      >
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-700/50 p-3 flex justify-between items-center"
          style={{ position: 'sticky', top: 0, zIndex: 10 }}
        >
          <h2 className="text-lg font-bold text-white">{editingBet ? 'Edit Bet' : 'New Bet'}</h2>
          <button
            onClick={cancelEdit}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
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
              <option value="money-line">Money Line</option>
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

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-200">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Chiefs -3 vs Bills"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-200">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Reverse line movement from -7 to -6.5"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-200">System Play Classification</label>
            <div className="grid grid-cols-2 gap-2">
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

          <div className="flex gap-2 pt-4">
            <button
              onClick={editingBet ? saveEdit : handleAddBet}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl font-medium"
            >
              {editingBet ? 'Save Changes' : 'Add Bet'}
            </button>
            <button
              onClick={cancelEdit}
              className="flex-1 bg-slate-700/50 text-slate-200 py-3 rounded-lg hover:bg-slate-600/50 backdrop-blur-sm transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // SETTINGS MENU COMPONENT
  const SettingsMenu = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-start z-50" onClick={() => setShowSettingsMenu(false)}>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-80 h-full overflow-y-auto border-r border-white/20 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-700/50 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={() => setShowSettingsMenu(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Unit Value */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-200">Unit Value ($)</label>
            <input
              type="number"
              step="1"
              value={unitValue}
              onChange={(e) => setUnitValue(parseFloat(e.target.value) || 50)}
              className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-400 mt-1">Applies to future bets only</p>
          </div>

          {/* Monthly Limit */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-200">Monthly Loss Limit ($)</label>
            <input
              type="number"
              step="100"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(parseFloat(e.target.value) || 1500)}
              className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Notifications</h3>
            
            <div className="space-y-4">
              {/* Big Bet Notification */}
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={notificationSettings.bigBet.enabled}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      bigBet: { ...notificationSettings.bigBet, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800/50 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-200">Big Bet Warning</span>
                </label>
                {notificationSettings.bigBet.enabled && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Threshold (units)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={notificationSettings.bigBet.threshold}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        bigBet: { ...notificationSettings.bigBet, threshold: parseFloat(e.target.value) || 4 }
                      })}
                      className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Favorite Team Notification */}
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={notificationSettings.favoriteTeam.enabled}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      favoriteTeam: { ...notificationSettings.favoriteTeam, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800/50 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-200">Favorite Team Warning</span>
                </label>
                {notificationSettings.favoriteTeam.enabled && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Threshold (percentile)</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={notificationSettings.favoriteTeam.threshold}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        favoriteTeam: { ...notificationSettings.favoriteTeam, threshold: parseFloat(e.target.value) || 0.75 }
                      })}
                      className="w-full p-2 border border-slate-600 rounded-lg bg-slate-800/50 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-1">0.75 = top 75% of bets</p>
                  </div>
                )}
              </div>

              {/* Monthly Limit Notification */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notificationSettings.monthlyLimit.enabled}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      monthlyLimit: { ...notificationSettings.monthlyLimit, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800/50 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-200">Monthly Limit Warning</span>
                </label>
              </div>
            </div>
          </div>

          {/* Display Mode */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Display</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setDisplayMode('dollars')}
                className={`flex-1 p-2 rounded-lg text-sm transition-all ${
                  displayMode === 'dollars'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                Dollars ($)
              </button>
              <button
                onClick={() => setDisplayMode('units')}
                className={`flex-1 p-2 rounded-lg text-sm transition-all ${
                  displayMode === 'units'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                Units (u)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      {/* Animation Overlay */}
      {animation.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 custom-fadeIn">
          <div className="text-center">
            {animation.contentType === 'emoji' ? (
              <div className={`text-9xl mb-4 ${animation.type === 'win' ? 'custom-bounce' : 'custom-ping'}`}>
                {animation.content}
              </div>
            ) : (
              <div className="mb-4">
                {animation.content}
              </div>
            )}
            {animation.isStreak && (
              <div className="flex items-center justify-center gap-3 custom-pulse">
                <span className="text-6xl">🔥</span>
                <span className="text-5xl font-black text-orange-400 drop-shadow-2xl">
                  {animation.streakText}
                </span>
                <span className="text-6xl">🔥</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Retirement Modal */}
      {showRetirementModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-rose-500/50 shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 text-rose-400">
                <PowerOff />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Retirement Mode</h3>
                <p className="text-slate-200">How many days do you need to take a break?</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-slate-200">Days</label>
              <input
                type="number"
                min="1"
                max="30"
                value={retirementDays}
                onChange={(e) => setRetirementDays(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                className="w-full p-3 border border-slate-600 rounded-lg bg-slate-800/50 text-white text-center text-2xl font-bold backdrop-blur-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-400 mt-2 text-center">Once you retire, you cannot add new bets until the period ends.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRetirement}
                className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 text-white py-3 rounded-lg hover:from-rose-700 hover:to-red-700 transition-all font-medium shadow-xl"
              >
                Start Retirement
              </button>
              <button
                onClick={() => setShowRetirementModal(false)}
                className="flex-1 bg-slate-700/50 text-slate-200 py-3 rounded-lg hover:bg-slate-600/50 backdrop-blur-sm transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {warningModal.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-rose-500/50 shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 text-rose-400">
                <AlertCircle />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Warning</h3>
                <p className="text-slate-200">{warningModal.message}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addBet();
                }}
                className="flex-1 bg-gradient-to-r from-rose-600 to-orange-600 text-white py-3 rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all font-medium shadow-xl"
              >
                {warningModal.buttonYes || 'Yes, proceed anyway'}
              </button>
              <button
                onClick={() => setWarningModal({ show: false, message: '', type: '' })}
                className="flex-1 bg-slate-700/50 text-slate-200 py-3 rounded-lg hover:bg-slate-600/50 backdrop-blur-sm transition-all font-medium"
              >
                {warningModal.buttonNo || 'No, let me change it'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retired Overlay */}
      {isRetired && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 pointer-events-none">
          <div className="text-center">
            <div className="text-8xl md:text-9xl font-black text-rose-500 mb-4 opacity-90 drop-shadow-2xl">
              RETIRED
            </div>
            <div className="text-2xl md:text-3xl text-white font-semibold opacity-90">
              {daysUntilRetirementEnds} {daysUntilRetirementEnds === 1 ? 'day' : 'days'} remaining
            </div>
          </div>
        </div>
      )}

      {/* Add Bet Modal */}
      {showAddBetModal && !isRetired && <AddBetModal />}

      {/* Settings Menu */}
      {showSettingsMenu && <SettingsMenu />}

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto p-4 md:p-6 ${isRetired ? 'opacity-30' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowSettingsMenu(true)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <Menu />
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white">Betting Tracker</h1>
          
          <button
            onClick={toggleDisplayMode}
            className="px-3 py-2 bg-emerald-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-emerald-700/80 transition-all shadow-xl font-medium"
          >
            {displayMode === 'dollars' ? '$' : 'U'}
          </button>
        </div>

        {/* Render Current Page */}
        {renderPage()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'home' 
                  ? 'text-emerald-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => !isRetired && setShowAddBetModal(true)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isRetired 
                  ? 'text-slate-600 cursor-not-allowed' 
                  : 'text-slate-400 hover:text-white'
              }`}
              disabled={isRetired}
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-full shadow-xl">
                <PlusCircle />
              </div>
              <span className="text-xs font-medium">Add Bet</span>
            </button>

            <button
              onClick={() => setCurrentPage('history')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'history' 
                  ? 'text-emerald-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock />
              <span className="text-xs font-medium">History</span>
            </button>

            <button
              onClick={() => setCurrentPage('more')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'more' 
                  ? 'text-emerald-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MoreHorizontal />
              <span className="text-xs font-medium">More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
