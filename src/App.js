import React, { useState, useEffect, useMemo, useRef, memo, useCallback } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, googleProvider } from './firebase';
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

// LogOut Icon
const LogOut = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

// ============================================
// LOGIN PAGE COMPONENT
// ============================================
// ============================================
// DESKTOP LANDING PAGE COMPONENT
// ============================================
const DesktopLandingPage = memo(({ colors, onContinue, onViewTutorial }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: '56px',
          fontWeight: '700',
          fontStyle: 'italic',
          color: '#2C3E50',
          letterSpacing: '0.5px'
        }}>
          The Cindy
        </div>
        <div style={{
          height: '5px',
          background: 'linear-gradient(90deg, #D4A574 0%, #E8B887 70%, transparent 100%)',
          marginTop: '8px',
          width: '280px',
          borderRadius: '3px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }} />
      </div>

      {/* Main Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '32px',
        padding: '48px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 12px 48px rgba(212, 165, 116, 0.15)',
        border: '1px solid #E5D5C3',
        textAlign: 'center'
      }}>
        {/* Phone Frame with App Preview */}
        <div style={{
          width: '200px',
          height: '400px',
          background: '#1a1a1a',
          borderRadius: '36px',
          padding: '12px',
          margin: '0 auto 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 0 0 2px #333',
          position: 'relative'
        }}>
          {/* Notch */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '24px',
            background: '#1a1a1a',
            borderRadius: '0 0 16px 16px',
            zIndex: 10
          }} />
          {/* Screen */}
          <div style={{
            width: '100%',
            height: '100%',
            background: '#FFF8F0',
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Mini App UI */}
            <div style={{
              padding: '40px 12px 12px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box'
            }}>
              {/* Mini Header */}
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  fontWeight: '700',
                  color: '#2C3E50'
                }}>The Cindy</div>
                <div style={{
                  height: '2px',
                  width: '60px',
                  background: 'linear-gradient(90deg, #D4A574, #E8B887)',
                  margin: '2px auto 0',
                  borderRadius: '1px'
                }} />
              </div>
              
              {/* Mini Hero */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '8px',
                boxShadow: '0 2px 8px rgba(212,165,116,0.15)'
              }}>
                <div style={{ fontSize: '7px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  Total Profit/Loss
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#7C9885', marginBottom: '8px' }}>
                  +$847.50
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #D4A574, #C89B6A)',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '9px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>+ Add New Bet</div>
              </div>
              
              {/* Mini Stats */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                <div style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 2px 8px rgba(212,165,116,0.1)' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#7C9885' }}>+$215</div>
                  <div style={{ fontSize: '6px', color: '#9CA3AF', marginTop: '2px' }}>This Month</div>
                </div>
                <div style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 2px 8px rgba(212,165,116,0.1)' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#2C3E50' }}>54.2%</div>
                  <div style={{ fontSize: '6px', color: '#9CA3AF', marginTop: '2px' }}>Win Rate</div>
                </div>
                <div style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 2px 8px rgba(212,165,116,0.1)' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#D4A574' }}>3 🔥</div>
                  <div style={{ fontSize: '6px', color: '#9CA3AF', marginTop: '2px' }}>Streak</div>
                </div>
              </div>
              
              {/* Mini Nav */}
              <div style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '8px 0',
                background: 'white',
                borderRadius: '12px'
              }}>
                {[true, false, false, false, false].map((active, i) => (
                  <div key={i} style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: active ? '#D4A574' : '#E5D5C3'
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#2C3E50',
          marginBottom: '12px',
          fontFamily: 'Georgia, "Times New Roman", serif'
        }}>
          Get the App
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          marginBottom: '24px',
          lineHeight: '1.6'
        }}>
          The Cindy is designed for mobile. Visit on your phone to install.
        </p>

        {/* Install Instructions */}
        <div style={{
          background: '#F5E6D3',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#2C3E50', marginBottom: '12px' }}>
            How to Install:
          </p>
          <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.8' }}>
            <div><strong>iPhone:</strong> Open in Safari → Tap <span style={{ display: 'inline-block', background: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>⬆️ Share</span> → "Add to Home Screen"</div>
            <div style={{ marginTop: '8px' }}><strong>Android:</strong> Open in Chrome → Tap <span style={{ display: 'inline-block', background: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>⋮ Menu</span> → "Add to Home Screen"</div>
          </div>
        </div>

        {/* Dark Footer CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #2C3E50 0%, #1a252f 100%)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
            Or continue on desktop
          </p>
          <button
            onClick={onContinue}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #D4A574 0%, #C89B6A 100%)',
              color: '#FFFFFF',
              padding: '14px 32px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(212, 165, 116, 0.3)'
            }}
          >
            Start tracking bets →
          </button>
          
          {/* VIEW TUTORIAL BUTTON */}
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={onViewTutorial}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '12px 24px',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '16px' }}>📖</span>
              See How It Works
            </button>
          </div>
        </div>
      </div>

      <p style={{ marginTop: '40px', fontSize: '13px', color: '#9CA3AF' }}>
        A betting tracker for people who fade the public
      </p>
    </div>
  );
});

// ============================================
// MOBILE ONBOARDING COMPONENT
// ============================================
const MobileOnboarding = memo(({ colors, onContinue, onDismiss }) => {
  const [isIOS] = useState(() => /iPad|iPhone|iPod/.test(navigator.userAgent));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '60px 24px 40px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Section - Logo */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: '42px',
          fontWeight: '700',
          fontStyle: 'italic',
          color: '#2C3E50',
          letterSpacing: '0.5px'
        }}>
          The Cindy
        </div>
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #D4A574 0%, #E8B887 70%, transparent 100%)',
          marginTop: '6px',
          width: '200px',
          borderRadius: '2px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }} />
      </div>

      {/* Middle Section - Install Card */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 24px',
          boxShadow: '0 8px 32px rgba(212, 165, 116, 0.15)',
          border: '1px solid #E5D5C3'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#2C3E50',
            marginBottom: '20px',
            textAlign: 'center',
            fontFamily: 'Georgia, serif'
          }}>
            Add to Home Screen
          </h2>

          {/* iOS Instructions */}
          {isIOS ? (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 0', borderBottom: '1px solid #F5E6D3' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #D4A574 0%, #C89B6A 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}>1</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', color: '#2C3E50', lineHeight: '1.5', margin: 0 }}>
                    Tap the <strong>Share</strong> button in Safari
                  </p>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#F5E6D3',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '14px',
                    marginTop: '8px'
                  }}>⬆️ Share</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 0', borderBottom: '1px solid #F5E6D3' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #D4A574 0%, #C89B6A 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}>2</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', color: '#2C3E50', lineHeight: '1.5', margin: 0 }}>
                    Scroll down and tap
                  </p>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#F5E6D3',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '14px',
                    marginTop: '8px'
                  }}>➕ Add to Home Screen</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 0' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #D4A574 0%, #C89B6A 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}>3</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', color: '#2C3E50', lineHeight: '1.5', margin: 0 }}>
                    Tap <strong>Add</strong>
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Android Instructions */
            <>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 0', borderBottom: '1px solid #F5E6D3' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #D4A574 0%, #C89B6A 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}>1</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', color: '#2C3E50', lineHeight: '1.5', margin: 0 }}>
                    Tap the <strong>Menu</strong> button in Chrome
                  </p>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#F5E6D3',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '14px',
                    marginTop: '8px'
                  }}>⋮ Menu</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 0', borderBottom: '1px solid #F5E6D3' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #D4A574 0%, #C89B6A 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}>2</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', color: '#2C3E50', lineHeight: '1.5', margin: 0 }}>
                    Tap
                  </p>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#F5E6D3',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '14px',
                    marginTop: '8px'
                  }}>➕ Add to Home Screen</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 0' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #D4A574 0%, #C89B6A 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}>3</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', color: '#2C3E50', lineHeight: '1.5', margin: 0 }}>
                    Tap <strong>Add</strong>
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Tip Box */}
          <div style={{
            background: '#F5E6D3',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <span style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>
              This lets the app work offline and gives you a full-screen experience.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section - Buttons */}
      <div style={{ width: '100%', maxWidth: '400px', marginTop: '32px' }}>
        <button
          onClick={onContinue}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #2C3E50 0%, #1a252f 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '16px',
            padding: '18px 24px',
            fontSize: '17px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(44, 62, 80, 0.2)'
          }}
        >
          Continue to App →
        </button>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#9CA3AF' }}>
          I'll do this later • <button 
            onClick={onDismiss}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#9CA3AF', 
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px',
              padding: 0
            }}
          >Don't show again</button>
        </p>
      </div>
    </div>
  );
});

// ============================================
// LOGIN PAGE COMPONENT
// ============================================
const LoginPage = memo(({ colors, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bgPrimary,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: '36px',
          fontWeight: '700',
          fontStyle: 'italic',
          color: '#2C3E50',
          letterSpacing: '0.5px'
        }}>
          The Cindy
        </div>
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #D4A574 0%, #E8B887 70%, transparent 100%)',
          marginTop: '4px',
          width: '100%',
          borderRadius: '2px'
        }} />
      </div>

      {/* Login Card */}
      <div style={{
        background: colors.bgElevated,
        borderRadius: '24px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: `0 8px 32px ${colors.shadow}`,
        border: `1px solid ${colors.border}`
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: colors.textPrimary,
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p style={{
          fontSize: '14px',
          color: colors.textSecondary,
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          {isSignUp ? 'Start tracking your bets' : 'Sign in to continue'}
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: colors.bgElevated,
            border: `2px solid ${colors.border}`,
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            color: colors.textPrimary,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px',
            opacity: loading ? 0.7 : 1
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ flex: 1, height: '1px', background: colors.border }} />
          <span style={{ fontSize: '12px', color: colors.textTertiary }}>or</span>
          <div style={{ flex: 1, height: '1px', background: colors.border }} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
          </div>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          </div>
          {isSignUp && (
            <div style={{ marginBottom: '16px' }}>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
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
            </div>
          )}

          {error && (
            <div style={{
              padding: '12px',
              background: 'rgba(184, 92, 80, 0.1)',
              border: '1px solid rgba(184, 92, 80, 0.3)',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              color: '#B85C50'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, #C89B6A 100%)`,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <p style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: colors.textSecondary
        }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: colors.accentPrimary,
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
});

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
// ANIMATION EFFECT COMPONENTS
// ============================================

// Particle explosion effect
const Particles = memo(({ color, count = 20 }) => {
  const particles = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      id: i,
      angle: (360 / count) * i,
      distance: 100 + Math.random() * 100,
      size: 8 + Math.random() * 12,
      duration: 0.6 + Math.random() * 0.4,
    }));
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 ${p.size}px ${color}`,
            animation: `particle-fly-${p.id} ${p.duration}s ease-out forwards`,
          }}
        >
          <style>{`
            @keyframes particle-fly-${p.id} {
              0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
              }
              100% {
                transform: translate(
                  calc(-50% + ${Math.cos(p.angle * Math.PI / 180) * p.distance}px),
                  calc(-50% + ${Math.sin(p.angle * Math.PI / 180) * p.distance}px)
                ) scale(0);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
});

// Screen flash effect
const ScreenFlash = memo(({ color }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: color,
      animation: 'screen-flash 0.5s ease-out forwards',
    }}
  >
    <style>{`
      @keyframes screen-flash {
        0% { opacity: 0.6; }
        100% { opacity: 0; }
      }
    `}</style>
  </div>
));

// Expanding rings effect
const ExpandingRings = memo(({ color }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          border: `4px solid ${color}`,
          animation: `ring-expand 1s ease-out ${i * 0.2}s forwards`,
          opacity: 0,
        }}
      >
        <style>{`
          @keyframes ring-expand {
            0% {
              width: 20px;
              height: 20px;
              opacity: 0.8;
            }
            100% {
              width: 300px;
              height: 300px;
              opacity: 0;
            }
          }
        `}</style>
      </div>
    ))}
  </div>
));

// Pulsing glow effect
const PulsingGlow = memo(({ color }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: `radial-gradient(circle at center, ${color}50 0%, transparent 70%)`,
      animation: 'pulse-glow 0.8s ease-in-out 3',
    }}
  >
    <style>{`
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 0.9; transform: scale(1.2); }
      }
    `}</style>
  </div>
));

// Fire effect for streaks
const FireEffect = memo(() => {
  const flames = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: 20 + Math.random() * 60,
      size: 20 + Math.random() * 30,
      duration: 0.8 + Math.random() * 0.4,
      delay: Math.random() * 0.3,
      hue: Math.random() > 0.5 ? '30' : '45',
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {flames.map((f) => (
        <div
          key={f.id}
          style={{
            position: 'absolute',
            left: `${f.left}%`,
            bottom: '30%',
            width: f.size,
            height: f.size * 1.5,
            borderRadius: '50%',
            background: `linear-gradient(to top, hsl(${f.hue}, 100%, 50%), hsl(60, 100%, 70%), transparent)`,
            filter: 'blur(3px)',
            animation: `fire-rise ${f.duration}s ease-out ${f.delay}s infinite`,
          }}
        >
          <style>{`
            @keyframes fire-rise {
              0% {
                transform: translateY(0) scale(1);
                opacity: 0.8;
              }
              100% {
                transform: translateY(-150px) scale(0.3);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
});

// Floating money effect
const FloatingMoney = memo(() => {
  const moneyItems = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 0.5,
      rotation: Math.random() > 0.5 ? 360 : -360,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {moneyItems.map((m) => (
        <div
          key={m.id}
          style={{
            position: 'absolute',
            left: `${m.left}%`,
            bottom: '-50px',
            fontSize: '36px',
            animation: `money-float-${m.id} ${m.duration}s ease-out ${m.delay}s forwards`,
          }}
        >
          💰
          <style>{`
            @keyframes money-float-${m.id} {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(-400px) rotate(${m.rotation}deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      ))}
    </div>
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

const quickAddButtons = [
  { label: '0.5u', value: 0.5 },
  { label: '1u', value: 1 },
  { label: '2u', value: 2 },
];

const calculateRiskAndWin = (units, odds, unitValue) => {
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
      // Restore focus after React finishes re-rendering
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
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
    background: colors.bgElevated, 
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

// HISTORY PAGE COMPONENT - Redesigned with 2-row filters + More button
const HistoryPage = memo(({ 
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
    isRetired,
    setShowFilterModal
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
          paddingLeft: '4px',
          ...headerStyle 
        }}>
          Bet History
        </h2>

        {/* Filters Card - WHITE container */}
        <div style={{
          background: colors.bgElevated,
          borderRadius: '20px',
          padding: '16px',
          marginBottom: '16px',
          border: `1px solid ${colors.border}`,
          boxShadow: `0 2px 8px ${colors.shadow}`
        }}>
          {/* Search Bar */}
          <div style={{ marginBottom: '12px' }}>
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
            alignItems: 'center'
          }}>
            {/* More Filters Button */}
            <button
              onClick={() => setShowFilterModal(true)}
              style={{
                padding: '12px 16px',
                background: moreFilterCount > 0 ? colors.accentPrimary : colors.bgSecondary,
                color: moreFilterCount > 0 ? '#FFFFFF' : colors.textPrimary,
                border: 'none',
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
              More
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
            boxShadow: `0 2px 8px ${colors.shadow}`,
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
            <div style={{
              background: colors.bgElevated,
              borderRadius: '20px',
              padding: '32px',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 2px 8px ${colors.shadow}`,
              textAlign: 'center'
            }}>
              <p style={{ color: colors.textTertiary, margin: 0 }}>
                {searchQuery ? `No bets found matching "${searchQuery}"` : 'No bets match your filters'}
              </p>
            </div>
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
});

// ============================================
// HOME PAGE COMPONENT - MATCHES MOCKUP EXACTLY
// ============================================
const HomePage = memo(({
  colors,
  stats,
  pendingBets,
  recentBets,
  formatMoney,
  formatMoneyNoSign,
  updateBetResult,
  startEdit,
  deleteBet,
  isRetired,
  setShowAddBetModal,
  setAddBetStep,
  setCurrentPage,
  systemExpanded,
  setSystemExpanded
}) => (
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
          {parseFloat(stats.monthlyLoss) >= parseFloat(stats.lastMonthPL) ? '↑' : '↓'} {formatMoneyNoSign(Math.abs(parseFloat(stats.monthlyLoss) - parseFloat(stats.lastMonthPL)))} vs. last month
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

      {/* PENDING BETS - White cards directly on cream */}
      {pendingBets.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: '12px',
            margin: '0 0 12px 4px',
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

      {/* RECENT BETS - White cards directly on cream */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
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
    fontWeight: '700',
    cursor: 'pointer'
  }}
>
  View All →
</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentBets.length === 0 ? (
            <div style={{
              background: colors.bgElevated,
              borderRadius: '20px',
              padding: '32px',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 2px 8px ${colors.shadow}`,
              textAlign: 'center'
            }}>
              <p style={{ color: colors.textTertiary, margin: 0 }}>
                No bets yet. Add your first bet!
              </p>
            </div>
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
  ));

// ============================================
// STATS PAGE COMPONENT - WITH KEY TRENDS
// ============================================
const StatsPage = memo(({
  colors,
  stats,
  trends,
  formatMoney,
  recentPerfExpanded,
  setRecentPerfExpanded,
  trendsExpanded,
  setTrendsExpanded
}) => (
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
                  <div style={{ marginBottom: trends.recent.losing.length > 0 ? '12px' : '0' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: colors.accentWin, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Where You're Winning
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                                {trend.record} ({(trend.winRate * 100).toFixed(0)}%)
                              </div>
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: colors.accentWin, ...numberStyle }}>
                              {formatMoney(trend.payout)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Losing */}
                {trends.recent.losing.length > 0 && (
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: colors.accentLoss, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Where You're Losing
                    </div>
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
                                {trend.record} ({(trend.winRate * 100).toFixed(0)}%)
                              </div>
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: colors.accentLoss, ...numberStyle }}>
                              {formatMoney(trend.payout)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
  ));

// MORE PAGE COMPONENT
const MorePage = memo(({
  colors,
  resources,
  exportToCSV,
  setShowRetirementModal,
  unitValue,
  setUnitValue,
  monthlyLimit,
  setMonthlyLimit,
  notificationSettings,
  setNotificationSettings,
  user,
  onLogout,
  onViewTutorial
}) => {
    return (
      <div style={{ paddingBottom: '100px' }}>
        {/* User Account Section */}
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
            marginBottom: '16px',
            ...headerStyle
          }}>
            Account
          </h2>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 0'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                {user?.displayName || 'Bettor'}
              </div>
              <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                {user?.email}
              </div>
            </div>
            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: colors.bgSecondary,
                color: colors.textSecondary,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <LogOut />
              Sign Out
            </button>
          </div>
        </div>

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
              onClick={onViewTutorial}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px',
                background: colors.bgSecondary,
                color: colors.textPrimary,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '18px' }}>📖</span>
              View Tutorial
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
});

// Filter Modal Component
const FilterModal = memo(({
  showFilterModal,
  setShowFilterModal,
  historyFilter,
  setHistoryFilter,
  colors
}) => {
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
});

// ============================================
// DEMO DATA GENERATOR
// ============================================
const generateDemoBets = () => {
  const sports = ['nfl', 'ncaaf', 'nba', 'ncaab', 'mlb'];
  const betTypes = ['straight', 'money-line', 'over-under', 'parlay', 'teaser', 'prop'];
  const systemPlays = ['clear', 'kind-of', 'no-system', 'not-system', 'none'];
  
  const nflTeams = ['Chiefs', 'Bills', 'Eagles', 'Cowboys', '49ers', 'Ravens', 'Lions', 'Dolphins'];
  const nbaTeams = ['Celtics', 'Lakers', 'Nuggets', 'Bucks', 'Heat', 'Warriors', 'Suns', 'Knicks'];
  const ncaafTeams = ['Georgia', 'Michigan', 'Alabama', 'Ohio State', 'Texas', 'Oregon', 'Penn State', 'FSU'];
  const ncaabTeams = ['Duke', 'UNC', 'Kansas', 'Kentucky', 'UConn', 'Purdue', 'Houston', 'Arizona'];
  const mlbTeams = ['Yankees', 'Dodgers', 'Braves', 'Astros', 'Phillies', 'Rangers', 'Orioles', 'Twins'];
  
  const getTeams = (sport) => {
    switch(sport) {
      case 'nfl': return nflTeams;
      case 'nba': return nbaTeams;
      case 'ncaaf': return ncaafTeams;
      case 'ncaab': return ncaabTeams;
      case 'mlb': return mlbTeams;
      default: return nflTeams;
    }
  };
  
  const bets = [];
  const now = new Date();
  
  // Generate ~40 bets over last 3 months
  for (let i = 0; i < 40; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const betDate = new Date(now);
    betDate.setDate(betDate.getDate() - daysAgo);
    
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const teams = getTeams(sport);
    const team1 = teams[Math.floor(Math.random() * teams.length)];
    let team2 = teams[Math.floor(Math.random() * teams.length)];
    while (team2 === team1) team2 = teams[Math.floor(Math.random() * teams.length)];
    
    const betType = betTypes[Math.floor(Math.random() * betTypes.length)];
    const spread = Math.floor(Math.random() * 14) - 7;
    const total = 40 + Math.floor(Math.random() * 30);
    
    let description = '';
    let odds = -110;
    
    if (betType === 'straight') {
      description = `${team1} ${spread >= 0 ? '+' : ''}${spread}`;
    } else if (betType === 'money-line') {
      description = `${team1} ML`;
      odds = Math.random() > 0.5 ? -(100 + Math.floor(Math.random() * 150)) : (100 + Math.floor(Math.random() * 200));
    } else if (betType === 'over-under') {
      description = Math.random() > 0.5 ? `Over ${total}` : `Under ${total}`;
    } else if (betType === 'parlay') {
      description = `${team1} + ${team2} Parlay`;
      odds = 200 + Math.floor(Math.random() * 300);
    } else if (betType === 'teaser') {
      description = `${team1} + ${team2} Teaser`;
      odds = -120;
    } else {
      description = `${team1} Team Total O${Math.floor(total/2)}`;
    }
    
    const units = [0.5, 1, 1, 1, 1, 1.5, 2, 2][Math.floor(Math.random() * 8)];
    const systemPlay = systemPlays[Math.floor(Math.random() * systemPlays.length)];
    
    // Slight winning bias (~53%)
    const rand = Math.random();
    let result;
    if (daysAgo < 3) {
      result = 'pending';
    } else if (rand < 0.53) {
      result = 'win';
    } else if (rand < 0.97) {
      result = 'loss';
    } else {
      result = 'push';
    }
    
    const unitValue = 50;
    let riskAmount, winAmount;
    if (odds < 0) {
      riskAmount = units * unitValue * (Math.abs(odds) / 100);
      winAmount = units * unitValue;
    } else {
      riskAmount = units * unitValue;
      winAmount = units * unitValue * (odds / 100);
    }
    
    const payout = result === 'win' ? winAmount : result === 'loss' ? -riskAmount : 0;
    
    bets.push({
      id: `demo-${i}`,
      date: betDate.toISOString().split('T')[0],
      sport,
      betType,
      description,
      units,
      odds,
      riskAmount,
      winAmount,
      result,
      payout,
      favoriteTeam: Math.random() < 0.15,
      primeTime: Math.random() < 0.2,
      systemPlay,
      notes: '',
      timestamp: betDate,
      isDemo: true
    });
  }
  
  return bets.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// ============================================
// TUTORIAL MODAL COMPONENT
// ============================================
// ============================================
// TUTORIAL HELPER COMPONENTS (from mockup)
// ============================================

// Highlight circle component for tutorial
const TutorialHighlightCircle = ({ size = 60, style }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '50%',
    border: '3px solid #D4A574',
    boxShadow: '0 0 0 4px rgba(212, 165, 116, 0.3)',
    position: 'absolute',
    pointerEvents: 'none',
    ...style
  }} />
);

// Mini mockup of the Settings section
const TutorialSettingsMockup = ({ colors }) => (
  <div style={{
    background: colors.bgElevated,
    borderRadius: '16px',
    padding: '16px',
    width: '280px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative'
  }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary, marginBottom: '16px' }}>
      Settings
    </div>
    
    {/* Unit Value - Highlighted */}
    <div style={{ 
      marginBottom: '12px',
      position: 'relative',
      background: 'rgba(212, 165, 116, 0.1)',
      borderRadius: '12px',
      padding: '12px',
      border: `2px solid ${colors.accentPrimary}`
    }}>
      <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>
        Unit Value ($)
      </div>
      <div style={{
        background: colors.bgSecondary,
        borderRadius: '8px',
        padding: '10px',
        fontSize: '16px',
        fontWeight: '600',
        color: colors.textPrimary
      }}>
        50
      </div>
      <div style={{ fontSize: '10px', color: colors.textTertiary, marginTop: '4px' }}>
        Applies to future bets only
      </div>
    </div>
    
    {/* Other settings (dimmed) */}
    <div style={{ opacity: 0.4 }}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>
          Monthly Loss Limit ($)
        </div>
        <div style={{
          background: colors.bgSecondary,
          borderRadius: '8px',
          padding: '10px',
          fontSize: '14px',
          color: colors.textPrimary
        }}>
          1500
        </div>
      </div>
    </div>
  </div>
);

// Mini mockup of Quick Add with TYPING ANIMATION
const TutorialQuickAddMockup = ({ colors }) => {
  const fullText = "Chiefs -3 2u -105";
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  
  // Typing animation
  useEffect(() => {
    if (charIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 120);
      return () => clearTimeout(timeout);
    } else {
      // Reset after a pause
      const resetTimeout = setTimeout(() => {
        setDisplayText("");
        setCharIndex(0);
      }, 2500);
      return () => clearTimeout(resetTimeout);
    }
  }, [charIndex]);
  
  // Parse the current text to show dynamic preview
  const getParsedPreview = (text) => {
    if (!text) return null;
    
    let sport = 'NFL';
    let betType = 'Spread';
    let units = '1';
    let odds = '-110';
    let description = text;
    
    const unitMatch = text.match(/(\d*\.?\d+)\s*u/i);
    if (unitMatch) {
      units = unitMatch[1];
      description = text.replace(/(\d*\.?\d+)\s*u/gi, '').trim();
    }
    
    const oddsMatch = text.match(/([+-]\d{3,})/);
    if (oddsMatch) {
      odds = oddsMatch[1];
      description = description.replace(/([+-]\d{3,})/g, '').trim();
    }
    
    description = description.trim() || text;
    
    const unitNum = parseFloat(units) || 1;
    const oddsNum = parseInt(odds) || -110;
    let risk, win;
    if (oddsNum < 0) {
      risk = unitNum * 50 * (Math.abs(oddsNum) / 100);
      win = unitNum * 50;
    } else {
      risk = unitNum * 50;
      win = unitNum * 50 * (oddsNum / 100);
    }
    
    return { sport, betType, description, units: units + 'u', odds, risk: risk.toFixed(0), win: win.toFixed(0) };
  };
  
  const parsed = getParsedPreview(displayText);
  const hasCustomUnits = displayText.toLowerCase().includes('u');
  const hasCustomOdds = /[+-]\d{3,}/.test(displayText);
  
  return (
    <div style={{
      background: colors.bgElevated,
      borderRadius: '16px',
      padding: '16px',
      width: '280px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: `2px solid ${colors.accentPrimary}`
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary }}>
          Quick Add
        </div>
        <div style={{ fontSize: '12px', color: colors.textTertiary }}>✕</div>
      </div>
      
      {/* Input with typing animation */}
      <div style={{
        background: colors.bgSecondary,
        borderRadius: '10px',
        padding: '12px',
        marginBottom: '12px',
        border: `2px solid ${colors.accentPrimary}`,
        minHeight: '20px'
      }}>
        <span style={{ color: colors.textPrimary, fontSize: '15px' }}>{displayText}</span>
        <span style={{ 
          display: 'inline-block',
          width: '2px',
          height: '16px',
          background: colors.accentPrimary,
          marginLeft: '2px',
          verticalAlign: 'middle',
          animation: 'tutorialBlink 1s infinite'
        }} />
      </div>
      
      {/* Parsed preview */}
      {parsed && displayText.length > 3 ? (
        <div style={{
          background: 'rgba(212, 165, 116, 0.1)',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '12px',
          transition: 'all 0.2s ease'
        }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              background: colors.accentPrimary,
              color: '#FFFFFF',
              fontSize: '9px',
              fontWeight: '700',
              padding: '3px 6px',
              borderRadius: '4px'
            }}>{parsed.sport}</span>
            <span style={{
              background: colors.bgSecondary,
              color: colors.textPrimary,
              fontSize: '9px',
              fontWeight: '600',
              padding: '3px 6px',
              borderRadius: '4px'
            }}>{parsed.betType}</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: colors.textPrimary }}>
              {parsed.description}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '10px', flexWrap: 'wrap' }}>
            <span>
              <span style={{ color: colors.textTertiary }}>Units:</span>{' '}
              <strong style={{ 
                color: hasCustomUnits ? colors.accentPrimary : colors.textSecondary,
                transition: 'color 0.2s ease'
              }}>
                {parsed.units}{!hasCustomUnits && ' (default)'}
              </strong>
            </span>
            <span>
              <span style={{ color: colors.textTertiary }}>Odds:</span>{' '}
              <strong style={{ 
                color: hasCustomOdds ? colors.accentPrimary : colors.textSecondary,
                transition: 'color 0.2s ease'
              }}>
                {parsed.odds}{!hasCustomOdds && ' (default)'}
              </strong>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '10px', marginTop: '6px' }}>
            <span><span style={{ color: colors.textTertiary }}>Risk:</span> <strong style={{ color: colors.accentLoss }}>${parsed.risk}</strong></span>
            <span><span style={{ color: colors.textTertiary }}>Win:</span> <strong style={{ color: colors.accentWin }}>${parsed.win}</strong></span>
          </div>
        </div>
      ) : (
        <div style={{
          background: colors.bgSecondary,
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '10px', color: colors.textTertiary }}>
            Start typing to see the magic...
          </span>
        </div>
      )}
      
      {/* Button */}
      <div style={{
        background: displayText.length > 5 
          ? `linear-gradient(135deg, ${colors.accentPrimary} 0%, #C89B6A 100%)`
          : colors.bgSecondary,
        color: displayText.length > 5 ? '#FFFFFF' : colors.textTertiary,
        borderRadius: '10px',
        padding: '12px',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.2s ease'
      }}>
        Add Bet
      </div>
      
      {/* CSS for blinking cursor */}
      <style>{`
        @keyframes tutorialBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// FULL HOMEPAGE MOCKUP with $/U toggle highlighted
const TutorialHomePageMockup = ({ colors }) => (
  <div style={{
    background: colors.bgPrimary,
    borderRadius: '16px',
    padding: '12px',
    width: '280px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative'
  }}>
    {/* Header with $/U toggle */}
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      marginBottom: '8px',
      position: 'relative'
    }}>
      <div style={{ width: '30px' }} />
      
      {/* Logo */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '16px',
          fontWeight: '700',
          fontStyle: 'italic',
          color: colors.textPrimary
        }}>
          The Cindy
        </div>
        <div style={{
          height: '2px',
          background: `linear-gradient(90deg, ${colors.accentPrimary}, #E8B887, transparent)`,
          marginTop: '2px',
          borderRadius: '1px'
        }} />
      </div>
      
      {/* $/U Toggle - HIGHLIGHTED */}
      <div style={{ position: 'relative' }}>
        <div style={{
          padding: '5px 10px',
          background: colors.accentPrimary,
          color: '#FFFFFF',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '700'
        }}>
          $
        </div>
        <TutorialHighlightCircle size={44} style={{ top: '-8px', right: '-8px' }} />
      </div>
    </div>
    
    {/* Callout below header */}
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '8px',
      paddingRight: '4px'
    }}>
      <div style={{
        background: colors.accentPrimary,
        color: '#FFFFFF',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '10px',
        fontWeight: '600',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-6px',
          right: '12px',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: `6px solid ${colors.accentPrimary}`
        }} />
        Tap to toggle $ ↔ Units
      </div>
    </div>
    
    {/* Hero Card */}
    <div style={{
      background: colors.bgElevated,
      borderRadius: '12px',
      padding: '12px',
      marginBottom: '8px',
      boxShadow: '0 2px 8px rgba(212,165,116,0.15)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '8px', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
        Total Profit/Loss
      </div>
      <div style={{ fontSize: '28px', fontWeight: '800', color: colors.accentWin, marginBottom: '8px' }}>
        +$847.50
      </div>
      <div style={{
        background: `linear-gradient(135deg, ${colors.accentPrimary}, #C89B6A)`,
        color: 'white',
        borderRadius: '8px',
        padding: '8px',
        fontSize: '10px',
        fontWeight: '600'
      }}>+ Add New Bet</div>
    </div>
    
    {/* Key Metrics */}
    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
      <div style={{ flex: 1, background: colors.bgElevated, borderRadius: '8px', padding: '8px 4px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: colors.accentWin }}>+$215</div>
        <div style={{ fontSize: '7px', color: colors.textTertiary }}>This Month</div>
      </div>
      <div style={{ flex: 1, background: colors.bgElevated, borderRadius: '8px', padding: '8px 4px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary }}>54.2%</div>
        <div style={{ fontSize: '7px', color: colors.textTertiary }}>Win Rate</div>
      </div>
      <div style={{ flex: 1, background: colors.bgElevated, borderRadius: '8px', padding: '8px 4px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: colors.accentPrimary }}>3 🔥</div>
        <div style={{ fontSize: '7px', color: colors.textTertiary }}>Streak</div>
      </div>
    </div>
    
    {/* Pending Bets preview */}
    <div style={{
      background: colors.bgElevated,
      borderRadius: '8px',
      padding: '8px',
      opacity: 0.6
    }}>
      <div style={{ fontSize: '10px', fontWeight: '600', color: colors.textPrimary, marginBottom: '4px' }}>
        Pending Bets (2)
      </div>
      <div style={{ fontSize: '8px', color: colors.textSecondary }}>
        Bills -3 • Lakers ML
      </div>
    </div>
  </div>
);

// Mini mockup of History page with filters selected
const TutorialHistoryMockup = ({ colors }) => (
  <div style={{
    background: colors.bgPrimary,
    borderRadius: '16px',
    padding: '12px',
    width: '280px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }}>
    <div style={{ fontSize: '14px', fontWeight: '700', color: colors.textPrimary, marginBottom: '10px' }}>
      Bet History
    </div>
    
    {/* Search bar */}
    <div style={{
      background: colors.bgSecondary,
      borderRadius: '8px',
      padding: '8px 10px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }}>
      <span style={{ color: colors.textTertiary, fontSize: '12px' }}>🔍</span>
      <span style={{ color: colors.textTertiary, fontSize: '11px' }}>Search bets...</span>
    </div>
    
    {/* Sport filter pills - NFL selected */}
    <div style={{ 
      display: 'flex', 
      gap: '4px', 
      marginBottom: '6px',
      flexWrap: 'wrap'
    }}>
      {[
        { label: 'All', selected: false },
        { label: 'NFL', selected: true },
        { label: 'NBA', selected: false },
        { label: 'NCAAF', selected: false },
      ].map((sport) => (
        <span key={sport.label} style={{
          padding: '4px 8px',
          background: sport.selected ? colors.accentPrimary : colors.bgSecondary,
          color: sport.selected ? '#FFFFFF' : colors.textPrimary,
          borderRadius: '12px',
          fontSize: '9px',
          fontWeight: '600'
        }}>{sport.label}</span>
      ))}
    </div>
    
    {/* Bet type filter pills - Spread selected */}
    <div style={{ 
      display: 'flex', 
      gap: '4px', 
      marginBottom: '6px',
      flexWrap: 'wrap'
    }}>
      {[
        { label: 'All Types', selected: false },
        { label: 'Spread', selected: true },
        { label: 'ML', selected: false },
        { label: 'O/U', selected: false },
      ].map((type) => (
        <span key={type.label} style={{
          padding: '4px 8px',
          background: type.selected ? colors.accentPrimary : colors.bgSecondary,
          color: type.selected ? '#FFFFFF' : colors.textPrimary,
          borderRadius: '12px',
          fontSize: '9px',
          fontWeight: '600'
        }}>{type.label}</span>
      ))}
    </div>
    
    {/* More filters button with badge + active filter tags */}
    <div style={{ 
      display: 'flex', 
      gap: '6px', 
      marginBottom: '8px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 10px',
        background: colors.accentPrimary,
        color: '#FFFFFF',
        borderRadius: '8px',
        fontSize: '9px',
        fontWeight: '600'
      }}>
        <span>⚙️</span>
        <span>More</span>
        <span style={{
          background: '#FFFFFF',
          color: colors.accentPrimary,
          borderRadius: '50%',
          width: '14px',
          height: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '8px',
          fontWeight: '700'
        }}>2</span>
      </div>
      
      {/* Active filter tags */}
      <span style={{
        padding: '4px 8px',
        background: 'rgba(212, 165, 116, 0.2)',
        borderRadius: '6px',
        fontSize: '9px',
        fontWeight: '600',
        color: colors.textPrimary,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        Wins <span style={{ color: colors.textTertiary }}>×</span>
      </span>
      <span style={{
        padding: '4px 8px',
        background: 'rgba(212, 165, 116, 0.2)',
        borderRadius: '6px',
        fontSize: '9px',
        fontWeight: '600',
        color: colors.textPrimary,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        Favorites <span style={{ color: colors.textTertiary }}>×</span>
      </span>
    </div>
    
    {/* Results summary */}
    <div style={{
      background: colors.bgElevated,
      borderRadius: '8px',
      padding: '8px',
      marginBottom: '6px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: `1px solid ${colors.border}`
    }}>
      <div>
        <div style={{ fontSize: '9px', color: colors.textSecondary }}>12 bets</div>
        <div style={{ fontSize: '11px', fontWeight: '600', color: colors.textPrimary }}>9W - 3L</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '9px', color: colors.textSecondary }}>P/L</div>
        <div style={{ fontSize: '14px', fontWeight: '800', color: colors.accentWin }}>+$285</div>
      </div>
    </div>
    
    {/* Sample filtered bets */}
    {[
      { desc: 'Chiefs -3', result: 'WIN', payout: '+$50' },
      { desc: 'Cowboys -7', result: 'WIN', payout: '+$45' },
    ].map((bet, i) => (
      <div key={i} style={{
        background: colors.bgElevated,
        borderRadius: '8px',
        padding: '8px',
        marginBottom: '4px',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                background: colors.accentPrimary,
                color: '#FFFFFF',
                fontSize: '8px',
                fontWeight: '700',
                padding: '2px 5px',
                borderRadius: '4px'
              }}>NFL</span>
              <span style={{ fontSize: '11px', fontWeight: '600', color: colors.textPrimary }}>{bet.desc}</span>
            </div>
          </div>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '700', 
            color: colors.accentWin
          }}>{bet.payout}</span>
        </div>
      </div>
    ))}
  </div>
);

// Mini mockup of Stats page
const TutorialStatsMockup = ({ colors }) => (
  <div style={{
    background: colors.bgPrimary,
    borderRadius: '16px',
    padding: '12px',
    width: '280px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }}>
    {/* Key Trends section - highlighted */}
    <div style={{
      background: colors.bgElevated,
      borderRadius: '12px',
      padding: '10px',
      marginBottom: '8px',
      border: `2px solid ${colors.accentPrimary}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px' }}>📈</span>
        <span style={{ fontSize: '12px', fontWeight: '700', color: colors.textPrimary }}>Key Trends</span>
      </div>
      
      {/* Winning trend */}
      <div style={{
        background: 'rgba(124, 152, 133, 0.1)',
        border: '1px solid rgba(124, 152, 133, 0.3)',
        borderRadius: '8px',
        padding: '8px',
        marginBottom: '6px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: colors.textPrimary }}>NFL Underdogs</div>
            <div style={{ fontSize: '9px', color: colors.textSecondary }}>8-3 (72.7%)</div>
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: colors.accentWin }}>+$245</div>
        </div>
      </div>
      
      {/* Losing trend */}
      <div style={{
        background: 'rgba(184, 92, 80, 0.1)',
        border: '1px solid rgba(184, 92, 80, 0.3)',
        borderRadius: '8px',
        padding: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: colors.textPrimary }}>NBA Parlays</div>
            <div style={{ fontSize: '9px', color: colors.textSecondary }}>2-7 (22.2%)</div>
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: colors.accentLoss }}>-$180</div>
        </div>
      </div>
    </div>
    
    {/* By Sport section (dimmed) */}
    <div style={{ opacity: 0.5 }}>
      <div style={{
        background: colors.bgElevated,
        borderRadius: '12px',
        padding: '10px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: colors.textPrimary, marginBottom: '6px' }}>
          By Sport
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
          <span style={{ color: colors.textPrimary }}>NFL</span>
          <span style={{ color: colors.accentWin, fontWeight: '700' }}>+$320</span>
        </div>
      </div>
    </div>
  </div>
);

// Demo CTA Component
const TutorialDemoCTA = ({ colors, onLoadDemo, onSkip }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    maxWidth: '300px'
  }}>
    {/* Demo preview */}
    <div style={{
      background: colors.bgElevated,
      borderRadius: '16px',
      padding: '20px',
      width: '100%',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary, marginBottom: '4px' }}>
        40 sample bets over 3 months
      </div>
      <div style={{ fontSize: '12px', color: colors.textSecondary }}>
        Explore all features with realistic data
      </div>
    </div>
    
    {/* Buttons */}
    <button
      onClick={onLoadDemo}
      style={{
        width: '100%',
        padding: '16px',
        background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, #C89B6A 100%)`,
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(212, 165, 116, 0.3)'
      }}
    >
      Load Demo Data →
    </button>
    
    <button
      onClick={onSkip}
      style={{
        width: '100%',
        padding: '14px',
        background: 'transparent',
        color: colors.textSecondary,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
      }}
    >
      Skip & Start Fresh
    </button>
  </div>
);

// ============================================
// TUTORIAL MODAL COMPONENT (matching mockup)
// ============================================
const TutorialModal = memo(({ 
  show, 
  onClose, 
  onLoadDemo, 
  colors 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const totalSlides = 7;
  
  // Reset on close
  useEffect(() => {
    if (!show) {
      setCurrentSlide(0);
    }
  }, [show]);
  
  if (!show) return null;
  
  const slides = [
    // Slide 1: Welcome
    {
      id: 'welcome',
      title: 'Welcome',
      content: "This is the Cindy app. Let me show you how to use it.",
      visual: (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '36px',
            fontWeight: '700',
            fontStyle: 'italic',
            color: colors.textPrimary,
            marginBottom: '8px'
          }}>
            The Cindy
          </div>
          <div style={{
            height: '4px',
            background: `linear-gradient(90deg, ${colors.accentPrimary}, #E8B887, transparent)`,
            width: '180px',
            margin: '0 auto 24px',
            borderRadius: '2px'
          }} />
          <div style={{
            background: colors.bgElevated,
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'inline-block'
          }}>
            <div style={{ fontSize: '10px', color: colors.textSecondary, marginBottom: '4px' }}>TOTAL PROFIT/LOSS</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: colors.accentWin }}>+$847.50</div>
          </div>
        </div>
      )
    },
    // Slide 2: Set Your Unit
    {
      id: 'units',
      title: 'Set Your Unit',
      content: "Before anything else, set your unit size. $50? $100? Set this in Settings and it will carry over to all of your future bets.",
      visual: <TutorialSettingsMockup colors={colors} />
    },
    // Slide 3: Adding Bets (with typing animation)
    {
      id: 'adding',
      title: 'Adding Bets',
      content: "Two ways to add bets. With Quick Add, type naturally—put in the team and the bet, and we'll do the rest. We'll assume it's 1 unit and -110, but if not, just type out what you want.",
      visual: <TutorialQuickAddMockup colors={colors} />
    },
    // Slide 4: Dollar/Unit Toggle
    {
      id: 'toggle',
      title: '$/U Toggle',
      content: "Do you want to see results in dollars or units? Toggle back and forth here.",
      visual: <TutorialHomePageMockup colors={colors} />
    },
    // Slide 5: History
    {
      id: 'history',
      title: 'Your History',
      content: "Every bet, filterable. Search, filter by sport/type/result, and see your full record. Tap any bet to edit or mark the result.",
      visual: <TutorialHistoryMockup colors={colors} />
    },
    // Slide 6: Stats & Trends
    {
      id: 'stats',
      title: 'Stats & Trends',
      content: "See where you're winning. The Stats page breaks down your performance by sport, bet type, and more. Key Trends shows what's working (and what isn't).",
      visual: <TutorialStatsMockup colors={colors} />
    },
    // Slide 7: Demo Mode
    {
      id: 'demo',
      title: 'Try Demo Mode',
      content: "See it in action. Want to explore with sample data first? Load 40 demo bets to see how everything works.",
      visual: <TutorialDemoCTA colors={colors} onLoadDemo={() => { onLoadDemo(); onClose(); }} onSkip={onClose} />
    }
  ];
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: colors.bgElevated,
        borderRadius: '24px',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: `2px solid ${colors.accentPrimary}`
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: '600' }}>
            {currentSlide + 1} of {totalSlides}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.textTertiary,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            Skip
          </button>
        </div>
        
        {/* Content */}
        <div style={{ 
          flex: 1,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          minHeight: '400px'
        }}>
          {/* Visual */}
          <div style={{
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            {slides[currentSlide].visual}
          </div>
          
          {/* Title */}
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: '12px',
            textAlign: 'center',
            margin: '0 0 12px 0'
          }}>
            {slides[currentSlide].title}
          </h2>
          
          {/* Content Text */}
          <p style={{
            fontSize: '15px',
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: '1.6',
            maxWidth: '340px',
            margin: 0
          }}>
            {slides[currentSlide].content}
          </p>
        </div>
        
        {/* Footer Navigation */}
        <div style={{
          padding: '16px 20px',
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Progress Dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: i === currentSlide ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === currentSlide ? colors.accentPrimary : colors.border,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide(currentSlide - 1)}
                style={{
                  padding: '10px 16px',
                  background: colors.bgSecondary,
                  color: colors.textPrimary,
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
            )}
            {currentSlide < totalSlides - 1 && (
              <button
                onClick={() => setCurrentSlide(currentSlide + 1)}
                style={{
                  padding: '10px 20px',
                  background: colors.accentPrimary,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* CSS for blinking cursor */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
});


// ============================================
// TEXT PARSER FOR QUICK ADD
// ============================================
const parseQuickAddInput = (text, unitValue = 50) => {
  if (!text.trim()) return null;
  const lower = text.toLowerCase();
  
  // SPORT DETECTION - check explicit sport names FIRST (highest priority)
  let sport = null;
  if (lower.includes('ncaab')) sport = 'ncaab';
  else if (lower.includes('ncaaf')) sport = 'ncaaf';
  else if (lower.includes('nba')) sport = 'nba';
  else if (lower.includes('nfl')) sport = 'nfl';
  else if (lower.includes('mlb')) sport = 'mlb';
  else if (lower.includes('nhl')) sport = 'nhl';
  else if (lower.includes('boxing') || lower.includes('ufc')) sport = 'boxing';
  
  // If no explicit sport mentioned, infer from team names
  if (!sport) {
    // NFL teams
    if (/chiefs|bills|eagles|cowboys|patriots|packers|49ers|niners|ravens|bengals|dolphins|jets|giants|commanders|bears|lions|vikings|saints|falcons|panthers|buccaneers|bucs|cardinals|rams|seahawks|broncos|raiders|chargers|texans|colts|jaguars|jags|titans|steelers|browns/i.test(text)) {
      sport = 'nfl';
    }
    // NBA teams
    else if (/lakers|celtics|warriors|nuggets|heat|bucks|suns|76ers|sixers|nets|knicks|bulls|cavaliers|cavs|mavericks|mavs|clippers|grizzlies|pelicans|timberwolves|wolves|hawks|raptors|hornets|wizards|pistons|pacers|magic|thunder|blazers|kings|spurs|jazz|rockets/i.test(text)) {
      sport = 'nba';
    }
    // College football teams (common ones)
    else if (/georgia|alabama|bama|ohio state|buckeyes|michigan|wolverines|clemson|texas|longhorns|oklahoma|sooners|lsu|usc|trojans|oregon|ducks|penn state|florida|gators|tennessee|vols|notre dame|irish|auburn|ole miss|utah|washington|huskies|iowa|hawkeyes/i.test(text)) {
      sport = 'ncaaf';
    }
    // MLB teams
    else if (/yankees|dodgers|astros|braves|mets|phillies|padres|guardians|mariners|orioles|rays|blue jays|twins|rangers|diamondbacks|dbacks|cubs|cardinals|cards|brewers|red sox|white sox|reds|pirates|royals|angels|athletics|rockies|marlins|nationals|nats/i.test(text)) {
      sport = 'mlb';
    }
  }
  
  // Default to smart default if nothing detected
  if (!sport) sport = getDefaultSport();
  
  // ODDS - look for +/-XXX pattern (3 or more digits after the sign)
  // Parse odds FIRST since we need it for risk/win calculations
  const oddsMatch = text.match(/([+-]\d{3,})/);
  const odds = oddsMatch ? parseInt(oddsMatch[1]) : -110;
  
  // UNITS - Multiple ways to specify:
  // 1. Direct units: "1u", "2u", ".5u", "0.5u", "1.5 units"
  // 2. Risk amount: "risk $50", "risk 50", "risking $100"
  // 3. To win amount: "to win $50", "win $100", "to win 50"
  
  let units = null;
  
  // Track if user specified exact risk or win amount
  let exactRisk = null;
  let exactWin = null;
  
  // Check for "risk" amount first
  const riskMatch = text.match(/risk(?:ing)?\s*\$?(\d+\.?\d*)/i);
  if (riskMatch) {
    exactRisk = parseFloat(riskMatch[1]);
    // Calculate units from risk amount
    if (odds < 0) {
      // Negative odds: risk = units * unitValue * (|odds|/100)
      units = exactRisk / (unitValue * (Math.abs(odds) / 100));
    } else {
      // Positive odds: risk = units * unitValue
      units = exactRisk / unitValue;
    }
  }
  
  // Check for "to win" amount
  if (units === null) {
    const winMatch = text.match(/(?:to\s*)?win\s*\$?(\d+\.?\d*)/i);
    if (winMatch && !text.match(/win\s*rate/i)) { // Exclude "win rate"
      exactWin = parseFloat(winMatch[1]);
      // Calculate units from win amount
      if (odds < 0) {
        // Negative odds: win = units * unitValue
        units = exactWin / unitValue;
      } else {
        // Positive odds: win = units * unitValue * (odds/100)
        units = exactWin / (unitValue * (odds / 100));
      }
    }
  }
  
  // Check for direct units (supports .5u, 0.5u, 1u, 2 units, etc.)
  if (units === null) {
    const unitMatch = text.match(/(\d*\.?\d+)\s*u(?:nits?)?/i);
    units = unitMatch ? parseFloat(unitMatch[1]) : 1;
  }
  
  // Round units to 2 decimal places
  units = Math.round(units * 100) / 100;
  
  // BET TYPE detection
  let betType = 'straight';
  if (/\bml\b|money\s*line|moneyline/i.test(text)) betType = 'money-line';
  else if (/\bover\b|\bunder\b|\bo\s*\d|\bu\s*\d|\btotal\b/i.test(text)) betType = 'over-under';
  else if (/parlay/i.test(text)) betType = 'parlay';
  else if (/teaser/i.test(text)) betType = 'teaser';
  else if (/prop/i.test(text)) betType = 'prop';
  else if (/future/i.test(text)) betType = 'future';
  
  // DESCRIPTION - remove the parsed components to leave just the bet description
  let description = text
    .replace(/(\d*\.?\d+)\s*u(?:nits?)?/gi, '')  // Remove units
    .replace(/([+-]\d{3,})/g, '')                 // Remove odds
    .replace(/risk(?:ing)?\s*\$?\d+\.?\d*/gi, '') // Remove risk amount
    .replace(/(?:to\s*)?win\s*\$?\d+\.?\d*/gi, '') // Remove win amount
    .replace(/\b(nfl|nba|ncaaf|ncaab|mlb|nhl|boxing|ufc)\b/gi, '')  // Remove sport tags
    .replace(/\s+/g, ' ')                         // Normalize whitespace
    .trim();
  
  // If description is empty, use original text
  if (!description) description = text.trim();
  
  // Calculate risk and win - use exact amounts if specified, otherwise calculate from units
  let risk, win;
  if (exactRisk !== null) {
    // User specified exact risk amount - use it directly
    risk = exactRisk;
    // Calculate win from the exact risk
    if (odds < 0) {
      win = exactRisk / (Math.abs(odds) / 100);
    } else {
      win = exactRisk * (odds / 100);
    }
  } else if (exactWin !== null) {
    // User specified exact win amount - use it directly
    win = exactWin;
    // Calculate risk from the exact win
    if (odds < 0) {
      risk = exactWin * (Math.abs(odds) / 100);
    } else {
      risk = exactWin / (odds / 100);
    }
  } else {
    // Calculate both from units
    const result = calculateRiskAndWin(units.toString(), odds.toString(), unitValue);
    risk = result.risk;
    win = result.win;
  }
  
  return { 
    sport, 
    betType, 
    units, 
    odds, 
    description,
    riskAmount: risk,
    winAmount: win
  };
};

  // ADD BET MODAL COMPONENT
// ============================================
/// ADD BET MODAL COMPONENT - Updated with Text Parser Quick Add
// ============================================
const AddBetModal = memo(({
  showAddBetModal,
  setShowAddBetModal,
  addBetStep,
  setAddBetStep,
  quickAddMode,
  setQuickAddMode,
  editingBet,
  formData,
  setFormData,
  handleAddBet,
  saveEdit,
  cancelEdit,
  colors,
  showToast,
  unitValue
}) => {
    // Quick Add text parser state
    const [quickAddInput, setQuickAddInput] = useState('');
    const [parsedBet, setParsedBet] = useState(null);
    const [quickSystemPlay, setQuickSystemPlay] = useState('none');

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
        // Reset quick add state when modal opens
        setQuickAddInput('');
        setParsedBet(null);
        setQuickSystemPlay('none');
      }
    }, [showAddBetModal]);

    // Handle quick add input change - parse as user types
    const handleQuickAddInputChange = (e) => {
      const value = e.target.value;
      setQuickAddInput(value);
      setParsedBet(parseQuickAddInput(value, unitValue));
    };

    // Submit quick add bet
    const handleQuickAddSubmit = () => {
      if (!parsedBet) {
        showToast('Please enter a bet', 'error');
        return;
      }

      const quickFormData = {
        date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        sport: parsedBet.sport,
        betType: parsedBet.betType,
        description: parsedBet.description,
        units: parsedBet.units.toString(),
        odds: parsedBet.odds.toString(),
        result: 'pending',
        favoriteTeam: false,
        primeTime: false,
        systemPlay: quickSystemPlay,
        notes: ''
      };

      const errorMsg = handleAddBet(quickFormData);
      if (errorMsg) {
        showToast(errorMsg, 'error');
      } else {
        // Reset quick add state
        setQuickAddInput('');
        setParsedBet(null);
        setQuickSystemPlay('none');
      }
    };

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

    const handleStepContinue = () => {
      if (addBetStep === 1) {
        if (!localFormData.sport || !localFormData.betType || !localFormData.description || !localFormData.units || !localFormData.odds) {
          showToast('Please fill in all required fields', 'error');
          return;
        }
        setFormData(localFormData);
        setAddBetStep(2);
      } else if (addBetStep === 2) {
        setFormData(localFormData);
        setAddBetStep(3);
      } else if (addBetStep === 3) {
        handleSubmit();
      }
    };

    const calculateRiskWin = () => {
      if (!localFormData.units || !localFormData.odds) return { risk: 0, win: 0 };
      return calculateRiskAndWin(localFormData.units, localFormData.odds, unitValue);
    };

    return (
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          background: colors.bgPrimary,
          overflow: 'hidden'
        }}
        onClick={cancelEdit}
      >
        {/* Dark overlay at top when in full form mode */}
        {!quickAddMode && !editingBet && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8vh',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
            pointerEvents: 'none'
          }} />
        )}
        <div 
          style={{ 
            background: colors.bgElevated,
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            width: '100%',
            maxWidth: '672px',
            overflowY: 'auto',
            border: `3px solid ${colors.accentPrimary}`,
            borderBottom: 'none',
            boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.3), 0 -2px 20px rgba(212, 165, 116, 0.3)',
            minHeight: quickAddMode && !editingBet ? 'auto' : '88vh',
            maxHeight: '90vh',
            position: 'relative',
            zIndex: 1
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 10,
            background: colors.bgPrimary,
            borderBottom: `2px solid ${colors.border}`,
            padding: 'max(16px, env(safe-area-inset-top, 16px)) 16px 12px 16px',
            borderRadius: '24px 24px 0 0'
          }}>
            {/* Gold accent bar at top */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '4px',
              background: colors.accentPrimary,
              borderRadius: '2px'
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
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

          <div style={{ padding: '16px' }}>
            {/* ============================================ */}
            {/* QUICK ADD MODE - Compact layout for iOS keyboard */}
            {/* ============================================ */}
            {quickAddMode && !editingBet && (
              <div>
                
                {/* Input Section with inline preview */}
                <div style={{
                  background: colors.bgElevated,
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '10px',
                  border: `2px solid ${parsedBet ? colors.accentPrimary : colors.border}`
                }}>
                  <input
                    type="text"
                    value={quickAddInput}
                    onChange={handleQuickAddInputChange}
                    placeholder="Chiefs -3 1u -110"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '17px',
                      fontWeight: '500',
                      background: colors.bgSecondary,
                      border: 'none',
                      borderRadius: '10px',
                      color: colors.textPrimary,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  
                  {/* Inline compact preview - right below input */}
                  {parsedBet ? (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${colors.border}` }}>
                      {/* Row 1: Sport, Type, Description */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          background: colors.accentPrimary,
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}>
                          {getSportLabel(parsedBet.sport)}
                        </span>
                        <span style={{
                          background: colors.bgSecondary,
                          color: colors.textPrimary,
                          fontSize: '10px',
                          fontWeight: '600',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}>
                          {formatBetType(parsedBet.betType)}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: colors.textPrimary }}>
                          {parsedBet.description}
                        </span>
                      </div>
                      
                      {/* Row 2: Units, Odds, Risk, Win - all in one line */}
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                        <span><span style={{ color: colors.textTertiary }}>Units:</span> <strong>{parsedBet.units}u</strong></span>
                        <span><span style={{ color: colors.textTertiary }}>Odds:</span> <strong>{parsedBet.odds > 0 ? '+' : ''}{parsedBet.odds}</strong></span>
                        <span><span style={{ color: colors.textTertiary }}>Risk:</span> <strong style={{ color: colors.accentLoss }}>${parsedBet.riskAmount.toFixed(0)}</strong></span>
                        <span><span style={{ color: colors.textTertiary }}>Win:</span> <strong style={{ color: colors.accentWin }}>${parsedBet.winAmount.toFixed(0)}</strong></span>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '10px', color: colors.textTertiary, marginTop: '8px', marginBottom: 0, textAlign: 'center' }}>
                      "1u" · ".5u" · "risk $50" · "to win $100"
                    </p>
                  )}
                </div>

                {/* System Play - compact single row */}
                {parsedBet && (
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ fontSize: '10px', color: colors.textTertiary, fontWeight: '600' }}>SYSTEM:</span>
                    {[
                      { value: 'clear', label: 'Clear', color: '#6B8CAE' },
                      { value: 'kind-of', label: 'Kind Of', color: '#8B9DC3' },
                      { value: 'no-system', label: 'None', color: colors.textTertiary },
                      { value: 'not-system', label: 'Anti', color: colors.accentLoss }
                    ].map(sys => (
                      <button
                        key={sys.value}
                        type="button"
                        onClick={() => setQuickSystemPlay(quickSystemPlay === sys.value ? 'none' : sys.value)}
                        style={{
                          padding: '5px 10px',
                          fontSize: '10px',
                          fontWeight: '600',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          background: quickSystemPlay === sys.value ? sys.color : 'transparent',
                          color: quickSystemPlay === sys.value ? '#FFFFFF' : colors.textTertiary,
                          border: `1px solid ${quickSystemPlay === sys.value ? sys.color : colors.border}`
                        }}
                      >
                        {sys.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleQuickAddSubmit}
                    disabled={!parsedBet}
                    style={{
                      flex: 2,
                      padding: '16px',
                      background: parsedBet 
                        ? `linear-gradient(135deg, ${colors.accentPrimary} 0%, #C89B6A 100%)`
                        : colors.bgSecondary,
                      color: parsedBet ? '#FFFFFF' : colors.textTertiary,
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: parsedBet ? 'pointer' : 'not-allowed',
                      boxShadow: parsedBet ? `0 4px 12px ${colors.shadow}` : 'none'
                    }}
                  >
                    Add Bet
                  </button>
                  <button
                    onClick={() => {
                      if (parsedBet) {
                        setFormData({
                          ...formData,
                          ...parsedBet,
                          units: parsedBet.units.toString(),
                          odds: parsedBet.odds.toString(),
                          systemPlay: quickSystemPlay
                        });
                      }
                      setQuickAddMode(false);
                      setAddBetStep(1);
                    }}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: colors.bgSecondary,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Full Form →
                  </button>
                </div>
              </div>
            )}


            {/* ============================================ */}
            {/* FULL FORM MODE - Step 1: THE BASICS */}
            {/* ============================================ */}
            {(!quickAddMode || editingBet) && (addBetStep === 1 || editingBet) && (
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
                      e.target.blur();
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
                    onClick={handleStepContinue}
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
                    Continue
                    <ArrowRight />
                  </button>
                )}
              </div>
            )}

            {/* STEP 2: OPTIONAL DETAILS */}
            {!quickAddMode && addBetStep === 2 && !editingBet && (
              <div>
                {/* System Classification */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: colors.textSecondary, marginBottom: '8px' }}>
                    System Play Classification (optional)
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
            {!quickAddMode && addBetStep === 3 && !editingBet && (
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
});

function App() {
      const [user, setUser] = useState(null);
      const [authLoading, setAuthLoading] = useState(true);
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

// Device detection and landing/onboarding state
const [isMobile] = useState(() => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
});
const [isStandalone] = useState(() => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
});
const [showDesktopLanding, setShowDesktopLanding] = useState(() => {
  const hasSeenLanding = localStorage.getItem('hasSeenDesktopLanding');
  return !hasSeenLanding;
});
const [showMobileOnboarding, setShowMobileOnboarding] = useState(() => {
  const hasDismissed = localStorage.getItem('hasDismissedMobileOnboarding');
  return !hasDismissed;
});

// Tutorial and Demo Mode state
const [showTutorial, setShowTutorial] = useState(false);
const [demoMode, setDemoMode] = useState(false);
const [demoBets, setDemoBets] = useState([]);

  // Animation state
  const [animation, setAnimation] = useState({ show: false, type: '', emoji: '', effect: '', animationType: '', isStreak: false, streakText: '' });
  const [winStreak, setWinStreak] = useState(0);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('displayMode', displayMode);
  }, [displayMode]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

  // Inject native mobile app CSS styles
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'native-app-styles';
    style.textContent = `
      /* Native app feel - disable rubber band scrolling when installed as PWA */
      @media (display-mode: standalone) {
        html, body {
          overscroll-behavior: none;
        }
      }
      
      /* Remove tap highlight that shows on touch */
      body {
        -webkit-tap-highlight-color: transparent;
      }
      
      /* Disable accidental text selection on UI elements */
      button, 
      [role="button"],
      nav,
      img,
      svg {
        user-select: none;
        -webkit-user-select: none;
      }
      
      /* Better focus states - only show for keyboard navigation */
      button:focus {
        outline: none;
      }
      button:focus-visible {
        outline: 2px solid #D4A574;
        outline-offset: 2px;
      }
      
      /* Prevent iOS text size adjust */
      html {
        -webkit-text-size-adjust: 100%;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById('native-app-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const isRetired = retirementEndDate && new Date() < retirementEndDate;

  const daysUntilRetirementEnds = isRetired 
    ? Math.ceil((retirementEndDate - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const showToast = useCallback((message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  }, []);

  const handleRetirement = useCallback(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + retirementDays);
    setRetirementEndDate(endDate);
    setShowRetirementModal(false);
  }, [retirementDays]);

  useEffect(() => {
    if (!user) {
      setBets([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'bets'), 
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
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
  }, [user]);

  // First-time tutorial detection - show tutorial after login if first time
  useEffect(() => {
    if (user && !loading) {
      const hasSeenTutorial = localStorage.getItem(`hasSeenTutorial_${user.uid}`);
      if (!hasSeenTutorial && bets.length === 0) {
        // Small delay to let the UI settle
        const timer = setTimeout(() => {
          setShowTutorial(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [user, loading, bets.length]);

  // Handle loading demo data
  const handleLoadDemo = useCallback(() => {
    const demoBetsData = generateDemoBets();
    setDemoBets(demoBetsData);
    setDemoMode(true);
    // Mark tutorial as seen
    if (user) {
      localStorage.setItem(`hasSeenTutorial_${user.uid}`, 'true');
    }
  }, [user]);

  // Handle exiting demo mode
  const handleExitDemo = useCallback(() => {
    setDemoMode(false);
    setDemoBets([]);
  }, []);

  // Handle viewing tutorial manually
  const handleViewTutorial = useCallback(() => {
    setShowTutorial(true);
  }, []);

  // Handle closing tutorial
  const handleCloseTutorial = useCallback(() => {
    setShowTutorial(false);
    // Mark as seen
    if (user) {
      localStorage.setItem(`hasSeenTutorial_${user.uid}`, 'true');
    }
  }, [user]);

  // Combine real bets with demo bets when in demo mode
  const displayBets = useMemo(() => {
    if (demoMode) {
      return demoBets;
    }
    return bets;
  }, [demoMode, demoBets, bets]);

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

  const toggleDisplayMode = useCallback(() => {
    setDisplayMode(prev => prev === 'dollars' ? 'units' : 'dollars');
  }, []);

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
        const [year, month] = bet.date.split('-').map(Number);
        return (month - 1) === currentMonth && year === currentYear;
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
        const [year, month] = bet.date.split('-').map(Number);
        return (month - 1) === currentMonth && year === currentYear && bet.result !== 'pending';
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
    const { risk, win } = calculateRiskAndWin(dataToSubmit.units, dataToSubmit.odds, unitValue);
    
    const newBet = {
      ...dataToSubmit,
      userId: user.uid,
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

    const { risk, win } = calculateRiskAndWin(dataToSubmit.units, dataToSubmit.odds, unitValue);
    
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

  const cancelEdit = useCallback(() => {
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
  }, []);

  const getRandomWinAnimation = () => {
    // Hybrid animations: emoji + effect type
    const hybridAnimations = [
      // Horses with particles
      { emoji: '🐴', effect: 'particles', animationType: 'bounce' },
      { emoji: '🏇', effect: 'particles', animationType: 'bounce' },
      { emoji: '🐎', effect: 'particles', animationType: 'pulse' },
      // Birds with rings
      { emoji: '🦅', effect: 'rings', animationType: 'bounce' },
      { emoji: '🦜', effect: 'rings', animationType: 'bounce' },
      { emoji: '🐦', effect: 'rings', animationType: 'pulse' },
      // Locks with glow
      { emoji: '🔒', effect: 'glow', animationType: 'pulse' },
      { emoji: '🔐', effect: 'glow', animationType: 'pulse' },
      { emoji: '🔓', effect: 'glow', animationType: 'bounce' },
      // Money with floating money
      { emoji: '💰', effect: 'money', animationType: 'bounce' },
      { emoji: '💵', effect: 'money', animationType: 'pulse' },
    ];

    return hybridAnimations[Math.floor(Math.random() * hybridAnimations.length)];
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
        emoji: winAnim.emoji,
        effect: winAnim.effect,
        animationType: winAnim.animationType,
        isStreak: newStreak >= 3,
        streakText: newStreak >= 3 ? getStreakText() : ''
      });
    } else if (result === 'loss') {
      setWinStreak(0);
      setAnimation({
        show: true,
        type: 'loss',
        emoji: '❌',
        effect: 'shake',
        animationType: 'drop',
        isStreak: false,
        streakText: ''
      });
    } else {
      return;
    }

    setTimeout(() => {
      setAnimation({ show: false, type: '', emoji: '', effect: '', animationType: '', isStreak: false, streakText: '' });
    }, 2500);
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

  const confirmDelete = useCallback(async () => {
    try {
      await deleteDoc(doc(db, 'bets', deleteModal.betId));
      setDeleteModal({ show: false, betId: null });
    } catch (error) {
      console.error("Error deleting bet:", error);
    }
  }, [deleteModal.betId]);

// Key Trends Analysis - Short-Term & All-Time
  const trends = useMemo(() => {
    const settledBets = displayBets.filter(b => b.result !== 'pending' && b.result !== 'push');
    
    // Get bets from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBets = settledBets.filter(bet => new Date(bet.date + 'T00:00:00') >= thirtyDaysAgo);

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
  }, [displayBets]);
  const stats = useMemo(() => {
    const settledBets = displayBets.filter(b => b.result !== 'pending');
    const totalDollars = settledBets.reduce((sum, bet) => sum + bet.payout, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthBets = settledBets.filter(bet => {
      const [year, month] = bet.date.split('-').map(Number);
      return (month - 1) === currentMonth && year === currentYear;
    });
    const monthlyLoss = monthBets.reduce((sum, bet) => sum + bet.payout, 0);

    // Last month calculation - ADDED
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthBets = settledBets.filter(bet => {
      const [year, month] = bet.date.split('-').map(Number);
      return (month - 1) === lastMonth && year === lastMonthYear;
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
      pendingCount: displayBets.filter(b => b.result === 'pending').length,
      pendingRisk: displayBets.filter(b => b.result === 'pending').reduce((sum, b) => sum + (b.riskAmount || 0), 0),
      pendingToWin: displayBets.filter(b => b.result === 'pending').reduce((sum, b) => sum + (b.winAmount || 0), 0)
    };
  }, [displayBets, monthlyLimit]);

  const exportToCSV = useCallback(() => {
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
  }, [bets]);

  const resources = [
    { name: 'Scores & Odds', url: 'https://www.scoresandodds.com/', icon: '🎲' },
    { name: 'Action Network', url: 'https://www.actionnetwork.com/nfl/public-betting', icon: '📊' },
    { name: 'John Ewing', url: 'https://twitter.com/johnewing', icon: '🎯' },
    { name: 'Patrick Everson', url: 'https://twitter.com/PatrickE_Vegas', icon: '📈' },
    { name: 'DraftKings', url: 'https://sportsbook.draftkings.com/', icon: '🏈' }
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
    let filtered = [...displayBets];
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
      filtered = filtered.filter(bet => new Date(bet.date + 'T00:00:00') >= thirtyDaysAgo);
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
  const recentBets = displayBets.slice(0, 5);
  const pendingBets = displayBets.filter(b => b.result === 'pending');

  // Auth loading state
  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: colors.bgPrimary,
        gap: '32px'
      }}>
        <div style={{ 
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 36px',
          background: 'linear-gradient(145deg, #FFF8F0 0%, #F5E6D3 100%)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(212, 165, 116, 0.25)'
        }}>
          <div style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '48px',
            fontWeight: '700',
            fontStyle: 'italic',
            color: '#2C3E50',
            letterSpacing: '0.5px',
            lineHeight: 1.2
          }}>
            The Cindy
          </div>
          <div style={{
            height: '5px',
            width: '180px',
            background: 'linear-gradient(90deg, #D4A574 0%, #E8B887 100%)',
            marginTop: '6px',
            borderRadius: '3px'
          }} />
        </div>
        <div style={{
          width: '32px',
          height: '32px',
          border: `3px solid ${colors.bgSecondary}`,
          borderTop: `3px solid ${colors.accentPrimary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Desktop users (not logged in): show landing page first
  if (!isMobile && !user && showDesktopLanding) {
    return (
      <DesktopLandingPage 
        colors={colors} 
        onContinue={() => {
          localStorage.setItem('hasSeenDesktopLanding', 'true');
          setShowDesktopLanding(false);
        }}
        onViewTutorial={() => setShowTutorial(true)}
      />
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <LoginPage colors={colors} />;
  }

  // Mobile users (logged in, not in PWA mode): show onboarding once
  if (isMobile && !isStandalone && showMobileOnboarding) {
    return (
      <MobileOnboarding 
        colors={colors}
        onContinue={() => {
          setShowMobileOnboarding(false);
        }}
        onDismiss={() => {
          localStorage.setItem('hasDismissedMobileOnboarding', 'true');
          setShowMobileOnboarding(false);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: colors.bgPrimary,
        gap: '32px'
      }}>
        {/* Logo */}
        <div style={{ 
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 36px',
          background: 'linear-gradient(145deg, #FFF8F0 0%, #F5E6D3 100%)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(212, 165, 116, 0.25)'
        }}>
          <div style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '48px',
            fontWeight: '700',
            fontStyle: 'italic',
            color: '#2C3E50',
            letterSpacing: '0.5px',
            lineHeight: 1.2
          }}>
            The Cindy
          </div>
          <div style={{
            height: '5px',
            width: '180px',
            background: 'linear-gradient(90deg, #D4A574 0%, #E8B887 100%)',
            marginTop: '6px',
            borderRadius: '3px'
          }} />
        </div>
        
        {/* Loading indicator */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: `3px solid ${colors.bgSecondary}`,
            borderTop: `3px solid ${colors.accentPrimary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ color: colors.textSecondary, fontSize: '14px' }}>
            Loading your bets...
          </div>
        </div>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage 
          colors={colors}
          stats={stats}
          pendingBets={pendingBets}
          recentBets={recentBets}
          formatMoney={formatMoney}
          formatMoneyNoSign={formatMoneyNoSign}
          updateBetResult={updateBetResult}
          startEdit={startEdit}
          deleteBet={deleteBet}
          isRetired={isRetired}
          setShowAddBetModal={setShowAddBetModal}
          setAddBetStep={setAddBetStep}
          setCurrentPage={setCurrentPage}
          systemExpanded={systemExpanded}
          setSystemExpanded={setSystemExpanded}
        />;
      case 'stats':
        return <StatsPage 
          colors={colors}
          stats={stats}
          trends={trends}
          formatMoney={formatMoney}
          recentPerfExpanded={recentPerfExpanded}
          setRecentPerfExpanded={setRecentPerfExpanded}
          trendsExpanded={trendsExpanded}
          setTrendsExpanded={setTrendsExpanded}
        />;
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
          setShowFilterModal={setShowFilterModal}
        />;
      case 'more':
        return <MorePage 
          colors={colors}
          resources={resources}
          exportToCSV={exportToCSV}
          setShowRetirementModal={setShowRetirementModal}
          unitValue={unitValue}
          setUnitValue={setUnitValue}
          monthlyLimit={monthlyLimit}
          setMonthlyLimit={setMonthlyLimit}
          notificationSettings={notificationSettings}
          setNotificationSettings={setNotificationSettings}
          user={user}
          onLogout={handleLogout}
          onViewTutorial={handleViewTutorial}
        />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: colors.bgPrimary }}>
      {/* Animation Overlay */}
      {animation.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          {/* Screen Flash for wins */}
          {animation.type === 'win' && (
            <ScreenFlash color={colors.accentWin} />
          )}
          
          {/* Screen Flash for losses (red) */}
          {animation.type === 'loss' && (
            <ScreenFlash color={colors.accentLoss} />
          )}
          
          {/* Effect layers based on type */}
          {animation.effect === 'particles' && (
            <Particles color={colors.accentPrimary} count={25} />
          )}
          
          {animation.effect === 'rings' && (
            <ExpandingRings color={colors.accentPrimary} />
          )}
          
          {animation.effect === 'glow' && (
            <>
              <PulsingGlow color={colors.accentWin} />
              <Particles color={colors.accentWin} count={15} />
            </>
          )}
          
          {animation.effect === 'money' && (
            <FloatingMoney />
          )}
          
          {/* Fire effect for streaks */}
          {animation.isStreak && (
            <FireEffect />
          )}
          
          <div style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 10
          }}>
            {/* Main emoji with animation */}
            <div 
              className={
                animation.animationType === 'bounce' ? 'custom-bounce' : 
                animation.animationType === 'pulse' ? 'custom-pulse' : 
                animation.animationType === 'drop' ? 'custom-ping' : 'custom-bounce'
              }
              style={{
                fontSize: '150px',
                marginBottom: '16px',
                lineHeight: 1
              }}
            >
              {animation.emoji}
            </div>
            
            {/* Streak text */}
            {animation.isStreak && (
              <div 
                className="custom-pulse"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '60px' }}>🔥</span>
                <span style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  color: '#FB923C',
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                  {animation.streakText}
                </span>
                <span style={{ fontSize: '60px' }}>🔥</span>
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
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{ 
            background: colors.bgElevated, 
            border: '2px solid rgba(231, 76, 60, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '28rem',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flexShrink: 0, color: '#E74C3C' }}>
                <AlertCircle />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: colors.textPrimary }}>Delete Bet</h3>
                <p style={{ color: colors.textSecondary }}>Are you sure you want to delete this bet? This action cannot be undone.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '500',
                  background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal({ show: false, betId: null })}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '500',
                  background: colors.bgSecondary,
                  color: colors.textSecondary,
                  border: 'none',
                  cursor: 'pointer'
                }}
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
      <FilterModal 
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        historyFilter={historyFilter}
        setHistoryFilter={setHistoryFilter}
        colors={colors}
      />

      {/* Tutorial Modal */}
      <TutorialModal 
        show={showTutorial}
        onClose={handleCloseTutorial}
        onLoadDemo={handleLoadDemo}
        colors={colors}
      />

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
      {showAddBetModal && !isRetired && (
        <AddBetModal 
          key="add-bet-modal"
          showAddBetModal={showAddBetModal}
          setShowAddBetModal={setShowAddBetModal}
          addBetStep={addBetStep}
          setAddBetStep={setAddBetStep}
          quickAddMode={quickAddMode}
          setQuickAddMode={setQuickAddMode}
          editingBet={editingBet}
          formData={formData}
          setFormData={setFormData}
          handleAddBet={handleAddBet}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          colors={colors}
          showToast={showToast}
          unitValue={unitValue}
        />
      )}

      {/* Main Content */}
<div className={`max-w-7xl mx-auto ${isRetired ? 'opacity-30' : ''}`} style={{ padding: '16px 20px', display: showAddBetModal ? 'none' : 'block' }}>
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

        {/* Demo Mode Banner */}
        {demoMode && (
          <div style={{
            background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
            color: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🎮</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>Demo Mode</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Exploring with sample data</div>
              </div>
            </div>
            <button
              onClick={handleExitDemo}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Exit Demo
            </button>
          </div>
        )}

        {/* Render Current Page */}
        {renderPage()}
      </div>

      {/* Bottom Navigation */}
<div style={{ 
  position: 'fixed', 
  bottom: 0,
  display: showAddBetModal ? 'none' : 'block', 
        left: 0, 
        right: 0, 
        background: colors.bgElevated, 
        borderTop: `1px solid ${colors.border}`,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}>
        <div style={{ 
          maxWidth: '500px', 
          margin: '0 auto', 
          padding: '0 16px' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '12px 0' 
          }}>
            <button
              onClick={() => setCurrentPage('home')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 16px',
                color: currentPage === 'home' ? colors.accentPrimary : colors.textTertiary
              }}
            >
              <Home />
              <span style={{ fontSize: '11px', fontWeight: '500' }}>Home</span>
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
                padding: '8px 16px',
                color: currentPage === 'stats' ? colors.accentPrimary : colors.textTertiary
              }}
            >
              <BarChart />
              <span style={{ fontSize: '11px', fontWeight: '500' }}>Stats</span>
            </button>

            <button
              onClick={() => { if (!isRetired) { setAddBetStep(1); setShowAddBetModal(true); } }}
              disabled={isRetired}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: isRetired ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 16px',
                color: isRetired ? '#BDC3C7' : colors.textTertiary
              }}
            >
              <div style={{ 
                padding: '8px', 
                borderRadius: '50%', 
                background: isRetired ? '#BDC3C7' : `linear-gradient(135deg, ${colors.accentPrimary} 0%, #E8B887 100%)`,
                boxShadow: '0 4px 12px rgba(212, 165, 116, 0.4)'
              }}>
                <PlusCircle />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '500' }}>Add Bet</span>
            </button>

            <button
              onClick={() => setCurrentPage('history')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 16px',
                color: currentPage === 'history' ? colors.accentPrimary : colors.textTertiary
              }}
            >
              <Clock />
              <span style={{ fontSize: '11px', fontWeight: '500' }}>History</span>
            </button>

            <button
              onClick={() => setCurrentPage('more')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 16px',
                color: currentPage === 'more' ? colors.accentPrimary : colors.textTertiary
              }}
            >
              <MoreHorizontal />
              <span style={{ fontSize: '11px', fontWeight: '500' }}>More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
