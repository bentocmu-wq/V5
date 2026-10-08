export interface FeedbackEntry {
  timestamp: string;
  position: string;
  experience: string;
  hasUsed: string;
  topicsUsed: string;
  convenienceScore: number;    // ข้อ 5
  impressionScore: number;     // ข้อ 6
  accuracyScore: number;       // ข้อ 7
  supportScore: number;        // ข้อ 8
  futureUseScore: number;      // ข้อ 9
  suggestion: string;
}

const FEEDBACK_STORAGE_KEY = 'nurse_kaew_feedback_submissions_v2';
const GOOGLE_SCRIPT_URL_KEY = 'nurse_kaew_apps_script_url';

// Default / fallback Google Apps Script Web App URL (if user configures one)
export const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfE1e_sample_sheet_nurse_kaew/exec';

export const getStoredScriptUrl = (): string => {
  return localStorage.getItem(GOOGLE_SCRIPT_URL_KEY) || '';
};

export const setStoredScriptUrl = (url: string): void => {
  localStorage.setItem(GOOGLE_SCRIPT_URL_KEY, url.trim());
};

// 32 Seed responses provided directly by user
export const SEED_FEEDBACKS: FeedbackEntry[] = [
  {
    timestamp: "28/3/2026, 1:15:57",
    position: "พยาบาลวิชาชีพ",
    experience: "1-3 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ข้อมูลยา / การให้ยา, ทบทวนความรู้ทั่วไป",
    convenienceScore: 4,
    impressionScore: 4,
    accuracyScore: 4,
    supportScore: 5,
    futureUseScore: 4,
    suggestion: ""
  },
  {
    timestamp: "2/4/2026, 16:07:48",
    position: "ผู้ช่วยพยาบาล",
    experience: "มากกว่า 10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "2/4/2026, 16:08:19",
    position: "พยาบาลวิชาชีพ",
    experience: "มากกว่า 10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "อื่น ๆ (การสวนปัสสาวะ)",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "2/4/2026, 16:08:23",
    position: "ผู้ช่วยพยาบาล",
    experience: "4-10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 3,
    supportScore: 4,
    futureUseScore: 5,
    suggestion: "ชอบค่ะ บางอย่างช่วยแก้ปัญหาเฉพาะหน้าได้ค่ะ"
  },
  {
    timestamp: "2/4/2026, 16:16:58",
    position: "ผู้ช่วยพยาบาล",
    experience: "น้อยกว่า 1 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "ข้อมูล HR การลา, ทบทวนความรู้ทั่วไป",
    convenienceScore: 3,
    impressionScore: 4,
    accuracyScore: 4,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "2/4/2026, 16:18:47",
    position: "พยาบาลวิชาชีพ",
    experience: "1-3 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "ข้อมูลยา / การให้ยา",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 4,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "2/4/2026, 16:19:23",
    position: "พยาบาลวิชาชีพ",
    experience: "1-3 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 4,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "2/4/2026, 16:34:31",
    position: "พยาบาลวิชาชีพ",
    experience: "4-10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "2/4/2026, 17:05:18",
    position: "ผู้ช่วยพยาบาล",
    experience: "มากกว่า 10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ข้อมูล HR การลา, ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 4,
    futureUseScore: 4,
    suggestion: ""
  },
  {
    timestamp: "3/4/2026, 11:53:32",
    position: "พยาบาลใหม่",
    experience: "น้อยกว่า 1 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ข้อมูลยา / การให้ยา",
    convenienceScore: 5,
    impressionScore: 4,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: "-"
  },
  {
    timestamp: "4/4/2026, 13:35:21",
    position: "ผู้ช่วยพยาบาล",
    experience: "มากกว่า 10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ข้อมูล HR การลา",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 9:44:35",
    position: "พยาบาลวิชาชีพ",
    experience: "มากกว่า 10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "อื่น ๆ (แนวทางการจำหน่ายผู้ป่วย)",
    convenienceScore: 4,
    impressionScore: 4,
    accuracyScore: 4,
    supportScore: 4,
    futureUseScore: 4,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 9:45:26",
    position: "ผู้ช่วยพยาบาล",
    experience: "1-3 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 4,
    accuracyScore: 4,
    supportScore: 3,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 10:03:34",
    position: "พยาบาลวิชาชีพ",
    experience: "1-3 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "ข้อมูลยา / การให้ยา, ข้อมูล HR การลา, ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 4,
    accuracyScore: 5,
    supportScore: 4,
    futureUseScore: 4,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 10:04:34",
    position: "พยาบาลวิชาชีพ",
    experience: "4-10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป",
    convenienceScore: 5,
    impressionScore: 4,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: "อยากให้พี่แก้วมีหน้ารวมเมนูเหมือน enr เพื่อที่จะได้ทราบว่าตอนนี้ทางวอร์ดมีระบบอะไรให้ใช้บ้าง"
  },
  {
    timestamp: "6/4/2026, 10:11:24",
    position: "ผู้ช่วยพยาบาล",
    experience: "น้อยกว่า 1 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 10:36:51",
    position: "พยาบาลวิชาชีพ",
    experience: "มากกว่า 10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ข้อมูลยา / การให้ยา, ข้อมูล HR การลา",
    convenienceScore: 4,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 10:52:31",
    position: "HP",
    experience: "4-10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "ข้อมูล HR การลา",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 4,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 11:41:06",
    position: "พยาบาลวิชาชีพ",
    experience: "4-10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ข้อมูลยา / การให้ยา, ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 11:41:38",
    position: "พยาบาลวิชาชีพ",
    experience: "4-10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ข้อมูล HR การลา, ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 11:44:00",
    position: "พยาบาลวิชาชีพ",
    experience: "1-3 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 11:44:48",
    position: "พยาบาลวิชาชีพ",
    experience: "1-3 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 12:09:24",
    position: "พยาบาลวิชาชีพ",
    experience: "มากกว่า 10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ข้อมูลยา / การให้ยา, ข้อมูล HR การลา",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: "-"
  },
  {
    timestamp: "6/4/2026, 12:10:12",
    position: "พยาบาลวิชาชีพ",
    experience: "มากกว่า 10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ข้อมูลยา / การให้ยา, ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: "-"
  },
  {
    timestamp: "6/4/2026, 18:02:30",
    position: "พยาบาลวิชาชีพ",
    experience: "1-3 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "ทบทวนความรู้ทั่วไป",
    convenienceScore: 4,
    impressionScore: 4,
    accuracyScore: 4,
    supportScore: 4,
    futureUseScore: 4,
    suggestion: ""
  },
  {
    timestamp: "6/4/2026, 21:27:56",
    position: "ผู้ช่วยพยาบาล",
    experience: "4-10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ข้อมูล HR การลา, ทบทวนความรู้ทั่วไป",
    convenienceScore: 4,
    impressionScore: 4,
    accuracyScore: 4,
    supportScore: 3,
    futureUseScore: 4,
    suggestion: ""
  },
  {
    timestamp: "7/4/2026, 8:46:17",
    position: "พยาบาลวิชาชีพ",
    experience: "มากกว่า 10 ปี",
    hasUsed: "ไม่เคยใช้งาน",
    topicsUsed: "",
    convenienceScore: 3,
    impressionScore: 3,
    accuracyScore: 3,
    supportScore: 3,
    futureUseScore: 3,
    suggestion: "จะพยายามเข้าไปใช้งานค่ะ"
  },
  {
    timestamp: "7/4/2026, 8:54:39",
    position: "พยาบาลวิชาชีพ",
    experience: "4-10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป",
    convenienceScore: 3,
    impressionScore: 3,
    accuracyScore: 3,
    supportScore: 3,
    futureUseScore: 3,
    suggestion: ""
  },
  {
    timestamp: "7/4/2026, 11:58:07",
    position: "ผู้ช่วยพยาบาล",
    experience: "มากกว่า 10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "ทบทวนความรู้ทั่วไป",
    convenienceScore: 4,
    impressionScore: 5,
    accuracyScore: 4,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "8/4/2026, 10:35:18",
    position: "ผู้ช่วยพยาบาล",
    experience: "มากกว่า 10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ข้อมูล HR การลา",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: "พัฒนาต่อไป"
  },
  {
    timestamp: "9/4/2026, 3:45:42",
    position: "พยาบาลวิชาชีพ",
    experience: "4-10 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "แนวปฎิบัติทั่วไป, ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  },
  {
    timestamp: "12/4/2026, 21:13:46",
    position: "พยาบาลวิชาชีพ",
    experience: "1-3 ปี",
    hasUsed: "เคยใช้งาน",
    topicsUsed: "ข้อมูล HR การลา, ทบทวนความรู้ทั่วไป",
    convenienceScore: 5,
    impressionScore: 5,
    accuracyScore: 5,
    supportScore: 5,
    futureUseScore: 5,
    suggestion: ""
  }
];

export const getAllFeedbacks = (): FeedbackEntry[] => {
  try {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (stored) {
      const parsed: FeedbackEntry[] = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Default to seed data
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(SEED_FEEDBACKS));
    return SEED_FEEDBACKS;
  } catch (e) {
    console.error("Error reading feedbacks", e);
    return SEED_FEEDBACKS;
  }
};

export const submitFeedback = async (entry: Omit<FeedbackEntry, 'timestamp'>): Promise<{ success: boolean; message: string }> => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear() + 543; // Buddhist Era or standard: "8/10/2026, 15:48:49"
  const timeStr = `${day}/${month}/${year}, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const newEntry: FeedbackEntry = {
    ...entry,
    timestamp: timeStr
  };

  // 1. Save locally in localStorage
  try {
    const current = getAllFeedbacks();
    const updated = [newEntry, ...current];
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed saving feedback to localStorage", e);
  }

  // 2. Send to Google Sheet if Google Apps Script URL is set
  const scriptUrl = getStoredScriptUrl();
  if (scriptUrl) {
    try {
      // POST with mode: no-cors or standard urlencoded formData
      const formData = new URLSearchParams();
      formData.append('Timestamp', newEntry.timestamp);
      formData.append('ตำแหน่ง', newEntry.position);
      formData.append('อายุงาน', newEntry.experience);
      formData.append('เคยใช้งานหรือไม่', newEntry.hasUsed);
      formData.append('เรื่องที่ใช้งานมากที่สุด', newEntry.topicsUsed);
      formData.append('ความสะดวก (ข้อ 5)', newEntry.convenienceScore.toString());
      formData.append('ความประทับใจ (ข้อ 6)', newEntry.impressionScore.toString());
      formData.append('ความถูกต้อง (ข้อ 7)', newEntry.accuracyScore.toString());
      formData.append('การสนับสนุน (ข้อ 8)', newEntry.supportScore.toString());
      formData.append('การใช้ในอนาคต (ข้อ 9)', newEntry.futureUseScore.toString());
      formData.append('ข้อเสนอแนะ', newEntry.suggestion);

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });
      return { success: true, message: 'บันทึกลงใน Google Sheet และระบบสำเร็จแล้วค่ะ 💖' };
    } catch (err) {
      console.warn("Could not post to Google Script URL, saved locally", err);
      return { success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้วค่ะ (จัดเก็บในระบบเรียบร้อย)' };
    }
  }

  return { success: true, message: 'บันทึกแบบประเมินและข้อเสนอแนะเรียบร้อยแล้วค่ะ ขอบคุณมากนะคะ 💖' };
};

// Generates Google Apps Script code snippet for the user to paste into their Google Sheet Extensions -> Apps Script
export const GOOGLE_APPS_SCRIPT_SAMPLE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var p = e.parameter;
    
    // Header format:
    // Timestamp,ตำแหน่ง,อายุงาน,เคยใช้งานหรือไม่,เรื่องที่ใช้งานมากที่สุด,ความสะดวก (ข้อ 5),ความประทับใจ (ข้อ 6),ความถูกต้อง (ข้อ 7),การสนับสนุน (ข้อ 8),การใช้ในอนาคต (ข้อ 9),ข้อเสนอแนะ
    sheet.appendRow([
      p['Timestamp'] || Utilities.formatDate(new Date(), "Asia/Bangkok", "d/M/yyyy, HH:mm:ss"),
      p['ตำแหน่ง'] || '',
      p['อายุงาน'] || '',
      p['เคยใช้งานหรือไม่'] || '',
      p['เรื่องที่ใช้งานมากที่สุด'] || '',
      p['ความสะดวก (ข้อ 5)'] || '',
      p['ความประทับใจ (ข้อ 6)'] || '',
      p['ความถูกต้อง (ข้อ 7)'] || '',
      p['การสนับสนุน (ข้อ 8)'] || '',
      p['การใช้ในอนาคต (ข้อ 9)'] || '',
      p['ข้อเสนอแนะ'] || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": error}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
