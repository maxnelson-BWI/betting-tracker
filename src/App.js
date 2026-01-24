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

// ============================================
// LOGO COMPONENT
// ============================================
const CindyLogo = () => (
  <div style={{ lineHeight: 1 }}>
    <div style={{
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '26px',
      fontWeight: '700',
      fontStyle: 'italic',
      color: '#2C3E50',
      letterSpacing: '0.5px'
    }}>
      The Cindy
    </div>
    <div style={{
      height: '3px',
      background: 'linear-gradient(90deg, #D4A574 0%, #E8B887 70%, transparent 100%)',
      marginTop: '2px',
      width: '100%',
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

// ============================================
// COLOR SYSTEM & TYPOGRAPHY
// ============================================
const colors = {
  bgPrimary: '#FFF8F0',
  bgSecondary: '#F5E6D3',
  bgElevated: '#FFFFFF',
  accentPrimary: '#D4A574',
  accentWin: '#7C9885',
  accentLoss: '#B85C50',
  accentSystem: '#8B7B9B',
  accentFavoriteTeam: '#E8926F',
  accentPrimeTime: '#6B8CAE',
  textPrimary: '#2C3E50',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5D5C3',
  shadow: 'rgba(212, 165, 116, 0.15)'
};

const headerStyle = {
  fontFamily: 'Outfit, sans-serif',
  fontWeight: '700',
  letterSpacing: '-0.02em'
};

const numberStyle = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum"'
};

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

  // Collapsible sections state - UPDATED
  const [systemExpanded, setSystemExpanded] = useState(false);
  const [breakdownExpanded, setBreakdownExpanded] = useState(false);
  const [teamTimeExpanded, setTeamTimeExpanded] = useState(false);

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

    // Last month calculation - ADDED
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthBets = settledBets.filter(bet => {
      const betDate = new Date(bet.date);
      return betDate.getMonth() === lastMonth && betDate.getFullYear() === lastMonthYear;
    });
    const lastMonthPL = lastMonthBets.reduce((sum, bet) => sum + bet.payout, 0);

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

    // Calculate win streak - ADDED
    let currentStreak = 0;
    for (const bet of settledBets) {
      if (bet.result === 'win') {
        currentStreak++;
      } else if (bet.result === 'loss') {
        break;
      }
    }

    return {
      totalDollars: totalDollars.toFixed(2),
      monthlyLoss: monthlyLoss.toFixed(2),
      lastMonthPL: lastMonthPL.toFixed(2), // ADDED
      totalBets: settledBets.length,
      wins: settledBets.filter(b => b.result === 'win').length,
      losses: settledBets.filter(b => b.result === 'loss').length,
      winRate: settledBets.length ? ((settledBets.filter(b => b.result === 'win').length / settledBets.length) * 100).toFixed(1) : 0,
      winStreak: currentStreak, // ADDED
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bgPrimary }}>
        <div className="text-xl" style={{ color: colors.textSecondary }}>Loading your bets...</div>
      </div>
    );
  }

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'stats':
        return <StatsPage />;
      case 'history':
        return <HistoryPage />;
      case 'more':
        return <MorePage />;
      default:
        return <HomePage />;
    }
  };

  // ============================================
  // HOME PAGE COMPONENT - MATCHES MOCKUP EXACTLY
  // ============================================
  const HomePage = () => (
    <div style={{ paddingBottom: '100px' }}>
      {/* HERO SECTION - Big P/L Number with Add Bet Button */}
      <div style={{
        background: colors.bgElevated,
        borderRadius: '24px',
        padding: '32px 24px',
        marginBottom: '24px',
        boxShadow: `0 4px 12px ${colors.shadow}`,
        textAlign: 'center',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{
          fontSize: '12px',
          color: colors.textSecondary,
          marginBottom: '8px',
          fontWeight: '800',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          ...headerStyle
        }}>
          Total Profit/Loss
        </div>
        <div style={{
          fontSize: '48px',
          fontWeight: '800',
          color: parseFloat(stats.totalDollars) >= 0 ? colors.accentWin : colors.accentLoss,
          marginBottom: '8px',
          letterSpacing: '-2px',
          ...numberStyle
        }}>
          {formatMoney(parseFloat(stats.totalDollars))}
        </div>
        <div style={{
          fontSize: '13px',
          color: colors.textTertiary,
          marginBottom: '24px',
          fontWeight: '500'
        }}>
          {parseFloat(stats.monthlyLoss) >= parseFloat(stats.lastMonthPL) ? '↑' : '↓'} ${Math.abs(parseFloat(stats.monthlyLoss) - parseFloat(stats.lastMonthPL)).toFixed(2)} vs. last month
        </div>
        
        {/* Add Bet Button */}
        <button
          onClick={() => !isRetired && setShowAddBetModal(true)}
          disabled={isRetired}
          style={{
            width: '100%',
            padding: '16px',
            background: isRetired
              ? colors.textTertiary
              : `linear-gradient(135deg, ${colors.accentPrimary} 0%, #C89B6A 100%)`,
            color: colors.textPrimary,
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isRetired ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: `0 4px 12px ${colors.shadow}`
          }}
        >
          <PlusCircle />
          Add New Bet
        </button>
      </div>

      {/* KEY METRICS - 3 Cards in a Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: colors.bgElevated,
          padding: '20px 16px',
          borderRadius: '20px',
          boxShadow: `0 2px 8px ${colors.shadow}`,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>This Month</div>
          <div style={{
            fontSize: '20px',
            fontWeight: '800',
            color: parseFloat(stats.monthlyLoss) >= 0 ? colors.accentWin : colors.accentLoss,
            ...numberStyle
          }}>
            {formatMoney(parseFloat(stats.monthlyLoss))}
          </div>
        </div>

        <div style={{
          background: colors.bgElevated,
          padding: '20px 16px',
          borderRadius: '20px',
          boxShadow: `0 2px 8px ${colors.shadow}`,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Win Rate</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: colors.textPrimary, ...numberStyle }}>
            {stats.winRate}%
          </div>
          <div style={{ fontSize: '10px', color: colors.textTertiary, marginTop: '2px', ...numberStyle }}>
            {stats.wins}W-{stats.losses}L
          </div>
        </div>

        <div style={{
          background: colors.bgElevated,
          padding: '20px 16px',
          borderRadius: '20px',
          boxShadow: `0 2px 8px ${colors.shadow}`,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Streak</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: colors.accentPrimary }}>
            {stats.winStreak >= 1 ? `${stats.winStreak} 🔥` : '—'}
          </div>
        </div>
      </div>

      {/* THE SYSTEM SECTION - Purple Border, Collapsible */}
      <div style={{
        background: colors.bgElevated,
        borderRadius: '20px',
        marginBottom: '24px',
        border: `2px solid ${colors.accentSystem}`,
        boxShadow: `0 4px 12px ${colors.shadow}`,
        overflow: 'hidden'
      }}>
        <button
          onClick={() => setSystemExpanded(!systemExpanded)}
          style={{
            width: '100%',
            padding: '20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrendingUp />
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '12px',
                color: colors.accentSystem,
                fontWeight: '600',
                marginBottom: '2px'
              }}>
                THE SYSTEM
              </div>
              <div style={{ fontSize: '10px', color: colors.textSecondary }}>
                Fade the Public
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: parseFloat(stats.systemDollars) >= 0 ? colors.accentWin : colors.accentLoss,
                ...numberStyle
              }}>
                {formatMoney(parseFloat(stats.systemDollars))}
              </div>
              <div style={{ fontSize: '11px', color: colors.textTertiary }}>
                {stats.systemWinRate}% Win Rate
              </div>
            </div>
            <ChevronDown isOpen={systemExpanded} />
          </div>
        </button>

        {systemExpanded && (
          <div style={{
            padding: '0 20px 20px 20px',
            borderTop: `1px solid ${colors.border}`,
            paddingTop: '20px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>Clear System</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: parseFloat(stats.clearSystemDollars) >= 0 ? colors.accentWin : colors.accentLoss, ...numberStyle }}>
                  {formatMoney(parseFloat(stats.clearSystemDollars))}
                </div>
                <div style={{ fontSize: '10px', color: colors.textTertiary, marginTop: '2px' }}>
                  {stats.clearSystemRecord}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>Kind Of</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: parseFloat(stats.kindOfSystemDollars) >= 0 ? colors.accentWin : colors.accentLoss, ...numberStyle }}>
                  {formatMoney(parseFloat(stats.kindOfSystemDollars))}
                </div>
                <div style={{ fontSize: '10px', color: colors.textTertiary, marginTop: '2px' }}>
                  {stats.kindOfSystemRecord}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>Anti System</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: parseFloat(stats.notSystemDollars) >= 0 ? colors.accentWin : colors.accentLoss, ...numberStyle }}>
                  {formatMoney(parseFloat(stats.notSystemDollars))}
                </div>
                <div style={{ fontSize: '10px', color: colors.textTertiary, marginTop: '2px' }}>
                  {stats.notSystemRecord}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PENDING BETS - Right after System */}
      {pendingBets.length > 0 && (
        <div style={{
          background: colors.bgElevated,
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: `0 2px 8px ${colors.shadow}`,
          border: `1px solid ${colors.border}`
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: '16px',
            margin: '0 0 16px 0',
            ...headerStyle
          }}>
            Pending Bets ({pendingBets.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingBets.map(bet => (
              <BetCard key={bet.id} bet={bet} isPending={true} />
            ))}
          </div>
        </div>
      )}

      {/* RECENT BETS */}
      <div style={{
        background: colors.bgElevated,
        borderRadius: '20px',
        padding: '20px',
        boxShadow: `0 2px 8px ${colors.shadow}`,
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: colors.textPrimary,
            margin: 0,
            ...headerStyle
          }}>
            Recent Bets
          </h3>
          <button
            onClick={() => setCurrentPage('history')}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.accentPrimary,
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            View All →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentBets.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '32px', color: colors.textTertiary }}>
              No bets yet. Add your first bet!
            </p>
          ) : (
            recentBets.map(bet => (
              <BetCard key={bet.id} bet={bet} />
            ))
          )}
        </div>
      </div>
    </div>
  );
  // ============================================
  // STATS PAGE COMPONENT - NEW PAGE
  // ============================================
  const StatsPage = () => (
    <div style={{ paddingBottom: '100px' }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: '24px',
        ...headerStyle
      }}>
        Performance Stats
      </h2>

      {/* Performance Breakdown */}
      <div style={{
        background: colors.bgElevated,
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: `0 2px 8px ${colors.shadow}`,
        border: `1px solid ${colors.border}`
      }}>
        <button
          onClick={() => setBreakdownExpanded(!breakdownExpanded)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: breakdownExpanded ? '16px' : 0
          }}
        >
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: colors.textPrimary,
            margin: 0,
            ...headerStyle
          }}>
            Performance Breakdown
          </h3>
          <ChevronDown isOpen={breakdownExpanded} />
        </button>
        
        {breakdownExpanded && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div style={{
              background: colors.bgSecondary,
              padding: '16px',
              borderRadius: '16px',
              border: `1px solid ${colors.border}`
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary, marginBottom: '12px', margin: '0 0 12px 0' }}>
                By Bet Type
              </h4>
              {Object.keys(stats.byType).length === 0 ? (
                <p style={{ fontSize: '13px', color: colors.textTertiary }}>No settled bets</p>
              ) : (
                Object.entries(stats.byType).map(([type, dollars]) => (
                  <div key={type} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
                    <span style={{ color: colors.textSecondary }}>{formatBetType(type)}</span>
                    <span style={{ color: dollars >= 0 ? colors.accentWin : colors.accentLoss, fontWeight: '600', ...numberStyle }}>
                      {formatMoney(dollars)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div style={{
              background: colors.bgSecondary,
              padding: '16px',
              borderRadius: '16px',
              border: `1px solid ${colors.border}`
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary, marginBottom: '12px', margin: '0 0 12px 0' }}>
                By Sport
              </h4>
              {Object.keys(stats.bySport).length === 0 ? (
                <p style={{ fontSize: '13px', color: colors.textTertiary }}>No settled bets</p>
              ) : (
                Object.entries(stats.bySport).map(([sport, dollars]) => (
                  <div key={sport} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
                    <span style={{ color: colors.textSecondary }}>{sport.toUpperCase()}</span>
                    <span style={{ color: dollars >= 0 ? colors.accentWin : colors.accentLoss, fontWeight: '600', ...numberStyle }}>
                      {formatMoney(dollars)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Favorite Team & Prime Time */}
      <div style={{
        background: colors.bgElevated,
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: `0 2px 8px ${colors.shadow}`,
        border: `1px solid ${colors.border}`
      }}>
        <button
          onClick={() => setTeamTimeExpanded(!teamTimeExpanded)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: teamTimeExpanded ? '16px' : 0
          }}
        >
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: colors.textPrimary,
            margin: 0,
            ...headerStyle
          }}>
            Favorite Team & Prime Time
          </h3>
          <ChevronDown isOpen={teamTimeExpanded} />
        </button>
        
        {teamTimeExpanded && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div style={{
              background: `${colors.accentFavoriteTeam}20`,
              padding: '16px',
              borderRadius: '16px',
              border: `1px solid ${colors.accentFavoriteTeam}40`
            }}>
              <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Favorite Team</div>
              <div style={{
                fontSize: '20px',
                fontWeight: '800',
                color: parseFloat(stats.favoriteTeamDollars) >= 0 ? colors.accentWin : colors.accentLoss,
                marginBottom: '4px',
                ...numberStyle
              }}>
                {formatMoney(parseFloat(stats.favoriteTeamDollars))}
              </div>
              <div style={{ fontSize: '11px', color: colors.textTertiary }}>
                {stats.favoriteTeamRecord}
              </div>
            </div>
            
            <div style={{
              background: `${colors.accentPrimeTime}20`,
              padding: '16px',
              borderRadius: '16px',
              border: `1px solid ${colors.accentPrimeTime}40`
            }}>
              <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Prime Time</div>
              <div style={{
                fontSize: '20px',
                fontWeight: '800',
                color: parseFloat(stats.primeTimeDollars) >= 0 ? colors.accentWin : colors.accentLoss,
                marginBottom: '4px',
                ...numberStyle
              }}>
                {formatMoney(parseFloat(stats.primeTimeDollars))}
              </div>
              <div style={{ fontSize: '11px', color: colors.textTertiary }}>
                {stats.primeTimeRecord}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // HISTORY PAGE COMPONENT
  const HistoryPage = () => (
    <div className="pb-20 animate-fadeIn">
      <div className="rounded-2xl shadow-2xl p-4 md:p-6" style={{ background: colors.bgElevated, border: `1px solid ${colors.border}` }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary, fontFamily: "'Outfit', sans-serif" }}>Bet History</h2>
        
        {/* Filter Pills */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter />
            <button
              onClick={() => setHistoryFilter({...historyFilter, sport: 'all'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.sport === 'all' ? colors.accentPrimary : colors.bgSecondary,
                color: historyFilter.sport === 'all' ? '#FFFFFF' : colors.textPrimary
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
                  background: historyFilter.sport === sport ? colors.accentPrimary : colors.bgSecondary,
                  color: historyFilter.sport === sport ? '#FFFFFF' : colors.textPrimary
                }}
              >
                {sport.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setHistoryFilter({...historyFilter, betType: 'all'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.betType === 'all' ? colors.accentPrimary : colors.bgSecondary,
                color: historyFilter.betType === 'all' ? '#FFFFFF' : colors.textPrimary
              }}
            >
              All Types
            </button>
            {['straight', 'money-line', 'over-under', 'parlay', 'teaser', 'prop'].map(type => (
              <button
                key={type}
                onClick={() => setHistoryFilter({...historyFilter, betType: type})}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
                style={{
                  background: historyFilter.betType === type ? colors.accentPrimary : colors.bgSecondary,
                  color: historyFilter.betType === type ? '#FFFFFF' : colors.textPrimary
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
                background: historyFilter.result === 'all' ? colors.accentPrimary : colors.bgSecondary,
                color: historyFilter.result === 'all' ? '#FFFFFF' : colors.textPrimary
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
                  background: historyFilter.result === result ? colors.accentPrimary : colors.bgSecondary,
                  color: historyFilter.result === result ? '#FFFFFF' : colors.textPrimary
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
                background: historyFilter.favoriteUnderdog === 'all' ? colors.accentPrimary : colors.bgSecondary,
                color: historyFilter.favoriteUnderdog === 'all' ? '#FFFFFF' : colors.textPrimary
              }}
            >
              Fav/Dog
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, favoriteUnderdog: 'favorite'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.favoriteUnderdog === 'favorite' ? colors.accentPrimary : colors.bgSecondary,
                color: historyFilter.favoriteUnderdog === 'favorite' ? '#FFFFFF' : colors.textPrimary
              }}
            >
              Favorites
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, favoriteUnderdog: 'underdog'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.favoriteUnderdog === 'underdog' ? colors.accentPrimary : colors.bgSecondary,
                color: historyFilter.favoriteUnderdog === 'underdog' ? '#FFFFFF' : colors.textPrimary
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
                background: historyFilter.overUnder === 'all' ? colors.accentPrimary : colors.bgSecondary,
                color: historyFilter.overUnder === 'all' ? '#FFFFFF' : colors.textPrimary
              }}
            >
              O/U
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, overUnder: 'over'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.overUnder === 'over' ? colors.accentPrimary : colors.bgSecondary,
                color: historyFilter.overUnder === 'over' ? '#FFFFFF' : colors.textPrimary
              }}
            >
              Overs
            </button>
            <button
              onClick={() => setHistoryFilter({...historyFilter, overUnder: 'under'})}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all`}
              style={{
                background: historyFilter.overUnder === 'under' ? colors.accentPrimary : colors.bgSecondary,
                color: historyFilter.overUnder === 'under' ? '#FFFFFF' : colors.textPrimary
              }}
            >
              Unders
            </button>
          </div>
        </div>

        {/* Time Range Toggle */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setShowAllBets(false)}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all`}
            style={{
              background: !showAllBets ? colors.accentPrimary : colors.bgSecondary,
              color: !showAllBets ? '#FFFFFF' : colors.textSecondary,
              boxShadow: !showAllBets ? `0 4px 12px ${colors.shadow}` : 'none'
            }}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setShowAllBets(true)}
            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all`}
            style={{
              background: showAllBets ? colors.accentPrimary : colors.bgSecondary,
              color: showAllBets ? '#FFFFFF' : colors.textSecondary,
              boxShadow: showAllBets ? `0 4px 12px ${colors.shadow}` : 'none'
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
                <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>Current Filter</div>
                <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  {historyFilter.sport !== 'all' && `${historyFilter.sport.toUpperCase()} • `}
                  {historyFilter.betType !== 'all' && `${formatBetType(historyFilter.betType)} • `}
                  {historyFilter.result !== 'all' && `${historyFilter.result.charAt(0).toUpperCase() + historyFilter.result.slice(1)} • `}
                  {historyFilter.favoriteUnderdog !== 'all' && `${historyFilter.favoriteUnderdog === 'favorite' ? 'Favorites' : 'Underdogs'} • `}
                  {historyFilter.overUnder !== 'all' && `${historyFilter.overUnder === 'over' ? 'Overs' : 'Unders'} • `}
                  {historyFilter.sport === 'all' && historyFilter.betType === 'all' && historyFilter.result === 'all' && historyFilter.favoriteUnderdog === 'all' && historyFilter.overUnder === 'all' && 'All Bets'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>Record & P/L</div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {filteredBets.filter(b => b.result === 'win').length}-{filteredBets.filter(b => b.result === 'loss').length}
                  </span>
                  <span className={`text-lg font-bold`} style={{ color: filteredBets.reduce((sum, b) => sum + b.payout, 0) >= 0 ? colors.accentWin : colors.accentLoss }}>
                    {formatMoney(filteredBets.reduce((sum, b) => sum + b.payout, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm mb-4" style={{ color: colors.textSecondary }}>
          Showing {filteredBets.length} {filteredBets.length === 1 ? 'bet' : 'bets'}
          {!showAllBets && ' (Last 30 days)'}
        </div>

        <div className="space-y-3">
          {filteredBets.length === 0 ? (
            <p className="text-center py-8" style={{ color: colors.textTertiary }}>No bets match your filters</p>
          ) : (
            filteredBets.map(bet => (
              <BetCard key={bet.id} bet={bet} showActions />
            ))
          )}
        </div>
      </div>
    </div>
  );

 /// MORE PAGE COMPONENT
  const MorePage = () => {
    return (
      <div style={{ paddingBottom: '100px' }}>
        <div style={{
          background: colors.bgElevated,
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: `0 2px 8px ${colors.shadow}`,
          border: `1px solid ${colors.border}`
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: colors.textPrimary,
            marginBottom: '24px',
            ...headerStyle
          }}>
            Resources
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '16px',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '30px' }}>{resource.icon}</span>
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  color: colors.textPrimary,
                  flex: 1
                }}>
                  {resource.name}
                </span>
                <ExternalLink />
              </a>
            ))}
          </div>
        </div>

        <div style={{
          background: colors.bgElevated,
          borderRadius: '20px',
          padding: '20px',
          boxShadow: `0 2px 8px ${colors.shadow}`,
          border: `1px solid ${colors.border}`
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: colors.textPrimary,
            marginBottom: '24px',
            ...headerStyle
          }}>
            Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={exportToCSV}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px',
                background: colors.accentPrimary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${colors.shadow}`
              }}
            >
              <Download />
              Export Bet History
            </button>
            
            <button
              onClick={() => setShowRetirementModal(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px',
                background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
                color: '#FFFFFF',
                border: '2px solid rgba(231, 76, 60, 0.5)',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${colors.shadow}`
              }}
            >
              <PowerOff />
              RETIRE
            </button>
          </div>
        </div>
      </div>
    );
  };

  // BET CARD COMPONENT - UPDATED with isPending prop
  const BetCard = ({ bet, showActions = false, isPending = false }) => (
    <div className="rounded-2xl p-4 transition-all duration-200 shadow-xl" style={{ border: `1px solid ${colors.border}`, background: isPending ? colors.bgSecondary : colors.bgElevated }}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ 
              background: colors.accentPrimary, 
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.5px',
              boxShadow: `0 2px 4px ${colors.shadow}`
            }}>
              {getSportLabel(bet.sport)}
            </span>
            <span className="font-semibold" style={{ color: colors.textPrimary, fontFamily: "'Inter', sans-serif" }}>{bet.description}</span>
            {bet.favoriteTeam && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(230, 126, 34, 0.15)', color: '#E67E22', border: '1px solid rgba(230, 126, 34, 0.3)' }}>Fav Team</span>}
            {bet.primeTime && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(93, 173, 226, 0.15)', color: '#5DADE2', border: '1px solid rgba(93, 173, 226, 0.3)' }}>Prime Time</span>}
            {bet.systemPlay !== 'none' && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getSystemColor(bet.systemPlay)}`}>
                {getSystemLabel(bet.systemPlay)}
              </span>
            )}
          </div>
          <div className="text-sm" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif" }}>
            {bet.date} • {bet.sport.toUpperCase()} • {formatBetType(bet.betType)} • {bet.units} units @ {bet.odds > 0 ? '+' : ''}{bet.odds}
          </div>
          <div className="text-xs mt-1" style={{ color: colors.textTertiary, fontFamily: "'Inter', sans-serif", fontFeatureSettings: "'tnum' 1" }}>
            Risk: ${bet.riskAmount.toFixed(2)} | To Win: ${bet.winAmount.toFixed(2)}
          </div>
          {bet.notes && (
            <div className="text-xs mt-1 italic" style={{ color: colors.textTertiary, fontFamily: "'Inter', sans-serif" }}>
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
              color: bet.payout > 0 ? colors.accentWin : bet.payout < 0 ? colors.accentLoss : colors.textTertiary,
              fontFamily: "'Inter', sans-serif",
              fontFeatureSettings: "'tnum' 1"
            }}>
              {formatMoney(bet.payout)}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: `1px solid ${colors.border}` }}>
        <span className={`text-xs font-medium px-2 py-1 rounded`} style={{
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
      setFormData(localFormData);
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
          background: colors.bgElevated,
          borderTop: `1px solid ${colors.border}`,
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
            background: colors.bgElevated,
            borderBottom: `1px solid ${colors.border}`
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{editingBet ? 'Edit Bet' : 'New Bet'}</h2>
          <button
            onClick={cancelEdit}
            className="transition-colors"
            style={{ color: colors.textTertiary }}
          >
            <X />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Date</label>
            <input
              type="date"
              value={localFormData.date}
              onChange={(e) => setLocalFormData({...localFormData, date: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: `1px solid ${colors.border}`, 
                background: colors.bgElevated, 
                color: colors.textPrimary
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Sport</label>
            <select
              value={localFormData.sport}
              onChange={(e) => setLocalFormData({...localFormData, sport: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: `1px solid ${colors.border}`, 
                background: colors.bgElevated, 
                color: colors.textPrimary
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
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Bet Type</label>
            <select
              value={localFormData.betType}
              onChange={(e) => setLocalFormData({...localFormData, betType: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: `1px solid ${colors.border}`, 
                background: colors.bgElevated, 
                color: colors.textPrimary
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
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Units</label>
            <input
              type="number"
              step="0.25"
              value={localFormData.units}
              onChange={(e) => setLocalFormData({...localFormData, units: e.target.value})}
              className="w-full p-2 rounded-lg mb-2"
              style={{ 
                border: `1px solid ${colors.border}`, 
                background: colors.bgElevated, 
                color: colors.textPrimary
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
                  style={{ background: colors.bgSecondary, color: colors.textPrimary }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            {localFormData.units && localFormData.odds && (
              <div className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                Risk: ${calculateRiskAndWin(localFormData.units, localFormData.odds).risk.toFixed(2)} | 
                Win: ${calculateRiskAndWin(localFormData.units, localFormData.odds).win.toFixed(2)}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Odds (American)</label>
            <input
              id="bet-odds"
              type="text"
              value={localFormData.odds}
              onChange={(e) => setLocalFormData({...localFormData, odds: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: `1px solid ${colors.border}`, 
                background: colors.bgElevated, 
                color: colors.textPrimary
              }}
              placeholder="e.g., -110, +150"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Result</label>
            <select
              value={localFormData.result}
              onChange={(e) => setLocalFormData({...localFormData, result: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: `1px solid ${colors.border}`, 
                background: colors.bgElevated, 
                color: colors.textPrimary
              }}
            >
              <option value="pending">Pending</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="push">Push</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Description</label>
            <input
              id="bet-description"
              type="text"
              value={localFormData.description}
              onChange={(e) => setLocalFormData({...localFormData, description: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: `1px solid ${colors.border}`, 
                background: colors.bgElevated, 
                color: colors.textPrimary
              }}
              placeholder="e.g., Chiefs -3 vs Bills"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Notes (Optional)</label>
            <textarea
              id="bet-notes"
              value={localFormData.notes}
              onChange={(e) => setLocalFormData({...localFormData, notes: e.target.value})}
              className="w-full p-2 rounded-lg"
              style={{ 
                border: `1px solid ${colors.border}`, 
                background: colors.bgElevated, 
                color: colors.textPrimary
              }}
              placeholder="e.g., Reverse line movement from -7 to -6.5"
              rows="2"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>System Play Classification</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalFormData({...localFormData, systemPlay: 'clear'})}
                className={`p-2 border-2 rounded-lg text-sm transition-all`}
                style={{
                  borderColor: localFormData.systemPlay === 'clear' ? '#9B59B6' : colors.border,
                  background: localFormData.systemPlay === 'clear' ? 'rgba(155, 89, 182, 0.15)' : colors.bgElevated,
                  color: localFormData.systemPlay === 'clear' ? '#9B59B6' : colors.textSecondary
                }}
              >
                Clear System
              </button>
              <button
                type="button"
                onClick={() => setLocalFormData({...localFormData, systemPlay: 'kind-of'})}
                className={`p-2 border-2 rounded-lg text-sm transition-all`}
                style={{
                  borderColor: localFormData.systemPlay === 'kind-of' ? '#3498DB' : colors.border,
                  background: localFormData.systemPlay === 'kind-of' ? 'rgba(52, 152, 219, 0.15)' : colors.bgElevated,
                  color: localFormData.systemPlay === 'kind-of' ? '#3498DB' : colors.textSecondary
                }}
              >
                Kind Of
              </button>
              <button
                type="button"
                onClick={() => setLocalFormData({...localFormData, systemPlay: 'no-system'})}
                className={`p-2 border-2 rounded-lg text-sm transition-all`}
                style={{
                  borderColor: localFormData.systemPlay === 'no-system' ? '#95A5A6' : colors.border,
                  background: localFormData.systemPlay === 'no-system' ? 'rgba(149, 165, 166, 0.15)' : colors.bgElevated,
                  color: localFormData.systemPlay === 'no-system' ? '#95A5A6' : colors.textSecondary
                }}
              >
                No System
              </button>
              <button
                type="button"
                onClick={() => setLocalFormData({...localFormData, systemPlay: 'not-system'})}
                className={`p-2 border-2 rounded-lg text-sm transition-all`}
                style={{
                  borderColor: localFormData.systemPlay === 'not-system' ? '#E74C3C' : colors.border,
                  background: localFormData.systemPlay === 'not-system' ? 'rgba(231, 76, 60, 0.15)' : colors.bgElevated,
                  color: localFormData.systemPlay === 'not-system' ? '#E74C3C' : colors.textSecondary
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
                style={{ accentColor: colors.accentPrimary }}
              />
              <span className="text-sm" style={{ color: colors.textPrimary }}>Favorite Team</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localFormData.primeTime}
                onChange={(e) => setLocalFormData({...localFormData, primeTime: e.target.checked})}
                className="w-4 h-4 rounded"
                style={{ accentColor: colors.accentPrimary }}
              />
              <span className="text-sm" style={{ color: colors.textPrimary }}>Prime Time Game</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-lg transition-all shadow-xl font-medium"
              style={{ background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, #E8B887 100%)`, color: '#FFFFFF' }}
            >
              {editingBet ? 'Save Changes' : 'Add Bet'}
            </button>
            <button
              onClick={cancelEdit}
              className="flex-1 py-3 rounded-lg transition-all font-medium"
              style={{ background: colors.bgSecondary, color: colors.textSecondary }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: colors.bgPrimary }}>
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
          <div className="rounded-2xl p-6 max-w-md w-full shadow-2xl" style={{ background: colors.bgElevated, border: '2px solid rgba(231, 76, 60, 0.5)' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0" style={{ color: '#E74C3C' }}>
                <PowerOff />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Retirement Mode</h3>
                <p style={{ color: colors.textSecondary }}>How many days do you need to take a break?</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>Days</label>
              <input
                type="number"
                min="1"
                max="30"
                value={retirementDays}
                onChange={(e) => setRetirementDays(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                className="w-full p-3 rounded-lg text-center text-2xl font-bold"
                style={{ 
                  border: `1px solid ${colors.border}`, 
                  background: colors.bgElevated, 
                  color: colors.textPrimary
                }}
              />
              <p className="text-xs mt-2 text-center" style={{ color: colors.textTertiary }}>Once you retire, you cannot add new bets until the period ends.</p>
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
                style={{ background: colors.bgSecondary, color: colors.textSecondary }}
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
          <div className="rounded-2xl p-6 max-w-md w-full shadow-2xl" style={{ background: colors.bgElevated, border: '2px solid rgba(231, 76, 60, 0.5)' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0" style={{ color: '#E74C3C' }}>
                <AlertCircle />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Warning</h3>
                <p style={{ color: colors.textSecondary }}>{warningModal.message}</p>
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
                style={{ background: colors.bgSecondary, color: colors.textSecondary }}
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
          <div className="rounded-2xl p-6 max-w-md w-full shadow-2xl" style={{ background: colors.bgElevated, border: '2px solid rgba(231, 76, 60, 0.5)' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0" style={{ color: '#E74C3C' }}>
                <AlertCircle />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Delete Bet</h3>
                <p style={{ color: colors.textSecondary }}>Are you sure you want to delete this bet? This action cannot be undone.</p>
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
                style={{ background: colors.bgSecondary, color: colors.textSecondary }}
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
            <div className="text-2xl md:text-3xl font-semibold opacity-90" style={{ color: colors.textPrimary }}>
              {daysUntilRetirementEnds} {daysUntilRetirementEnds === 1 ? 'day' : 'days'} remaining
            </div>
          </div>
        </div>
      )}

      {/* Add Bet Modal */}
      {showAddBetModal && !isRetired && <AddBetModal key="add-bet-modal" />}

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto p-4 md:p-6 ${isRetired ? 'opacity-30' : ''}`}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ width: '40px' }} />
          <CindyLogo />
          <button
            onClick={toggleDisplayMode}
            style={{
              padding: '8px 14px',
              background: colors.accentPrimary,
              color: colors.textPrimary,
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: `0 2px 8px ${colors.shadow}`
            }}
          >
            {displayMode === 'dollars' ? '$' : 'U'}
          </button>
        </div>

        {/* Render Current Page */}
        {renderPage()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 shadow-2xl" style={{ background: colors.bgElevated, borderTop: `1px solid ${colors.border}` }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all`}
              style={{ color: currentPage === 'home' ? colors.accentPrimary : colors.textTertiary }}
            >
              <Home />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => setCurrentPage('stats')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                color: currentPage === 'stats' ? colors.accentPrimary : colors.textSecondary,
                flex: '1'
              }}
            >
              <BarChart />
              <span style={{ fontSize: '11px', fontWeight: '500' }}>Stats</span>
            </button>

            <button
              onClick={() => !isRetired && setShowAddBetModal(true)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isRetired 
                  ? 'cursor-not-allowed' 
                  : ''
              }`}
              style={{ color: isRetired ? '#BDC3C7' : colors.textTertiary }}
              disabled={isRetired}
            >
              <div className="p-2 rounded-full shadow-xl" style={{ background: isRetired ? '#BDC3C7' : `linear-gradient(135deg, ${colors.accentPrimary} 0%, #E8B887 100%)` }}>
                <PlusCircle />
              </div>
              <span className="text-xs font-medium">Add Bet</span>
            </button>

            <button
              onClick={() => setCurrentPage('history')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all`}
              style={{ color: currentPage === 'history' ? colors.accentPrimary : colors.textTertiary }}
            >
              <Clock />
              <span className="text-xs font-medium">History</span>
            </button>

            <button
              onClick={() => setCurrentPage('more')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all`}
              style={{ color: currentPage === 'more' ? colors.accentPrimary : colors.textTertiary }}
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
