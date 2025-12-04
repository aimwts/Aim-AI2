import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, BarChart, CheckCircle, PlayCircle, Lock, Star, Globe, FileText, ChevronLeft } from 'lucide-react';
import { COURSES } from '../data/mockData';

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = COURSES.find(c => c.id === courseId);

  if (!course) return <div className="p-10 text-center">Course not found</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section with Backdrop Blur and Gradient */}
      <div className="relative h-[500px] w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-slate-900/90 z-10" />
        <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        
        {/* Navigation Breadcrumb Overlay */}
        <div className="absolute top-6 left-6 z-30">
             <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium">
                <ChevronLeft className="w-4 h-4" />
                Back to Dashboard
             </Link>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md text-indigo-100 px-3 py-1 rounded-full text-xs font-semibold w-fit mb-6 shadow-lg shadow-indigo-500/10">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                New Course
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl tracking-tight">
                {course.title}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed font-light">
                {course.description}
            </p>
            
            <div className="flex flex-wrap gap-6 text-white/90 font-medium">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    <span>4h 30m Total Duration</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <span>{course.totalStudents.toLocaleString()} Students</span>
                </div>
                <div className="flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-indigo-400" />
                    <span>{course.level} Level</span>
                </div>
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span>4.9 (240 Reviews)</span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-30 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">What you'll learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        "Build production-ready applications",
                        "Master advanced patterns and best practices",
                        "Implement secure authentication",
                        "Deploy globally with edge functions"
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-slate-600 leading-snug">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex justify-between items-end mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Course Content</h3>
                    <span className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">{course.modules.length} Modules</span>
                </div>
                
                <div className="space-y-3">
                    {course.modules.map((module, idx) => (
                        <div key={module.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-slate-600 group-hover:text-indigo-600 font-bold text-sm transition-colors">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">{module.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${module.type === 'video' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {module.type}
                                        </span>
                                        <span className="text-xs text-slate-400">• {module.durationMinutes} min</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 bg-white">
                                {idx === 0 ? <PlayCircle className="w-4 h-4 text-indigo-600" /> : <Lock className="w-3 h-3 text-slate-400" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Instructor */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-600 blur-lg opacity-20 rounded-full"></div>
                    <img src={`https://picsum.photos/seed/${course.instructor}/200`} alt={course.instructor} className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{course.instructor}</h3>
                    <p className="text-indigo-600 font-medium text-sm mb-4">Senior Software Engineer</p>
                    <p className="text-slate-600 leading-relaxed mb-6 max-w-lg">
                        A passionate educator with over 10 years of experience in building scalable web applications. 
                        Previously worked at top tech companies and has taught over 50,000 students worldwide.
                    </p>
                    <div className="flex gap-4 justify-center md:justify-start">
                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition border border-slate-200 px-3 py-1.5 rounded-lg hover:border-indigo-200 hover:bg-indigo-50">
                            <Globe className="w-4 h-4" /> Website
                        </button>
                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition border border-slate-200 px-3 py-1.5 rounded-lg hover:border-indigo-200 hover:bg-indigo-50">
                            <Users className="w-4 h-4" /> Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-indigo-900/10 border border-slate-100 overflow-hidden relative">
                     {/* Decorative top pattern */}
                     <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

                     <div className="flex items-end gap-3 mb-2 mt-2">
                        <span className="text-4xl font-bold text-slate-900">$89.99</span>
                        <span className="text-lg text-slate-400 line-through mb-1.5">$199.99</span>
                     </div>
                     <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md mb-6">
                        55% OFF • LIMITED TIME
                     </div>
                     
                     <Link 
                        to={`/course/${course.id}`}
                        className="block w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-center font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mb-4"
                     >
                        Start Learning Now
                     </Link>
                     
                     <p className="text-xs text-center text-slate-400 mb-6">30-Day Money-Back Guarantee</p>
                     
                     <div className="space-y-4 pt-6 border-t border-slate-100">
                        <h4 className="font-semibold text-slate-900 text-sm">This course includes:</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <PlayCircle className="w-4 h-4 text-indigo-500" />
                                <span>12 hours on-demand video</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <FileText className="w-4 h-4 text-indigo-500" />
                                <span>5 downloadable resources</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Globe className="w-4 h-4 text-indigo-500" />
                                <span>Full lifetime access</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Users className="w-4 h-4 text-indigo-500" />
                                <span>Certificate of completion</span>
                            </div>
                        </div>
                     </div>
                </div>
                
                {/* Support Card */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
                    <h4 className="font-bold text-slate-900 mb-2">Training for a Team?</h4>
                    <p className="text-sm text-slate-500 mb-4">Get this course plus 500+ others for your team.</p>
                    <button className="text-indigo-600 font-semibold text-sm hover:underline">Request a demo</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;