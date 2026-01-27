import React, { useState, useEffect, useMemo, useRef, memo, useCallback } from 'react';
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

const ChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
// Search Icon - NEW
const Search = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// ============================================
/// ============================================
// ANIMATED NUMBER COMPONENT
// ============================================
const AnimatedNumber = memo(({ value, formatFn, duration = 1500, style = {} }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = displayValue;
    const endValue = value;

    // Skip if no meaningful change
    if (Math.abs(startValue - endValue) < 0.01) {
      return;
    }

    setIsAnimating(true);
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeProgress;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]); // Only depend on value, not displayValue

  return (
    <span 
      style={{
        ...style,
        transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
        display: 'inline-block',
        transition: 'transform 0.2s ease'
      }}
    >
      {formatFn(displayValue)}
    </span>
  );
});

// ============================================
// SPARKLINE COMPONENT
// ============================================
const Sparkline = memo(({ data, width = 100, height = 30, color }) => {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  
  const pathD = `M ${points.join(' L ')}`;
  const trendColor = color || (data[data.length - 1] >= data[0] ? '#7C9885' : '#B85C50');
  
  return (
    <svg width={width} height={height} style={{ display: 'block', margin: '0 auto' }}>
      <path
        d={pathD}
        fill="none"
        stroke={trendColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r="3"
        fill={trendColor}
      />
    </svg>
  );
});

// ============================================
// LOGO COMPONENT
// ============================================
const CindyLogo = memo(() => (
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
));

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
accentSystem: '#6B8CAE',
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

const getSportLabel = (sport) => {
  const labels = {
    'nfl': 'NFL',
    'nba': 'NBA',
    'mlb': 'MLB',
    'nhl': 'NHL',
    'ncaaf': 'NCAAF',
    'ncaab': 'NCAAB',
    'boxing': 'Boxing/UFC',
    'other': 'OTHER'
  };
  return labels[sport?.toLowerCase()] || 'OTHER';
};

const formatBetType = (type) => {
  if (type === 'money-line') return 'ML';
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// ============================================
// SMART DEFAULT SPORT FUNCTION
// ============================================
const getDefaultSport = () => {
  const now = new Date();
  const month = now.getMonth(); // 0-11 (Jan = 0)
  const day = now.getDate(); // 1-31
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0;
  const isMonday = dayOfWeek === 1;
  const isThursday = dayOfWeek === 4;
  
  // Sept 1 - Dec 31: Football season
  if (month >= 8 && month <= 11) {
    if (isSaturday) return 'ncaaf';
    if (isThursday || isSunday || isMonday) return 'nfl';
    return 'ncaaf'; // Tue/Wed/Fri = NCAAF (MACtion, weeknight CFB)
  }
  
  // Jan 1 - Jan 15
  if (month === 0 && day <= 15) {
    if (isSaturday || isSunday || isMonday) return 'nfl'; // NFL Playoffs
    return 'ncaab'; // Tue/Wed/Thu/Fri = College hoops
  }
  
  // Jan 16 - Feb 14: NFL Playoffs / Super Bowl
  if ((month === 0 && day >= 16) || (month === 1 && day <= 14)) {
    return 'nfl';
  }
  
  // Feb 15 - April 7: March Madness season
  if ((month === 1 && day >= 15) || month === 2 || (month === 3 && day <= 7)) {
    return 'ncaab';
  }
  
  // April 8 - April 15: Gap period
  if (month === 3 && day >= 8 && day <= 15) {
    return 'mlb';
  }
  
  // April 16 - June 20: NBA Playoffs
  if ((month === 3 && day >= 16) || month === 4 || (month === 5 && day <= 20)) {
    return 'nba';
  }
  
  // June 21 - Aug 31: Baseball season
  if ((month === 5 && day >= 21) || month === 6 || month === 7) {
    return 'mlb';
  }
  
  // Fallback (shouldn't hit this)
  return '';
};



// SearchBar Component - search as you type with debounce
const SearchBar = memo(({ searchQuery, setSearchQuery, colors }) => {
  const [localValue, setLocalValue] = React.useState(searchQuery);
  const debounceRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalValue(value);
    
    // Debounce: wait 300ms after typing stops
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
      // Restore focus after state update
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
  };

  React.useEffect(() => {
    if (searchQuery === '' && localValue !== '') {
      setLocalValue('');
    }
  }, [searchQuery]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: colors.textTertiary,
        pointerEvents: 'none'
      }}>
        <Search />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search bets..."
        value={localValue}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '12px 40px',
          background: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          fontSize: '16px',
          color: colors.textPrimary,
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            setSearchQuery('');
            if (debounceRef.current) {
              clearTimeout(debounceRef.current);
            }
          }}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: colors.textTertiary,
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X />
        </button>
      )}
    </div>
  );
});

// ============================================
// BET CARD COMPONENT (Memoized - moved outside App for performance)
// ============================================
const BetCard = memo(({ 
  bet, 
  showActions = false, 
  isPending = false,
  colors,
  formatMoney,
  onUpdateResult,
  onStartEdit,
  onDelete,
  isRetired
}) => (
  <div style={{ 
    background: colors.bgSecondary, 
    borderRadius: '20px', 
    padding: '16px', 
    border: `1px solid ${colors.border}`,
    boxShadow: `0 2px 8px ${colors.shadow}`
  }}>
    {/* Top Row: Sport Badge + Description + P/L Amount */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <span style={{ 
          background: colors.accentPrimary, 
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: '700',
          padding: '6px 14px',
          borderRadius: '8px',
          letterSpacing: '0.3px'
        }}>
          {getSportLabel(bet.sport)}
        </span>
        <span style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary }}>
          {bet.description}
        </span>
      </div>
      {bet.result !== 'pending' && (
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '800', 
          color: bet.payout >= 0 ? colors.accentWin : colors.accentLoss,
          ...numberStyle
        }}>
          {formatMoney(bet.payout)}
        </div>
      )}
    </div>

    {/* Second Row: Date • Sport • Units @ Odds */}
    <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '6px' }}>
      {bet.date} • {getSportLabel(bet.sport)} • {bet.units}u @ {bet.odds > 0 ? '+' : ''}{bet.odds}
    </div>

    {/* Third Row: Risk and Win amounts */}
    <div style={{ fontSize: '12px', color: colors.textTertiary, marginBottom: '12px' }}>
      Risk: ${bet.riskAmount.toFixed(2)} | To Win: ${bet.winAmount.toFixed(2)}
    </div>

    {/* Bottom Section */}
    {bet.result === 'pending' ? (
      <div>
        {/* Win/Loss/Push buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: showActions && !isRetired ? '12px' : '0' }}>
          <button
            onClick={() => onUpdateResult(bet.id, 'win')}
            style={{
              flex: 1,
              padding: '12px 16px',
              minHeight: '48px',
              background: colors.accentWin,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            WIN
          </button>
          <button
            onClick={() => onUpdateResult(bet.id, 'loss')}
            style={{
              flex: 1,
              padding: '12px 16px',
              minHeight: '48px',
              background: colors.accentLoss,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            LOSS
          </button>
          <button
            onClick={() => onUpdateResult(bet.id, 'push')}
            style={{
              flex: 1,
              padding: '12px 16px',
              minHeight: '48px',
              background: colors.textTertiary,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            PUSH
          </button>
        </div>
        
        {/* Edit/Delete on separate row for pending */}
        {showActions && !isRetired && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '16px',
            paddingTop: '8px',
            borderTop: `1px solid ${colors.border}`
          }}>
            <button
              onClick={() => onStartEdit(bet)}
              style={{
                background: 'transparent',
                border: 'none',
                color: colors.accentPrimary,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(bet.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#E74C3C',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: '700',
          padding: '8px 16px',
          borderRadius: '8px',
          background: bet.result === 'win' ? 'rgba(124, 152, 133, 0.2)' : 
                      bet.result === 'loss' ? 'rgba(184, 92, 80, 0.2)' : 
                      'rgba(156, 163, 175, 0.2)',
          color: bet.result === 'win' ? colors.accentWin : 
                 bet.result === 'loss' ? colors.accentLoss : 
                 colors.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {bet.result}
        </span>
        
        {showActions && !isRetired && (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={() => onStartEdit(bet)}
              style={{
                background: 'transparent',
                border: 'none',
                color: colors.accentPrimary,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(bet.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#E74C3C',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    )}
  </div>
));

function App() {
      const [bets, setBets] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
// Theme state removed - was unused
const [showAddBetModal, setShowAddBetModal] = useState(false);
const [addBetStep, setAddBetStep] = useState(1); // NEW: Multi-step modal
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
    sport: getDefaultSport(),
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
const [showFilters, setShowFilters] = useState(false); // NEW: Collapsible filters
const [searchQuery, setSearchQuery] = useState(''); // NEW: Search functionality
const [showFilterModal, setShowFilterModal] = useState(false); // NEW: Filter modal
const [quickAddMode, setQuickAddMode] = useState(true); // Quick Add on by default
const searchInputRef = useRef(null);


// Collapsible sections state
const [systemExpanded, setSystemExpanded] = useState(false);
const [recentPerfExpanded, setRecentPerfExpanded] = useState(false);
const [trendsExpanded, setTrendsExpanded] = useState(false);

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

  const formatMoney = useCallback((dollarAmount) => {
    if (displayMode === 'units') {
      const units = dollarAmount / unitValue;
      return `${units >= 0 ? '+' : ''}${units.toFixed(2)}u`;
    } else {
      return `${dollarAmount >= 0 ? '+' : ''}$${Math.abs(dollarAmount).toFixed(2)}`;
    }
  }, [displayMode, unitValue]);

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

  // Parse bet details to determine favorite/underdog and over/under
  const parseBetDetails = (bet) => {
    const desc = bet.description || '';
    const odds = parseFloat(bet.odds);
    const betType = bet.betType || '';
    
    // Determine favorite/underdog based on bet type
    let favoriteUnderdog = 'none';
    
    // Teasers, Parlays, Futures, Props: skip entirely (not useful indicators)
    if (['teaser', 'parlay', 'longshot-parlay', 'future', 'prop'].includes(betType)) {
      favoriteUnderdog = 'none';
    }
    // Straight bets and Over/Under: check description for spread
    else if (betType === 'straight' || betType === 'over-under') {
      // +number = underdog (getting points), -number = favorite (giving points)
      if (/\+\s*\d/.test(desc)) {
        favoriteUnderdog = 'underdog';
      } else if (/(?:^|\s)-\s*\d/.test(desc)) {
        favoriteUnderdog = 'favorite';
      }
    }
    // Money Line: check odds field
    else if (betType === 'money-line') {
      if (odds > 0) {
        favoriteUnderdog = 'underdog';
      } else if (odds < 0) {
        favoriteUnderdog = 'favorite';
      }
    }
    
    // Determine over/under from description (applies to all bet types)
    let overUnder = 'none';
    const descLower = desc.toLowerCase();
    
    if (/\bo\s*\d/i.test(desc) || descLower.includes('over')) {
      overUnder = 'over';
    } else if (/\bu\s*\d/i.test(desc) || descLower.includes('under')) {
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
        sport: getDefaultSport(),
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

  const startEdit = useCallback((bet) => {
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
  }, []);

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
        sport: getDefaultSport(),
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
      sport: getDefaultSport(),
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

  const updateBetResult = useCallback(async (id, result) => {
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
  }, [bets]);

  const deleteBet = useCallback((id) => {
    setDeleteModal({ show: true, betId: id });
  }, []);

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'bets', deleteModal.betId));
      setDeleteModal({ show: false, betId: null });
    } catch (error) {
      console.error("Error deleting bet:", error);
    }
  };

// Key Trends Analysis - Short-Term & All-Time
  const trends = useMemo(() => {
    const settledBets = bets.filter(b => b.result !== 'pending' && b.result !== 'push');
    
    // Get bets from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBets = settledBets.filter(bet => new Date(bet.date) >= thirtyDaysAgo);

    // Helper function to analyze a set of bets
    const analyzeBets = (betsToAnalyze, minBets) => {
      const combinations = {};

      betsToAnalyze.forEach(bet => {
        const { favoriteUnderdog, overUnder } = parseBetDetails(bet);
        const sport = bet.sport?.toUpperCase() || 'OTHER';
        const betType = formatBetType(bet.betType);
        const systemPlay = bet.systemPlay;

        // Helper to add to a combination
        const addToCombination = (key, label) => {
          if (!combinations[key]) {
            combinations[key] = { key, label, bets: [], wins: 0, losses: 0, payout: 0 };
          }
          combinations[key].bets.push(bet);
          combinations[key].payout += bet.payout;
          if (bet.result === 'win') combinations[key].wins++;
          if (bet.result === 'loss') combinations[key].losses++;
        };

        // Sport + Bet Type (e.g., "NFL Spread")
        addToCombination(`${sport}-${bet.betType}`, `${sport} ${betType}`);

        // Sport + Favorite/Underdog (e.g., "NFL Favorites")
        if (favoriteUnderdog !== 'none') {
          const favDogLabel = favoriteUnderdog === 'favorite' ? 'Favorites' : 'Underdogs';
          addToCombination(`${sport}-${favoriteUnderdog}`, `${sport} ${favDogLabel}`);
        }

        // Sport + Over/Under (e.g., "NFL Overs")
        if (overUnder !== 'none') {
          const ouLabel = overUnder === 'over' ? 'Overs' : 'Unders';
          addToCombination(`${sport}-${overUnder}`, `${sport} ${ouLabel}`);
        }

        // Bet Type + Favorite/Underdog (e.g., "ML Underdogs")
        if (favoriteUnderdog !== 'none') {
          const favDogLabel = favoriteUnderdog === 'favorite' ? 'Favorites' : 'Underdogs';
          addToCombination(`${bet.betType}-${favoriteUnderdog}`, `${betType} ${favDogLabel}`);
        }

        // Sport + Bet Type + Favorite/Underdog (e.g., "NFL ML Underdogs")
        if (favoriteUnderdog !== 'none') {
          const favDogLabel = favoriteUnderdog === 'favorite' ? 'Favorites' : 'Underdogs';
          addToCombination(`${sport}-${bet.betType}-${favoriteUnderdog}`, `${sport} ${betType} ${favDogLabel}`);
        }

        // Sport + System Play (e.g., "NFL Clear System")
        if (systemPlay && systemPlay !== 'none' && systemPlay !== 'no-system') {
          const systemLabel = systemPlay === 'clear' ? 'Clear System' : systemPlay === 'kind-of' ? 'Kind Of System' : 'Anti System';
          addToCombination(`${sport}-${systemPlay}`, `${sport} ${systemLabel}`);
        }

        // Favorite Team bets
        if (bet.favoriteTeam) {
          addToCombination('favorite-team', 'Favorite Team Bets');
          addToCombination(`${sport}-favorite-team`, `${sport} Favorite Team`);
        }

        // Prime Time bets
        if (bet.primeTime) {
          addToCombination('prime-time', 'Prime Time Bets');
          addToCombination(`${sport}-prime-time`, `${sport} Prime Time`);
        }
      });

      // Filter to minimum bets and calculate significance
      const validCombos = Object.values(combinations)
        .filter(combo => combo.bets.length >= minBets)
        .map(combo => {
          const winRate = combo.wins / combo.bets.length;
          const significance = Math.abs(combo.payout) * Math.sqrt(combo.bets.length / 10);
          return {
            ...combo,
            winRate,
            significance,
            record: `${combo.wins}-${combo.losses}`
          };
        });

      return validCombos;
    };

    // Analyze all-time trends (10+ bets)
    const allTimeCombos = analyzeBets(settledBets, 10);
    
    // Analyze recent trends (5+ bets in last 30 days)
    const recentCombos = analyzeBets(recentBets, 5);

    // Create a map of recent performance by key for badge lookup
    const recentPerformanceMap = {};
    recentCombos.forEach(combo => {
      recentPerformanceMap[combo.key] = {
        payout: combo.payout,
        bets: combo.bets.length,
        winRate: combo.winRate
      };
    });

    // Add "hot recently" flag to all-time trends
    const allTimeWithHotFlag = allTimeCombos.map(combo => {
      const recent = recentPerformanceMap[combo.key];
      // Hot if: has 3+ bets in last 30 days AND positive P/L recently
      const isHotRecently = recent && recent.bets >= 3 && recent.payout > 0;
      return {
        ...combo,
        isHotRecently,
        recentPayout: recent?.payout || 0,
        recentBets: recent?.bets || 0
      };
    });

    // Split into winning and losing, sort by significance
    const allTimeWinning = allTimeWithHotFlag
      .filter(c => c.payout > 0)
      .sort((a, b) => b.significance - a.significance)
      .slice(0, 3);

    const allTimeLosing = allTimeWithHotFlag
      .filter(c => c.payout < 0)
      .sort((a, b) => b.significance - a.significance)
      .slice(0, 3);

    // Recent/Hot trends (last 30 days only)
    const recentWinning = recentCombos
      .filter(c => c.payout > 0)
      .sort((a, b) => b.significance - a.significance)
      .slice(0, 3);

    const recentLosing = recentCombos
      .filter(c => c.payout < 0)
      .sort((a, b) => b.significance - a.significance)
      .slice(0, 3);

    return {
      allTime: { winning: allTimeWinning, losing: allTimeLosing },
      recent: { winning: recentWinning, losing: recentLosing }
    };
  }, [bets]);
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
      totalDollars: totalDollars,
      monthlyLoss: monthlyLoss,
      lastMonthPL: lastMonthPL.toFixed(2),
      totalBets: settledBets.length,
      wins: settledBets.filter(b => b.result === 'win').length,
      losses: settledBets.filter(b => b.result === 'loss').length,
      winRate: settledBets.length ? ((settledBets.filter(b => b.result === 'win').length / settledBets.length) * 100).toFixed(1) : 0,
      winStreak: currentStreak,
      byType,
      bySport,
      favoriteTeamDollars: favoriteTeamBets.reduce((sum, bet) => sum + bet.payout, 0),
      favoriteTeamRecord: `${favoriteTeamBets.filter(b => b.result === 'win').length}-${favoriteTeamBets.filter(b => b.result === 'loss').length}`,
      primeTimeDollars: primeTimeBets.reduce((sum, bet) => sum + bet.payout, 0),
      primeTimeRecord: `${primeTimeBets.filter(b => b.result === 'win').length}-${primeTimeBets.filter(b => b.result === 'loss').length}`,
      systemDollars: systemBets.reduce((sum, bet) => sum + bet.payout, 0),
      systemRecord: `${systemBets.filter(b => b.result === 'win').length}-${systemBets.filter(b => b.result === 'loss').length}`,
      systemWinRate: systemBets.length ? ((systemBets.filter(b => b.result === 'win').length / systemBets.length) * 100).toFixed(1) : 0,
      clearSystemDollars: clearSystemBets.reduce((sum, bet) => sum + bet.payout, 0),
      clearSystemRecord: `${clearSystemBets.filter(b => b.result === 'win').length}-${clearSystemBets.filter(b => b.result === 'loss').length}`,
      kindOfSystemDollars: kindOfSystemBets.reduce((sum, bet) => sum + bet.payout, 0),
      notSystemDollars: notSystemBets.reduce((sum, bet) => sum + bet.payout, 0),
      kindOfSystemRecord: `${kindOfSystemBets.filter(b => b.result === 'win').length}-${kindOfSystemBets.filter(b => b.result === 'loss').length}`,
      notSystemRecord: `${notSystemBets.filter(b => b.result === 'win').length}-${notSystemBets.filter(b => b.result === 'loss').length}`,
      monthlyLossWarning: monthlyLoss < -monthlyLimit,
    totalLossWarning: totalDollars < -5000,
      // Sparkline data: cumulative P/L over last 20 settled bets (oldest to newest)
      sparklineData: (() => {
        const last20 = settledBets.slice(0, 20).reverse();
        let cumulative = 0;
        return last20.map(bet => {
          cumulative += bet.payout;
          return cumulative;
        });
      })(),
      // Pending exposure stats
      pendingCount: bets.filter(b => b.result === 'pending').length,
      pendingRisk: bets.filter(b => b.result === 'pending').reduce((sum, b) => sum + (b.riskAmount || 0), 0),
      pendingToWin: bets.filter(b => b.result === 'pending').reduce((sum, b) => sum + (b.winAmount || 0), 0)
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
    // Search filter - NEW
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(bet => {
        const description = (bet.description || '').toLowerCase();
        const notes = (bet.notes || '').toLowerCase();
        return description.includes(query) || notes.includes(query);
      });
    }

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
        return <HistoryPage 
          colors={colors}
          filteredBets={filteredBets}
          historyFilter={historyFilter}
          setHistoryFilter={setHistoryFilter}
          showAllBets={showAllBets}
          setShowAllBets={setShowAllBets}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          getSportLabel={getSportLabel}
          formatBetType={formatBetType}
          formatMoney={formatMoney}
          updateBetResult={updateBetResult}
          startEdit={startEdit}
          deleteBet={deleteBet}
          isRetired={isRetired}
        />;
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
        borderRadius: '20px',
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
          <AnimatedNumber 
  value={stats.totalDollars} 
  formatFn={formatMoney}
/>
        </div>
        
        <div style={{
          fontSize: '13px',
          color: colors.textTertiary,
          marginBottom: '16px',
          fontWeight: '500'
        }}>
          {parseFloat(stats.monthlyLoss) >= parseFloat(stats.lastMonthPL) ? '↑' : '↓'} ${Math.abs(parseFloat(stats.monthlyLoss) - parseFloat(stats.lastMonthPL)).toFixed(2)} vs. last month
        </div>

        {/* Pending Exposure Widget */}
        {stats.pendingCount > 0 && (
          <div style={{
            background: colors.bgSecondary,
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>⏳</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: colors.textPrimary }}>
                {stats.pendingCount} Active {stats.pendingCount === 1 ? 'Bet' : 'Bets'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: colors.textTertiary }}>Risk</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: colors.accentLoss, ...numberStyle }}>
                  ${stats.pendingRisk.toFixed(0)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: colors.textTertiary }}>To Win</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: colors.accentWin, ...numberStyle }}>
                  ${stats.pendingToWin.toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Add Bet Button */}
        <button
          onClick={() => { if (!isRetired) { setAddBetStep(1); setShowAddBetModal(true); } }}
          disabled={isRetired}
          style={{
            width: '100%',
            padding: '16px',
            background: isRetired
              ? colors.textTertiary
              : `linear-gradient(135deg, ${colors.accentPrimary} 0%, #C89B6A 100%)`,
            color: colors.textPrimary,
            border: 'none',
            borderRadius: '12px',
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
            <AnimatedNumber 
              value={parseFloat(stats.monthlyLoss)} 
              formatFn={formatMoney}
            />
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
{systemExpanded ? <ChevronUp /> : <ChevronDown />}
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
              <BetCard 
                key={bet.id} 
                bet={bet} 
                isPending={true}
                colors={colors}
                formatMoney={formatMoney}
                onUpdateResult={updateBetResult}
                onStartEdit={startEdit}
                onDelete={deleteBet}
                isRetired={isRetired}
              />
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
    fontWeight: '700',  // Changed from 600 to 700
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
              <BetCard 
                key={bet.id} 
                bet={bet}
                colors={colors}
                formatMoney={formatMoney}
                onUpdateResult={updateBetResult}
                onStartEdit={startEdit}
                onDelete={deleteBet}
                isRetired={isRetired}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
  
// Helper function to get trend message
  const getTrendMessage = (index, isWinning, isAllTime) => {
    if (isWinning) {
      if (isAllTime) {
        return index === 0 ? "These have been your top plays" : "This is working";
      } else {
        return "On fire lately";
      }
    } else {
      if (isAllTime) {
        return index === 0 ? "Your worst plays" : "This hasn't been working";
      } else {
        return "Cold streak";
      }
    }
  };
  // ============================================
  // STATS PAGE COMPONENT - WITH KEY TRENDS
  // ============================================
  const StatsPage = () => (
    <div style={{ paddingBottom: '100px' }}>
      {/* Recent Performance - Collapsible */}
      {stats.sparklineData && stats.sparklineData.length >= 2 && (
        <div style={{
          background: colors.bgElevated,
          borderRadius: '20px',
          marginBottom: '16px',
          border: `1px solid ${colors.border}`,
          boxShadow: `0 2px 8px ${colors.shadow}`,
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setRecentPerfExpanded(!recentPerfExpanded)}
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
              <span style={{ fontSize: '20px' }}>📈</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary, ...headerStyle }}>
                Recent Performance
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: stats.sparklineData[stats.sparklineData.length - 1] >= 0 ? colors.accentWin : colors.accentLoss,
                ...numberStyle
              }}>
                {stats.sparklineData[stats.sparklineData.length - 1] >= 0 ? '+' : ''}${stats.sparklineData[stats.sparklineData.length - 1].toFixed(0)}
              </div>
              <div style={{ color: colors.textTertiary }}>
                {recentPerfExpanded ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>
          </button>

          {recentPerfExpanded && (
            <div style={{
              padding: '0 20px 20px 20px',
              borderTop: `1px solid ${colors.border}`
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '20px',
                paddingTop: '20px'
              }}>
                <Sparkline data={stats.sparklineData} width={200} height={50} />
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: colors.textTertiary, 
                textAlign: 'center',
                marginTop: '12px'
              }}>
                Cumulative P/L over last {stats.sparklineData.length} settled bets
              </div>
            </div>
          )}
        </div>
      )}
      {/* KEY TRENDS SECTION - Collapsible */}
      <div style={{
        background: colors.bgElevated,
        borderRadius: '20px',
        marginBottom: '16px',
        border: `1px solid ${colors.border}`,
        boxShadow: `0 2px 8px ${colors.shadow}`,
        overflow: 'hidden'
      }}>
        <button
          onClick={() => setTrendsExpanded(!trendsExpanded)}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>📈</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary, ...headerStyle }}>
              Key Trends
            </span>
          </div>
          <div style={{ color: colors.textTertiary }}>
            {trendsExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>
        </button>

        {trendsExpanded && (
          <div style={{ padding: '0 20px 20px 20px', borderTop: `1px solid ${colors.border}` }}>
            {/* HOT RIGHT NOW - Last 30 Days */}
            {(trends.recent.winning.length > 0 || trends.recent.losing.length > 0) && (
              <div style={{ marginBottom: '24px', marginTop: '20px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: colors.accentPrimary,
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  🔥 HOT RIGHT NOW
                  <span style={{ fontSize: '11px', fontWeight: '500', color: colors.textTertiary }}>(Last 30 Days)</span>
                </div>
                
                {/* Recent Winning */}
                {trends.recent.winning.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: trends.recent.losing.length > 0 ? '12px' : '0' }}>
                    {trends.recent.winning.map((trend, index) => (
                      <div key={trend.key} style={{
                        background: 'rgba(124, 152, 133, 0.1)',
                        border: `1px solid rgba(124, 152, 133, 0.3)`,
                        borderRadius: '12px',
                        padding: '12px 14px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                              {trend.label}
                            </div>
                            <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '2px' }}>
                              {trend.record} ({(trend.winRate * 100).toFixed(0)}%) • {getTrendMessage(index, true, false)}
                            </div>
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '800', color: colors.accentWin, ...numberStyle }}>
                            {formatMoney(trend.payout)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent Losing */}
                {trends.recent.losing.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {trends.recent.losing.map((trend, index) => (
                      <div key={trend.key} style={{
                        background: 'rgba(184, 92, 80, 0.1)',
                        border: `1px solid rgba(184, 92, 80, 0.3)`,
                        borderRadius: '12px',
                        padding: '12px 14px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                              {trend.label}
                            </div>
                            <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '2px' }}>
                              {trend.record} ({(trend.winRate * 100).toFixed(0)}%) • {getTrendMessage(index, false, false)}
                            </div>
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '800', color: colors.accentLoss, ...numberStyle }}>
                            {formatMoney(trend.payout)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ALL-TIME TRENDS */}
            {(trends.allTime.winning.length > 0 || trends.allTime.losing.length > 0) ? (
              <div style={{ marginTop: (trends.recent.winning.length > 0 || trends.recent.losing.length > 0) ? '0' : '20px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: colors.textSecondary,
                  marginBottom: '12px'
                }}>
                  📊 ALL-TIME TRENDS
                </div>
                
                {/* All-Time Winning */}
                {trends.allTime.winning.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: colors.accentWin, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Where You're Winning
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {trends.allTime.winning.map((trend, index) => (
                        <div key={trend.key} style={{
                          background: 'rgba(124, 152, 133, 0.1)',
                          border: `1px solid rgba(124, 152, 133, 0.3)`,
                          borderRadius: '12px',
                          padding: '14px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '15px', fontWeight: '600', color: colors.textPrimary }}>
                                {trend.label}
                              </span>
                              {trend.isHotRecently && (
                                <span style={{
                                  fontSize: '10px',
                                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                                  color: '#FFFFFF',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  fontWeight: '700'
                                }}>
                                  🔥 HOT
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '17px', fontWeight: '800', color: colors.accentWin, ...numberStyle }}>
                              {formatMoney(trend.payout)}
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                              {trend.record} ({(trend.winRate * 100).toFixed(1)}%)
                            </div>
                            <div style={{ fontSize: '11px', color: colors.accentWin, fontStyle: 'italic' }}>
                              {getTrendMessage(index, true, true)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All-Time Losing */}
                {trends.allTime.losing.length > 0 && (
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: colors.accentLoss, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Where You're Losing
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {trends.allTime.losing.map((trend, index) => (
                        <div key={trend.key} style={{
                          background: 'rgba(184, 92, 80, 0.1)',
                          border: `1px solid rgba(184, 92, 80, 0.3)`,
                          borderRadius: '12px',
                          padding: '14px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: colors.textPrimary }}>
                              {trend.label}
                            </div>
                            <div style={{ fontSize: '17px', fontWeight: '800', color: colors.accentLoss, ...numberStyle }}>
                              {formatMoney(trend.payout)}
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                              {trend.record} ({(trend.winRate * 100).toFixed(1)}%)
                            </div>
                            <div style={{ fontSize: '11px', color: colors.accentLoss, fontStyle: 'italic' }}>
                              {getTrendMessage(index, false, true)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not enough data message */
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ fontSize: '13px', color: colors.textTertiary }}>
                  Need more settled bets to identify trends (10+ per category)
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* By Sport */}
      <div style={{
        background: colors.bgElevated,
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '16px',
        border: `1px solid ${colors.border}`,
        boxShadow: `0 2px 8px ${colors.shadow}`
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary, marginBottom: '16px', margin: '0 0 16px 0', ...headerStyle }}>
          By Sport
        </h3>
        {Object.keys(stats.bySport).length === 0 ? (
          <p style={{ fontSize: '13px', color: colors.textTertiary }}>No settled bets</p>
        ) : (
          Object.entries(stats.bySport).map(([sport, dollars]) => (
            <div key={sport} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 0',
              borderBottom: `1px solid ${colors.border}`
            }}>
<span style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>{getSportLabel(sport)}</span>              <span style={{
                fontSize: '15px',
                fontWeight: '800',
                color: dollars >= 0 ? colors.accentWin : colors.accentLoss,
                ...numberStyle
              }}>
                {formatMoney(dollars)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* By Bet Type */}
      <div style={{
        background: colors.bgElevated,
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '16px',
        border: `1px solid ${colors.border}`,
        boxShadow: `0 2px 8px ${colors.shadow}`
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary, marginBottom: '16px', margin: '0 0 16px 0', ...headerStyle }}>
          By Bet Type
        </h3>
        {Object.keys(stats.byType).length === 0 ? (
          <p style={{ fontSize: '13px', color: colors.textTertiary }}>No settled bets</p>
        ) : (
          Object.entries(stats.byType).map(([type, dollars]) => (
            <div key={type} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 0',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>{formatBetType(type)}</span>
              <span style={{
                fontSize: '15px',
                fontWeight: '800',
                color: dollars >= 0 ? colors.accentWin : colors.accentLoss,
                ...numberStyle
              }}>
                {formatMoney(dollars)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Favorite Team Stats */}
      <div style={{
        background: colors.bgElevated,
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '16px',
        border: `2px solid ${colors.accentFavoriteTeam}`,
        boxShadow: `0 2px 8px ${colors.shadow}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: colors.accentFavoriteTeam
          }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary, margin: 0, ...headerStyle }}>
            Favorite Team
          </h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: '600' }}>Total P/L</span>
          <span style={{
            fontSize: '20px',
            fontWeight: '800',
            color: parseFloat(stats.favoriteTeamDollars) >= 0 ? colors.accentWin : colors.accentLoss,
            ...numberStyle
          }}>
            {formatMoney(parseFloat(stats.favoriteTeamDollars))}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: '600' }}>Record</span>
          <span style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary, ...numberStyle }}>
            {stats.favoriteTeamRecord}
          </span>
        </div>
      </div>

      {/* Prime Time Stats */}
      <div style={{
        background: colors.bgElevated,
        borderRadius: '20px',
        padding: '20px',
        border: `2px solid ${colors.accentPrimeTime}`,
        boxShadow: `0 2px 8px ${colors.shadow}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: colors.accentPrimeTime
          }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary, margin: 0, ...headerStyle }}>
            Prime Time
          </h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: '600' }}>Total P/L</span>
          <span style={{
            fontSize: '20px',
            fontWeight: '800',
            color: parseFloat(stats.primeTimeDollars) >= 0 ? colors.accentWin : colors.accentLoss,
            ...numberStyle
          }}>
            {formatMoney(parseFloat(stats.primeTimeDollars))}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: '600' }}>Record</span>
          <span style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary, ...numberStyle }}>
            {stats.primeTimeRecord}
          </span>
        </div>
      </div>
    </div>
  );

  // HISTORY PAGE COMPONENT - Redesigned with 2-row filters + More button
  const HistoryPage = ({ 
    colors, 
    filteredBets, 
    historyFilter, 
    setHistoryFilter, 
    showAllBets, 
    setShowAllBets, 
    searchQuery, 
    setSearchQuery,
    getSportLabel,
    formatBetType,
    formatMoney,
    updateBetResult,
    startEdit,
    deleteBet,
    isRetired
  }) => {
    // Count active filters in the "More" modal
    const moreFilterCount = [
      historyFilter.result !== 'all',
      historyFilter.favoriteUnderdog !== 'all',
      historyFilter.overUnder !== 'all'
    ].filter(Boolean).length;

    return (
      <div style={{ paddingBottom: '100px' }}>
        {/* Header */}
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: colors.textPrimary, 
          marginBottom: '16px',
          ...headerStyle 
        }}>
          Bet History
        </h2>

        {/* Search Bar */}
        <div style={{ marginBottom: '16px' }}>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} colors={colors} />
        </div>

        {/* Sport Filter Pills */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto', 
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch'
          }}>
            {['all', 'nfl', 'ncaaf', 'nba', 'ncaab', 'mlb', 'boxing'].map(sport => (
              <button
                key={sport}
                onClick={() => setHistoryFilter({...historyFilter, sport})}
                style={{
                  padding: '10px 16px',
                  background: historyFilter.sport === sport ? colors.accentPrimary : colors.bgSecondary,
                  color: historyFilter.sport === sport ? '#FFFFFF' : colors.textPrimary,
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {sport === 'all' ? 'All Sports' : getSportLabel(sport)}
              </button>
            ))}
          </div>
        </div>

        {/* Bet Type Filter Pills */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto', 
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch'
          }}>
            {['all', 'straight', 'money-line', 'over-under', 'parlay', 'teaser', 'prop'].map(type => (
              <button
                key={type}
                onClick={() => setHistoryFilter({...historyFilter, betType: type})}
                style={{
                  padding: '10px 16px',
                  background: historyFilter.betType === type ? colors.accentPrimary : colors.bgSecondary,
                  color: historyFilter.betType === type ? '#FFFFFF' : colors.textPrimary,
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {type === 'all' ? 'All Types' : 
                 type === 'straight' ? 'Spread' : 
                 type === 'money-line' ? 'ML' : 
                 type === 'over-under' ? 'O/U' :
                 formatBetType(type)}
              </button>
            ))}
          </div>
        </div>

        {/* More Filters Button + Time Range - Same Row */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '16px',
          alignItems: 'center'
        }}>
          {/* More Filters Button */}
          <button
            onClick={() => setShowFilterModal(true)}
            style={{
              padding: '12px 16px',
              background: moreFilterCount > 0 ? colors.accentPrimary : colors.bgElevated,
              color: moreFilterCount > 0 ? '#FFFFFF' : colors.textPrimary,
              border: `1px solid ${moreFilterCount > 0 ? colors.accentPrimary : colors.border}`,
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <Filter />
            More Filters
            {moreFilterCount > 0 && (
              <span style={{
                background: '#FFFFFF',
                color: colors.accentPrimary,
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '700'
              }}>
                {moreFilterCount}
              </span>
            )}
          </button>

          {/* Time Range Toggle */}
          <div style={{ display: 'flex', flex: 1, gap: '8px' }}>
            <button
              onClick={() => setShowAllBets(false)}
              style={{
                flex: 1,
                padding: '12px',
                background: !showAllBets ? colors.accentPrimary : colors.bgSecondary,
                color: !showAllBets ? '#FFFFFF' : colors.textSecondary,
                border: 'none',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              30 Days
            </button>
            <button
              onClick={() => setShowAllBets(true)}
              style={{
                flex: 1,
                padding: '12px',
                background: showAllBets ? colors.accentPrimary : colors.bgSecondary,
                color: showAllBets ? '#FFFFFF' : colors.textSecondary,
                border: 'none',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(historyFilter.result !== 'all' || historyFilter.favoriteUnderdog !== 'all' || historyFilter.overUnder !== 'all') && (
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            flexWrap: 'wrap', 
            marginBottom: '16px' 
          }}>
            {historyFilter.result !== 'all' && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(212, 165, 116, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: colors.textPrimary
              }}>
                {historyFilter.result.charAt(0).toUpperCase() + historyFilter.result.slice(1)}
                <button
                  onClick={() => setHistoryFilter({...historyFilter, result: 'all'})}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: colors.textSecondary,
                    fontSize: '14px',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </span>
            )}
            {historyFilter.favoriteUnderdog !== 'all' && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(212, 165, 116, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: colors.textPrimary
              }}>
                {historyFilter.favoriteUnderdog === 'favorite' ? 'Favorites' : 'Underdogs'}
                <button
                  onClick={() => setHistoryFilter({...historyFilter, favoriteUnderdog: 'all'})}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: colors.textSecondary,
                    fontSize: '14px',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </span>
            )}
            {historyFilter.overUnder !== 'all' && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(212, 165, 116, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: colors.textPrimary
              }}>
                {historyFilter.overUnder === 'over' ? 'Overs' : 'Unders'}
                <button
                  onClick={() => setHistoryFilter({...historyFilter, overUnder: 'all'})}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: colors.textSecondary,
                    fontSize: '14px',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Summary */}
        {filteredBets.length > 0 && (
          <div style={{
            background: colors.bgElevated,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            border: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '2px' }}>
                {filteredBets.length} {filteredBets.length === 1 ? 'bet' : 'bets'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary, ...numberStyle }}>
                {filteredBets.filter(b => b.result === 'win').length}W - {filteredBets.filter(b => b.result === 'loss').length}L
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '2px' }}>P/L</div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '800', 
                color: filteredBets.reduce((sum, b) => sum + b.payout, 0) >= 0 ? colors.accentWin : colors.accentLoss,
                ...numberStyle 
              }}>
                {formatMoney(filteredBets.reduce((sum, b) => sum + b.payout, 0))}
              </div>
            </div>
          </div>
        )}

        {/* Bet List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredBets.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '32px', color: colors.textTertiary }}>
              {searchQuery ? `No bets found matching "${searchQuery}"` : 'No bets match your filters'}
            </p>
          ) : (
            filteredBets.map(bet => (
              <BetCard 
                key={bet.id} 
                bet={bet} 
                showActions
                colors={colors}
                formatMoney={formatMoney}
                onUpdateResult={updateBetResult}
                onStartEdit={startEdit}
                onDelete={deleteBet}
                isRetired={isRetired}
              />
            ))
          )}
        </div>
      </div>
    );
  };

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
            fontSize: '18px',
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: '20px',
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
                  borderRadius: '12px',
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
            fontSize: '18px',
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: '20px',
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
                borderRadius: '12px',
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
                borderRadius: '12px',
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

        <div style={{
          background: colors.bgElevated,
          borderRadius: '20px',
          padding: '20px',
          boxShadow: `0 2px 8px ${colors.shadow}`,
          border: `1px solid ${colors.border}`
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: '20px',
            ...headerStyle
          }}>
            Settings
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Unit Value */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textPrimary, marginBottom: '8px' }}>
                Unit Value ($)
              </label>
              <input
                type="number"
                step="1"
                value={unitValue}
                onChange={(e) => setUnitValue(parseFloat(e.target.value) || 50)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: colors.textPrimary
                }}
              />
              <p style={{ fontSize: '11px', color: colors.textTertiary, marginTop: '4px' }}>
                Applies to future bets only
              </p>
              </div>

            {/* Monthly Limit */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.textPrimary, marginBottom: '8px' }}>
                Monthly Loss Limit ($)
              </label>
              <input
                type="number"
                step="100"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(parseFloat(e.target.value) || 1500)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: colors.textPrimary
                }}
              />
            </div>

            {/* Notifications */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: colors.textPrimary, marginBottom: '12px', margin: '0 0 12px 0' }}>
                Notifications
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Big Bet */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div
  onClick={() => setNotificationSettings({
    ...notificationSettings,
    bigBet: { ...notificationSettings.bigBet, enabled: !notificationSettings.bigBet.enabled }
  })}
  style={{
    width: '42px',
    height: '24px',
    background: notificationSettings.bigBet.enabled ? colors.accentWin : colors.textTertiary,
    borderRadius: '12px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }}
>
  <div style={{
    position: 'absolute',
    right: notificationSettings.bigBet.enabled ? '2px' : 'auto',
    left: notificationSettings.bigBet.enabled ? 'auto' : '2px',
    top: '2px',
    width: '20px',
    height: '20px',
    background: '#FFFFFF',
    borderRadius: '50%',
    transition: 'all 0.2s ease'
  }} />
</div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                      Big Bet Warning
                    </span>
                  </label>
                  {notificationSettings.bigBet.enabled && (
                    <input
                      type="number"
                      step="0.5"
                      value={notificationSettings.bigBet.threshold}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        bigBet: { ...notificationSettings.bigBet, threshold: parseFloat(e.target.value) || 4 }
                      })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: colors.bgSecondary,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: colors.textPrimary
                      }}
                      placeholder="Threshold (units)"
                    />
                  )}
                </div>

                {/* Favorite Team */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        favoriteTeam: { ...notificationSettings.favoriteTeam, enabled: !notificationSettings.favoriteTeam.enabled }
                      })}
                      style={{
                        width: '42px',
                        height: '24px',
                        background: notificationSettings.favoriteTeam.enabled ? colors.accentWin : colors.textTertiary,
                        borderRadius: '12px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        right: notificationSettings.favoriteTeam.enabled ? '2px' : 'auto',
                        left: notificationSettings.favoriteTeam.enabled ? 'auto' : '2px',
                        top: '2px',
                        width: '20px',
                        height: '20px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        transition: 'all 0.2s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                      Favorite Team Warning
                    </span>
                  </label>
                  {notificationSettings.favoriteTeam.enabled && (
                    <div>
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
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: colors.bgSecondary,
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                          fontSize: '13px',
                          color: colors.textPrimary
                        }}
                        placeholder="Threshold (percentile)"
                      />
                      <p style={{ fontSize: '11px', color: colors.textTertiary, marginTop: '4px' }}>
                        0.75 = top 75% of bets
                      </p>
                    </div>
                  )}
                </div>

                {/* Monthly Limit */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        monthlyLimit: { ...notificationSettings.monthlyLimit, enabled: !notificationSettings.monthlyLimit.enabled }
                      })}
                      style={{
                        width: '42px',
                        height: '24px',
                        background: notificationSettings.monthlyLimit.enabled ? colors.accentWin : colors.textTertiary,
                        borderRadius: '12px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        right: notificationSettings.monthlyLimit.enabled ? '2px' : 'auto',
                        left: notificationSettings.monthlyLimit.enabled ? 'auto' : '2px',
                        top: '2px',
                        width: '20px',
                        height: '20px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        transition: 'all 0.2s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                      Monthly Limit Warning
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  // ============================================
  // ADD BET MODAL - NEW MULTI-STEP VERSION
  // ============================================
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

    const handleQuickSubmit = () => {
      if (!localFormData.sport || !localFormData.betType || !localFormData.description || !localFormData.units || !localFormData.odds) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      handleSubmit();
    };
    const handleStepContinue = () => {
      if (addBetStep === 1) {
        if (!localFormData.sport || !localFormData.betType || !localFormData.description || !localFormData.units || !localFormData.odds) {
          showToast('Please fill in all required fields', 'error');
          return;
        }
        // Sync to parent state before changing step
        setFormData(localFormData);
        setAddBetStep(2);
      } else if (addBetStep === 2) {
        // Sync to parent state before changing step
        setFormData(localFormData);
        setAddBetStep(3);
      } else if (addBetStep === 3) {
        handleSubmit();
      }
    };

    const calculateRiskWin = () => {
      if (!localFormData.units || !localFormData.odds) return { risk: 0, win: 0 };
      return calculateRiskAndWin(localFormData.units, localFormData.odds);
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
            minHeight: '85vh',
            maxHeight: '85vh'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 10,
            background: colors.bgElevated,
            borderBottom: `1px solid ${colors.border}`,
            padding: '12px 16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>
                {editingBet ? 'Edit Bet' : (quickAddMode ? 'Quick Add' : `Step ${addBetStep} of 3`)}
              </h2>
              <button
                onClick={cancelEdit}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.textTertiary }}
              >
                <X />
              </button>
            </div>
            
            {/* Quick Add Toggle - only when adding new bet */}
            {!editingBet && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: `1px solid ${colors.border}`
              }}>
                <span style={{ fontSize: '13px', color: colors.textSecondary }}>Quick Add Mode</span>
                <div
                  onClick={() => {
                    setQuickAddMode(!quickAddMode);
                    setAddBetStep(1);
                  }}
                  style={{
                    width: '42px',
                    height: '24px',
                    background: quickAddMode ? colors.accentPrimary : colors.textTertiary,
                    borderRadius: '12px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    right: quickAddMode ? '2px' : 'auto',
                    left: quickAddMode ? 'auto' : '2px',
                    top: '2px',
                    width: '20px',
                    height: '20px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease'
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Step Indicator - hide in Quick Add mode */}
          {!editingBet && !quickAddMode && (
            <div style={{ padding: '16px 20px', display: 'flex', gap: '8px' }}>
              {[1, 2, 3].map(step => (
                <div key={step} style={{
                  flex: 1,
                  height: '4px',
                  background: step <= addBetStep ? colors.accentPrimary : colors.bgSecondary,
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }} />
              ))}
            </div>
          )}

          <div style={{ padding: '16px' }}>
            {/* STEP 1: THE BASICS */}
            {(addBetStep === 1 || editingBet) && (
              <div>
                {!editingBet && (
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '20px' }}>
                    The Basics
                  </h3>
                )}

                {/* Date */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '8px' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={localFormData.date}
                    onChange={(e) => {
                      setLocalFormData({...localFormData, date: e.target.value});
                      e.target.blur(); // Auto-close the picker after selection
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: colors.textPrimary,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Sport Selection */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: colors.textSecondary, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Sport
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { name: 'NFL', value: 'nfl' },
                      { name: 'NCAAF', value: 'ncaaf' },
                      { name: 'NBA', value: 'nba' },
                      { name: 'NCAAB', value: 'ncaab' },
                      { name: 'MLB', value: 'mlb' },
                      { name: 'Boxing/UFC', value: 'boxing' },
                      { name: 'Other', value: 'other' }
                    ].map(sport => (
                      <button
                        key={sport.value}
                        type="button"
                        onClick={() => setLocalFormData({ ...localFormData, sport: sport.value })}
                        style={{
                          padding: '14px 8px',
                          background: localFormData.sport === sport.value ? colors.accentPrimary : colors.bgSecondary,
                          border: `2px solid ${localFormData.sport === sport.value ? colors.accentPrimary : colors.border}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: localFormData.sport === sport.value ? '#FFFFFF' : colors.textPrimary,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {sport.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bet Type Selection */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: colors.textSecondary, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Bet Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { name: 'Spread', value: 'straight' },
                      { name: 'ML', value: 'money-line' },
                      { name: 'O/U', value: 'over-under' },
                      { name: 'Parlay', value: 'parlay' },
                      { name: 'Teaser', value: 'teaser' },
                      { name: 'Prop', value: 'prop' },
                      { name: 'Future', value: 'future' },
                      { name: '+500 Parlay', value: 'longshot-parlay' }
                    ].map(type => (
  <button
    key={type.value}
    type="button"
    onClick={() => {
      const newData = { ...localFormData, betType: type.value };
      // Auto-fill -110 for spread and over-under if odds is empty
      if ((type.value === 'straight' || type.value === 'over-under') && !localFormData.odds) {
        newData.odds = '-110';
      }
      setLocalFormData(newData);
    }}
                        style={{
                          padding: '12px 8px',
                          background: localFormData.betType === type.value ? colors.accentPrimary : colors.bgSecondary,
                          border: `2px solid ${localFormData.betType === type.value ? colors.accentPrimary : colors.border}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: localFormData.betType === type.value ? '#FFFFFF' : colors.textPrimary,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '8px' }}>
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Chiefs -3 vs Bills"
                    value={localFormData.description}
                    onChange={(e) => setLocalFormData({ ...localFormData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: colors.textPrimary,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    autoComplete="off"
                  />
                </div>

                {/* Units */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '12px' }}>
                    Units
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {quickAddButtons.map(btn => (
                      <button
                        key={btn.value}
                        type="button"
                        onClick={() => setLocalFormData({ ...localFormData, units: btn.value.toString() })}
                        style={{
                          flex: 1,
                          padding: '14px',
                          background: localFormData.units === btn.value.toString() ? colors.accentPrimary : colors.bgSecondary,
                          border: `2px solid ${localFormData.units === btn.value.toString() ? colors.accentPrimary : colors.border}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: localFormData.units === btn.value.toString() ? '#FFFFFF' : colors.textPrimary,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    step="0.25"
                    value={localFormData.units}
                    onChange={(e) => setLocalFormData({ ...localFormData, units: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: colors.textPrimary,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {localFormData.units && localFormData.odds && (
                    <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '8px' }}>
                      Risk: ${calculateRiskWin().risk.toFixed(2)} | To Win: ${calculateRiskWin().win.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Odds */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '8px' }}>
                    Odds (American)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., -110 or +150"
                    value={localFormData.odds}
                    onChange={(e) => setLocalFormData({ ...localFormData, odds: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: colors.textPrimary,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    autoComplete="off"
                  />
                </div>

              {!editingBet && (
                  <button
                    onClick={quickAddMode ? handleQuickSubmit : handleStepContinue}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, #C89B6A 100%)`,
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {quickAddMode ? 'Add Bet' : 'Continue'}
                    {!quickAddMode && <ArrowRight />}
                  </button>
                )}
              </div>
            )}

            {/* STEP 2: OPTIONAL DETAILS */}
            {addBetStep === 2 && !editingBet && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '8px' }}>
                  Additional Details
                </h3>
                <p style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '20px' }}>
                  Optional - Skip if you want to add the bet quickly
                </p>

                {/* System Classification */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: colors.textSecondary, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    System Play Classification
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {[
                      { name: 'Clear System', value: 'clear', color: colors.accentSystem },
                      { name: 'Kind Of', value: 'kind-of', color: '#6B8CAE' },
                      { name: 'No System', value: 'no-system', color: colors.textSecondary },
                      { name: 'Anti System', value: 'not-system', color: colors.accentLoss }
                    ].map(sys => (
                      <button
                        key={sys.value}
                        type="button"
                        onClick={() => setLocalFormData({...localFormData, systemPlay: sys.value})}
                        style={{
                          padding: '14px',
                          background: localFormData.systemPlay === sys.value ? sys.color + '20' : colors.bgSecondary,
                          border: `2px solid ${localFormData.systemPlay === sys.value ? sys.color : colors.border}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: localFormData.systemPlay === sys.value ? sys.color : colors.textPrimary,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {sys.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: colors.bgSecondary,
                    borderRadius: '12px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    border: `1px solid ${colors.border}`
                  }}>
                    <input
                      type="checkbox"
                      checked={localFormData.favoriteTeam}
                      onChange={(e) => setLocalFormData({...localFormData, favoriteTeam: e.target.checked})}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: colors.accentPrimary }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: colors.textPrimary }}>
                      Favorite Team
                    </span>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: colors.bgSecondary,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: `1px solid ${colors.border}`
                  }}>
                    <input
                      type="checkbox"
                      checked={localFormData.primeTime}
                      onChange={(e) => setLocalFormData({...localFormData, primeTime: e.target.checked})}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: colors.accentPrimary }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: colors.textPrimary }}>
                      Prime Time Game
                    </span>
                  </label>
                </div>

                {/* Notes */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '8px' }}>
                    Notes (Optional)
                  </label>
                  <textarea
                    placeholder="e.g., Reverse line movement..."
                    rows="3"
                    value={localFormData.notes}
                    onChange={(e) => setLocalFormData({...localFormData, notes: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: colors.textPrimary,
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                    autoComplete="off"
                  />
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <button
                    onClick={() => { setFormData(localFormData); setAddBetStep(1); }}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: colors.bgSecondary,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <ArrowLeft />
                    Back
                  </button>
                  <button
                    onClick={handleStepContinue}
                    style={{
                      flex: 2,
                      padding: '16px',
                      background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, #C89B6A 100%)`,
                      color: colors.textPrimary,
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Continue
                    <ArrowRight />
                  </button>
                </div>

                {/* Skip Button */}
                <button
                  onClick={handleStepContinue}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    color: colors.textSecondary,
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Skip & Continue
                </button>
              </div>
            )}

            {/* STEP 3: REVIEW & CONFIRM */}
            {addBetStep === 3 && !editingBet && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary, marginBottom: '20px' }}>
                  Review Your Bet
                </h3>

                {/* Summary Card */}
                <div style={{
                  background: colors.bgSecondary,
                  padding: '20px',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  border: `1px solid ${colors.border}`
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>
                      Description
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: colors.textPrimary }}>
                      {localFormData.description}
                    </div>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '16px',
                    paddingTop: '16px',
                    borderTop: `1px solid ${colors.border}`
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Sport</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                        {getSportLabel(localFormData.sport)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Bet Type</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                        {formatBetType(localFormData.betType)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Units</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                        {localFormData.units}u
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Odds</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                        {localFormData.odds > 0 ? '+' : ''}{localFormData.odds}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: `1px solid ${colors.border}`,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Risk Amount</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: colors.accentLoss }}>
                        ${calculateRiskWin().risk.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>To Win</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: colors.accentWin }}>
                        ${calculateRiskWin().win.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => { setFormData(localFormData); setAddBetStep(2); }}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: colors.bgSecondary,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <ArrowLeft />
                    Back
                  </button>
                  <button
                    onClick={handleStepContinue}
                    style={{
                      flex: 2,
                      padding: '16px',
                      background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, #C89B6A 100%)`,
                      color: colors.textPrimary,
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Place Bet
                  </button>
                </div>
              </div>
            )}

            {/* EDIT MODE - Show all fields + Result */}
            {editingBet && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '8px' }}>
                    Result
                  </label>
                  <select
                    value={localFormData.result}
                    onChange={(e) => setLocalFormData({...localFormData, result: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: colors.textPrimary
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="push">Push</option>
                  </select>
                </div>

                {/* System Classification for Edit */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: colors.textSecondary, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    System Play
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {[
                      { name: 'Clear System', value: 'clear', color: colors.accentSystem },
                      { name: 'Kind Of', value: 'kind-of', color: '#6B8CAE' },
                      { name: 'No System', value: 'no-system', color: colors.textSecondary },
                      { name: 'Anti System', value: 'not-system', color: colors.accentLoss }
                    ].map(sys => (
                      <button
                        key={sys.value}
                        type="button"
                        onClick={() => setLocalFormData({...localFormData, systemPlay: sys.value})}
                        style={{
                          padding: '14px',
                          background: localFormData.systemPlay === sys.value ? sys.color + '20' : colors.bgSecondary,
                          border: `2px solid ${localFormData.systemPlay === sys.value ? sys.color : colors.border}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: localFormData.systemPlay === sys.value ? sys.color : colors.textPrimary,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {sys.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkboxes for Edit */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={localFormData.favoriteTeam}
                      onChange={(e) => setLocalFormData({...localFormData, favoriteTeam: e.target.checked})}
                      style={{ width: '18px', height: '18px', accentColor: colors.accentPrimary }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '500', color: colors.textPrimary }}>Favorite Team</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={localFormData.primeTime}
                      onChange={(e) => setLocalFormData({...localFormData, primeTime: e.target.checked})}
                      style={{ width: '18px', height: '18px', accentColor: colors.accentPrimary }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '500', color: colors.textPrimary }}>Prime Time</span>
                  </label>
                </div>

                {/* Notes for Edit */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '8px' }}>
                    Notes (Optional)
                  </label>
                  <textarea
                    rows="2"
                    value={localFormData.notes}
                    onChange={(e) => setLocalFormData({...localFormData, notes: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: colors.textPrimary,
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                    autoComplete="off"
                  />
                </div>

                {/* Edit Mode Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleSubmit}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, #C89B6A 100%)`,
                      color: colors.textPrimary,
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: colors.bgSecondary,
                      color: colors.textSecondary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Filter Modal Component
  const FilterModal = () => {
    if (!showFilterModal) return null;
    
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 100,
          backdropFilter: 'blur(4px)'
        }}
        onClick={() => setShowFilterModal(false)}
      >
        <div
          style={{
            background: colors.bgElevated,
            borderRadius: '20px 20px 0 0',
            padding: '20px',
            width: '100%',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.textPrimary, margin: 0, ...headerStyle }}>
              More Filters
            </h3>
            <button
              onClick={() => setShowFilterModal(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textTertiary }}
            >
              <X />
            </button>
          </div>

          {/* Result */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: colors.textSecondary, marginBottom: '10px', textTransform: 'uppercase' }}>
              Result
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['all', 'win', 'loss', 'push', 'pending'].map(result => (
                <button
                  key={result}
                  onClick={() => setHistoryFilter({...historyFilter, result})}
                  style={{
                    padding: '10px 16px',
                    background: historyFilter.result === result ? colors.accentPrimary : colors.bgSecondary,
                    color: historyFilter.result === result ? '#FFFFFF' : colors.textPrimary,
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {result === 'all' ? 'All' : result.charAt(0).toUpperCase() + result.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite/Underdog */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: colors.textSecondary, marginBottom: '10px', textTransform: 'uppercase' }}>
              Side
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['all', 'favorite', 'underdog'].map(side => (
                <button
                  key={side}
                  onClick={() => setHistoryFilter({...historyFilter, favoriteUnderdog: side})}
                  style={{
                    padding: '10px 16px',
                    background: historyFilter.favoriteUnderdog === side ? colors.accentPrimary : colors.bgSecondary,
                    color: historyFilter.favoriteUnderdog === side ? '#FFFFFF' : colors.textPrimary,
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {side === 'all' ? 'All' : side.charAt(0).toUpperCase() + side.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Over/Under */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: colors.textSecondary, marginBottom: '10px', textTransform: 'uppercase' }}>
              Total
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['all', 'over', 'under'].map(ou => (
                <button
                  key={ou}
                  onClick={() => setHistoryFilter({...historyFilter, overUnder: ou})}
                  style={{
                    padding: '10px 16px',
                    background: historyFilter.overUnder === ou ? colors.accentPrimary : colors.bgSecondary,
                    color: historyFilter.overUnder === ou ? '#FFFFFF' : colors.textPrimary,
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {ou === 'all' ? 'All' : ou.charAt(0).toUpperCase() + ou.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                setHistoryFilter({ ...historyFilter, result: 'all', favoriteUnderdog: 'all', overUnder: 'all' });
              }}
              style={{
                flex: 1,
                padding: '14px',
                background: colors.bgSecondary,
                color: colors.textSecondary,
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear All
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              style={{
                flex: 2,
                padding: '14px',
                background: colors.accentPrimary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Apply Filters
            </button>
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

      {/* Filter Modal */}
      <FilterModal />

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
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
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
              onClick={() => { if (!isRetired) { setAddBetStep(1); setShowAddBetModal(true); } }}
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
