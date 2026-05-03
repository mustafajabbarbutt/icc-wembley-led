import React, { useState, useEffect } from 'react';

const PRAYER_TIMETABLE = {
  '2026-04-27': { fajr: '5:00', dhuhr: '1:30', asr: '7:15', maghrib: '8:21', isha: '9:45', fajrAdhan: '3:58', dhuhrAdhan: '1:04', asrAdhan: '6:00', maghribAdhan: '8:21', ishaAdhan: '9:30', sunrise: '5:39', sunset: '8:21', jummah: '1:30' },
  '2026-04-28': { fajr: '5:00', dhuhr: '1:30', asr: '7:15', maghrib: '8:22', isha: '9:45', fajrAdhan: '3:55', dhuhrAdhan: '1:04', asrAdhan: '6:01', maghribAdhan: '8:22', ishaAdhan: '9:31', sunrise: '5:37', sunset: '8:22' },
  '2026-04-29': { fajr: '5:00', dhuhr: '1:30', asr: '7:15', maghrib: '8:24', isha: '9:45', fajrAdhan: '3:53', dhuhrAdhan: '1:04', asrAdhan: '6:02', maghribAdhan: '8:24', ishaAdhan: '9:32', sunrise: '5:39', sunset: '8:24' },
  '2026-04-30': { fajr: '5:00', dhuhr: '1:30', asr: '7:15', maghrib: '8:26', isha: '9:45', fajrAdhan: '3:51', dhuhrAdhan: '1:04', asrAdhan: '6:03', maghribAdhan: '8:26', ishaAdhan: '9:34', sunrise: '5:39', sunset: '8:26' }
};

const ADHKAAR = [
  {
    title: "آية الكرسي",
    titleEn: "Ayat al-Kursi",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.",
    reference: "Quran 2:255"
  },
  {
    title: "التسبيح",
    titleEn: "Tasbih",
    arabic: "سُبْحَانَ اللهِ (٣٣) • الْحَمْدُ لِلَّهِ (٣٣) • اللهُ أَكْبَرُ (٣٤)",
    translation: "SubhanAllah 33x • Alhamdulillah 33x • Allahu Akbar 34x",
    reference: "After Salah"
  }
];

const getHijriDate = () => "11 Dhul Qa'dah 1447";

const PrayerTimesDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAdhkaar, setShowAdhkaar] = useState(false);
  const [currentAdhkaar, setCurrentAdhkaar] = useState(0);
  const [showPoster, setShowPoster] = useState(false);
  const [fadeState, setFadeState] = useState('fade-in');
  
  // Check URL for admin parameter
  const urlParams = new URLSearchParams(window.location.search);
  const adminFromUrl = urlParams.get('admin') === 'true';
  
  const [isAdmin, setIsAdmin] = useState(adminFromUrl);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [adminSection, setAdminSection] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [announcements, setAnnouncements] = useState([
    "Quran Commentary Lessons Every Tuesday After Isha",
    "Sisters' Halaqa This Saturday 2:00 PM"
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const getTodayKey = () => new Date().toISOString().split('T')[0];
  const todayTimes = PRAYER_TIMETABLE[getTodayKey()] || PRAYER_TIMETABLE['2026-04-29'];

  const isMakroohTime = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [fajrH, fajrM] = todayTimes.fajr.split(':').map(Number);
    const fajrEnd = fajrH * 60 + fajrM;
    const [sunriseH, sunriseM] = todayTimes.sunrise.split(':').map(Number);
    const sunriseEnd = sunriseH * 60 + sunriseM + 20;
    
    if (currentMinutes >= fajrEnd && currentMinutes <= sunriseEnd) {
      return "After Fajr until 20 minutes after Sunrise";
    }
    
    const [dhuhrH, dhuhrM] = todayTimes.dhuhrAdhan.split(':').map(Number);
    const dhuhrAdhan = dhuhrH * 60 + dhuhrM;
    const beforeDhuhr = dhuhrAdhan - 15;
    
    if (currentMinutes >= beforeDhuhr && currentMinutes < dhuhrAdhan) {
      return "15 minutes before Dhuhr (Sun at Zenith)";
    }
    
    const [asrH, asrM] = todayTimes.asr.split(':').map(Number);
    const asrEnd = asrH * 60 + asrM;
    const [maghribH, maghribM] = todayTimes.maghribAdhan.split(':').map(Number);
    const maghribStart = maghribH * 60 + maghribM;
    
    if (currentMinutes >= asrEnd && currentMinutes < maghribStart) {
      return "After Asr until Maghrib";
    }
    
    return null;
  };

  const makroohReason = isMakroohTime();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Global keyboard shortcut for admin access
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAdmin(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const rotationTimer = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setShowPoster((prev) => !prev);
        setFadeState('fade-in');
      }, 1000);
    }, 7000);
    return () => clearInterval(rotationTimer);
  }, []);

  useEffect(() => {
    const checkPrayerTime = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      const prayers = [
        { time: todayTimes.fajr },
        { time: todayTimes.dhuhr },
        { time: todayTimes.asr },
        { time: todayTimes.maghrib },
        { time: todayTimes.isha }
      ];

      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        const timeSincePrayer = currentMinutes - prayerMinutes;
        
        if (timeSincePrayer >= 0 && timeSincePrayer <= 5) {
          setShowAdhkaar(true);
          return;
        }
      }
      setShowAdhkaar(false);
    };

    checkPrayerTime();
    const interval = setInterval(checkPrayerTime, 60000);
    return () => clearInterval(interval);
  }, [todayTimes]);

  useEffect(() => {
    if (showAdhkaar) {
      const adhkaarTimer = setInterval(() => {
        setCurrentAdhkaar((prev) => (prev + 1) % ADHKAAR.length);
      }, 60000);
      return () => clearInterval(adhkaarTimer);
    }
  }, [showAdhkaar]);

  // Admin login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'iccwembley2026') {
      setIsLoggedIn(true);
      setIsAdmin(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleAddAnnouncement = () => {
    if (newAnnouncement.trim()) {
      setAnnouncements([...announcements, newAnnouncement]);
      setNewAnnouncement('');
    }
  };

  const handleDeleteAnnouncement = (index) => {
    setAnnouncements(announcements.filter((_, i) => i !== index));
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')}`;
  };

  const transitionStyle = {
    opacity: fadeState === 'fade-in' ? 1 : 0,
    transition: 'opacity 1s ease-in-out'
  };

  // ADMIN PANEL
  if (isAdmin && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#1a1a24] to-[#0a0e14] flex items-center justify-center p-8">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lora:wght@400;500;600&family=Cinzel:wght@400;600&display=swap');
        `}</style>
        
        <div className="bg-gradient-to-br from-[#2C1810] to-[#1a1614] border-2 border-[#D4AF37] rounded-2xl p-12 shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="ICC Wembley" className="w-32 h-32 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-[#D4AF37] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
              Admin Panel
            </h1>
            <p className="text-[#E8D5C4]" style={{ fontFamily: 'Lora, serif' }}>
              Islamic Cultural Centre Wembley
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[#D4AF37] text-sm font-semibold mb-2" style={{ fontFamily: 'Lora, serif' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg px-4 py-3 text-[#F5E6D3] focus:border-[#D4AF37] focus:outline-none"
                style={{ fontFamily: 'Lora, serif' }}
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-[#1a1614] font-bold py-3 rounded-lg transition-all duration-300 shadow-lg"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setIsAdmin(false)}
              className="w-full bg-[#8B0000] hover:bg-[#A52A2A] text-white font-semibold py-3 rounded-lg transition-all duration-300"
              style={{ fontFamily: 'Lora, serif' }}
            >
              Back to Display
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#D4AF37]/60" style={{ fontFamily: 'Lora, serif' }}>
            Press Ctrl+Shift+A on main display to access admin
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin && isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#1a1a24] to-[#0a0e14] p-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lora:wght@400;500;600&family=Cinzel:wght@400;600&display=swap');
        `}</style>
        
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2C1810] to-[#3D2416] border-2 border-[#D4AF37] rounded-2xl p-6 mb-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-[#D4AF37] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                  ICC Wembley Admin Panel
                </h1>
                <p className="text-[#E8D5C4]" style={{ fontFamily: 'Lora, serif' }}>
                  Manage prayer times, announcements, and settings
                </p>
              </div>
              <button
                onClick={() => { setIsAdmin(false); setIsLoggedIn(false); setPassword(''); }}
                className="bg-[#8B0000] hover:bg-[#A52A2A] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                style={{ fontFamily: 'Lora, serif' }}
              >
                Exit Admin
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gradient-to-r from-[#2C1810] to-[#3D2416] border-2 border-[#D4AF37]/50 rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex gap-4 flex-wrap">
              {['dashboard', 'prayer-times', 'announcements', 'settings'].map((section) => (
                <button
                  key={section}
                  onClick={() => setAdminSection(section)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    adminSection === section
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1614]'
                      : 'bg-black/30 text-[#E8D5C4] hover:bg-black/50'
                  }`}
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard */}
          {adminSection === 'dashboard' && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#2C1810] to-[#1a1614] border-2 border-[#D4AF37]/50 rounded-xl p-6 shadow-xl">
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                  Quick Stats
                </h3>
                <div className="space-y-3 text-[#E8D5C4]" style={{ fontFamily: 'Lora, serif' }}>
                  <p>📅 Dates Loaded: {Object.keys(PRAYER_TIMETABLE).length}</p>
                  <p>📢 Announcements: {announcements.length}</p>
                  <p>🕌 Adhkaar: {ADHKAAR.length}</p>
                  <p>✅ System: Active</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#2C1810] to-[#1a1614] border-2 border-[#D4AF37]/50 rounded-xl p-6 shadow-xl">
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                  Today's Times
                </h3>
                <div className="space-y-2 text-[#E8D5C4]" style={{ fontFamily: 'Lora, serif' }}>
                  <p>Fajr: {todayTimes.fajr}</p>
                  <p>Dhuhr: {todayTimes.dhuhr}</p>
                  <p>Asr: {todayTimes.asr}</p>
                  <p>Maghrib: {todayTimes.maghrib}</p>
                  <p>Isha: {todayTimes.isha}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#2C1810] to-[#1a1614] border-2 border-[#D4AF37]/50 rounded-xl p-6 shadow-xl">
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                  Status
                </h3>
                <div className="space-y-3 text-[#E8D5C4]" style={{ fontFamily: 'Lora, serif' }}>
                  <p>🟢 Display: Running</p>
                  <p>🟢 Rotation: Active</p>
                  <p>🟢 Adhkaar: Enabled</p>
                  <p>{makroohReason ? '🔴 Makrooh Time' : '🟢 Prayer Permitted'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prayer Times */}
          {adminSection === 'prayer-times' && (
            <div className="bg-gradient-to-br from-[#2C1810] to-[#1a1614] border-2 border-[#D4AF37]/50 rounded-xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-[#D4AF37] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                Update Prayer Times
              </h2>
              
              <div className="mb-6">
                <label className="block text-[#D4AF37] text-lg font-semibold mb-2" style={{ fontFamily: 'Lora, serif' }}>
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg px-4 py-2 text-[#F5E6D3]"
                  style={{ fontFamily: 'Lora, serif' }}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((prayer) => (
                  <div key={prayer} className="space-y-3">
                    <h3 className="text-xl font-bold text-[#D4AF37] capitalize" style={{ fontFamily: 'Cinzel, serif' }}>
                      {prayer}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#E8D5C4] text-sm mb-1" style={{ fontFamily: 'Lora, serif' }}>
                          Adhan
                        </label>
                        <input
                          type="time"
                          defaultValue={PRAYER_TIMETABLE[selectedDate]?.[`${prayer}Adhan`] || ''}
                          className="w-full bg-black/50 border border-[#D4AF37]/30 rounded px-3 py-2 text-[#F5E6D3]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E8D5C4] text-sm mb-1" style={{ fontFamily: 'Lora, serif' }}>
                          Jamaat
                        </label>
                        <input
                          type="time"
                          defaultValue={PRAYER_TIMETABLE[selectedDate]?.[prayer] || ''}
                          className="w-full bg-black/50 border border-[#D4AF37]/30 rounded px-3 py-2 text-[#F5E6D3]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1614] px-8 py-3 rounded-lg font-bold hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Save Changes
              </button>

              <div className="mt-8 p-4 bg-[#1e5a8e]/20 border border-[#87CEEB]/30 rounded-lg">
                <p className="text-[#87CEEB]" style={{ fontFamily: 'Lora, serif' }}>
                  ℹ️ <strong>Note:</strong> Changes will be saved locally in the browser. For permanent storage, you'll need to integrate a database.
                </p>
              </div>
            </div>
          )}

          {/* Announcements */}
          {adminSection === 'announcements' && (
            <div className="bg-gradient-to-br from-[#2C1810] to-[#1a1614] border-2 border-[#D4AF37]/50 rounded-xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-[#D4AF37] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                Manage Announcements
              </h2>

              <div className="mb-8">
                <label className="block text-[#D4AF37] text-lg font-semibold mb-2" style={{ fontFamily: 'Lora, serif' }}>
                  Add New Announcement
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    placeholder="Enter announcement text..."
                    className="flex-1 bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg px-4 py-3 text-[#F5E6D3]"
                    style={{ fontFamily: 'Lora, serif' }}
                  />
                  <button
                    onClick={handleAddAnnouncement}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1614] px-6 py-3 rounded-lg font-bold hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Cinzel, serif' }}>
                  Current Announcements
                </h3>
                {announcements.length === 0 ? (
                  <p className="text-[#E8D5C4] italic" style={{ fontFamily: 'Lora, serif' }}>
                    No announcements yet
                  </p>
                ) : (
                  announcements.map((announcement, idx) => (
                    <div
                      key={idx}
                      className="bg-black/30 border border-[#D4AF37]/30 rounded-lg p-4 flex justify-between items-center"
                    >
                      <p className="text-[#E8D5C4]" style={{ fontFamily: 'Lora, serif' }}>
                        {announcement}
                      </p>
                      <button
                        onClick={() => handleDeleteAnnouncement(idx)}
                        className="text-[#8B0000] hover:text-[#A52A2A] font-semibold transition-colors"
                        style={{ fontFamily: 'Lora, serif' }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Settings */}
          {adminSection === 'settings' && (
            <div className="bg-gradient-to-br from-[#2C1810] to-[#1a1614] border-2 border-[#D4AF37]/50 rounded-xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-[#D4AF37] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                Display Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[#D4AF37] text-lg font-semibold mb-2" style={{ fontFamily: 'Lora, serif' }}>
                    Adhkaar Display Duration (minutes)
                  </label>
                  <input
                    type="number"
                    defaultValue={5}
                    min={1}
                    max={30}
                    className="bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg px-4 py-2 text-[#F5E6D3]"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] text-lg font-semibold mb-2" style={{ fontFamily: 'Lora, serif' }}>
                    Rotation Speed (seconds between slides)
                  </label>
                  <input
                    type="number"
                    defaultValue={7}
                    min={3}
                    max={30}
                    className="bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg px-4 py-2 text-[#F5E6D3]"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] text-lg font-semibold mb-2" style={{ fontFamily: 'Lora, serif' }}>
                    Change Admin Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg px-4 py-2 text-[#F5E6D3] w-full max-w-md"
                  />
                </div>

                <button
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1614] px-8 py-3 rounded-lg font-bold hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Save Settings
                </button>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Cinzel, serif' }}>
                  Quick Guide
                </h3>
                <ul className="space-y-2 text-[#E8D5C4]" style={{ fontFamily: 'Lora, serif' }}>
                  <li>• <strong>Access Admin:</strong> Press Ctrl+Shift+A on main display</li>
                  <li>• <strong>Default Password:</strong> iccwembley2026</li>
                  <li>• <strong>Prayer Times:</strong> Update individual dates or bulk import</li>
                  <li>• <strong>Announcements:</strong> Add urgent messages visible on display</li>
                  <li>• <strong>Makrooh Times:</strong> Automatically detected and displayed</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show parking poster
  if (showPoster && !showAdhkaar) {
    return (
      <div className="h-screen w-screen bg-[#0a0e14] flex items-center justify-center overflow-hidden" style={transitionStyle}>
        <img 
          src="/parking-poster-1.jpg" 
          alt="Event Day Parking" 
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  // Show Adhkaar
  if (showAdhkaar) {
    const adhkaar = ADHKAAR[currentAdhkaar];
    return (
      <div className="h-screen w-screen bg-gradient-to-b from-[#1a1614] via-[#2d1810] to-[#1a1614] text-white p-6 flex flex-col justify-center overflow-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lora:wght@400;600&display=swap');
        `}</style>
        
        <div className="text-center mb-8">
          <img src="/logo.png" alt="ICC Wembley" className="w-48 h-48 mx-auto mb-4 drop-shadow-2xl" />
          <h1 className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Islamic Cultural Centre Wembley
          </h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="bg-gradient-to-br from-[#8B4513]/30 to-[#6B3410]/30 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border-2 border-[#D4AF37]/40 max-w-4xl">
            <div className="text-center mb-6">
              <div className="bg-[#D4AF37] text-[#1a1614] px-6 py-3 rounded-full text-xl font-semibold mb-4 inline-block" style={{ fontFamily: 'Lora, serif' }}>
                {adhkaar.titleEn}
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-5xl mb-6 leading-relaxed text-[#F5E6D3]" style={{ fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
                {adhkaar.arabic}
              </div>
            </div>
            
            <div className="text-center border-t-2 border-[#D4AF37]/30 pt-6">
              <p className="text-2xl leading-relaxed text-[#E8D5C4]" style={{ fontFamily: 'Lora, serif' }}>
                {adhkaar.translation}
              </p>
              <p className="text-xl mt-4 text-[#D4AF37] font-semibold">
                — {adhkaar.reference}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Prayer Times Display (same as before)
  const currentTimeFormatted = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const currentDateEn = currentTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hijriDate = getHijriDate();

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#0a0e14] via-[#1a1a24] to-[#0a0e14] overflow-hidden flex flex-col" style={transitionStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lora:wght@400;500;600&family=Cinzel:wght@400;600&display=swap');
        
        .geometric-pattern {
          background-image: 
            linear-gradient(30deg, #D4AF37 12%, transparent 12.5%, transparent 87%, #D4AF37 87.5%, #D4AF37),
            linear-gradient(150deg, #D4AF37 12%, transparent 12.5%, transparent 87%, #D4AF37 87.5%, #D4AF37),
            linear-gradient(30deg, #D4AF37 12%, transparent 12.5%, transparent 87%, #D4AF37 87.5%, #D4AF37),
            linear-gradient(150deg, #D4AF37 12%, transparent 12.5%, transparent 87%, #D4AF37 87.5%, #D4AF37);
          background-size: 80px 140px;
          background-position: 0 0, 0 0, 40px 70px, 40px 70px;
          opacity: 0.03;
        }
        
        .ornate-border {
          border-image: linear-gradient(45deg, #D4AF37, #B8860B, #D4AF37) 1;
        }
      `}</style>

      <div className="absolute inset-0 geometric-pattern pointer-events-none"></div>
      
      <div className="relative z-10 flex-1 flex flex-col p-4">
        
        {makroohReason && (
          <div className="bg-gradient-to-r from-[#8B0000] via-[#A52A2A] to-[#8B0000] border-2 border-[#FFD700] rounded-2xl p-4 mb-3 shadow-2xl animate-pulse">
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div className="text-center">
                <div className="text-white text-xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
                  MAKROOH TIME - PRAYER NOT PERMITTED
                </div>
                <div className="text-[#FFD700] text-sm font-medium" style={{ fontFamily: 'Lora, serif' }}>
                  {makroohReason} • Please wait for the permitted time
                </div>
              </div>
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
        )}

        <div className="text-center mb-3">
          <img 
            src="/logo.png" 
            alt="ICC Wembley" 
            className="w-40 h-40 mx-auto drop-shadow-2xl"
          />
        </div>

        <div className="bg-gradient-to-r from-[#2C1810] via-[#3D2416] to-[#2C1810] border-2 ornate-border rounded-2xl p-4 mb-3 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="text-[#D4AF37] text-base font-semibold px-4 py-2 bg-black/30 rounded-lg" style={{ fontFamily: 'Lora, serif' }}>
              {hijriDate}
            </div>
            
            <div className="text-center">
              <div className="bg-black/50 backdrop-blur-sm text-[#F5E6D3] rounded-xl px-6 py-3 shadow-xl border border-[#D4AF37]/30">
                <div className="text-6xl font-bold tracking-wider" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>
                  {currentTimeFormatted}
                </div>
              </div>
            </div>
            
            <div className="text-[#D4AF37] text-base font-semibold px-4 py-2 bg-black/30 rounded-lg text-right" style={{ fontFamily: 'Lora, serif' }}>
              {currentDateEn}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#D4AF37] via-[#F5E6D3] to-[#D4AF37] py-3 rounded-xl mb-3 shadow-lg border-2 border-[#8B4513]/30">
          <div className="text-center">
            <p className="text-[#2C1810] text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
              ESTABLISH THE PRAYER
            </p>
            <p className="text-[#3D2416] text-lg font-semibold mt-1" style={{ direction: 'rtl' }}>
              إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] border-2 border-[#D4AF37]/50 py-3 text-white rounded-t-xl shadow-lg">
          <div className="grid grid-cols-3 gap-2 px-3 text-center">
            <div className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>SALAH</div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>ADHAN</div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>JAMAAT</div>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-b from-[#1a1a24] to-[#2a2a34] rounded-b-xl border-2 border-[#D4AF37]/30 overflow-hidden">
          <div className="h-full flex flex-col justify-evenly p-2">
            {[
              { nameEn: 'FAJR', nameAr: 'فجر', adhan: todayTimes.fajrAdhan, jamaat: todayTimes.fajr },
              { nameEn: 'DHUHR', nameAr: 'ظهر', adhan: todayTimes.dhuhrAdhan, jamaat: todayTimes.dhuhr },
              { nameEn: 'ASR', nameAr: 'عصر', adhan: todayTimes.asrAdhan, jamaat: todayTimes.asr },
              { nameEn: 'MAGHRIB', nameAr: 'مغرب', adhan: todayTimes.maghribAdhan, jamaat: todayTimes.maghrib },
              { nameEn: 'ISHA', nameAr: 'عشاء', adhan: todayTimes.ishaAdhan, jamaat: todayTimes.isha },
              ...(todayTimes.jummah ? [{ nameEn: 'JUMMAH', nameAr: 'جمعه', adhan: todayTimes.dhuhrAdhan, jamaat: todayTimes.jummah }] : [])
            ].map((prayer, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2">
                <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-lg px-3 py-4 flex flex-col justify-center items-center shadow-lg border border-[#2C1810]">
                  <div className="text-[#1a1614] text-2xl font-bold mb-1" style={{ direction: 'rtl' }}>
                    {prayer.nameAr}
                  </div>
                  <div className="text-[#2C1810] text-2xl font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                    {prayer.nameEn}
                  </div>
                </div>

                <div className="bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-xl border border-[#D4AF37]/30">
                  <div className="text-[#87CEEB] text-5xl font-bold" style={{ 
                    fontFamily: 'Cinzel, serif',
                    textShadow: '0 0 20px rgba(135,206,235,0.6)'
                  }}>
                    {formatTime(prayer.adhan)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#8B4513] to-[#6B3410] rounded-lg flex items-center justify-center shadow-xl border-2 border-[#D4AF37]/50">
                  <div className="text-[#F5E6D3] text-5xl font-bold" style={{ 
                    fontFamily: 'Cinzel, serif',
                    textShadow: '0 0 10px rgba(245,230,211,0.3)'
                  }}>
                    {formatTime(prayer.jamaat)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#2C1810] via-[#3D2416] to-[#2C1810] border-2 ornate-border rounded-xl py-3 px-4 shadow-xl mt-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-[#D4AF37]/30">
              <div className="text-[#D4AF37] text-lg font-bold" style={{ fontFamily: 'Lora, serif' }}>🌅 SUNRISE</div>
              <div className="text-[#F5E6D3] text-4xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
                {formatTime(todayTimes.sunrise)}
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-[#D4AF37]/30">
              <div className="text-[#D4AF37] text-lg font-bold" style={{ fontFamily: 'Lora, serif' }}>🌇 SUNSET</div>
              <div className="text-[#F5E6D3] text-4xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
                {formatTime(todayTimes.sunset)}
              </div>
            </div>
          </div>
          
          {/* Admin Access Button - Hidden but clickable */}
          <div className="text-center mt-2">
            <button
              onClick={() => setIsAdmin(true)}
              className="text-[#D4AF37]/30 hover:text-[#D4AF37] text-xs transition-all duration-300"
              style={{ fontFamily: 'Lora, serif' }}
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrayerTimesDisplay;
