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
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.",
    reference: "Quran 2:255"
  },
  {
    title: "التسبيح",
    titleEn: "Tasbih",
    arabic: "سُبْحَانَ اللهِ (٣٣) • الْحَمْدُ لِلَّهِ (٣٣) • اللهُ أَكْبَرُ (٣٤)",
    translation: "SubhanAllah 33 times • Alhamdulillah 33 times • Allahu Akbar 34 times",
    reference: "After Salah"
  },
  {
    title: "دعاء",
    titleEn: "Du'a",
    arabic: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
    translation: "O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of Glory and Honor.",
    reference: "After Salah"
  }
];

const getHijriDate = () => {
  return "11 Dhul Qa'dah 1447";
};

const PrayerTimesDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAdhkaar, setShowAdhkaar] = useState(false);
  const [currentAdhkaar, setCurrentAdhkaar] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const getTodayKey = () => new Date().toISOString().split('T')[0];
  const todayTimes = PRAYER_TIMETABLE[getTodayKey()] || PRAYER_TIMETABLE['2026-04-29'];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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
        
        if (timeSincePrayer >= 0 && timeSincePrayer <= 10) {
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
      }, 20000);
      return () => clearInterval(adhkaarTimer);
    }
  }, [showAdhkaar]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return { display: `${displayHours}:${minutes.toString().padStart(2, '0')}`, period };
  };

  const formatLEDTime = (time) => {
    const { display } = formatTime(time);
    return display;
  };

  if (!isAdmin) {
    if (showAdhkaar) {
      const adhkaar = ADHKAAR[currentAdhkaar];
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#1e3a5f] via-[#2c5282] to-[#1e3a5f] text-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <img src="/logo.png" alt="ICC Wembley" className="w-72 h-72 mx-auto mb-6 drop-shadow-2xl" />
              <h1 className="text-5xl font-bold mb-2 text-[#E8A857]" style={{ fontFamily: 'Georgia, serif' }}>
                Islamic Cultural Centre Wembley
              </h1>
            </div>

            <div className="bg-gradient-to-br from-[#E07060] to-[#D86A5A] rounded-3xl p-12 shadow-2xl border-4 border-[#89C5D4]">
              <div className="text-center mb-8">
                <div className="bg-[#89C5D4] text-[#1e3a5f] px-8 py-4 rounded-full text-2xl font-bold mb-6 inline-block shadow-lg">
                  {adhkaar.titleEn}
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-6xl mb-8 leading-relaxed text-white" style={{ fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
                    {adhkaar.arabic}
                  </div>
                </div>
                
                <div className="text-center border-t-4 border-white/30 pt-8">
                  <p className="text-3xl leading-relaxed text-white" style={{ fontFamily: 'Georgia, serif' }}>
                    {adhkaar.translation}
                  </p>
                  <p className="text-2xl mt-6 text-[#E8A857] font-bold">
                    — {adhkaar.reference}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentTimeFormatted = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const currentDateEn = currentTime.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    const hijriDate = getHijriDate();

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#1a2332] to-[#0f1419] p-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Logo - Big at Top */}
          <div className="text-center mb-6">
            <img 
              src="/logo.png" 
              alt="ICC Wembley" 
              className="w-64 h-64 mx-auto mb-4 drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Top Header with Modern Colors */}
          <div className="bg-gradient-to-r from-[#E07060] via-[#D86A5A] to-[#E07060] rounded-3xl p-6 mb-4 shadow-2xl">
            <div className="flex justify-between items-center text-white">
              <div className="text-xl font-bold bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-sm">
                {hijriDate}
              </div>
              
              <div className="text-center">
                <div className="bg-[#1e3a5f] text-white rounded-2xl px-8 py-4 shadow-2xl border-2 border-[#89C5D4]">
                  <div className="text-7xl font-bold tracking-wider" style={{ fontFamily: 'Courier New, monospace' }}>
                    {currentTimeFormatted}
                  </div>
                  <div className="text-sm mt-1 text-[#89C5D4]">{currentTime.getHours() >= 12 ? 'PM' : 'AM'}</div>
                </div>
              </div>
              
              <div className="text-xl font-bold bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-sm">
                {currentDateEn}
              </div>
            </div>
          </div>

          {/* Quranic Header - Modern Style */}
          <div className="bg-gradient-to-r from-[#89C5D4] to-[#A8D5E2] py-5 rounded-2xl mb-4 shadow-xl">
            <div className="text-center">
              <p className="text-[#1e3a5f] text-3xl font-bold mb-2">ESTABLISH THE PRAYER</p>
              <p className="text-[#2c5282] text-2xl font-semibold" style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
                إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ
              </p>
            </div>
          </div>

          {/* Prayer Times Table Header */}
          <div className="bg-gradient-to-r from-[#E07060] to-[#D86A5A] py-5 text-white rounded-t-2xl shadow-xl">
            <div className="grid grid-cols-3 gap-4 px-8 text-center">
              <div className="text-3xl font-bold">SALAH</div>
              <div className="text-3xl font-bold">ADHAN</div>
              <div className="text-3xl font-bold">JAMAAT</div>
            </div>
          </div>

          {/* Prayer Times - Modern Clean Design */}
          <div className="bg-gradient-to-b from-[#1a2332] to-[#243447]">
            {[
              { nameEn: 'FAJR', nameAr: 'فجر', adhan: todayTimes.fajrAdhan, jamaat: todayTimes.fajr },
              { nameEn: 'DHUHR', nameAr: 'ظهر', adhan: todayTimes.dhuhrAdhan, jamaat: todayTimes.dhuhr },
              { nameEn: 'ASR', nameAr: 'عصر', adhan: todayTimes.asrAdhan, jamaat: todayTimes.asr },
              { nameEn: 'MAGHRIB', nameAr: 'مغرب', adhan: todayTimes.maghribAdhan, jamaat: todayTimes.maghrib },
              { nameEn: 'ISHA', nameAr: 'عشاء', adhan: todayTimes.ishaAdhan, jamaat: todayTimes.isha },
              ...(todayTimes.jummah ? [{ nameEn: 'JUMMAH', nameAr: 'جمعه', adhan: '1:04', jamaat: todayTimes.jummah }] : [])
            ].map((prayer, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 border-b-2 border-[#89C5D4]/20 py-3">
                {/* Prayer Name - Modern Turquoise */}
                <div className="bg-gradient-to-br from-[#89C5D4] to-[#A8D5E2] rounded-xl mx-2 px-4 py-6 flex flex-col justify-center items-center shadow-xl border-2 border-[#E8A857]">
                  <div className="text-[#1e3a5f] text-3xl font-bold mb-1" style={{ direction: 'rtl' }}>
                    {prayer.nameAr}
                  </div>
                  <div className="text-[#2c5282] text-3xl font-bold">
                    {prayer.nameEn}
                  </div>
                </div>

                {/* Adhan Time - Bright Cyan LED */}
                <div className="bg-[#0a0e14] rounded-xl mx-2 flex items-center justify-center shadow-2xl border-2 border-[#00d9ff]/30">
                  <div className="text-[#00d9ff] text-6xl font-bold tracking-wider" style={{ 
                    fontFamily: 'Courier New, monospace',
                    textShadow: '0 0 20px rgba(0,217,255,0.8), 0 0 40px rgba(0,217,255,0.4)'
                  }}>
                    {formatLEDTime(prayer.adhan)}
                  </div>
                </div>

                {/* Jamaat Time - Coral/Salmon */}
                <div className="bg-gradient-to-br from-[#E07060] to-[#D86A5A] rounded-xl mx-2 flex items-center justify-center shadow-2xl border-2 border-[#E8A857]">
                  <div className="text-white text-6xl font-bold tracking-wider" style={{ 
                    fontFamily: 'Courier New, monospace',
                    textShadow: '0 0 15px rgba(255,255,255,0.5)'
                  }}>
                    {formatLEDTime(prayer.jamaat)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sunrise & Sunset Section - Modern */}
          <div className="bg-gradient-to-r from-[#E8A857] via-[#D99A4A] to-[#E8A857] rounded-b-2xl py-6 px-8 shadow-2xl">
            <div className="grid grid-cols-2 gap-8">
              {/* Sunrise */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-white/30">
                <div className="text-[#1e3a5f] text-2xl font-bold mb-2">🌅 SUNRISE</div>
                <div className="text-[#1e3a5f] text-5xl font-bold" style={{ fontFamily: 'Courier New, monospace' }}>
                  {formatLEDTime(todayTimes.sunrise)}
                </div>
              </div>

              {/* Sunset */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-white/30">
                <div className="text-[#1e3a5f] text-2xl font-bold mb-2">🌇 SUNSET</div>
                <div className="text-[#1e3a5f] text-5xl font-bold" style={{ fontFamily: 'Courier New, monospace' }}>
                  {formatLEDTime(todayTimes.sunset)}
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
          <p className="text-gray-400">Admin panel coming soon with full management features.</p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesDisplay;
