import { supabase } from '../lib/supabase';
import { COURSES } from '../data/mockData';

// Types
export interface ProgressData {
  courseId: string;
  moduleId: string;
  completedAt: string;
}

/**
 * Saves module completion status.
 * Uses Supabase if available, otherwise localStorage.
 */
export const markModuleComplete = async (userId: string, courseId: string, moduleId: string): Promise<boolean> => {
  if (supabase) {
    const { error } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: userId, 
        course_id: courseId, 
        module_id: moduleId 
      }, { onConflict: 'user_id, course_id, module_id' });
      
    if (error) {
      console.error('Supabase Error:', error);
      return false;
    }
    return true;
  } else {
    // Fallback: LocalStorage
    const key = `aim_ai_progress_${userId}`;
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    const exists = current.find((p: ProgressData) => p.courseId === courseId && p.moduleId === moduleId);
    
    if (!exists) {
      const newProgress = [...current, { courseId, moduleId, completedAt: new Date().toISOString() }];
      localStorage.setItem(key, JSON.stringify(newProgress));
    }
    return true;
  }
};

/**
 * Calculates percentage progress for all courses
 */
export const getUserProgress = async (userId: string): Promise<Record<string, number>> => {
  let completedModules: ProgressData[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('course_id, module_id, completed_at')
      .eq('user_id', userId);

    if (error) {
        console.error("Fetch Error:", error);
    } else if (data) {
        // Map snake_case to camelCase
        completedModules = data.map((d: any) => ({
            courseId: d.course_id,
            moduleId: d.module_id,
            completedAt: d.completed_at
        }));
    }
  } else {
    // Fallback: LocalStorage
    const key = `aim_ai_progress_${userId}`;
    completedModules = JSON.parse(localStorage.getItem(key) || '[]');
  }

  // Calculate percentages
  const progressMap: Record<string, number> = {};

  COURSES.forEach(course => {
    const totalModules = course.modules.length;
    if (totalModules === 0) return;

    const completedCount = completedModules.filter(m => m.courseId === course.id).length;
    const percentage = Math.round((completedCount / totalModules) * 100);
    progressMap[course.id] = percentage;
  });

  return progressMap;
};