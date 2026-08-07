
export enum EntityType {
  WALL = 'WALL',
  BOARD = 'BOARD',
  EVENT = 'EVENT'
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  ANONYMOUS = 'ANONYMOUS',
  PRIVATE = 'PRIVATE'
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isClaimed: boolean;
  socialUrl?: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  mediaUrl?: string;
  visibility: PostVisibility;
  createdAt: string;
  targetId: string;
  targetType: EntityType;
  reactions: number;
  canvasElements?: any[];
}

export interface AppreciationEntity {
  id: string;
  name: string;
  description: string;
  type: EntityType;
  owner?: User;
  avatar?: string;
  postCount: number;
  isSponsored?: boolean;
  sponsorName?: string;
}

export interface ModerationResult {
  isSafe: boolean;
  reason?: string;
  sentiment?: string;
}
