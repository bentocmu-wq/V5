import React, { useState } from 'react';
import { 
  FeedbackEntry, 
  submitFeedback, 
  getAllFeedbacks, 
  getStoredScriptUrl, 
  setStoredScriptUrl,
  GOOGLE_APPS_SCRIPT_SAMPLE 
} from './feedbackService';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'results' | 'settings'>('form');

  // Form State
  const [position, setPosition] = useState<string>('พยาบาลวิชาชีพ');
  const [customPosition, setCustomPosition] = useState<string>('');
  
  const [experience, setExperience] = useState<string>('1-3 ปี');
  const [hasUsed, setHasUsed] = useState<string>('เคยใช้งาน');
  
  const [topics, setTopics] = useState<string[]>(['แนวปฎิบัติทั่วไป']);
  const [customTopic, setCustomTopic] = useState<string>('');

  // 1-5 Scores
  const [convenienceScore, setConvenienceScore] = useState<number>(5);
  const [impressionScore, setImpressionScore] = useState<number>(5);
  const [accuracyScore, setAccuracyScore] = useState<number>(5);
  const [supportScore, setSupportScore] = useState<number>(5);
  const [futureUseScore, setFutureUseScore] = useState<number>(5);
  
  const [suggestion, setSuggestion] = useState<string>('');

  // Google Sheet Webhook Script URL
  const [scriptUrl, setScriptUrl] = useState<string>(getStoredScriptUrl());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Results
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>(getAllFeedbacks());

  if (!isOpen) return null;

  const handleTopicToggle = (topic: string) => {
    setTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(null);

    const finalPosition = position === 'อื่น ๆ' && customPosition.trim() ? `อื่น ๆ (${customPosition.trim()})` : position;
    
    let finalTopicsList = [...topics];
    if (customTopic.trim()) {
      finalTopicsList.push(`อื่น ๆ (${customTopic.trim()})`);
    }
    const finalTopics = finalTopicsList.join(', ');

    const res = await submitFeedback({
      position: finalPosition,
      experience,
      hasUsed,
      topicsUsed: finalTopics,
      convenienceScore,
      impressionScore,
      accuracyScore,
      supportScore,
      futureUseScore,
      suggestion: suggestion.trim()
    });

    setIsSubmitting(false);
    setSubmitSuccess(res.message);
    setFeedbacks(getAllFeedbacks());

    // Reset suggestion
    setSuggestion('');
  };

  const handleSaveScriptUrl = () => {
    setStoredScriptUrl(scriptUrl);
    alert('บันทึก Google Apps Script Web App URL เรียบร้อยแล้วค่ะ');
  };

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SAMPLE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const renderStarRating = (value: number, onChange: (val: number) => void, label: string, questionNum: string) => {
    return (
      <div className="bg-pink-50/50 rounded-2xl p-3 border border-pink-100/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-800">
            <span className="text-pink-600 font-bold mr-1">{questionNum}</span> {label}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
            {value} / 5
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              type="button"
              key={score}
              onClick={() => onChange(score)}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all ${
                value === score
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md scale-105'
                  : 'bg-white hover:bg-pink-100 text-gray-700 border border-pink-100'
              }`}
            >
              <span>{score}</span>
              <span className="text-[10px] hidden sm:inline font-normal">
                {score === 1 ? 'น้อยสุด' : score === 5 ? 'มากสุด' : '⭐'}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Calculations for results
  const totalCount = feedbacks.length;
  const avgConvenience = (feedbacks.reduce((acc, f) => acc + f.convenienceScore, 0) / (totalCount || 1)).toFixed(1);
  const avgImpression = (feedbacks.reduce((acc, f) => acc + f.impressionScore, 0) / (totalCount || 1)).toFixed(1);
  const avgAccuracy = (feedbacks.reduce((acc, f) => acc + f.accuracyScore, 0) / (totalCount || 1)).toFixed(1);
  const avgSupport = (feedbacks.reduce((acc, f) => acc + f.supportScore, 0) / (totalCount || 1)).toFixed(1);
  const avgFuture = (feedbacks.reduce((acc, f) => acc + f.futureUseScore, 0) / (totalCount || 1)).toFixed(1);
  const overallAvg = ((+avgConvenience + +avgImpression + +avgAccuracy + +avgSupport + +avgFuture) / 5).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-pink-100 flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl shadow-xs">
              📝
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">แสดงความคิดเห็น & แบบประเมิน</h3>
              <p className="text-pink-100 text-xs">พี่พยาบาลแก้วรอบรู้ • เชื่อมต่อ Google Sheet</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/60 p-1.5 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all text-center flex items-center justify-center space-x-1.5 ${
              activeTab === 'form' 
                ? 'bg-white text-pink-600 shadow-xs border border-pink-100' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>✍️ กรอกแบบประเมิน</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all text-center flex items-center justify-center space-x-1.5 ${
              activeTab === 'results' 
                ? 'bg-white text-pink-600 shadow-xs border border-pink-100' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>📊 ผลประเมินสะสม ({totalCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-3 rounded-xl transition-all text-center flex items-center justify-center space-x-1 ${
              activeTab === 'settings' 
                ? 'bg-white text-pink-600 shadow-xs border border-pink-100' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
            title="ตั้งค่า Google Sheet Webhook"
          >
            <span>⚙️ Google Sheet</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {submitSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎉</span>
                <span>{submitSuccess}</span>
              </div>
              <button 
                onClick={() => setSubmitSuccess(null)}
                className="text-emerald-600 hover:text-emerald-900 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {activeTab === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              {/* 1. ตำแหน่ง */}
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  1. ตำแหน่งของคุณ <span className="text-pink-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['พยาบาลวิชาชีพ', 'ผู้ช่วยพยาบาล', 'พยาบาลใหม่', 'HP', 'อื่น ๆ'].map((pos) => (
                    <button
                      type="button"
                      key={pos}
                      onClick={() => setPosition(pos)}
                      className={`px-3 py-1.5 rounded-xl border font-medium transition-all ${
                        position === pos
                          ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
                {position === 'อื่น ๆ' && (
                  <input
                    type="text"
                    value={customPosition}
                    onChange={(e) => setCustomPosition(e.target.value)}
                    placeholder="ระบุตำแหน่งของคุณ..."
                    className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-pink-400 outline-none"
                  />
                )}
              </div>

              {/* 2. อายุงาน */}
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  2. อายุงาน <span className="text-pink-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['น้อยกว่า 1 ปี', '1-3 ปี', '4-10 ปี', 'มากกว่า 10 ปี'].map((exp) => (
                    <button
                      type="button"
                      key={exp}
                      onClick={() => setExperience(exp)}
                      className={`py-2 px-2 text-center rounded-xl border font-medium text-xs transition-all ${
                        experience === exp
                          ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. เคยใช้งานหรือไม่ */}
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  3. เคยใช้งานพี่แก้วรอบรู้หรือไม่? <span className="text-pink-500">*</span>
                </label>
                <div className="flex gap-2">
                  {['เคยใช้งาน', 'ไม่เคยใช้งาน'].map((u) => (
                    <button
                      type="button"
                      key={u}
                      onClick={() => setHasUsed(u)}
                      className={`flex-1 py-2 px-3 rounded-xl border font-medium transition-all ${
                        hasUsed === u
                          ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. เรื่องที่ใช้งานมากที่สุด */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  4. เรื่องที่ใช้งานมากที่สุด (เลือกได้หลายข้อ)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    'แนวปฎิบัติทั่วไป',
                    'ข้อมูลยา / การให้ยา',
                    'ข้อมูล HR การลา',
                    'ทบทวนความรู้ทั่วไป'
                  ].map((topic) => {
                    const checked = topics.includes(topic);
                    return (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => handleTopicToggle(topic)}
                        className={`text-left p-2.5 rounded-xl border flex items-center space-x-2 transition-all ${
                          checked
                            ? 'bg-pink-50 text-pink-700 border-pink-300 font-semibold'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-pink-200'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          checked ? 'bg-pink-500 text-white' : 'border border-gray-300'
                        }`}>
                          {checked ? '✓' : ''}
                        </span>
                        <span className="text-xs">{topic}</span>
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="อื่น ๆ (ระบุเพิ่มเติม เช่น การสวนปัสสาวะ, แนวทาง D/C)..."
                  className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-pink-400 outline-none"
                />
              </div>

              {/* 5-9 แบบประเมินความพึงพอใจ 1-5 */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm">
                    ⭐ ประเมินความพึงพอใจ (คะแนน 1 - 5)
                  </h4>
                  <span className="text-[11px] text-gray-400 font-normal">1 = น้อยที่สุด, 5 = มากที่สุด</span>
                </div>

                {renderStarRating(convenienceScore, setConvenienceScore, 'ความสะดวกในการใช้งาน', 'ข้อ 5')}
                {renderStarRating(impressionScore, setImpressionScore, 'ความประทับใจ', 'ข้อ 6')}
                {renderStarRating(accuracyScore, setAccuracyScore, 'ความถูกต้องของข้อมูล', 'ข้อ 7')}
                {renderStarRating(supportScore, setSupportScore, 'การสนับสนุนการปฏิบัติงาน', 'ข้อ 8')}
                {renderStarRating(futureUseScore, setFutureUseScore, 'ความตั้งใจใช้งานในอนาคต', 'ข้อ 9')}
              </div>

              {/* 10. ข้อเสนอแนะ */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700 mb-1">
                  10. ข้อเสนอแนะเพิ่มเติมเพื่อพัฒนาพี่แก้วรอบรู้
                </label>
                <textarea
                  rows={3}
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="พิมพ์ข้อคิดเห็นหรือสิ่งที่อยากให้พี่แก้วเพิ่มเติม เช่น อยากให้มีเมนูค้นหาเบอร์โทร, เพิ่มข้อมูลหัตถการ..."
                  className="w-full p-3 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-pink-400 outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? 'กำลังบันทึกลงใน Google Sheet...' : 'ส่งแบบประเมินและบันทึกข้อมูล'}</span>
                <span>💖</span>
              </button>
            </form>
          )}

          {activeTab === 'results' && (
            <div className="space-y-4">
              {/* Score Summary Cards */}
              <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold opacity-90">คะแนนความพึงพอใจเฉลี่ยรวม</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">{totalCount} แบบประเมิน</span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl sm:text-4xl font-black">{overallAvg}</span>
                  <span className="text-pink-100 text-xs sm:text-sm">/ 5.0 คะแนน ⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              {/* Breakdown per question */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-gray-700">
                  <span>ข้อ 5: ความสะดวกในการใช้งาน</span>
                  <span className="font-bold text-pink-600">{avgConvenience} / 5</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full rounded-full" style={{ width: `${(+avgConvenience / 5) * 100}%` }} />
                </div>

                <div className="flex justify-between items-center text-gray-700 pt-1">
                  <span>ข้อ 6: ความประทับใจ</span>
                  <span className="font-bold text-pink-600">{avgImpression} / 5</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(+avgImpression / 5) * 100}%` }} />
                </div>

                <div className="flex justify-between items-center text-gray-700 pt-1">
                  <span>ข้อ 7: ความถูกต้องของข้อมูล</span>
                  <span className="font-bold text-pink-600">{avgAccuracy} / 5</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(+avgAccuracy / 5) * 100}%` }} />
                </div>

                <div className="flex justify-between items-center text-gray-700 pt-1">
                  <span>ข้อ 8: การสนับสนุนการทำงาน</span>
                  <span className="font-bold text-pink-600">{avgSupport} / 5</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(+avgSupport / 5) * 100}%` }} />
                </div>

                <div className="flex justify-between items-center text-gray-700 pt-1">
                  <span>ข้อ 9: การใช้ในอนาคต</span>
                  <span className="font-bold text-pink-600">{avgFuture} / 5</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(+avgFuture / 5) * 100}%` }} />
                </div>
              </div>

              {/* Recent Responses List */}
              <div>
                <h4 className="font-bold text-gray-800 text-xs sm:text-sm mb-2">
                  ความคิดเห็นล่าสุดจากผู้ใช้งาน ({feedbacks.length} รายการ)
                </h4>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {feedbacks.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white border border-gray-100 rounded-xl shadow-2xs text-xs space-y-1">
                      <div className="flex justify-between items-center text-gray-500 text-[11px]">
                        <span className="font-bold text-pink-600">{item.position} • {item.experience}</span>
                        <span>{item.timestamp}</span>
                      </div>
                      {item.topicsUsed && (
                        <div className="text-gray-600 text-[11px]">
                          <span className="text-gray-400">เรื่องที่ใช้:</span> {item.topicsUsed}
                        </div>
                      )}
                      {item.suggestion && (
                        <div className="text-gray-800 font-medium bg-pink-50/50 p-2 rounded-lg border border-pink-100/50">
                          "{item.suggestion}"
                        </div>
                      )}
                      <div className="text-gray-400 text-[10px] flex gap-2">
                        <span>คะแนน: 5/6/7/8/9 = {item.convenienceScore}/{item.impressionScore}/{item.accuracyScore}/{item.supportScore}/{item.futureUseScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-900 space-y-2">
                <h4 className="font-bold text-sm flex items-center">
                  <span>🔗 การเชื่อมต่อ Google Sheet</span>
                </h4>
                <p className="text-xs leading-relaxed text-blue-800">
                  ระบบสามารถส่งข้อมูลแบบประเมินและข้อเสนอแนะเข้าไปยัง Google Sheet ได้โดยตรงผ่าน Google Apps Script Web App เมื่อมีผู้ตอบแบบประเมิน ข้อมูลจะถูกบันทึกเป็นแถวใหม่ทันทีตามโครงสร้างคอลัมน์ของคุณ
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-gray-700 block">
                  Google Apps Script Web App URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={scriptUrl}
                    onChange={(e) => setScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 p-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-pink-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSaveScriptUrl}
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    บันทึก URL
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  * หากเว้นว่างไว้ ข้อมูลจะถูกจัดเก็บบนระบบ Local Storage และแสดงผลในหน้ารวมสถิติ
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">โค้ด Google Apps Script (คัดลอกไปวางใน Google Sheet):</span>
                  <button
                    type="button"
                    onClick={copyScriptToClipboard}
                    className="text-pink-600 hover:text-pink-700 font-bold text-xs flex items-center"
                  >
                    {copiedScript ? '✓ คัดลอกแล้ว!' : '📋 คัดลอกโค้ด'}
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded-xl text-[10px] overflow-x-auto max-h-40 font-mono">
                  {GOOGLE_APPS_SCRIPT_SAMPLE}
                </pre>
                <p className="text-[10px] text-gray-500 leading-normal">
                  วิธีทำ: ใน Google Sheet ไปที่ <strong>ส่วนขยาย (Extensions)</strong> &gt; <strong>Apps Script</strong> &gt; วางโค้ดนี้ &gt; กด <strong>ทำให้ใช้งานได้ (Deploy)</strong> &gt; <strong>การทำให้ใช้งานได้รายการใหม่ (New deployment)</strong> &gt; เลือกประเภท <strong>เว็บแอป (Web app)</strong> &gt; ให้สิทธิ์ผู้เข้าถึงเป็น <strong>ทุกคน (Anyone)</strong> &gt; นำ URL มาวางด้านบนค่ะ
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
          <button
            onClick={() => setActiveTab(activeTab === 'results' ? 'form' : 'results')}
            className="text-pink-600 hover:text-pink-700 font-semibold flex items-center space-x-1"
          >
            <span>{activeTab === 'results' ? '← กลับไปทำแบบประเมิน' : '📊 ดูสถิติและความคิดเห็นทั้งหมด'}</span>
          </button>
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
