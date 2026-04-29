import React, { useState, useEffect } from 'react';

// Prayer times data from ICC Wembley April 2026 timetable
const PRAYER_TIMETABLE = {
  '2026-04-01': { fajr: '5:45', dhuhr: '1:30', asr: '6:15', maghrib: '7:37', isha: '9:00', fajrAdhan: '5:01', dhuhrAdhan: '1:10', asrAdhan: '5:31', maghribAdhan: '7:37', ishaAdhan: '8:52' },
  '2026-04-02': { fajr: '5:45', dhuhr: '1:30', asr: '6:15', maghrib: '7:39', isha: '9:00', fajrAdhan: '4:59', dhuhrAdhan: '1:10', asrAdhan: '5:32', maghribAdhan: '7:39', ishaAdhan: '8:54' },
  '2026-04-03': { fajr: '5:45', dhuhr: '1:30', asr: '6:30', maghrib: '7:41', isha: '9:15', fajrAdhan: '4:56', dhuhrAdhan: '1:10', asrAdhan: '5:33', maghribAdhan: '7:41', ishaAdhan: '8:55', jummah: '2:00' },
  '2026-04-26': { fajr: '5:00', dhuhr: '1:30', asr: '7:15', maghrib: '8:19', isha: '9:45', fajrAdhan: '4:00', dhuhrAdhan: '1:04', asrAdhan: '5:59', maghribAdhan: '8:19', ishaAdhan: '9:28' },
  '2026-04-27': { fajr: '5:00', dhuhr: '1:30', asr: '7:15', maghrib: '8:21', isha: '9:45', fajrAdhan: '3:58', dhuhrAdhan: '1:04', asrAdhan: '6:00', maghribAdhan: '8:21', ishaAdhan: '9:30' },
  '2026-04-30': { fajr: '5:00', dhuhr: '1:30', asr: '7:15', maghrib: '8:26', isha: '9:45', fajrAdhan: '3:51', dhuhrAdhan: '1:04', asrAdhan: '6:03', maghribAdhan: '8:26', ishaAdhan: '9:34' }
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

// Hijri date calculation (simplified)
const getHijriDate = () => {
  return "11 Dhul Qa'dah 1447";
};

const PrayerTimesDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAdhkaar, setShowAdhkaar] = useState(false);
  const [currentAdhkaar, setCurrentAdhkaar] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const getTodayKey = () => new Date().toISOString().split('T')[0];
  const todayTimes = PRAYER_TIMETABLE[getTodayKey()] || PRAYER_TIMETABLE['2026-04-27'];

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
        <div className="min-h-screen bg-gradient-to-b from-[#5C3333] via-[#4A2B2B] to-[#5C3333] text-white p-6">
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <div className="text-center mb-6">
              <img src="/logo.png" alt="ICC Wembley" className="w-64 h-64 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#E8A857' }}>
                Islamic Cultural Centre Wembley
              </h1>
            </div>

            {/* Adhkaar Display */}
            <div className="bg-gradient-to-r from-[#D86A5A] to-[#E07060] rounded-3xl p-12 shadow-2xl border-4 border-[#E8A857]">
              <div className="text-center mb-8">
                <div className="bg-[#A8D5E2] text-[#4A2B2B] px-8 py-4 rounded-full text-2xl font-bold mb-6 inline-block">
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
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] p-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Top Header with Islamic Pattern */}
          <div className="bg-gradient-to-r from-[#E8A857] via-[#D99A4A] to-[#E8A857] rounded-t-3xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
            }}></div>
            
            <div className="relative z-10 flex justify-between items-center text-[#4A2B2B]">
              <div className="text-xl font-bold">{hijriDate}</div>
              
              <div className="text-center">
                <div className="bg-[#4A2B2B] text-white rounded-2xl px-8 py-4 shadow-xl">
                  <div className="text-6xl font-bold tracking-wider" style={{ fontFamily: 'Courier New, monospace' }}>
                    {currentTimeFormatted}
                  </div>
                  <div className="text-sm mt-1">{currentTime.getHours() >= 12 ? 'PM' : 'AM'}</div>
                </div>
              </div>
              
              <div className="text-xl font-bold">{currentDateEn}</div>
            </div>
          </div>

          {/* Quranic Header */}
          <div className="bg-white py-4 border-b-4 border-[#D86A5A]">
            <div className="text-center">
              <p className="text-[#D86A5A] text-2xl font-bold mb-1">ESTABLISH THE PRAYER</p>
              <p className="text-[#4A2B2B] text-xl" style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
                إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ
              </p>
            </div>
          </div>

          {/* Prayer Times Table Header */}
          <div className="bg-gradient-to-r from-[#D86A5A] to-[#E07060] py-4 text-white">
            <div className="grid grid-cols-3 gap-4 px-8 text-center">
              <div className="text-3xl font-bold">SALAH</div>
              <div className="text-3xl font-bold">ADHAN</div>
              <div className="text-3xl font-bold">JAMAAT</div>
            </div>
          </div>

          {/* Prayer Times */}
          <div className="bg-[#E5E5E5]">
            {[
              { nameEn: 'FAJR', nameAr: 'فجر', adhan: todayTimes.fajrAdhan, jamaat: todayTimes.fajr },
              { nameEn: 'DHUHR', nameAr: 'ظهر', adhan: todayTimes.dhuhrAdhan, jamaat: todayTimes.dhuhr },
              { nameEn: 'ASR', nameAr: 'عصر', adhan: todayTimes.asrAdhan, jamaat: todayTimes.asr },
              { nameEn: 'MAGHRIB', nameAr: 'مغرب', adhan: todayTimes.maghribAdhan, jamaat: todayTimes.maghrib },
              { nameEn: 'ISHA', nameAr: 'عشاء', adhan: todayTimes.ishaAdhan, jamaat: todayTimes.isha },
              ...(todayTimes.jummah ? [{ nameEn: 'JUMMAH', nameAr: 'جمعه', adhan: '1:04', jamaat: todayTimes.jummah }] : [])
            ].map((prayer, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 border-b-2 border-white py-2">
                {/* Prayer Name */}
                <div className="bg-gradient-to-r from-[#E8A857] to-[#D99A4A] rounded-lg mx-2 px-4 py-6 flex flex-col justify-center items-center border-4 border-[#5C3333]">
                  <div className="text-[#4A2B2B] text-3xl font-bold mb-1" style={{ direction: 'rtl' }}>
                    {prayer.nameAr}
                  </div>
                  <div className="text-[#4A2B2B] text-3xl font-bold">
                    {prayer.nameEn}
                  </div>
                </div>

                {/* Adhan Time */}
                <div className="bg-[#1a1a1a] rounded-lg mx-2 flex items-center justify-center border-4 border-[#5C3333]">
                  <div className="text-[#00FF00] text-6xl font-bold tracking-wider" style={{ 
                    fontFamily: 'Courier New, monospace',
                    textShadow: '0 0 10px rgba(0,255,0,0.5)'
                  }}>
                    {formatLEDTime(prayer.adhan)}
                  </div>
                </div>

                {/* Jamaat Time */}
                <div className="bg-gradient-to-r from-[#D86A5A] to-[#E07060] rounded-lg mx-2 flex items-center justify-center border-4 border-[#5C3333]">
                  <div className="text-white text-6xl font-bold tracking-wider" style={{ 
                    fontFamily: 'Courier New, monospace',
                    textShadow: '0 0 10px rgba(255,255,255,0.3)'
                  }}>
                    {formatLEDTime(prayer.jamaat)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Info */}
          <div className="bg-[#4A2B2B] rounded-b-3xl py-4 px-6 text-center text-white">
            <p className="text-xl mb-2">Islamic Cultural Centre Wembley</p>
            <p className="text-lg text-[#E8A857]">72-74 Harrow Road, Wembley, HA9 6PL</p>
            <p className="text-lg mt-2">Tel: 0208 903 3760 • www.iccwembley.co.uk</p>
          </div>

        </div>
      </div>
    );
  }

  // Simple Admin Panel
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <button onClick={() => setIsAdmin(false)} className="bg-red-600 px-6 py-3 rounded">Exit</button>
        </div>
        <div className="bg-gray-800 rounded p-6">
          <h2 className="text-2xl mb-4">Update Prayer Times</h2>
          <p className="text-gray-400">Use this panel to adjust prayer times as needed.</p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesDisplay;
