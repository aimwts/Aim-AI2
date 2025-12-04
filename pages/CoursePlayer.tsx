import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, PlayCircle, FileText, ChevronLeft, Menu, Play, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { COURSES } from '../data/mockData';
import AITutor from '../components/AITutor';
import { Module } from '../types';
import { markModuleComplete } from '../services/progressService';
import { useAuth } from '../context/AuthContext';

interface CoursePlayerProps {
  progress: Record<string, number>;
  onProgressUpdate: () => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ progress, onProgressUpdate }) => {
  const { user } = useAuth();
  const { courseId } = useParams<{ courseId: string }>();
  const course = COURSES.find(c => c.id === courseId);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [marking, setMarking] = useState(false);

  // Initialize active module
  useEffect(() => {
    if (course && !activeModule) {
      setActiveModule(course.modules[0]);
    }
  }, [course, activeModule]);

  if (!course) return <div className="p-10 text-center">Course not found</div>;

  const handleComplete = async () => {
      if (!user || !activeModule || marking) return;
      setMarking(true);
      
      const success = await markModuleComplete(user.id, course.id, activeModule.id);
      if (success) {
          onProgressUpdate();
      }
      
      // Simulate network delay for UX if local
      setTimeout(() => setMarking(false), 500);
  };

  const currentIndex = course.modules.findIndex(m => m.id === activeModule?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < course.modules.length - 1;

  const handlePrev = () => {
    if (hasPrev) setActiveModule(course.modules[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) setActiveModule(course.modules[currentIndex + 1]);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Sidebar - Module List */}
      <div 
        className={`${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} 
        bg-slate-50 border-r border-slate-200 transition-all duration-300 flex-shrink-0 relative`}
      >
        <div className="p-5 border-b border-slate-200">
            <Link to="/" className="flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-4">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </Link>
            <h2 className="font-bold text-slate-900 leading-tight">{course.title}</h2>
            <div className="mt-3 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${progress[course.id] || 0}%` }}
                />
            </div>
            <p className="text-xs text-slate-500 mt-1">{progress[course.id] || 0}% Completed</p>
        </div>

        <div className="overflow-y-auto h-[calc(100%-140px)]">
            {course.modules.map((module, idx) => {
                const isActive = activeModule?.id === module.id;
                return (
                    <button
                        key={module.id}
                        onClick={() => setActiveModule(module)}
                        className={`w-full text-left p-4 border-b border-slate-100 transition-colors flex items-start gap-3
                            ${isActive ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-100 border-l-4 border-l-transparent'}
                        `}
                    >
                        <div className={`mt-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {module.type === 'video' ? <PlayCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                                {idx + 1}. {module.title}
                            </p>
                            <span className="text-xs text-slate-500">{module.durationMinutes} min</span>
                        </div>
                    </button>
                );
            })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Toggle Bar for Mobile/Desktop */}
        <div className="h-14 border-b border-slate-200 flex items-center px-4 bg-white z-10 shadow-sm">
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-md text-slate-600"
            >
                <Menu className="w-5 h-5" />
            </button>
            <span className="ml-4 font-semibold text-slate-800 truncate">
                {activeModule?.title}
            </span>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {activeModule && (
                    <>
                        {/* Content Rendering */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
                            {activeModule.type === 'video' ? (
                                <div className="aspect-video bg-black flex items-center justify-center relative group cursor-pointer">
                                    <img src={activeModule.content} className="w-full h-full object-cover opacity-60" alt="Video thumbnail" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition">
                                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                    <span className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        Mock Player
                                    </span>
                                </div>
                            ) : (
                                <div className="p-8 prose prose-slate max-w-none">
                                    <div className="whitespace-pre-wrap">{activeModule.content}</div>
                                </div>
                            )}
                        </div>

                        {/* Action Bar */}
                        <div className="flex justify-between items-center py-6">
                             <button 
                                onClick={handlePrev}
                                disabled={!hasPrev}
                                className="px-4 py-2 flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-600"
                             >
                                <ArrowLeft className="w-4 h-4" /> Previous Module
                             </button>
                             
                             <button 
                                onClick={handleComplete}
                                disabled={marking}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-indigo-200 flex items-center gap-2 transition transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                             >
                                {marking ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                {marking ? 'Saving...' : 'Mark as Complete'}
                             </button>
                             
                             <button 
                                onClick={handleNext}
                                disabled={!hasNext}
                                className="px-4 py-2 flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-600"
                             >
                                Next Module <ArrowRight className="w-4 h-4" />
                             </button>
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>

      {/* AI Assistant available in Context */}
      <AITutor contextTitle={activeModule?.title || course.title} />
    </div>
  );
};

export default CoursePlayer;