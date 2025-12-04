import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Modern React Patterns',
    description: 'Master advanced React hooks, performance optimization, and scalable architecture.',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    instructor: 'Sarah Drasner',
    level: 'Advanced',
    totalStudents: 1240,
    modules: [
      {
        id: 'm1-1',
        title: 'Introduction to Hooks',
        type: 'text',
        durationMinutes: 10,
        content: '# Introduction to Hooks\n\nHooks are a new addition in React 16.8. They let you use state and other React features without writing a class.\n\n### Rules of Hooks\n1. Only call Hooks at the top level.\n2. Only call Hooks from React function components.'
      },
      {
        id: 'm1-2',
        title: 'The useEffect Dependency Array',
        type: 'video',
        durationMinutes: 15,
        content: 'https://picsum.photos/800/450?random=10' // Mock video placeholder
      },
      {
        id: 'm1-3',
        title: 'Custom Hooks Quiz',
        type: 'quiz',
        durationMinutes: 5,
        content: 'What is the primary rule for naming custom hooks?'
      }
    ]
  },
  {
    id: 'c2',
    title: 'UI/UX Principles for Devs',
    description: 'Learn the fundamentals of color theory, typography, and layout design.',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    instructor: 'Gary Simon',
    level: 'Beginner',
    totalStudents: 850,
    modules: [
      {
        id: 'm2-1',
        title: 'Color Theory 101',
        type: 'text',
        durationMinutes: 12,
        content: '# Color Theory\n\nUnderstanding the color wheel is essential for creating visually appealing interfaces.'
      },
      {
        id: 'm2-2',
        title: 'Typography Basics',
        type: 'text',
        durationMinutes: 20,
        content: '# Typography\n\nLearn about serif vs sans-serif, line-height, and hierarchy.'
      }
    ]
  },
  {
    id: 'c3',
    title: 'Fullstack Next.js 14',
    description: 'Build production-ready applications with the App Router and Server Actions.',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    instructor: 'Lee Robinson',
    level: 'Intermediate',
    totalStudents: 3200,
    modules: [
      {
        id: 'm3-1',
        title: 'App Router Fundamentals',
        type: 'video',
        durationMinutes: 25,
        content: 'https://picsum.photos/800/450?random=11'
      }
    ]
  }
];