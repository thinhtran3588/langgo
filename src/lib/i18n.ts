export type Locale = 'en' | 'vi';
export type TranslationsMap = {
  en?: string;
  vi?: string;
};

export const supportedLocales: Locale[] = ['en', 'vi'];
export const defaultLocale: Locale = 'en';
export const localeStorageKey = 'langgo.locale';

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.main': 'Main',
    'nav.language': 'Language',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'nav.showItems': 'Show {label} items',
    'nav.hideItems': 'Hide {label} items',
    'home.welcome': 'Welcome',
    'home.title': 'Discover language courses tailored to your goals.',
    'home.subtitle':
      'Pick a course from the menu to get started. Lessons are organized by level so you can build confidence step by step.',
    'home.startLearning': 'Start learning today.',
    'home.coursesComing': 'Courses coming soon',
    'home.coursesComingDesc': 'Check back later for new language lessons.',
    'languages.title': 'Languages',
    'languages.heading': 'All courses',
    'languages.desc': 'Choose a language to see levels and lessons.',
    'language.coursesHeading': '{language} courses',
    'language.coursesLabel': 'Courses',
    'language.levelsHeading': 'Levels',
    'language.allLanguagesHeading': 'All languages',
    'level.lessonsHeading': '{level} lessons',
    'level.lessonsLabel': 'Lessons',
    'level.levelsInLanguage': 'Levels in {language}',
    'lesson.items': '{count} items',
    'lesson.word': 'Word',
    'lesson.pronunciation': 'Pronunciation',
    'lesson.type': 'Type',
    'lesson.translation': 'Translation',
    'lesson.noNewWords': 'No new words available for this lesson yet.',
    'lesson.noDialogs': 'No dialogs available for this lesson yet.',
    'lesson.noGrammar': 'No grammar notes available for this lesson yet.',
    'lesson.dialogFallback': 'Dialog {number}',
    'lesson.tab.newWords': 'New Words',
    'lesson.tab.dialogs': 'Dialogs',
    'lesson.tab.grammar': 'Grammar',
    'lesson.tab.practice': 'Practice',
    'lesson.tab.games': 'Games',
    'games.backToGames': 'Back to games',
    'games.title': 'Games',
    'games.subtitle': 'Choose a game to practice this lesson.',
    'games.flashcard': 'Flashcard',
    'games.flashcardDesc': 'Flip cards, reveal details, and rate your recall.',
    'games.multipleChoice': 'Multiple choice',
    'games.multipleChoiceDesc': 'Pick the correct word from four options.',
    'games.playNow': 'Play now',
    'flashcard.addWords': 'Add new words to play flashcards.',
    'flashcard.completeTitle': 'Nice work!',
    'flashcard.completeBody': 'You reviewed every flashcard.',
    'flashcard.retry': 'Retry',
    'flashcard.clearSavedData': 'Clear saved data',
    'flashcard.goBack': 'Go back',
    'flashcard.title': 'Flashcard',
    'flashcard.pronunciation': 'Pronunciation',
    'flashcard.type': 'Type',
    'flashcard.translation': 'Translation',
    'flashcard.revealAnswer': 'Reveal answer',
    'flashcard.howWell': 'How well did you know this?',
    'flashcard.cards': '{count} cards',
    'flashcard.reviewed': '{count} reviewed',
    'flashcard.example': 'Example',
    'mc.addWords': 'Add at least 4 new words to play multiple choice.',
    'mc.unable': 'Unable to build questions for this lesson.',
    'mc.completeTitle': 'Great run!',
    'mc.completeBody': 'You answered {correct} out of {total} questions.',
    'mc.playAgain': 'Play again',
    'mc.title': 'Multiple Choice',
    'mc.choose': 'Choose the matching word.',
    'mc.questionCount': 'Question {current} of {total}',
    'mc.correctCount': '{count} correct',
    'mc.correct': 'Correct!',
    'mc.incorrect': 'Not quite.',
    'mc.finish': 'Finish',
    'mc.next': 'Next',
    'languageText.showDetails': 'Show details',
    'languageText.hideDetails': 'Hide details',
    'about.title': 'About Langgo',
    'about.body':
      'Langgo is a simple learning space for structured language lessons. Navigate through the course menu to find each lesson.',
  },
  vi: {
    'nav.home': 'Trang chủ',
    'nav.about': 'Giới thiệu',
    'nav.main': 'Chính',
    'nav.language': 'Ngôn ngữ',
    'nav.openMenu': 'Mở menu',
    'nav.closeMenu': 'Đóng menu',
    'nav.showItems': 'Hiện mục {label}',
    'nav.hideItems': 'Ẩn mục {label}',
    'home.welcome': 'Chào mừng',
    'home.title':
      'Khám phá các khóa học ngôn ngữ phù hợp với mục tiêu của bạn.',
    'home.subtitle':
      'Chọn một khóa học từ menu để bắt đầu. Bài học được sắp xếp theo cấp độ để bạn tự tin tiến bộ từng bước.',
    'home.startLearning': 'Bắt đầu học ngay hôm nay.',
    'home.coursesComing': 'Khóa học sắp có',
    'home.coursesComingDesc': 'Quay lại sau để xem các bài học mới.',
    'languages.title': 'Ngôn ngữ',
    'languages.heading': 'Tất cả khóa học',
    'languages.desc': 'Chọn một ngôn ngữ để xem các cấp độ và bài học.',
    'language.coursesHeading': 'Khóa học {language}',
    'language.coursesLabel': 'Giáo trình',
    'language.levelsHeading': 'Cấp độ',
    'language.allLanguagesHeading': 'Tất cả ngôn ngữ',
    'level.lessonsHeading': 'Bài học {level}',
    'level.lessonsLabel': 'Bài học',
    'level.levelsInLanguage': 'Các cấp độ trong {language}',
    'lesson.items': '{count} mục',
    'lesson.word': 'Từ vựng',
    'lesson.pronunciation': 'Phiên âm',
    'lesson.type': 'Loại từ',
    'lesson.translation': 'Dịch nghĩa',
    'lesson.noNewWords': 'Chưa có từ mới cho bài học này.',
    'lesson.noDialogs': 'Chưa có hội thoại cho bài học này.',
    'lesson.noGrammar': 'Chưa có ghi chú ngữ pháp cho bài học này.',
    'lesson.dialogFallback': 'Hội thoại {number}',
    'lesson.tab.newWords': 'Từ mới',
    'lesson.tab.dialogs': 'Hội thoại',
    'lesson.tab.grammar': 'Ngữ pháp',
    'lesson.tab.practice': 'Luyện tập',
    'lesson.tab.games': 'Trò chơi',
    'games.backToGames': 'Quay lại trò chơi',
    'games.title': 'Trò chơi',
    'games.subtitle': 'Chọn một trò chơi để luyện tập bài này.',
    'games.flashcard': 'Thẻ ghi nhớ',
    'games.flashcardDesc': 'Lật thẻ, xem chi tiết và đánh giá mức độ nhớ.',
    'games.multipleChoice': 'Trắc nghiệm',
    'games.multipleChoiceDesc': 'Chọn từ đúng trong bốn đáp án.',
    'games.playNow': 'Chơi ngay',
    'flashcard.addWords': 'Thêm từ mới để chơi thẻ ghi nhớ.',
    'flashcard.completeTitle': 'Làm tốt!',
    'flashcard.completeBody': 'Bạn đã xem hết tất cả thẻ.',
    'flashcard.retry': 'Làm lại',
    'flashcard.clearSavedData': 'Xóa dữ liệu đã lưu',
    'flashcard.goBack': 'Quay lại',
    'flashcard.title': 'Thẻ ghi nhớ',
    'flashcard.pronunciation': 'Phiên âm',
    'flashcard.type': 'Loại từ',
    'flashcard.translation': 'Dịch nghĩa',
    'flashcard.revealAnswer': 'Hiện đáp án',
    'flashcard.howWell': 'Bạn nhớ từ này thế nào?',
    'flashcard.cards': '{count} thẻ',
    'flashcard.reviewed': 'Đã ôn {count}',
    'flashcard.example': 'Ví dụ',
    'mc.addWords': 'Thêm ít nhất 4 từ mới để chơi trắc nghiệm.',
    'mc.unable': 'Không thể tạo câu hỏi cho bài học này.',
    'mc.completeTitle': 'Lượt chơi tuyệt vời!',
    'mc.completeBody': 'Bạn trả lời đúng {correct} trên {total} câu.',
    'mc.playAgain': 'Chơi lại',
    'mc.title': 'Trắc nghiệm',
    'mc.choose': 'Chọn từ phù hợp.',
    'mc.questionCount': 'Câu {current}/{total}',
    'mc.correctCount': '{count} đúng',
    'mc.correct': 'Đúng rồi!',
    'mc.incorrect': 'Chưa đúng.',
    'mc.finish': 'Kết thúc',
    'mc.next': 'Tiếp',
    'languageText.showDetails': 'Hiện chi tiết',
    'languageText.hideDetails': 'Ẩn chi tiết',
    'about.title': 'Giới thiệu Langgo',
    'about.body':
      'Langgo là một không gian học tập đơn giản dành cho các bài học ngôn ngữ có cấu trúc. Hãy điều hướng qua menu khóa học để tìm từng bài học.',
  },
};

export const formatMessage = (
  template: string,
  values?: Record<string, string | number>
) => {
  if (!values) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = values[key as keyof typeof values];
    return value === undefined ? match : String(value);
  });
};

export const resolveTranslation = (
  translations: TranslationsMap | undefined,
  locale: Locale
) => {
  if (!translations) {
    return undefined;
  }
  const localeValue = translations[locale]?.trim();
  if (localeValue) {
    return localeValue;
  }
  const defaultValue = translations[defaultLocale]?.trim();
  if (defaultValue) {
    return defaultValue;
  }
  const fallbackValue =
    translations.vi?.trim() ??
    translations.en?.trim() ??
    Object.values(translations)
      .map((value) => value?.trim())
      .find((value) => value);
  return fallbackValue ?? undefined;
};
