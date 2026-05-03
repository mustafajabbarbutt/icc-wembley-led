import React, { useState, useEffect } from 'react';

// Prayer times data from ICC Wembley April 2026 timetable
const PRAYER_TIMETABLE = {
  '2026-04-01': { fajr: '5:45', dhuhr: '1:30', asr: '6:15', maghrib: '7:37', isha: '9:00', fajrAdhan: '5:01', dhuhrAdhan: '1:10', asrAdhan: '5:31', maghribAdhan: '7:37', ishaAdhan: '8:52', sunrise: '6:15', sunset: '7:37' },
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPoster, setShowPoster] = useState(false);

  const getTodayKey = () => new Date().toISOString().split('T')[0];
  const todayTimes = PRAYER_TIMETABLE[getTodayKey()] || PRAYER_TIMETABLE['2026-04-29'];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate between prayer times and poster every 5 seconds
  useEffect(() => {
    const rotationTimer = setInterval(() => {
      setShowPoster((prev) => !prev);
    }, 5000);
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
        
        // Show adhkaar for 5 minutes after each prayer
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
      }, 60000); // 1 minute per adhkaar
      return () => clearInterval(adhkaarTimer);
    }
  }, [showAdhkaar]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')}`;
  };

  if (!isAdmin) {
    // Show parking poster
    if (showPoster && !showAdhkaar) {
      return (
        <div className="h-screen w-screen bg-[#0f1419] flex items-center justify-center overflow-hidden">
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
        <div className="h-screen w-screen bg-gradient-to-b from-[#1e3a5f] via-[#2c5282] to-[#1e3a5f] text-white p-6 flex flex-col justify-center overflow-hidden">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="ICC Wembley" className="w-48 h-48 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-[#E8A857]">Islamic Cultural Centre Wembley</h1>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="bg-gradient-to-br from-[#E07060] to-[#D86A5A] rounded-3xl p-10 shadow-2xl border-4 border-[#89C5D4] max-w-4xl">
              <div className="text-center mb-6">
                <div className="bg-[#89C5D4] text-[#1e3a5f] px-6 py-3 rounded-full text-xl font-bold mb-4 inline-block">
                  {adhkaar.titleEn}
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-5xl mb-6 leading-relaxed text-white" style={{ fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
                  {adhkaar.arabic}
                </div>
              </div>
              
              <div className="text-center border-t-4 border-white/30 pt-6">
                <p className="text-2xl leading-relaxed text-white">
                  {adhkaar.translation}
                </p>
                <p className="text-xl mt-4 text-[#E8A857] font-bold">
                  — {adhkaar.reference}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Main Prayer Times Display - OPTIMIZED FOR 55" PORTRAIT
    const currentTimeFormatted = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const currentDateEn = currentTime.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    const hijriDate = getHijriDate();

    return (
      <div className="h-screen w-screen bg-gradient-to-b from-[#0f1419] via-[#1a2332] to-[#0f1419] overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col p-3">
          
          {/* Logo - Compact */}
          <div className="text-center mb-2">
            <img 
              src="/logo.png" 
              alt="ICC Wembley" 
              className="w-40 h-40 mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Top Header - Compact */}
          <div className="bg-gradient-to-r from-[#E07060] via-[#D86A5A] to-[#E07060] rounded-2xl p-3 mb-2 shadow-xl">
            <div className="flex justify-between items-center text-white text-sm">
              <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm font-bold">
                {hijriDate}
              </div>
              
              <div className="text-center">
                <div className="bg-[#1e3a5f] text-white rounded-xl px-4 py-2 shadow-xl border border-[#89C5D4]">
                  <div className="text-5xl font-bold tracking-wider" style={{ fontFamily: 'Courier New, monospace' }}>
                    {currentTimeFormatted}
                  </div>
                </div>
              </div>
              
              <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm font-bold">
                {currentDateEn}
              </div>
            </div>
          </div>

          {/* Quranic Header - Compact */}
          <div className="bg-gradient-to-r from-[#89C5D4] to-[#A8D5E2] py-2 rounded-xl mb-2 shadow-lg">
            <div className="text-center">
              <p className="text-[#1e3a5f] text-xl font-bold">ESTABLISH THE PRAYER</p>
              <p className="text-[#2c5282] text-base font-semibold" style={{ direction: 'rtl' }}>
                إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ
              </p>
            </div>
          </div>

          {/* Prayer Times Table Header - Compact */}
          <div className="bg-gradient-to-r from-[#E07060] to-[#D86A5A] py-2 text-white rounded-t-xl shadow-lg">
            <div className="grid grid-cols-3 gap-2 px-3 text-center">
              <div className="text-xl font-bold">SALAH</div>
              <div className="text-xl font-bold">ADHAN</div>
              <div className="text-xl font-bold">JAMAAT</div>
            </div>
          </div>

          {/* Prayer Times - Optimized Spacing */}
          <div className="flex-1 bg-gradient-to-b from-[#1a2332] to-[#243447] rounded-b-xl overflow-hidden">
            <div className="h-full flex flex-col justify-evenly">
              {[
                { nameEn: 'FAJR', nameAr: 'فجر', adhan: todayTimes.fajrAdhan, jamaat: todayTimes.fajr },
                { nameEn: 'DHUHR', nameAr: 'ظهر', adhan: todayTimes.dhuhrAdhan, jamaat: todayTimes.dhuhr },
                { nameEn: 'ASR', nameAr: 'عصر', adhan: todayTimes.asrAdhan, jamaat: todayTimes.asr },
                { nameEn: 'MAGHRIB', nameAr: 'مغرب', adhan: todayTimes.maghribAdhan, jamaat: todayTimes.maghrib },
                { nameEn: 'ISHA', nameAr: 'عشاء', adhan: todayTimes.ishaAdhan, jamaat: todayTimes.isha },
                ...(todayTimes.jummah ? [{ nameEn: 'JUMMAH', nameAr: 'جمعه', adhan: '1:04', jamaat: todayTimes.jummah }] : [])
              ].map((prayer, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 px-2">
                  {/* Prayer Name */}
                  <div className="bg-gradient-to-br from-[#89C5D4] to-[#A8D5E2] rounded-lg px-2 py-3 flex flex-col justify-center items-center shadow-lg border border-[#E8A857]">
                    <div className="text-[#1e3a5f] text-xl font-bold" style={{ direction: 'rtl' }}>
                      {prayer.nameAr}
                    </div>
                    <div className="text-[#2c5282] text-xl font-bold">
                      {prayer.nameEn}
                    </div>
                  </div>

                  {/* Adhan Time */}
                  <div className="bg-[#0a0e14] rounded-lg flex items-center justify-center shadow-xl border border-[#00d9ff]/30">
                    <div className="text-[#00d9ff] text-4xl font-bold tracking-wider" style={{ 
                      fontFamily: 'Courier New, monospace',
                      textShadow: '0 0 15px rgba(0,217,255,0.8)'
                    }}>
                      {formatTime(prayer.adhan)}
                    </div>
                  </div>

                  {/* Jamaat Time */}
                  <div className="bg-gradient-to-br from-[#E07060] to-[#D86A5A] rounded-lg flex items-center justify-center shadow-xl border border-[#E8A857]">
                    <div className="text-white text-4xl font-bold tracking-wider" style={{ 
                      fontFamily: 'Courier New, monospace',
                      textShadow: '0 0 10px rgba(255,255,255,0.5)'
                    }}>
                      {formatTime(prayer.jamaat)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sunrise & Sunset - Compact */}
          <div className="bg-gradient-to-r from-[#E8A857] via-[#D99A4A] to-[#E8A857] rounded-xl py-3 px-4 shadow-xl mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30">
                <div className="text-[#1e3a5f] text-base font-bold">🌅 SUNRISE</div>
                <div className="text-[#1e3a5f] text-3xl font-bold" style={{ fontFamily: 'Courier New, monospace' }}>
                  {formatTime(todayTimes.sunrise)}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30">
                <div className="text-[#1e3a5f] text-base font-bold">🌇 SUNSET</div>
                <div className="text-[#1e3a5f] text-3xl font-bold" style={{ fontFamily: 'Courier New, monospace' }}>
                  {formatTime(todayTimes.sunset)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <button onClick={() => setIsAdmin(false)} className="bg-red-600 px-6 py-3 rounded">Exit</button>
        </div>
        <div className="bg-gray-800 rounded p-6">
          <h2 className="text-2xl mb-4">Update Prayer Times</h2>
          <p className="text-gray-400">Admin panel coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesDisplay;
