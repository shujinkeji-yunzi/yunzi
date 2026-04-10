import React, { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { LivePlayer } from './components/LivePlayer';
import { ChatBox } from './components/ChatBox';
import { GiftPanel } from './components/GiftPanel';
import { FloatingHearts } from './components/FloatingHearts';
import { Users, Heart, Share2, MoreHorizontal, X, MessageCircle, Gift as GiftIcon, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [userName] = useState(`用户_${Math.floor(Math.random() * 1000)}`);
  const [activeGift, setActiveGift] = useState<{user: string, type: string} | null>(null);
  const [likeTrigger, setLikeTrigger] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [showGiftPanel, setShowGiftPanel] = useState(false);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('viewer_count', (count: number) => {
      setViewerCount(count);
    });

    newSocket.on('new_gift', (gift: any) => {
      setActiveGift({ user: gift.user, type: gift.giftType });
      setTimeout(() => setActiveGift(null), 3000);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleLike = useCallback(() => {
    setLikeTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* 模拟安卓手机容器 (在桌面端显示为手机比例) */}
      <div className="relative w-full h-full max-w-[450px] bg-[#050505] shadow-2xl overflow-hidden flex flex-col">
        
        {/* 顶部状态栏模拟 */}
        <div className="absolute top-0 left-0 right-0 h-8 z-50 flex items-center justify-between px-6 text-[10px] font-bold text-white/80 pointer-events-none">
          <span>12:00</span>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border border-white/40 rounded-sm"></div>
            <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 relative">
          <LivePlayer />
          
          {/* 顶部主播信息 */}
          <header className="absolute top-10 left-0 right-0 z-30 px-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg p-1 pr-3 rounded-full border border-white/10">
                <img 
                  src="https://picsum.photos/seed/streamer/100/100" 
                  className="w-8 h-8 rounded-full border border-pink-500"
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold leading-none">星耀女神 ✨</span>
                  <span className="text-[9px] text-white/60">12.5w 粉丝</span>
                </div>
                <button className="ml-2 bg-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  关注
                </button>
              </div>
              
              <div className="bg-black/30 backdrop-blur-lg px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
                <Users size={10} className="text-white/60" />
                <span className="text-[10px] font-medium">{viewerCount}</span>
              </div>
            </div>

            <div className="pointer-events-auto">
              <button className="p-1.5 bg-black/30 backdrop-blur-lg rounded-full border border-white/10">
                <X size={16} />
              </button>
            </div>
          </header>

          {/* 礼物动效层 */}
          <AnimatePresence>
            {activeGift && (
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 20, opacity: 1 }}
                exit={{ x: 20, opacity: 0, scale: 1.2 }}
                className="absolute top-1/3 left-0 z-40 pointer-events-none"
              >
                <div className="bg-gradient-to-r from-pink-500/80 to-transparent backdrop-blur-md pl-2 pr-8 py-1.5 rounded-full flex items-center gap-3 border border-white/20">
                  <div className="w-10 h-10 rounded-full bg-white/20 p-0.5">
                    <img src="https://picsum.photos/seed/user/100/100" className="w-full h-full rounded-full" alt="User" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white">{activeGift.user}</p>
                    <p className="text-[12px] font-black text-yellow-300 italic">送出 {activeGift.type}</p>
                  </div>
                  <div className="text-3xl animate-bounce ml-4">
                    {activeGift.type === 'Rose' ? '🌹' : activeGift.type === 'Heart' ? '❤️' : '🚀'}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 点赞动效 */}
          <FloatingHearts trigger={likeTrigger} />

          {/* 底部互动区 */}
          <div className="absolute bottom-0 left-0 right-0 z-30 p-4 flex flex-col gap-4">
            {/* 聊天列表 (半透明悬浮) */}
            <div className="h-48 w-full max-w-[280px]">
              <ChatBox socket={socket} userName={userName} />
            </div>

            {/* 底部功能栏 */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 flex items-center gap-3">
                <button 
                  onClick={() => setShowChat(!showChat)}
                  className="p-2.5 bg-black/30 backdrop-blur-lg rounded-full border border-white/10 text-white/90"
                >
                  <MessageCircle size={20} />
                </button>
                <button className="p-2.5 bg-black/30 backdrop-blur-lg rounded-full border border-white/10 text-white/90">
                  <ShoppingBag size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowGiftPanel(true)}
                  className="p-2.5 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-orange-500/20"
                >
                  <GiftIcon size={20} className="text-white" />
                </button>
                <button 
                  onClick={handleLike}
                  className="p-2.5 bg-pink-500 rounded-full shadow-lg shadow-pink-500/20"
                >
                  <Heart size={20} fill="white" className="text-white" />
                </button>
                <button className="p-2.5 bg-black/30 backdrop-blur-lg rounded-full border border-white/10 text-white/90">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* 礼物面板抽屉 */}
          <AnimatePresence>
            {showGiftPanel && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowGiftPanel(false)}
                  className="absolute inset-0 bg-black/40 z-40"
                />
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute bottom-0 left-0 right-0 z-50"
                >
                  <GiftPanel socket={socket} userName={userName} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

