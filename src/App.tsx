/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Sparkles, Music, Volume2, VolumeX, Gift, Star, Calendar, 
  Flame, Award, BookOpen, Send, CheckCircle2, XCircle, Smile, PartyPopper, ChevronDown, RotateCcw 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation & States
  const [entered, setEntered] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showCakePopup, setShowCakePopup] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  
  // Easter egg janna click count
  const [jannaClickCount, setJannaClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Quiz State (Customized for You & Janna)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Countdown State for 28th December
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Refs for audio
  const heerAudioRef = useRef<HTMLAudioElement | null>(null);

  // Cursor Trail Hearts
  const [cursorHearts, setCursorHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() < 0.25) {
        const newHeart = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
        setCursorHearts((prev) => [...prev.slice(-15), newHeart]);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Countdown timer for 28th December next occurrence
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let year = now.getFullYear();
      let targetDate = new Date(year, 11, 28); // December is 11
      if (now > targetDate) {
        targetDate = new Date(year + 1, 11, 28);
      }
      const difference = targetDate.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleJannaClick = () => {
    setJannaClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setShowEasterEgg(true);
        return 0;
      }
      return next;
    });
  };

  // Trigger grand entry and start Heer music
  const handleEnter = () => {
    setEntered(true);
    try {
      if (heerAudioRef.current) {
        heerAudioRef.current.volume = 0.5;
        heerAudioRef.current.play().then(() => {
          setMusicPlaying(true);
        }).catch(() => {});
      }
    } catch (e) {}

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#B76E79', '#D4AF37', '#ff1493', '#ff69b4', '#fff8f0']
    });
  };

  const toggleMusic = () => {
    if (heerAudioRef.current) {
      if (musicPlaying) {
        heerAudioRef.current.pause();
        setMusicPlaying(false);
      } else {
        heerAudioRef.current.volume = 0.5;
        heerAudioRef.current.play().then(() => {
          setMusicPlaying(true);
        }).catch(() => {});
      }
    }
  };

  const handleBlowCandles = () => {
    setCandlesBlown(true);
    setShowCakePopup(true);

    confetti({
      particleCount: 250,
      spread: 140,
      origin: { y: 0.4 },
      colors: ['#D4AF37', '#B76E79', '#FFF8F0', '#ff1493']
    });
  };

  // Customized Quiz Questions about You & Janna
  const quizQuestions = [
    {
      question: "Mera (Tumhare hone wale shohar ka) birthday kab hota hai?",
      options: ["14 August", "23 March", "25 December", "1 January"],
      correct: 0
    },
    {
      question: "Main is duniya mein sabse zyada kis se mohabbat karta hoon?",
      options: ["Apne aap se", "Janna (Dua) se", "Doston se", "Kaam se"],
      correct: 1
    },
    {
      question: "Janna ki kaunsi cheez mujhe sabse zyada pagal karti hai?",
      options: ["Uski pyari muskurahat", "Uski cute baatein", "Uski saadgi aur pyar", "Yeh sabhi"],
      correct: 3
    },
    {
      question: "Humari aane wali zindagi ka sabse bada khwab kya hai?",
      options: ["Ek apna ghar aur sath mein puri zindagi", "Badi gaari", "Duniya ghoomna", "Business"],
      correct: 0
    },
    {
      question: "Mujhe sabse zyada sukoon kab milta hai?",
      options: ["Jab Janna muskuraati hai aur baat karti hai", "Jab main sota hoon", "Jab khana khata hoon", "Jab game khelta hoon"],
      correct: 0
    }
  ];

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(newAnswers);
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      let sc = 0;
      newAnswers.forEach((ans, idx) => {
        if (ans === quizQuestions[idx].correct) sc++;
      });
      setScore(sc);
      setQuizSubmitted(true);
      confetti({ particleCount: 180, spread: 120 });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizSubmitted(false);
    setScore(0);
  };

  const promises = [
    { id: 1, icon: "🌙", title: "Wada 1", text: "Main har raat tumhari aakhri baat aur har subah tumhari pehli baat banunga" },
    { id: 2, icon: "🛡️", title: "Wada 2", text: "Tumhari har takleef ko apna samjhunga aur tumhe kabhi akela nahi chhodunga" },
    { id: 3, icon: "😂", title: "Wada 3", text: "Tumhe hamesha hasaunga — chahe duniya kitni bhi serious ho jaye" },
    { id: 4, icon: "🤝", title: "Wada 4", text: "Tumhari family ko apni family samjhunga aur unki izzat karunga" },
    { id: 5, icon: "🌹", title: "Wada 5", text: "Har saal tumhara birthday aur bhi special banaunga — yeh pehla hai, aakhri nahi" },
    { id: 6, icon: "🕌", title: "Wada 6", text: "Tumhe deen aur dunya dono ki khushiyan dunga, In Sha Allah" },
    { id: 7, icon: "💍", title: "Wada 7", text: "Jis din tum meri biwi banogi, us din se meri har dua mein tumhara naam hoga" },
  ];

  const timelineMilestones = [
    { date: "The Beginning", title: "Jab Nazar Mili", desc: "Woh pal jab pehli baar tumse baat hui aur pata chal gaya ke meri zindagi badalne wali hai." },
    { date: "The Proposal", title: "Tum Meri Ho Gayi", desc: "Sabse khoobsurat din jab tumne meri zindagi mein aane ka faisla kiya aur meri honay wali biwi bani." },
    { date: "Everyday Love", title: "Haseen Lamhe", desc: "Raat bhar ki baatein, tumhari cute baatein, aur har khushi mein tumhara saath." },
    { date: "Forever", title: "Aane Wala Kal", desc: "Woh din jab hum hamesha ke liye ek ho jayenge, In Sha Allah. Meri Janna, hamesha ke liye." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1b1b3a] via-[#2a1b32] to-[#120c18] text-[#fff8f0] relative selection:bg-[#b76e79] selection:text-white font-poppins">
      
      {/* Online Audio Asset - Heer Song */}
      <audio 
        ref={heerAudioRef} 
        src="/assets/aistudio/Heer_Haider_Ali_320_Kbps_04a59e9d.mp3" 
        loop 
      />

      {/* Falling Rose Petals & Glowing Hearts Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-400 opacity-50 animate-[fall_7s_linear_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animationDuration: `${5 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${1 + Math.random() * 1.8}rem`
            }}
          >
            {i % 3 === 0 ? '🌹' : i % 3 === 1 ? '💖' : '✨'}
          </div>
        ))}
      </div>

      {/* Cursor Trail Hearts */}
      {cursorHearts.map((h) => (
        <div
          key={h.id}
          className="fixed pointer-events-none text-rose-400 text-sm animate-ping z-50"
          style={{ left: h.x - 8, top: h.y - 8 }}
        >
          ❤️
        </div>
      ))}

      {/* Floating Music Toggle Button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#b76e79] to-[#d4af37] hover:scale-110 text-white p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 border-2 border-[#fff8f0]/50 animate-bounce"
        title="Play / Pause Romantic Song"
      >
        {musicPlaying ? <Volume2 className="w-6 h-6 animate-pulse" /> : <VolumeX className="w-6 h-6" />}
        <span className="text-xs font-semibold hidden md:inline">
          {musicPlaying ? "Heer (Playing 🎶)" : "Play Music 🎵"}
        </span>
      </button>

      {/* EASTER EGG MODAL */}
      {showEasterEgg && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 rounded-3xl max-w-md text-center border-2 border-[#d4af37] shadow-2xl animate-float bg-[#1b1b3a]/95">
            <div className="text-5xl mb-4">👑💖</div>
            <h3 className="font-great-vibes text-4xl text-[#d4af37] mb-3">Secret Surprise!</h3>
            <p className="text-lg text-[#fff8f0] mb-6">
              "Tumhe pata hai tum kitni khoobsurat ho? Bohot zyada! Aur main tumse is duniya mein sabse zyada pyar karta hoon, <span onClick={handleJannaClick} className="cursor-pointer text-[#d4af37] font-bold">Janna</span>. 😍💍"
            </p>
            <button
              onClick={() => setShowEasterEgg(false)}
              className="bg-gradient-to-r from-[#b76e79] to-[#d4af37] text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition-all"
            >
              Band Karo (I Love You!)
            </button>
          </div>
        </div>
      )}

      {/* SECTION 0: SPLASH SCREEN (Grand Romantic Entry) */}
      {!entered && (
        <div className="fixed inset-0 z-50 bg-[#120c18] flex flex-col items-center justify-center p-6 text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3a1b2d] via-[#1b1b3a] to-[#0a0510]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop')] opacity-15 bg-cover bg-center"></div>
          
          <div className="relative z-10 max-w-xl mx-auto glass-card p-10 rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.3)] border-2 border-[#d4af37]/60 animate-float bg-[#1b1b3a]/90 backdrop-blur-xl">
            <div className="text-6xl mb-6 animate-pulse">🌹💖</div>
            <h1 className="font-great-vibes text-5xl md:text-7xl text-[#d4af37] mb-4 drop-shadow-lg">
              <span onClick={handleJannaClick} className="cursor-pointer">Janna</span>... Ek Behad Khaas Lamha Tumhare Liye 💝
            </h1>
            <p className="text-rose-200 mb-8 text-base md:text-lg font-light">
              Meri jaan, meri Dua — yeh birthday website sirf aur sirf tumhare liye hai.
            </p>
            <button
              onClick={handleEnter}
              className="relative group overflow-hidden rounded-full bg-gradient-to-r from-[#b76e79] via-[#d4af37] to-[#b76e79] p-px font-semibold shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#1b1b3a] transition-all duration-300 group-hover:bg-opacity-0">
                <Sparkles className="w-5 h-5 text-[#d4af37] group-hover:text-white" />
                <span className="text-lg md:text-xl font-medium tracking-wide text-white font-poppins">
                  ✨ Apna Romantic Surprise Dekho ✨
                </span>
                <Heart className="w-5 h-5 text-rose-400 group-hover:text-white animate-pulse" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN WEBSITE CONTENT */}
      {entered && (
        <div className="relative z-10 animate-[fadeIn_1s_ease-in-out]">
          
          {/* Sticky Navigation Bar */}
          <nav className="fixed top-0 left-0 right-0 z-40 glass-nav px-6 py-4 flex items-center justify-between shadow-xl border-b border-[#d4af37]/30 bg-[#1b1b3a]/90 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌹</span>
              <span className="font-great-vibes text-3xl text-[#d4af37] font-bold tracking-wide">
                Dua & Janna
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#fff8f0]">
              <a href="#hero" className="hover:text-[#d4af37] transition-colors">Home</a>
              <a href="#letter" className="hover:text-[#d4af37] transition-colors">Love Letter</a>
              <a href="#promises" className="hover:text-[#d4af37] transition-colors">Promises</a>
              <a href="#quiz" className="hover:text-[#d4af37] transition-colors">Quiz</a>
              <a href="#gift" className="hover:text-[#d4af37] transition-colors">Gift 🎁</a>
              <a href="#timeline" className="hover:text-[#d4af37] transition-colors">Timeline</a>
              <a href="#stars" className="hover:text-[#d4af37] transition-colors">Star ✨</a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-[#b76e79]/40 text-[#d4af37] px-3 py-1.5 rounded-full border border-[#d4af37]/40 shadow-inner">
                28 Dec 🎉
              </span>
            </div>
          </nav>

          {/* SECTION 1: HERO / BIRTHDAY GREETING & CAKE */}
          <section id="hero" className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4a1b32] via-[#1b1b3a] to-[#0f0f1a]">
            
            <div className="max-w-3xl mx-auto z-10">
              <div className="inline-block mb-4 px-5 py-2 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-sm tracking-widest uppercase font-semibold shadow-lg">
                Happy Birthday My Queen, My Soulmate
              </div>
              <h1 className="font-great-vibes text-6xl md:text-8xl text-[#d4af37] mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                Happy Birthday, Meri <span onClick={handleJannaClick} className="cursor-pointer underline decoration-[#b76e79]">Janna</span>! 🎂
              </h1>
              <p className="text-xl md:text-2xl text-rose-200 font-light mb-8 font-poppins">
                28 December — Woh Haseen Din Jab Meri Duniya Mein Roshni Aayi
              </p>

              {/* Animated CSS Birthday Cake */}
              <div className="relative w-64 h-72 mx-auto my-8 flex flex-col items-center justify-end">
                <div className="absolute top-4 flex justify-center gap-4 z-20">
                  <div className="relative flex flex-col items-center">
                    {!candlesBlown && (
                      <div className="w-4 h-8 bg-gradient-to-t from-yellow-400 to-orange-500 rounded-full animate-flicker -top-8 absolute shadow-[0_0_20px_#ffdf00]"></div>
                    )}
                    <div className="w-2 h-10 bg-white/90 rounded-sm"></div>
                  </div>
                  <div className="relative flex flex-col items-center">
                    {!candlesBlown && (
                      <div className="w-4 h-8 bg-gradient-to-t from-yellow-400 to-orange-500 rounded-full animate-flicker -top-8 absolute shadow-[0_0_20px_#ffdf00]" style={{ animationDelay: '0.3s' }}></div>
                    )}
                    <div className="w-2 h-10 bg-white/90 rounded-sm"></div>
                  </div>
                  <div className="relative flex flex-col items-center">
                    {!candlesBlown && (
                      <div className="w-4 h-8 bg-gradient-to-t from-yellow-400 to-orange-500 rounded-full animate-flicker -top-8 absolute shadow-[0_0_20px_#ffdf00]" style={{ animationDelay: '0.6s' }}></div>
                    )}
                    <div className="w-2 h-10 bg-white/90 rounded-sm"></div>
                  </div>
                </div>

                <div className="w-36 h-16 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300 rounded-t-2xl shadow-md relative z-10 border-t-2 border-white/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#1b1b3a]">DUA 💖</span>
                </div>
                <div className="w-36 h-4 bg-white rounded-b-xl shadow-sm z-10 flex justify-around">
                  <div className="w-3 h-5 bg-white rounded-b-full"></div>
                  <div className="w-4 h-6 bg-white rounded-b-full"></div>
                  <div className="w-3 h-5 bg-white rounded-b-full"></div>
                </div>

                <div className="w-48 h-20 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 rounded-t-xl shadow-lg relative z-0 border-t-2 border-white/40">
                  <div className="absolute inset-x-0 top-0 h-3 bg-white/90 rounded-t-xl flex justify-around">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="w-64 h-24 bg-gradient-to-r from-[#9b4d59] via-[#b76e79] to-[#9b4d59] rounded-t-2xl shadow-2xl relative border-t-2 border-[#d4af37]/70 flex items-center justify-center">
                  <span className="text-[#fff8f0] font-great-vibes text-2xl tracking-widest drop-shadow">Happy Birthday Janna</span>
                </div>
              </div>

              {!candlesBlown ? (
                <button
                  onClick={handleBlowCandles}
                  className="mt-6 bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-amber-500 hover:to-[#d4af37] text-[#1b1b3a] font-bold px-8 py-4 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto text-lg"
                >
                  <Flame className="w-6 h-6 animate-bounce text-red-700" />
                  🌬️ Phoonk Maaro Candles Bujhao!
                </button>
              ) : (
                <div className="mt-6 inline-block bg-emerald-500/20 border border-emerald-400 text-emerald-300 px-6 py-3 rounded-full font-semibold animate-pulse shadow-lg">
                  ✨ Candles Bujh Gayi! Mubarak Ho Janna! 🎉
                </div>
              )}

            </div>

            {showCakePopup && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="glass-card p-8 rounded-3xl max-w-lg text-center border-2 border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.4)] animate-float bg-[#1b1b3a]/95">
                  <div className="text-6xl mb-4">🤲💕</div>
                  <h3 className="font-great-vibes text-4xl text-[#d4af37] mb-3">Mubarak Ho Janna!</h3>
                  <p className="text-lg text-[#fff8f0] mb-6 leading-relaxed">
                    Tumhari har dua qabool ho! Allah tumhe hamesha mere paas, salamat aur khush rakhe. Main tumse bepanah mohabbat karta hoon. ❤️
                  </p>
                  <button
                    onClick={() => setShowCakePopup(false)}
                    className="bg-gradient-to-r from-[#b76e79] to-[#d4af37] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-all"
                  >
                    Aage Chalo ✨
                  </button>
                </div>
              </div>
            )}

            <div className="absolute bottom-6 animate-bounce">
              <a href="#letter" className="text-[#d4af37] flex flex-col items-center text-sm">
                <span>Neeche Padho</span>
                <ChevronDown className="w-5 h-5" />
              </a>
            </div>
          </section>

          {/* SECTION 2: LOVE LETTER 💌 */}
          <section id="letter" className="py-24 px-4 relative max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block p-3 rounded-full bg-[#b76e79]/30 text-[#d4af37] mb-3 shadow-md">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="font-great-vibes text-5xl md:text-6xl text-[#d4af37]">
                Mere Dil Ki Baat
              </h2>
              <p className="text-rose-200 mt-2">Sirf tumhare liye, meri pyari Dua.</p>
            </div>

            <div className="relative glass-card p-8 md:p-14 rounded-3xl border-2 border-[#d4af37]/50 shadow-[0_0_60px_rgba(212,175,55,0.2)] animate-heartbeat bg-gradient-to-b from-[#252545]/95 to-[#1b1b3a]/95">
              <div className="absolute -top-6 right-8 w-14 h-14 bg-gradient-to-br from-red-700 to-rose-900 rounded-full flex items-center justify-center shadow-2xl border-2 border-[#d4af37] transform rotate-12">
                <span className="font-great-vibes text-xl text-[#d4af37] font-bold">D & M</span>
              </div>

              <div className="space-y-6 text-[#fff8f0] text-lg md:text-xl font-light leading-relaxed font-poppins">
                <p className="font-great-vibes text-4xl text-[#d4af37] mb-6">
                  Meri Pyaari Janna, Dua,
                </p>
                <p>
                  Aaj 28 December hai, aur meri zindagi ka sabse khoobsurat din hai — kyunki aaj ke din tum is duniya mein aayi thi. Tumhare bina meri zindagi adhoori thi, jaise aasman ke bina chand, jaise phoolon ke bina khushboo.
                </p>
                <p>
                  Janna, jab se tum meri zindagi mein aayi ho, har subah ek nayi umeed lekar aati hai. Tumhari muskurahat mere liye duniya ki sabse qeemti cheez hai. Main is duniya mein sabse zyada sirf tumse pyar karta hoon.
                </p>
                <p>
                  Tum meri dua ho — woh dua jo maine har raat Allah se maangi. Aur aaj main shukar karta hoon ke usne meri sun li aur tumhe mera humsafar banaya.
                </p>
                <p>
                  Happy Birthday, meri jaan. Tum hamesha khush raho, hamesha muskurao, aur yaad rakhna — main hamesha tumhare saath hoon, har qadam par, har mushkil mein, har khushi mein.
                </p>
                <div className="pt-6 border-t border-[#d4af37]/40 flex justify-between items-center">
                  <div>
                    <p className="font-light text-rose-200">Tumse bepanah aur sacha pyar,</p>
                    <p className="font-great-vibes text-3xl text-[#d4af37] mt-1">Tumhara Apna Shohar ❤️</p>
                  </div>
                  <div className="text-3xl animate-bounce">💌</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: OUR PROMISES 🤞 */}
          <section id="promises" className="py-24 px-4 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Mere Pyare Vaade</span>
              <h2 className="font-great-vibes text-5xl md:text-6xl text-[#d4af37] mt-2">
                Meri Waadein, Meri Janna Ke Naam
              </h2>
              <p className="text-rose-200 mt-2">Har card ke peeche ek sacha vaada hai jo tumse kiya hai.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promises.map((p) => (
                <div 
                  key={p.id}
                  className="glass-card p-8 rounded-3xl border border-[#d4af37]/40 shadow-xl hover:border-[#d4af37] transition-all duration-500 transform hover:-translate-y-2 group flex flex-col justify-between bg-[#1b1b3a]/80"
                >
                  <div>
                    <div className="text-4xl mb-4 p-3 bg-[#b76e79]/25 w-fit rounded-2xl group-hover:scale-110 transition-transform shadow">
                      {p.icon}
                    </div>
                    <h3 className="font-great-vibes text-3xl text-[#d4af37] mb-3">{p.title}</h3>
                    <p className="text-[#fff8f0] text-base font-light leading-relaxed">
                      "{p.text}"
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-rose-300">
                    <span>Vaada Pakka 🤝</span>
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: LOVE QUIZ 💕 (Customized for You & Janna) */}
          <section id="quiz" className="py-24 px-4 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Special Love Test</span>
              <h2 className="font-great-vibes text-5xl md:text-6xl text-[#d4af37] mt-2">
                Kitna Jaanti Ho Apne Hone Wale Shohar Ko? 😏
              </h2>
              <p className="text-rose-200 mt-2">Dekhte hain tumhe mere baare mein kitna pata hai!</p>
            </div>

            <div className="glass-card p-8 md:p-10 rounded-3xl border-2 border-[#d4af37]/50 shadow-[0_0_40px_rgba(212,175,55,0.2)] bg-[#1b1b3a]/90">
              {!quizSubmitted ? (
                <div>
                  <div className="flex justify-between items-center mb-6 text-sm text-[#d4af37] font-semibold">
                    <span>Sawaal {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span>{Math.round(((currentQuestion) / quizQuestions.length) * 100)}% Completed</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-semibold mb-8 text-[#fff8f0]">
                    {quizQuestions[currentQuestion].question}
                  </h3>

                  <div className="space-y-4">
                    {quizQuestions[currentQuestion].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37] hover:bg-[#b76e79]/30 transition-all text-base md:text-lg flex items-center justify-between group shadow"
                      >
                        <span>{opt}</span>
                        <span className="text-xs text-rose-300 group-hover:translate-x-1 transition-transform font-bold">Select ➔</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏆💖</div>
                  <h3 className="font-great-vibes text-4xl text-[#d4af37] mb-2">Quiz Complete!</h3>
                  <p className="text-2xl font-bold mb-4 text-rose-300">
                    Aapka Score: {score} / {quizQuestions.length}
                  </p>
                  <p className="text-lg text-[#fff8f0] mb-8 leading-relaxed">
                    {score === 5 && "PERFECT! Tum mujhe mujhse zyada jaanti ho! Tum meri soulmate ho Janna! 💖"}
                    {score >= 3 && score < 5 && "Bohot achi ho Janna, thoda sa aur dhyaan rakha karo mere baare mein! 😘"}
                    {score < 3 && "Arre Janna! Apne hone wale shohar ke baare mein itna nahi pata? Chalo ab sab yaad rakhna! 😂❤️"}
                  </p>
                  <button
                    onClick={resetQuiz}
                    className="bg-gradient-to-r from-[#b76e79] to-[#d4af37] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" /> Phir Se Khelo
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 5: BIRTHDAY GIFT REVEAL 🎁 */}
          <section id="gift" className="py-24 px-4 max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Special Surprise</span>
              <h2 className="font-great-vibes text-5xl md:text-6xl text-[#d4af37] mt-2">
                Tumhara Birthday Gift, Janna!
              </h2>
              <p className="text-rose-200 mt-2">Dekho isme kya hai tumhare liye...</p>
            </div>

            <div className="glass-card p-10 rounded-3xl border-2 border-[#d4af37]/60 shadow-[0_0_50px_rgba(212,175,55,0.3)] relative overflow-hidden bg-[#1b1b3a]/90">
              {!giftOpened ? (
                <div className="py-12 flex flex-col items-center">
                  <div className="text-8xl mb-6 animate-bounce">🎁</div>
                  <h3 className="text-2xl font-semibold mb-6 text-[#fff8f0]">Ek pyaara sa gift sirf meri Janna ke liye!</h3>
                  <button
                    onClick={() => {
                      setGiftOpened(true);
                      confetti({ particleCount: 220, spread: 160, origin: { y: 0.5 } });
                    }}
                    className="bg-gradient-to-r from-[#d4af37] via-amber-500 to-[#b76e79] text-white px-10 py-4 rounded-full font-bold text-xl shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 transition-all flex items-center gap-3"
                  >
                    <Gift className="w-6 h-6 animate-spin" /> 🎀 Gift Kholo!
                  </button>
                </div>
              ) : (
                <div className="py-8 animate-[fadeIn_1s_ease-in-out]">
                  <div className="text-6xl mb-4">✨💖💍</div>
                  <h3 className="font-great-vibes text-4xl text-[#d4af37] mb-4">Meri Pyaari Dua,</h3>
                  <div className="bg-black/40 p-8 rounded-2xl border border-[#d4af37]/40 text-left space-y-4 text-lg font-light leading-relaxed shadow-inner">
                    <p>
                      Asli gift toh main khud hoon — tumhara hone wala shohar! 😜💍 Aur mera birthday 14 August ko hota hai, yeh toh tumhe ab yaad hi hoga!
                    </p>
                    <p>
                      Lekin seriously, jo bhi tumhari dil ki khwahish hai, woh meri zimmadaari hai. Tum bas bolo, main poori kar dunga. In Sha Allah! 🤲
                    </p>
                    <p>
                      Yeh website meri taraf se ek chhoti si koshish hai tumhe special feel karwane ki. Tum meri poori duniya ho, Dua. Happy Birthday! 🎂❤️
                    </p>
                  </div>
                  <button
                    onClick={() => setGiftOpened(false)}
                    className="mt-8 text-sm text-[#d4af37] hover:underline font-semibold"
                  >
                    Gift Dobara Band Karo 🔄
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 6: TIMELINE OF US */}
          <section id="timeline" className="py-24 px-4 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Our Love Story</span>
              <h2 className="font-great-vibes text-5xl md:text-6xl text-[#d4af37] mt-2">
                Timeline Of Us ⏳
              </h2>
              <p className="text-rose-200 mt-2">Hamare safar ke sabse haseen padaav.</p>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-1 before:bg-[#d4af37]/40">
              {timelineMilestones.map((m, idx) => (
                <div key={idx} className={`flex flex-col md:flex-row items-center justify-between gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="glass-card p-6 rounded-2xl w-full md:w-[45%] border border-[#d4af37]/40 shadow-xl bg-[#1b1b3a]/90">
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">{m.date}</span>
                    <h3 className="font-great-vibes text-3xl text-rose-300 mt-1 mb-2">{m.title}</h3>
                    <p className="text-sm font-light text-slate-200">{m.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#d4af37] text-[#1b1b3a] flex items-center justify-center font-bold z-10 shadow-lg animate-pulse">
                    ❤️
                  </div>
                  <div className="w-full md:w-[45%] hidden md:block"></div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 7: STAR NAMING */}
          <section id="stars" className="py-24 px-4 max-w-4xl mx-auto text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-[#1b1b3a] to-black opacity-90 z-0"></div>
            
            <div className="relative z-10 glass-card p-10 rounded-3xl border-2 border-[#d4af37]/50 shadow-[0_0_50px_rgba(212,175,55,0.3)] bg-[#1b1b3a]/90">
              <div className="text-5xl mb-4 animate-pulse">✨</div>
              <h2 className="font-great-vibes text-5xl md:text-6xl text-[#d4af37] mb-4">
                Aasman Ka Ek Sitaara — Dua ✨
              </h2>
              <p className="text-lg md:text-xl font-light text-[#fff8f0] leading-relaxed max-w-2xl mx-auto mb-6">
                "Maine aasman ke is sabse roshan sitaare ka naam <span className="text-[#d4af37] font-bold">Dua</span> rakh diya hai — kyunki tum meri zindagi ki roshni ho."
              </p>
              <div className="inline-block px-6 py-2 rounded-full bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/50 text-sm font-semibold shadow">
                Star Coordinates: Janna's Heart (Forever) 🌌
              </div>
            </div>
          </section>

          {/* SECTION 8: COUNTDOWN / FOOTER */}
          <footer className="py-20 px-4 text-center border-t border-[#d4af37]/30 bg-[#120c18] relative">
            <div className="max-w-3xl mx-auto space-y-8">
              
              <div>
                <h3 className="font-great-vibes text-4xl text-[#d4af37] mb-3">Agla Birthday Tak Ka Intezaar... ⏳</h3>
                <div className="flex justify-center gap-4 my-6">
                  <div className="glass-card px-4 py-3 rounded-2xl min-w-[70px] bg-[#1b1b3a]/90 border border-[#d4af37]/30">
                    <div className="text-2xl font-bold text-[#d4af37]">{timeLeft.days}</div>
                    <div className="text-xs text-rose-200">Days</div>
                  </div>
                  <div className="glass-card px-4 py-3 rounded-2xl min-w-[70px] bg-[#1b1b3a]/90 border border-[#d4af37]/30">
                    <div className="text-2xl font-bold text-[#d4af37]">{timeLeft.hours}</div>
                    <div className="text-xs text-rose-200">Hours</div>
                  </div>
                  <div className="glass-card px-4 py-3 rounded-2xl min-w-[70px] bg-[#1b1b3a]/90 border border-[#d4af37]/30">
                    <div className="text-2xl font-bold text-[#d4af37]">{timeLeft.minutes}</div>
                    <div className="text-xs text-rose-200">Mins</div>
                  </div>
                  <div className="glass-card px-4 py-3 rounded-2xl min-w-[70px] bg-[#1b1b3a]/90 border border-[#d4af37]/30">
                    <div className="text-2xl font-bold text-[#d4af37]">{timeLeft.seconds}</div>
                    <div className="text-xs text-rose-200">Secs</div>
                  </div>
                </div>
              </div>

              <p className="text-lg font-light text-rose-200 italic">
                "Janna, yeh sirf ek website nahi hai — yeh mera dil hai jo screen pe dhadak raha hai. Main tumse bepanah mohabbat karta hoon. 💕"
              </p>

              <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
                <p>Made with ❤️ by your future husband (Birthday: 14 August) for Dua (Meri Janna)</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied! Share this special moment with Janna! 💖");
                  }}
                  className="bg-gradient-to-r from-[#b76e79] to-[#d4af37] text-white px-6 py-2 rounded-full text-xs font-semibold hover:scale-105 transition-all shadow-lg"
                >
                  🔗 Share This Website
                </button>
              </div>

            </div>
          </footer>

        </div>
      )}

    </div>
  );
}
