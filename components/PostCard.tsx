
import React from 'react';
import { Post } from '../types';
import { EditableCardCanvas } from './EditableCardCanvas';

interface PostCardProps {
  post: Post & { 
    theme?: string; 
    mediaType?: 'audio' | 'video' | 'image' | 'text' | 'note';
    sponsor?: string;
    sticker?: string;
    secondaryImage?: string;
    category?: 'tears' | 'vouch' | 'hype';
  };
  onClick?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <div className="cursor-pointer group h-full select-none" onClick={onClick}>
      <EditableCardCanvas post={post} isEditable={true}>
        {/* Top header area */}
        {post.sticker && (
          <div className="flex items-center justify-start w-full select-none">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-lg">
              {post.sticker === 'heart_bubble' ? '❤️' :
               post.sticker === 'star_glow' ? '⭐' :
               post.sticker === 'medal_trophy' ? '🏆' :
               post.sticker === 'party_celebrate' ? '🎉' : '😊'}
            </div>
          </div>
        )}

        {/* Central content / Rasterized Image created by curator */}
        <div className="flex-grow flex flex-col justify-center my-2 relative overflow-hidden rounded-xl">
          {post.mediaUrl ? (
            <div className="relative w-full h-full min-h-[160px] rounded-2xl overflow-hidden bg-gray-50">
              <img 
                src={post.mediaUrl} 
                className="w-full h-full object-cover" 
                alt={post.content || 'Curated tribute'} 
                referrerPolicy="no-referrer" 
              />
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-center px-1 text-right" style={{ direction: 'rtl' }}>
              <p className="font-handwriting text-2xl text-gray-800 font-bold leading-snug">
                "{post.content}"
              </p>
            </div>
          )}
        </div>
      </EditableCardCanvas>
    </div>
  );
};



