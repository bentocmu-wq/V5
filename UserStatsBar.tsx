import React, { useState, useEffect } from 'react';
import { UserStats, getCumulativeStats, recordAppVisit } from './userStatsService';

interface UserStatsBarProps {
  variant?: 'top-banner' | 'card' | 'chat-header';
  onOpenFeedback?: () => void;
  className?: string;
}

export const UserStatsBar: React.FC<UserStatsBarProps> = ({
  variant = 'top-banner',
  onOpenFeedback,
  className = ''
}) => {
  const [stats, setStats] = useState<UserStats>(getCumulativeStats());

  useEffect(() => {
    // Record visit on mount and update stats
    const updated = recordAppVisit();
    setStats(updated);

    // Listen to local changes or intervals
    const interval = setInterval(() => {
      setStats(getCumulativeStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  if (variant === 'chat-header') {
    return (
      <div className={`bg-pink-50/90 border-b border-pink-100/80 px-3 py-1.5 flex items-center justify-between text-xs text-gray-700 backdrop-blur-sm ${className}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-pink-600">👥 ผู้ใช้งานสะสม:</span>
            <span className="font-bold text-gray-900">{formatNumber(stats.totalUsers)}</span>
            <span className="text-[11px] text-gray-500">คน</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-rose-600">💬 การตอบคำถาม:</span>
            <span className="font-bold text-gray-900">{formatNumber(stats.totalQuestions)}</span>
            <span className="text-[11px] text-gray-500">ครั้ง</span>
          </div>
        </div>

        {onOpenFeedback && (
          <button
            onClick={onOpenFeedback}
            className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 font-medium px-2 py-0.5 rounded-md hover:bg-pink-100 transition-colors"
          >
            <span>⭐</span>
            <span>แบบประเมิน / ข้อเสนอแนะ</span>
          </button>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-gradient-to-br from-pink-50/80 via-white to-rose-50/70 border border-pink-100 rounded-2xl p-4 shadow-sm text-left ${className}`}>
        <div className="flex items-center justify-between mb-3 border-b border-pink-100/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h3 className="font-bold text-gray-800 text-sm">สถิติการใช้งานระบบ</h3>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
            ระบบพร้อมใช้งาน
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/90 p-3 rounded-xl border border-pink-50 shadow-xs">
            <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
              <span>👥</span> ผู้ใช้งานสะสม
            </div>
            <div className="text-lg font-extrabold text-pink-600 mt-0.5">
              {formatNumber(stats.totalUsers)}
              <span className="text-xs font-normal text-gray-500 ml-1">คน</span>
            </div>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-pink-50 shadow-xs">
            <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
              <span>💬</span> การตอบคำถาม
            </div>
            <div className="text-lg font-extrabold text-rose-600 mt-0.5">
              {formatNumber(stats.totalQuestions)}
              <span className="text-xs font-normal text-gray-500 ml-1">ครั้ง</span>
            </div>
          </div>
        </div>

        {onOpenFeedback && (
          <button
            onClick={onOpenFeedback}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium text-xs py-2.5 px-3 rounded-xl shadow-xs transition-all active:scale-[0.99]"
          >
            <span>📝</span>
            <span>แสดงความคิดเห็น & แบบประเมินความพึงพอใจ (1-5 คะแนน)</span>
          </button>
        )}
      </div>
    );
  }

  // Default: 'top-banner'
  return (
    <div className={`w-full bg-white/95 backdrop-blur-md border-b border-pink-100 py-2 px-4 shadow-xs flex items-center justify-between text-xs md:text-sm text-gray-700 transition-all ${className}`}>
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 md:gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-base">👥</span>
            <span className="text-gray-600">ผู้ใช้งาน application สะสม:</span>
            <span className="font-bold text-pink-600 text-sm md:text-base">{formatNumber(stats.totalUsers)}</span>
            <span className="text-xs text-gray-400">คน</span>
          </div>

          <div className="hidden sm:block text-gray-300">•</div>

          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-base">💬</span>
            <span className="text-gray-600">การตอบคำถามสะสม:</span>
            <span className="font-bold text-rose-600 text-sm md:text-base">{formatNumber(stats.totalQuestions)}</span>
            <span className="text-xs text-gray-400">ครั้ง</span>
          </div>
        </div>

        {onOpenFeedback && (
          <button
            onClick={onOpenFeedback}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 text-pink-700 border border-pink-200/80 font-medium text-xs px-3 py-1.5 rounded-full transition-all shadow-2xs hover:shadow-xs active:scale-95"
          >
            <span>⭐</span>
            <span>แสดงความคิดเห็น & ประเมินความพึงพอใจ</span>
          </button>
        )}
      </div>
    </div>
  );
};
