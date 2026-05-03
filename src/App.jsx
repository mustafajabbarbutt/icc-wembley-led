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

  const getTodayKey = () => new Date().toISOString().split('T')[0];
  const todayTimes = PRAYER_TIMETABLE[getTodayKey()] || PRAYER_TIMETABLE['2026-04-29'];

  // Check if current time is Makrooh
  const isMakroohTime = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // After Fajr until 20 min after sunrise
    const [fajrH, fajrM] = todayTimes.fajr.split(':').map(Number);
    const fajrEnd = fajrH * 60 + fajrM;
    const [sunriseH, sunriseM] = todayTimes.sunrise.split(':').map(Number);
    const sunriseEnd = sunriseH * 60 + sunriseM + 20;
    
    if (currentMinutes >= fajrEnd && currentMinutes <= sunriseEnd) {
      return "After Fajr until 20 minutes after Sunrise";
    }
    
    // 15 min before Dhuhr (sun at zenith)
    const [dhuhrH, dhuhrM] = todayTimes.dhuhrAdhan.split(':').map(Number);
    const dhuhrAdhan = dhuhrH * 60 + dhuhrM;
    const beforeDhuhr = dhuhrAdhan - 15;
    
    if (currentMinutes >= beforeDhuhr && currentMinutes < dhuhrAdhan) {
      return "15 minutes before Dhuhr (Sun at Zenith)";
    }
    
    // After Asr until Maghrib
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

  // Smooth rotation with fade transitions (7 seconds total: 5 display + 2 transition)
  useEffect(() => {
    const rotationTimer = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setShowPoster((prev) => !prev);
        setFadeState('fade-in');
      }, 1000); // 1 second fade out, then switch, then 1 second fade in = 2 second transition
    }, 7000); // 7 seconds total (5 viewing + 2 transition)
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

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Smooth fade transition styles
  const transitionStyle = {
    opacity: fadeState === 'fade-in' ? 1 : 0,
    transition: 'opacity 1s ease-in-out'
  };

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

  // Main Prayer Times Display
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
        
        {/* Makrooh Warning Banner */}
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

        {/* Logo */}
        <div className="text-center mb-3">
          <img 
            src="/logo.png" 
            alt="ICC Wembley" 
            className="w-40 h-40 mx-auto drop-shadow-2xl"
          />
        </div>

        {/* Header with dates and clock */}
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

        {/* Quranic Banner */}
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

        {/* Prayer Table Header */}
        <div className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] border-2 border-[#D4AF37]/50 py-3 text-white rounded-t-xl shadow-lg">
          <div className="grid grid-cols-3 gap-2 px-3 text-center">
            <div className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>SALAH</div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>ADHAN</div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>JAMAAT</div>
          </div>
        </div>

        {/* Prayer Times */}
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
                {/* Prayer Name */}
                <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-lg px-3 py-4 flex flex-col justify-center items-center shadow-lg border border-[#2C1810]">
                  <div className="text-[#1a1614] text-2xl font-bold mb-1" style={{ direction: 'rtl' }}>
                    {prayer.nameAr}
                  </div>
                  <div className="text-[#2C1810] text-2xl font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                    {prayer.nameEn}
                  </div>
                </div>

                {/* Adhan Time */}
                <div className="bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-xl border border-[#D4AF37]/30">
                  <div className="text-[#87CEEB] text-5xl font-bold" style={{ 
                    fontFamily: 'Cinzel, serif',
                    textShadow: '0 0 20px rgba(135,206,235,0.6)'
                  }}>
                    {formatTime(prayer.adhan)}
                  </div>
                </div>

                {/* Jamaat Time */}
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

        {/* Sunrise & Sunset */}
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
        </div>

      </div>
    </div>
  );
};

export default PrayerTimesDisplay;
