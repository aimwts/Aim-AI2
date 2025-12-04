import React from 'react';
import { Play, Clock, Award, TrendingUp, BookOpen } from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  progress: Record<string, number>;
}

const Dashboard: React.FC<DashboardProps> = ({ progress }) => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student';

  const activeCourses = COURSES.filter(c => (progress[c.id] || 0) > 0 && (progress[c.id] || 0) < 100);
  const completedCourses = COURSES.filter(c => (progress[c.id] || 0) === 100);
  
  // Stats Data
  const stats = [
    { label: 'Hours Learned', value: '12.5', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Completed', value: completedCourses.length.toString(), icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Current Streak', value: '5 Days', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const chartData = COURSES.map(c => ({
    name: c.title.split(' ').slice(0, 2).join(' '),
    progress: progress[c.id] || 0
  }));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {userName}! 👋</h1>
          <p className="text-slate-500 mt-1">You've made great progress this week. Keep it up!</p>
        </div>
        <div className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow-lg shadow-indigo-200">
            <span className="font-semibold">Pro Plan</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Active Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
            <Link to="/courses" className="text-indigo-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          
          <div className="grid gap-4">
            {activeCourses.length > 0 ? (
              activeCourses.map(course => (
                <div key={course.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-center group hover:border-indigo-300 transition">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{course.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500 rounded-full" 
                                style={{ width: `${progress[course.id] || 0}%` }}
                            />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{progress[course.id]}%</span>
                    </div>
                  </div>
                  <Link 
                    to={`/course/${course.id}`}
                    className="p-2 bg-slate-50 rounded-full text-indigo-600 hover:bg-indigo-50 hover:scale-110 transition"
                  >
                    <Play className="w-5 h-5 fill-current" />
                  </Link>
                </div>
              ))
            ) : (
                <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">No active courses. Start one below!</p>
                </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900 pt-4">Explore New Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COURSES.filter(c => !activeCourses.includes(c)).map(course => (
               <div key={course.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition group">
                 <div className="h-40 overflow-hidden relative">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                        {course.level}
                    </div>
                 </div>
                 <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <BookOpen className="w-4 h-4" />
                            <span>{course.modules.length} Modules</span>
                        </div>
                        <Link to={`/course-details/${course.id}`} className="text-indigo-600 font-medium text-sm hover:text-indigo-800">
                            Details &rarr;
                        </Link>
                    </div>
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Progress Chart */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6">Learning Activity</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" fontSize={10} tick={{fill: '#64748b'}} interval={0} />
                            <YAxis hide />
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="progress" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.progress > 50 ? '#6366f1' : '#cbd5e1'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
                    <p className="text-slate-300 text-sm mb-4">Get unlimited access to all courses, AI tutoring, and certificates.</p>
                    <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition">
                        View Plans
                    </button>
                </div>
                <Award className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;