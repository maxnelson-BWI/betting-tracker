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

const ChevronDown = ({ isOpen }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    style={{ 
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease'
    }}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// The Cindy Logo Component
const CindyLogo = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
    <div style={{ 
      fontFamily: "'Brush Script MT', cursive",
      fontSize: '32px',
      fontWeight: '400',
      color: '#2C3E50',
      lineHeight: '1',
      fontStyle: 'italic'
    }}>
      The Cindy
    </div>
    <div style={{
      width: '100%',
      height: '3px',
      background: 'linear-gradient(90deg, #D4A574 0%, #E8B887 50%, #D4A574 100%)',
      borderRadius: '2px'
    }} />
  </div>
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
  const [deleteModal, setDeleteModal] = useState({ show: false, betId: null });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
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

  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    system: false,
    breakdown: false,
    teamTime: false
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

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
      showToast("Error connecting to database. Check your Firebase config in src/firebase.js");
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

  const getSportLabel = (sport) => {
    const labels = {
      'nfl': 'NFL',
      'nba': 'NBA',
      'mlb': 'MLB',
      'nhl': 'NHL',
      'ncaaf': 'NCAAF',
      'ncaab': 'NCAAB',
      'other': 'OTHER'
    };
    return labels[sport?.toLowerCase()] || 'OTHER';
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

  const handleAddBet = (dataToSubmit = formData) => {
    if (!dataToSubmit.sport || !dataToSubmit.betType || !dataToSubmit.description || !dataToSubmit.units || !dataToSubmit.odds) {
      return 'Please fill in all required fields';
    }
    if (dataToSubmit.betType === 'longshot-parlay' && parseFloat(dataToSubmit.odds) < 500) {
      return 'Long shot parlays must be +500 or greater. Please change bet type to "Parlay" or adjust odds.';
    }

    const warning = checkWarnings();
    if (warning.show) {
      setWarningModal(warning);
    } else {
      addBet(dataToSubmit);
    }
    return null;
  };

  const addBet = async (dataToSubmit = formData) => {
    const { risk, win } = calculateRiskAndWin(dataToSubmit.units, dataToSubmit.odds);
    
    const newBet = {
      ...dataToSubmit,
      units: parseFloat(dataToSubmit.units),
      odds: parseFloat(dataToSubmit.odds),
      riskAmount: risk,
      winAmount: win,
      timestamp: new Date(),
      payout: dataToSubmit.result === 'win' 
        ? win
        : dataToSubmit.result === 'loss'
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
      showToast("Error adding bet: " + error.message);
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

  const saveEdit = async (dataToSubmit = formData) => {
    if (!dataToSubmit.sport || !dataToSubmit.betType || !dataToSubmit.description || !dataToSubmit.units || !dataToSubmit.odds) {
      return 'Please fill in all required fields';
    }
    if (dataToSubmit.betType === 'longshot-parlay' && parseFloat(dataToSubmit.odds) < 500) {
      return 'Long shot parlays must be +500 or greater. Please change bet type to "Parlay" or adjust odds.';
    }

    const { risk, win } = calculateRiskAndWin(dataToSubmit.units, dataToSubmit.odds);
    
    const updatedBet = {
      ...dataToSubmit,
      units: parseFloat(dataToSubmit.units),
      odds: parseFloat(dataToSubmit.odds),
      riskAmount: risk,
      winAmount: win,
      payout: dataToSubmit.result === 'win' 
        ? win
        : dataToSubmit.result === 'loss'
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
      return null;
    } catch (error) {
      console.error("Error updating bet:", error);
      showToast("Error updating bet: " + error.message);
      return null;
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
    setDeleteModal({ show: true, betId: id });
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'bets', deleteModal.betId));
      setDeleteModal({ show: false, betId: null });
    } catch (error) {
      console.error("Error deleting bet:", error);
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8F0' }}>
        <div className="text-xl" style={{ color: '#5D6D7E' }}>Loading your bets...</div>
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
      <div className="rounded-2xl shadow-2xl p-4 md:p-6 mb-6" style={{ background: '#FFFFFF', border: '1px solid #E8DCC8' }}>
        {(stats.monthlyLossWarning || stats.totalLossWarning) && (
          <div className="mb-4 p-4 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)' }}>
            <div className="flex-shrink-0 mt-0.5" style={{ color: '#E74C3C' }}>
              <AlertCircle />
            </div>
            <div>
              {stats.monthlyLossWarning && (
                <p className="font-medium text-sm md:text-base" style={{ color: '#E74C3C' }}>⚠️ Monthly loss limit: {formatMoneyNoSign(stats.monthlyLoss)} / ${monthlyLimit}</p>
              )}
              {stats.totalLossWarning && (
                <p className="font-medium text-sm md:text-base" style={{ color: '#E74C3C' }}>⚠️ Total loss threshold: {formatMoneyNoSign(stats.totalDollars)} / $5,000</p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="p-4 rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.15) 0%, rgba(41, 128, 185, 0.15) 100%)', border: '1px solid rgba(52, 152, 219, 0.3)' }}>
            <div className="text-xs md:text-sm mb-1" style={{ color: '#2C3E50' }}>Total P/L</div>
            <div className={`text-xl md:text-2xl font-bold ${parseFloat(stats.totalDollars) >= 0 ? '' : ''}`} style={{ color: parseFloat(stats.totalDollars) >= 0 ? '#27AE60' : '#E74C3C' }}>
              {formatMoney(parseFloat(stats.totalDollars))}
            </div>
          </div>
          <div className="p-4 rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(39, 174, 96, 0.15) 0%, rgba(22, 160, 133, 0.15) 100%)', border: '1px solid rgba(39, 174, 96, 0.3)' }}>
            <div className="text-xs md:text-sm flex items-center gap-1 mb-1" style={{ color: '#2C3E50' }}>
              This Month
              {stats.monthlyLossWarning && <span style={{ color: '#E74C3C' }}>⚠️</span>}
            </div>
            <div className={`text-xl md:text-2xl font-bold`} style={{ color: parseFloat(stats.monthlyLoss) >= 0 ? '#27AE60' : '#E74C3C' }}>
              {formatMoney(parseFloat(stats.monthlyLoss))}
            </div>
          </div>

          <div className="p-4 rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(39, 174, 96, 0.15) 0%, rgba(22, 160, 133, 0.15) 100%)', border: '1px solid rgba(39, 174, 96, 0.3)' }}>
            <div className="text-xs md:text-sm mb-1" style={{ color: '#2C3E50' }}>Win Rate</div>
            <div className="text-xl md:text-2xl font-bold" style={{ color: '#2C3E50' }}>{stats.winRate}%</div>
            <div className="text-xs md:text-sm" style={{ color: '#5D6D7E' }}>{stats.wins}W-{stats.losses}L</div>
          </div>

          <div className="p-4 rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(243, 156, 18, 0.15) 0%, rgba(230, 126, 34, 0.15) 100%)', border: '1px solid rgba(243, 156, 18, 0.3)' }}>
            <div className="text-xs md:text-sm mb-1" style={{ color: '#2C3E50' }}>Total Bets</div>
            <div className="text-xl md:text-2xl font-bold" style={{ color: '#2C3E50' }}>{stats.totalBets}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl mb-6 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(39, 174, 96, 0.15) 0%, rgba(34, 153, 84, 0.15) 100%)', border: '1px solid rgba(39, 174, 96, 0.3)' }}>
          <button 
            onClick={() => toggleSection('system')}
            className="w-full flex items-center justify-between mb-3"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp />
              <h3 className="font-bold text-base md:text-lg" style={{ color: '#2C3E50', fontFamily: "'Outfit', sans-serif" }}>THE SYSTEM (Fade the Public)</h3>
            </div>
            <ChevronDown isOpen={!collapsedSections.system} />
          </button>
          {!collapsedSections.system && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <div>
              <div className="text-xs md:text-sm" style={{ color: '#5D6D7E' }}>All System</div>
              <div className={`text-lg md:text-xl font-bold`} style={{ color: parseFloat(stats.systemDollars) >= 0 ? '#27AE60' : '#E74C3C' }}>
                {formatMoney(parseFloat(stats.systemDollars))}
              </div>
              <div className="text-xs" style={{ color: '#5D6D7E' }}>{stats.systemWinRate}%</div>
            </div>
            <div>
              <div className="text-xs md:text-sm" style={{ color: '#5D6D7E' }}>Clear</div>
              <div className={`text-lg md:text-xl font-bold`} style={{ color: parseFloat(stats.clearSystemDollars) >= 0 ? '#27AE60' : '#E74C3C' }}>
                {formatMoney(parseFloat(stats.clearSystemDollars))}
              </div>
              <div className="text-xs" style={{ color: '#5D6D7E' }}>{stats.clearSystemRecord}</div>
            </div>
            <div>
              <div className="text-xs md:text-sm" style={{ color: '#5D6D7E' }}>Kind Of</div>
              <div className={`text-lg md:text-xl font-bold`} style={{ color: parseFloat(stats.kindOfSystemDollars) >= 0 ? '#27AE60' : '#E74C3C' }}>
                {formatMoney(parseFloat(stats.kindOfSystemDollars))}
              </div>
              <div className="text-xs" style={{ color: '#5D6D7E' }}>{stats.kindOfSystemRecord}</div>
            </div>
            <div>
              <div className="text-xs md:text-sm" style={{ color: '#5D6D7E' }}>Anti System</div>
              <div className={`text-lg md:text-xl font-bold`} style={{ color: parseFloat(stats.notSystemDollars) >= 0 ? '#27AE60' : '#E74C3C' }}>
                {formatMoney(parseFloat(stats.notSystemDollars))}
              </div>
              <div className="text-xs" style={{ color: '#5D6D7E' }}>{stats.notSystemRecord}</div>
            </div>
          </div>
          )}
        </div>

        <div className="rounded-2xl mb-6 p-4 shadow-xl" style={{ background: '#FFFFFF', border: '1px solid #E8DCC8' }}>
          <button 
            onClick={() => toggleSection('breakdown')}
            className="w-full flex items-center justify-between mb-4"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <h3 className="font-bold text-base md:text-lg" style={{ color: '#2C3E50', fontFamily: "'Outfit', sans-serif" }}>Performance Breakdown</h3>
            <ChevronDown isOpen={!collapsedSections.breakdown} />
          </button>
          {!collapsedSections.breakdown && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl shadow-xl" style={{ background: '#F5E6D3', border: '1px solid #E8DCC8' }}>
                <h3 className="font-semibold mb-2 text-sm md:text-base" style={{ color: '#2C3E50', fontFamily: "'Outfit', sans-serif" }}>By Bet Type</h3>
                {Object.keys(stats.byType).length === 0 ? (
                  <p className="text-sm" style={{ color: '#95A5A6' }}>No settled bets</p>
                ) : (
                  Object.entries(stats.byType).map(([type, dollars]) => (
                    <div key={type} className="flex justify-between text-sm py-1">
                      <span style={{ color: '#5D6D7E' }}>{formatBetType(type)}</span>
                      <span style={{ color: dollars >= 0 ? '#27AE60' : '#E74C3C' }}>
                        {formatMoney(dollars)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 rounded-2xl shadow-xl" style={{ background: '#F5E6D3', border: '1px solid #E8DCC8' }}>
                <h3 className="font-semibold mb-2 text-sm md:text-base" style={{ color: '#2C3E50', fontFamily: "'Outfit', sans-serif" }}>By Sport</h3>
                {Object.keys(stats.bySport).length === 0 ? (
                  <p className="text-sm" style={{ color: '#95A5A6' }}>No settled bets</p>
                ) : (
                  Object.entries(stats.bySport).map(([sport, dollars]) => (
                    <div key={sport} className="flex justify-between text-sm py-1">
                      <span style={{ color: '#5D6D7E' }}>{sport.toUpperCase()}</span>
                      <span style={{ color: dollars >= 0 ? '#27AE60' : '#E74C3C' }}>
                        {formatMoney(dollars)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl mb-6 p-4 shadow-xl" style={{ background: '#FFFFFF', border: '1px solid #E8DCC8' }}>
          <button 
            onClick={() => toggleSection('teamTime')}
            className="w-full flex items-center justify-between mb-4"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <h3 className="font-bold text-base md:text-lg" style={{ color: '#2C3E50', fontFamily: "'Outfit', sans-serif" }}>Favorite Team & Prime Time</h3>
            <ChevronDown isOpen={!collapsedSections.teamTime} />
          </button>
          {!collapsedSections.teamTime && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.15) 0%, rgba(211, 84, 0, 0.15) 100%)', border: '1px solid rgba(230, 126, 34, 0.3)' }}>
                <div className="text-xs md:text-sm" style={{ color: '#2C3E50' }}>Favorite Team</div>
                <div className={`text-lg md:text-xl font-bold`} style={{ color: parseFloat(stats.favoriteTeamDollars) >= 0 ? '#27AE60' : '#E74C3C' }}>
                  {formatMoney(parseFloat(stats.favoriteTeamDollars))}
                </div>
                <div className="text-xs" style={{ color: '#5D6D7E' }}>{stats.favoriteTeamRecord}</div>
              </div>
              
              <div className="p-3 rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(93, 173, 226, 0.15) 0%, rgba(52, 152, 219, 0.15) 100%)', border: '1px solid rgba(93, 173, 226, 0.3)' }}>
                <div className="text-xs md:text-sm" style={{ color: '#2C3E50' }}>Prime Time</div>
                <div className={`text-lg md:text-xl font-bold`} style={{ color: parseFloat(stats.primeTimeDollars) >= 0 ? '#27AE60' : '#E74C3C' }}>
                  {formatMoney(parseFloat(stats.primeTimeDollars))}
                </div>
                <div className="text-xs" style={{ color: '#5D6D7E' }}>{stats.primeTimeRecord}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending Bets Section */}
      {pendingBets.length > 0 && (
        <div className="rounded-2xl shadow-2xl p-4 md:p-6 mb-6" style={{ background: '#FFFFFF', border: '1px solid #E8DCC8' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#2C3E50', fontFamily: "'Outfit', sans-serif" }}>Pending Bets ({pendingBets.length})</h2>
          <div className="space-y-3">
            {pendingBets.map(bet => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Bets Section */}
      <div className="rounded-2xl shadow-2xl p-4 md:p-6" style={{ background: '#FFFFFF', border: '1px solid #E8DCC8' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#2C3E50', fontFamily: "'Outfit', sans-serif" }}>Recent Bets</h2>
          <button
            onClick={() => setCurrentPage('history')}
            className="text-sm transition-colors"
            style={{ color: '#D4A574' }}
          >
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {recentBets.length === 0 ? (
            <p className="text-center py-8" style={{ color: '#95A5A6' }}>No bets yet. Add your first bet!</p>
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
      <div className="rounded-2xl shadow-2xl p-4 md:p-6" style={{ background: '#FFFFFF', border: '1px solid #E8DCC8' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#2C3E50', fontFamily: "'Outfit', sans-serif" }}>Bet History</h2>
        
        {/* Filter Pills */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter />
            <button
              onClick={() => setHistoryFilter({...historyFilter, sport: 'all'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.sport === 'all' ? '#D4A574' : '#F5E6D3',
                color: historyFilter.sport === 'all' ? '#FFFFFF' : '#2C3E50'
              }}
            >
              All Sports
            </button>
            {['nfl', 'nba', 'mlb', 'nhl', 'ncaaf', 'ncaab'].map(sport => (
              <button
                key={sport}
                onClick={() => setHistoryFilter({...historyFilter, sport})}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
                style={{
                  background: historyFilter.sport === sport ? '#D4A574' : '#F5E6D3',
                  color: historyFilter.sport === sport ? '#FFFFFF' : '#2C3E50'
                }}
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
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
                style={{
                  background: historyFilter.betType === type ? '#D4A574' : '#F5E6D3',
                  color: historyFilter.betType === type ? '#FFFFFF' : '#2C3E50'
                }}
              >
                {formatBetType(type)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setHistoryFilter({...historyFilter, result: 'all'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.result === 'all' ? '#D4A574' : '#F5E6D3',
                color: historyFilter.result === 'all' ? '#FFFFFF' : '#2C3E50'
              }}
            >
              All Results
            </button>
            {['win', 'loss', 'push', 'pending'].map(result => (
              <button
                key={result}
                onClick={() => setHistoryFilter({...historyFilter, result})}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
                style={{
                  background: historyFilter.result === result ? '#D4A574' : '#F5E6D3',
                  color: historyFilter.result === result ? '#FFFFFF' : '#2C3E50'
                }}
              >
                {result.charAt(0).toUpperCase() + result.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setHistoryFilter({...historyFilter, favoriteUnderdog: 'all'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.favoriteUnderdog === 'all' ? '#D4A574' : '#F5E6D3',
                color: historyFilter.favoriteUnderdog === 'all' ? '#FFFFFF' : '#2C3E50'
              }}
            >
              Fav/Dog
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, favoriteUnderdog: 'favorite'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.favoriteUnderdog === 'favorite' ? '#D4A574' : '#F5E6D3',
                color: historyFilter.favoriteUnderdog === 'favorite' ? '#FFFFFF' : '#2C3E50'
              }}
            >
              Favorites
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, favoriteUnderdog: 'underdog'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.favoriteUnderdog === 'underdog' ? '#D4A574' : '#F5E6D3',
                color: historyFilter.favoriteUnderdog === 'underdog' ? '#FFFFFF' : '#2C3E50'
              }}
            >
              Underdogs
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setHistoryFilter({...historyFilter, overUnder: 'all'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.overUnder === 'all' ? '#D4A574' : '#F5E6D3',
                color: historyFilter.overUnder === 'all' ? '#FFFFFF' : '#2C3E50'
              }}
            >
              O/U
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, overUnder: 'over'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.overUnder === 'over' ? '#D4A574' : '#F5E6D3',
                color: historyFilter.overUnder === 'over' ? '#FFFFFF' : '#2C3E50'
              }}
            >
              Overs
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, overUnder: 'under'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.overUnder === 'under' ? '#D4A574' : '#F5E6D3',
                color: historyFilter.overUnder === 'under' ? '#FFFFFF' : '#2C3E50'
              }}
            >
              Unders
            </button>
          </div>
        </div>

        {/* Time Range Toggle - Bigger and More Prominent */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setShowAllBets(false)}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all`}
            style={{
              background: !showAllBets ? '#D4A574' : '#F5E6D3',
              color: !showAllBets ? '#FFFFFF' : '#5D6D7E',
              boxShadow: !showAllBets ? '0 4px 12px rgba(212, 165, 116, 0.3)' : 'none'
            }}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setShowAllBets(true)}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all`}
            style={{
              background: showAllBets ? '#D4A574' : '#F5E6D3',
              color: showAllBets ? '#FFFFFF' : '#5D6D7E',
              boxShadow: showAllBets ? '0 4px 12px rgba(212, 165, 116, 0.3)' : 'none'
            }}
          >
            All Time
          </button>
        </div>

        {/* Filter Stats Box */}
        {filteredBets.length > 0 && (
          <div className="p-4 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.15) 0%, rgba(155, 89, 182, 0.15) 100%)', border: '1px solid rgba(52, 152, 219, 0.3)' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs mb-1" style={{ color: '#5D6D7E' }}>Current Filter</div>
                <div className="text-sm font-medium" style={{ color: '#2C3E50' }}>
                  {historyFilter.sport !== 'all' && `${historyFilter.sport.toUpperCase()} • `}
                  {historyFilter.betType !== 'all' && `${formatBetType(historyFilter.betType)} • `}
                  {historyFilter.result !== 'all' && `${historyFilter.result.charAt(0).toUpperCase() + historyFilter.result.slice(1)} • `}
                  {historyFilter.favoriteUnderdog !== 'all' && `${historyFilter.favoriteUnderdog === 'favorite' ? 'Favorites' : 'Underdogs'} • `}
                  {historyFilter.overUnder !== 'all' && `${historyFilter.overUnder === 'over' ? 'Overs' : 'Unders'} • `}
                  {historyFilter.sport === 'all' && historyFilter.betType === 'all' && historyFilter.result === 'all' && historyFilter.favoriteUnderdog === 'all' && historyFilter.overUnder === 'all' && 'All Bets'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs mb-1" style={{ color: '#5D6D7E' }}>Record & P/L</div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: '#2C3E50' }}>
                    {filteredBets.filter(b => b.result === 'win').length}-{filteredBets.filter(b => b.result === 'loss').length}
                  </span>
                  <span className={`text-lg font-bold`} style={{ color: filteredBets.reduce((sum, b) => sum + b.payout, 0) >= 0 ? '#27AE60' : '#E74C3C' }}>
                    {formatMoney(filteredBets.reduce((sum, b) => sum + b.payout, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm mb-4" style={{ color: '#5D6D7E' }}>
          Showing {filteredBets.length} {filteredBets.length === 1 ? 'bet' : 'bets'}
          {!showAllBets && ' (Last 30 days)'}
        </div>

        <div className="space-y-3">
          {filteredBets.length === 0 ? (
            <p className="text-center py-8" style={{ color: '#95A5A6' }}>No bets match your filters</p>
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
      <div className="rounded-2xl shadow-2xl p-4 md:p-6 mb-6" style={{ background: '#FFFFFF', border: '1px solid #E8DCC8' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#2C3E50', fontFamily: "'Outfit', sans-serif" }}>Resources</h2>
        <div className="grid grid-cols-1 gap-3">
          {resources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl transition-all"
              style={{ background: '#F5E6D3', border: '1px solid #E8DCC8' }}
            >
              <span className="text-3xl">{resource.icon}</span>
              <span className="text-base font-medium flex-1" style={{ color: '#2C3E50' }}>{resource.name}</span>
              <ExternalLink />
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl shadow-2xl p-4 md:p-6" style={{ background: '#FFFFFF', border: '1px solid #E8DCC8' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#2C3E50', fontFamily: "'Outfit', sans-serif" }}>Actions</h2>
        <div className="space-y-3">
          <button
            onClick={exportToCSV}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all shadow-xl"
            style={{ background: '#D4A574', color: '#FFFFFF' }}
          >
            <Download />
            Export Bet History
          </button>
          
          <button
            onClick={() => setShowRetirementModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all shadow-xl font-semibold"
            style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)', color: '#FFFFFF', border: '2px solid rgba(231, 76, 60, 0.5)' }}
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
    <div className="rounded-2xl p-4 transition-all duration-200 shadow-xl" style={{ border: '1px solid #E8DCC8', background: '#FFFFFF' }}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ 
              background: '#D4A574', 
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.5px',
              boxShadow: '0 2px 4px rgba(212, 165, 116, 0.3)'
            }}>
              {getSportLabel(bet.sport)}
            </span>
            <span className="font-semibold" style={{ color: '#2C3E50', fontFamily: "'Inter', sans-serif" }}>{bet.description}</span>
            {bet.favoriteTeam && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(230, 126, 34, 0.15)', color: '#E67E22', border: '1px solid rgba(230, 126, 34, 0.3)' }}>Fav Team</span>}
            {bet.primeTime && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(93, 173, 226, 0.15)', color: '#5DADE2', border: '1px solid rgba(93, 173, 226, 0.3)' }}>Prime Time</span>}
            {bet.systemPlay !== 'none' && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getSystemColor(bet.systemPlay)}`}>
                {getSystemLabel(bet.systemPlay)}
              </span>
            )}
          </div>
          <div className="text-sm" style={{ color: '#5D6D7E', fontFamily: "'Inter', sans-serif" }}>
            {bet.date} • {bet.sport.toUpperCase()} • {formatBetType(bet.betType)} • {bet.units} units @ {bet.odds > 0 ? '+' : ''}{bet.odds}
          </div>
          <div className="text-xs mt-1" style={{ color: '#95A5A6', fontFamily: "'Inter', sans-serif", fontFeatureSettings: "'tnum' 1" }}>
            Risk: ${bet.riskAmount.toFixed(2)} | To Win: ${bet.winAmount.toFixed(2)}
          </div>
          {bet.notes && (
            <div className="text-xs mt-1 italic" style={{ color: '#95A5A6', fontFamily: "'Inter', sans-serif" }}>
              Note: {bet.notes}
            </div>
          )}
        </div>
        <div className="text-right">
          {bet.result === 'pending' ? (
            <div className="flex gap-1">
              <button
                onClick={() => updateBetResult(bet.id, 'win')}
                className="px-2 py-1 text-xs rounded-lg transition-all"
                style={{ background: 'rgba(39, 174, 96, 0.15)', color: '#27AE60', border: '1px solid rgba(39, 174, 96, 0.3)' }}
                disabled={isRetired}
              >
                Win
              </button>
              <button
                onClick={() => updateBetResult(bet.id, 'loss')}
                className="px-2 py-1 text-xs rounded-lg transition-all"
                style={{ background: 'rgba(231, 76, 60, 0.15)', color: '#E74C3C', border: '1px solid rgba(231, 76, 60, 0.3)' }}
                disabled={isRetired}
              >
                Loss
              </button>
              <button
                onClick={() => updateBetResult(bet.id, 'push')}
                className="px-2 py-1 text-xs rounded transition-all"
                style={{ background: 'rgba(149, 165, 166, 0.15)', color: '#95A5A6', border: '1px solid rgba(149, 165, 166, 0.3)' }}
                disabled={isRetired}
              >
                Push
              </button>
            </div>
          ) : (
            <div className="font-semibold" style={{ 
              color: bet.payout > 0 ? '#27AE60' : bet.payout < 0 ? '#E74C3C' : '#95A5A6',
              fontFamily: "'Inter', sans-serif",
              fontFeatureSettings: "'tnum' 1"
            }}>
              {formatMoney(bet.payout)}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: '1px solid #E8DCC8' }}>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          bet.result === 'win' ? '' :
          bet.result === 'loss' ? '' :
          bet.result === 'push' ? '' :
          ''
        }`} style={{
          background: bet.result === 'win' ? 'rgba(39, 174, 96, 0.15)' : bet.result === 'loss' ? 'rgba(231, 76, 60, 0.15)' : bet.result === 'push' ? 'rgba(149, 165, 166, 0.15)' : 'rgba(243, 156, 18, 0.15)',
          color: bet.result === 'win' ? '#27AE60' : bet.result === 'loss' ? '#E74C3C' : bet.result === 'push' ? '#95A5A6' : '#F39C12',
          border: bet.result === 'win' ? '1px solid rgba(39, 174, 96, 0.3)' : bet.result === 'loss' ? '1px solid rgba(231, 76, 60, 0.3)' : bet.result === 'push' ? '1px solid rgba(149, 165, 166, 0.3)' : '1px solid rgba(243, 156, 18, 0.3)'
        }}>
          {bet.result.toUpperCase()}
        </span>
        {showActions && !isRetired && (
          <div className="flex gap-2">
            <button
              onClick={() => startEdit(bet)}
              className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: '#3498DB' }}
            >
              <Edit />
              Edit
            </button>
            <button
              onClick={() => deleteBet(bet.id)}
              className="text-xs transition-colors"
              style={{ color: '#E74C3C' }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ADD BET MODAL COMPONENT
  const AddBetModal = () => {
    // Modal manages its own state to prevent parent re-renders
    const [localFormData, setLocalFormData] = useState({
      date: formData.date,
      sport: formData.sport,
      betType: formData.betType,
      description: formData.description,
      units: formData.units,
      odds: formData.odds,
      result: formData.result,
      favoriteTeam: formData.favoriteTeam,
      primeTime: formData.primeTime,
      systemPlay: formData.systemPlay,
      notes: formData.notes
    });

    // Sync with parent formData when modal opens
    useEffect(() => {
      if (showAddBetModal) {
        setLocalFormData({
          date: formData.date,
          sport: formData.sport,
          betType: formData.betType,
          description: formData.description,
          units: formData.units,
          odds: formData.odds,
          result: formData.result,
          favoriteTeam: formData.favoriteTeam,
          primeTime: formData.primeTime,
          systemPlay: formData.systemPlay,
          notes: formData.notes
        });
      }
    }, [showAddBetModal]);

    const handleSubmit = async () => {
      // Update parent formData and trigger save with the local data
      setFormData(localFormData);
      // Pass the localFormData directly to avoid state update timing issues
      let errorMsg;
      if (editingBet) {
        errorMsg = await saveEdit(localFormData);
      } else {
        errorMsg = handleAddBet(localFormData);
      }
      if (errorMsg) {
        showToast(errorMsg, 'error');
      }
    };

    return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
      onClick={cancelEdit}
    >
      <div 
        className="rounded-t-3xl w-full max-w-2xl overflow-y-auto shadow-2xl"
        style={{ 
          background: '#FFFFFF',
          borderTop: '1px solid #E8DCC8',
          minHeight: '80vh',
          maxHeight: '80vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b p-3 flex justify-between items-center"
          style={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 10,
            background: '#FFFFFF',
            borderBottom: '1px solid #E8DCC8'
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: '#2C3E50' }}>{editingBet ? 'Edit Bet' : 'New Bet'}</h2>
          <button
            onClick={cancelEdit}
            className="transition-colors"
            style={{ color: '#95A5A6' }}
          >
            <X />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C3E50' }}>Date</label>
            <input
              type="date"
              value={localFormData.date}
              onChange={(e) => setLocalFormData({...localFormData, date: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: '1px solid #E8DCC8', 
                background: '#FFFFFF', 
                color: '#2C3E50'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C3E50' }}>Sport</label>
            <select
              value={localFormData.sport}
              onChange={(e) => setLocalFormData({...localFormData, sport: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: '1px solid #E8DCC8', 
                background: '#FFFFFF', 
                color: '#2C3E50'
              }}
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
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C3E50' }}>Bet Type</label>
            <select
              value={localFormData.betType}
              onChange={(e) => setLocalFormData({...localFormData, betType: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: '1px solid #E8DCC8', 
                background: '#FFFFFF', 
                color: '#2C3E50'
              }}
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
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C3E50' }}>Units</label>
            <input
              type="number"
              step="0.25"
              value={localFormData.units}
              onChange={(e) => setLocalFormData({...localFormData, units: e.target.value})}
              className="w-full p-2 rounded-lg mb-2"
              style={{ 
                border: '1px solid #E8DCC8', 
                background: '#FFFFFF', 
                color: '#2C3E50'
              }}
              placeholder="e.g., 1, 2, 0.5"
            />
            <div className="flex gap-1 flex-wrap">
              {quickAddButtons.map(btn => (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => setLocalFormData({...localFormData, units: btn.value.toString()})}
                  className="px-2 py-1 text-xs rounded transition-all"
                  style={{ background: '#F5E6D3', color: '#2C3E50' }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            {localFormData.units && localFormData.odds && (
              <div className="text-xs mt-2" style={{ color: '#5D6D7E' }}>
                Risk: ${calculateRiskAndWin(localFormData.units, localFormData.odds).risk.toFixed(2)} | 
                Win: ${calculateRiskAndWin(localFormData.units, localFormData.odds).win.toFixed(2)}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C3E50' }}>Odds (American)</label>
            <input
              id="bet-odds"
              type="text"
              value={localFormData.odds}
              onChange={(e) => setLocalFormData({...localFormData, odds: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: '1px solid #E8DCC8', 
                background: '#FFFFFF', 
                color: '#2C3E50'
              }}
              placeholder="e.g., -110, +150"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C3E50' }}>Result</label>
            <select
              value={localFormData.result}
              onChange={(e) => setLocalFormData({...localFormData, result: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: '1px solid #E8DCC8', 
                background: '#FFFFFF', 
                color: '#2C3E50'
              }}
            >
              <option value="pending">Pending</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="push">Push</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C3E50' }}>Description</label>
            <input
              id="bet-description"
              type="text"
              value={localFormData.description}
              onChange={(e) => setLocalFormData({...localFormData, description: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: '1px solid #E8DCC8', 
                background: '#FFFFFF', 
                color: '#2C3E50'
              }}
              placeholder="e.g., Chiefs -3 vs Bills"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C3E50' }}>Notes (Optional)</label>
            <textarea
              id="bet-notes"
              value={localFormData.notes}
              onChange={(e) => setLocalFormData({...localFormData, notes: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: '1px solid #E8DCC8', 
                background: '#FFFFFF', 
                color: '#2C3E50'
              }}
              placeholder="e.g., Reverse line movement from -7 to -6.5"
              rows="2"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>System Play Classification</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalFormData({...localFormData, systemPlay: 'clear'})}
                className={`p-2 border-2 rounded-lg text-sm transition-all`}
                style={{
                  borderColor: localFormData.systemPlay === 'clear' ? '#9B59B6' : '#E8DCC8',
                  background: localFormData.systemPlay === 'clear' ? 'rgba(155, 89, 182, 0.15)' : '#FFFFFF',
                  color: localFormData.systemPlay === 'clear' ? '#9B59B6' : '#5D6D7E'
                }}
              >
                Clear System
              </button>
              <button
                type="button"
                onClick={() => setLocalFormData({...localFormData, systemPlay: 'kind-of'})}
                className={`p-2 border-2 rounded-lg text-sm transition-all`}
                style={{
                  borderColor: localFormData.systemPlay === 'kind-of' ? '#3498DB' : '#E8DCC8',
                  background: localFormData.systemPlay === 'kind-of' ? 'rgba(52, 152, 219, 0.15)' : '#FFFFFF',
                  color: localFormData.systemPlay === 'kind-of' ? '#3498DB' : '#5D6D7E'
                }}
              >
                Kind Of
              </button>
              <button
                type="button"
                onClick={() => setLocalFormData({...localFormData, systemPlay: 'no-system'})}
                className={`p-2 border-2 rounded-lg text-sm transition-all`}
                style={{
                  borderColor: localFormData.systemPlay === 'no-system' ? '#95A5A6' : '#E8DCC8',
                  background: localFormData.systemPlay === 'no-system' ? 'rgba(149, 165, 166, 0.15)' : '#FFFFFF',
                  color: localFormData.systemPlay === 'no-system' ? '#95A5A6' : '#5D6D7E'
                }}
              >
                No System
              </button>
              <button
                type="button"
                onClick={() => setLocalFormData({...localFormData, systemPlay: 'not-system'})}
                className={`p-2 border-2 rounded-lg text-sm transition-all`}
                style={{
                  borderColor: localFormData.systemPlay === 'not-system' ? '#E74C3C' : '#E8DCC8',
                  background: localFormData.systemPlay === 'not-system' ? 'rgba(231, 76, 60, 0.15)' : '#FFFFFF',
                  color: localFormData.systemPlay === 'not-system' ? '#E74C3C' : '#5D6D7E'
                }}
              >
                Anti System
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localFormData.favoriteTeam}
                onChange={(e) => setLocalFormData({...localFormData, favoriteTeam: e.target.checked})}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#D4A574' }}
              />
              <span className="text-sm" style={{ color: '#2C3E50' }}>Favorite Team</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localFormData.primeTime}
                onChange={(e) => setLocalFormData({...localFormData, primeTime: e.target.checked})}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#D4A574' }}
              />
              <span className="text-sm" style={{ color: '#2C3E50' }}>Prime Time Game</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-lg transition-all shadow-xl font-medium"
              style={{ background: 'linear-gradient(135deg, #D4A574 0%, #E8B887 100%)', color: '#FFFFFF' }}
            >
              {editingBet ? 'Save Changes' : 'Add Bet'}
            </button>
            <button
              onClick={cancelEdit}
              className="flex-1 py-3 rounded-lg transition-all font-medium"
              style={{ background: '#F5E6D3', color: '#5D6D7E' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  };

  // SETTINGS MENU COMPONENT
  const SettingsMenu = () => (
    <div className="fixed inset-0 flex items-start justify-start z-50" style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowSettingsMenu(false)}>
      <div className="w-80 h-full overflow-y-auto shadow-2xl" style={{ background: '#FFFFFF', borderRight: '1px solid #E8DCC8' }} onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 p-4 flex justify-between items-center" style={{ background: '#FFFFFF', borderBottom: '1px solid #E8DCC8' }}>
          <h2 className="text-xl font-bold" style={{ color: '#2C3E50' }}>Settings</h2>
          <button
            onClick={() => setShowSettingsMenu(false)}
            className="transition-colors"
            style={{ color: '#95A5A6' }}
          >
            <X />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Unit Value */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>Unit Value ($)</label>
            <input
              type="number"
              step="1"
              value={unitValue}
              onChange={(e) => setUnitValue(parseFloat(e.target.value) || 50)}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: '1px solid #E8DCC8', 
                background: '#FFFFFF', 
                color: '#2C3E50'
              }}
            />
            <p className="text-xs mt-1" style={{ color: '#95A5A6' }}>Applies to future bets only</p>
          </div>

          {/* Monthly Limit */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>Monthly Loss Limit ($)</label>
            <input
              type="number"
              step="100"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(parseFloat(e.target.value) || 1500)}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: '1px solid #E8DCC8', 
                background: '#FFFFFF', 
                color: '#2C3E50'
              }}
            />
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#2C3E50' }}>Notifications</h3>
            
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
            <h3 className="text-lg font-bold mb-3" style={{ color: '#2C3E50' }}>Display</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setDisplayMode('dollars')}
                className={`flex-1 p-2 rounded-lg text-sm transition-all`}
                style={{
                  background: displayMode === 'dollars' ? '#D4A574' : '#F5E6D3',
                  color: displayMode === 'dollars' ? '#FFFFFF' : '#5D6D7E'
                }}
              >
                Dollars ($)
              </button>
              <button
                onClick={() => setDisplayMode('units')}
                className={`flex-1 p-2 rounded-lg text-sm transition-all`}
                style={{
                  background: displayMode === 'units' ? '#D4A574' : '#F5E6D3',
                  color: displayMode === 'units' ? '#FFFFFF' : '#5D6D7E'
                }}
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
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl p-6 max-w-md w-full shadow-2xl" style={{ background: '#FFFFFF', border: '2px solid rgba(231, 76, 60, 0.5)' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0" style={{ color: '#E74C3C' }}>
                <PowerOff />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2C3E50' }}>Retirement Mode</h3>
                <p style={{ color: '#5D6D7E' }}>How many days do you need to take a break?</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>Days</label>
              <input
                type="number"
                min="1"
                max="30"
                value={retirementDays}
                onChange={(e) => setRetirementDays(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                className="w-full p-3 rounded-lg text-center text-2xl font-bold"
                style={{ 
                  border: '1px solid #E8DCC8', 
                  background: '#FFFFFF', 
                  color: '#2C3E50'
                }}
              />
              <p className="text-xs mt-2 text-center" style={{ color: '#95A5A6' }}>Once you retire, you cannot add new bets until the period ends.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRetirement}
                className="flex-1 py-3 rounded-lg transition-all font-medium shadow-xl"
                style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)', color: '#FFFFFF' }}
              >
                Start Retirement
              </button>
              <button
                onClick={() => setShowRetirementModal(false)}
                className="flex-1 py-3 rounded-lg transition-all font-medium"
                style={{ background: '#F5E6D3', color: '#5D6D7E' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {warningModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl p-6 max-w-md w-full shadow-2xl" style={{ background: '#FFFFFF', border: '2px solid rgba(231, 76, 60, 0.5)' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0" style={{ color: '#E74C3C' }}>
                <AlertCircle />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2C3E50' }}>Warning</h3>
                <p style={{ color: '#5D6D7E' }}>{warningModal.message}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addBet();
                }}
                className="flex-1 py-3 rounded-lg transition-all font-medium shadow-xl"
                style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)', color: '#FFFFFF' }}
              >
                {warningModal.buttonYes || 'Yes, proceed anyway'}
              </button>
              <button
                onClick={() => setWarningModal({ show: false, message: '', type: '' })}
                className="flex-1 py-3 rounded-lg transition-all font-medium"
                style={{ background: '#F5E6D3', color: '#5D6D7E' }}
              >
                {warningModal.buttonNo || 'No, let me change it'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl p-6 max-w-md w-full shadow-2xl" style={{ background: '#FFFFFF', border: '2px solid rgba(231, 76, 60, 0.5)' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0" style={{ color: '#E74C3C' }}>
                <AlertCircle />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2C3E50' }}>Delete Bet</h3>
                <p style={{ color: '#5D6D7E' }}>Are you sure you want to delete this bet? This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-lg transition-all font-medium shadow-xl"
                style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)', color: '#FFFFFF' }}
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal({ show: false, betId: null })}
                className="flex-1 py-3 rounded-lg transition-all font-medium"
                style={{ background: '#F5E6D3', color: '#5D6D7E' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-fadeIn">
          <div className="px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md" style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)', color: '#FFFFFF', border: '1px solid rgba(231, 76, 60, 0.5)' }}>
            <AlertCircle />
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Retired Overlay */}
      {isRetired && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none" style={{ background: 'rgba(255, 248, 240, 0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="text-center">
            <div className="text-8xl md:text-9xl font-black mb-4 opacity-90 drop-shadow-2xl" style={{ color: '#E74C3C' }}>
              RETIRED
            </div>
            <div className="text-2xl md:text-3xl font-semibold opacity-90" style={{ color: '#2C3E50' }}>
              {daysUntilRetirementEnds} {daysUntilRetirementEnds === 1 ? 'day' : 'days'} remaining
            </div>
          </div>
        </div>
      )}

      {/* Add Bet Modal */}
      {showAddBetModal && !isRetired && <AddBetModal key="add-bet-modal" />}

      {/* Settings Menu */}
      {showSettingsMenu && <SettingsMenu key="settings-menu" />}

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto p-4 md:p-6 ${isRetired ? 'opacity-30' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowSettingsMenu(true)}
            className="p-2 rounded-lg transition-all"
            style={{ color: '#2C3E50' }}
          >
            <Menu />
          </button>
          
          <CindyLogo />
          
          <button
            onClick={toggleDisplayMode}
            className="px-3 py-2 rounded-lg transition-all shadow-xl font-medium"
            style={{ background: '#D4A574', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}
          >
            {displayMode === 'dollars' ? '$' : 'U'}
          </button>
        </div>

        {/* Render Current Page */}
        {renderPage()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 shadow-2xl" style={{ background: '#FFFFFF', borderTop: '1px solid #E8DCC8' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all`}
              style={{ color: currentPage === 'home' ? '#D4A574' : '#95A5A6' }}
            >
              <Home />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => !isRetired && setShowAddBetModal(true)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isRetired 
                  ? 'cursor-not-allowed' 
                  : ''
              }`}
              style={{ color: isRetired ? '#BDC3C7' : '#95A5A6' }}
              disabled={isRetired}
            >
              <div className="p-2 rounded-full shadow-xl" style={{ background: isRetired ? '#BDC3C7' : 'linear-gradient(135deg, #D4A574 0%, #E8B887 100%)' }}>
                <PlusCircle />
              </div>
              <span className="text-xs font-medium">Add Bet</span>
            </button>

            <button
              onClick={() => setCurrentPage('history')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all`}
              style={{ color: currentPage === 'history' ? '#D4A574' : '#95A5A6' }}
            >
              <Clock />
              <span className="text-xs font-medium">History</span>
            </button>

            <button
              onClick={() => setCurrentPage('more')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all`}
              style={{ color: currentPage === 'more' ? '#D4A574' : '#95A5A6' }}
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
