export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
}

export interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  type: 'chat' | 'gift_announcement';
  giftType?: string;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  price: number;
}

export const GIFTS: Gift[] = [
  { id: 'rose', name: 'Rose', icon: '🌹', price: 1 },
  { id: 'heart', name: 'Heart', icon: '❤️', price: 10 },
  { id: 'rocket', name: 'Rocket', icon: '🚀', price: 100 },
  { id: 'crown', name: 'Crown', icon: '👑', price: 500 },
  { id: 'car', name: 'Supercar', icon: '🏎️', price: 1000 },
];
