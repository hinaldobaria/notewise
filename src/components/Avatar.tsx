import React from 'react';

export interface AvatarOption {
  id: string;
  name: string;
  background: string;
  emoji: string;
}

export const avatarOptions: AvatarOption[] = [
  { id: 'avatar1', name: 'Cheerful', background: 'bg-gradient-to-br from-pink-400 to-pink-600', emoji: '😊' },
  { id: 'avatar2', name: 'Cool', background: 'bg-gradient-to-br from-blue-400 to-blue-600', emoji: '😎' },
  { id: 'avatar3', name: 'Smart', background: 'bg-gradient-to-br from-purple-400 to-purple-600', emoji: '🤓' },
  { id: 'avatar4', name: 'Creative', background: 'bg-gradient-to-br from-yellow-400 to-orange-500', emoji: '🎨' },
  { id: 'avatar5', name: 'Focused', background: 'bg-gradient-to-br from-green-400 to-green-600', emoji: '🎯' },
];

interface AvatarProps {
  avatarId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-24 h-24 text-4xl'
};

export const Avatar: React.FC<AvatarProps> = ({ avatarId, size = 'md', className = '' }) => {
  const avatar = avatarOptions.find(a => a.id === avatarId) || avatarOptions[0];

  return (
    <div className={`${avatar.background} ${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg ${className}`}>
      <span className="text-white font-bold">{avatar.emoji}</span>
    </div>
  );
};

interface AvatarSelectorProps {
  selectedId: string;
  onSelect: (avatarId: string) => void;
  className?: string;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedId, onSelect, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {avatarOptions.map(avatar => (
        <button
          key={avatar.id}
          onClick={() => onSelect(avatar.id)}
          className={`relative transition-all duration-200 ${
            selectedId === avatar.id 
              ? 'ring-4 ring-indigo-500 ring-offset-2 scale-110' 
              : 'hover:scale-105 hover:shadow-lg'
          }`}
        >
          <Avatar avatarId={avatar.id} size="lg" />
          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-medium">
            {avatar.name}
          </span>
        </button>
      ))}
    </div>
  );
};