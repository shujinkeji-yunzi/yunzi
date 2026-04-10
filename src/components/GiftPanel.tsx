import React from 'react';
import { Gift, GIFTS } from '../types';
import { Socket } from 'socket.io-client';
import { motion } from 'motion/react';

interface GiftPanelProps {
  socket: Socket | null;
  userName: string;
}

export const GiftPanel: React.FC<GiftPanelProps> = ({ socket, userName }) => {
  const handleSendGift = (gift: Gift) => {
    if (!socket) return;
    socket.emit('send_gift', {
      user: userName,
      giftType: gift.name,
    });
  };

  return (
    <div className="bg-black/80 backdrop-blur-2xl p-4 rounded-t-3xl border-t border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-medium text-sm">Send a Gift</h4>
        <div className="flex items-center gap-1 text-yellow-400">
          <span className="text-xs font-bold">1,240</span>
          <span className="text-[10px]">Coins</span>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {GIFTS.map((gift) => (
          <motion.button
            key={gift.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendGift(gift)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/10 transition-colors group"
          >
            <span className="text-2xl group-hover:animate-bounce">{gift.icon}</span>
            <span className="text-[10px] text-white/60">{gift.name}</span>
            <span className="text-[10px] text-yellow-500 font-bold">{gift.price}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
