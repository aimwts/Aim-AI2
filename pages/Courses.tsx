import React, { useState, useEffect } from 'react';
import { COURSES } from '../data/mockData';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Filter, Play } from 'lucide-react';
import { getUserProgress } from '../services/progressService';
import { useAuth } from '../context/AuthContext';

const Courses: React.FC = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user) {
      getUserProgress(user.id).then(setProgress);
    }
  }, [user]);

  const filteredCourses = COURSES.filter(course => {
    const prog = progress[course.id] || 0;
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === 'active') return prog > 0 && prog < 100;
    if (filter === 'completed') return prog === 100;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search courses..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                {(['all', 'active', 'completed'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                            filter === f ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
               <div key={course.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition group flex flex-col">
                 <div className="h-48 overflow-hidden relative">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                        {course.level}
                    </div>
                    {progress[course.id] ? (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/30">
                            <div className="h-full bg-indigo-500" style={{ width: `${progress[course.id]}%` }}></div>
                        </div>
                    ) : null}
                 </div>
                 <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <BookOpen className="w-4 h-4" />
                            <span>{course.modules.length} Modules</span>
                        </div>
                        {progress[course.id] ? (
                            <Link to={`/course/${course.id}`} className="text-indigo-600 font-medium text-sm hover:bg-indigo-50 p-2 rounded-lg flex items-center gap-2 transition">
                                <Play className="w-4 h-4 fill-current" /> Continue
                            </Link>
                        ) : (
                            <Link to={`/course-details/${course.id}`} className="text-indigo-600 font-medium text-sm hover:text-indigo-800">
                                Details &rarr;
                            </Link>
                        )}
                    </div>
                 </div>
               </div>
            ))
        ) : (
            <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Filter className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No courses found matching your criteria.</p>
                <button onClick={() => {setFilter('all'); setSearch('')}} className="mt-2 text-indigo-600 hover:underline">Clear filters</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Courses;