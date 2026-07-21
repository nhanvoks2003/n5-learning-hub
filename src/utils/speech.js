export const speakJapanese = (text) => {
  if (!('speechSynthesis' in window)) {
    alert('Trình duyệt của bạn không hỗ trợ tính năng Web Speech API.');
    return;
  }

  // Dừng các câu nói trước đó nếu đang phát dở
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.85; // Tốc độ đọc 0.85x chuẩn người học JLPT

  // Lấy danh sách giọng đọc của trình duyệt và ưu tiên chọn giọng Nhật
  const voices = window.speechSynthesis.getVoices();
  const japaneseVoice = voices.find(
    (voice) => voice.lang === 'ja-JP' || voice.lang.startsWith('ja')
  );

  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }

  window.speechSynthesis.speak(utterance);
};