export interface Module {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  content: string; // URL or Markdown text
  durationMinutes: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: Module[];
  totalStudents: number;
}

export interface UserProgress {
  userId: string;
  completedModuleIds: string[];
  courseProgress: Record<string, number>; // courseId -> percentage
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingUrls?: { title: string; uri: string; source: 'map' | 'web' }[];
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  COURSE_PLAYER = 'COURSE_PLAYER'
}