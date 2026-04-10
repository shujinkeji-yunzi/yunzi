import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '../types';
import { Send } from 'lucide-react';

interface ChatBoxProps {
  socket: Socket | null;
  userName: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ socket, userName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('chat_history', (history: Message[]) => {
      setMessages(history);
    });

    socket.on('new_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat_history');
      socket.off('new_message');
    };
  }, [socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket) return;

    socket.emit('send_message', {
      user: userName,
      text: inputValue,
    });
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 scrollbar-hide mask-fade-top"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-black/20 backdrop-blur-md inline-block px-3 py-1 rounded-2xl border border-white/5 max-w-full">
              <span className="text-yellow-400 font-bold text-[11px] mr-1.5">{msg.user}:</span>
              <span className="text-white text-[12px] leading-relaxed break-words">{msg.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

