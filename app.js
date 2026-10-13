/**
 * Infosys FA2 Cloud Examination Application Logic
 * Full exam lifecycle: Setup, Shuffling, Interactive Testing, Strict Evaluation, Review
 */

// Application State
const state = {
  questions: [],          // Active questions array (shuffled or original)
  currentIndex: 0,        // Current active question index (0..26)
  userAnswers: {},        // Map: questionIndex -> Array of selected option IDs (e.g. ['A'], ['A', 'B'])
  reviewFlags: {},        // Map: questionIndex -> boolean
  visitedFlags: {},       // Map: questionIndex -> boolean
  timerInterval: null,    // Timer interval handle
  remainingSeconds: 2400, // 40 Minutes default (2400 seconds)
  totalDuration: 2400,    // Total set duration (40 mins)
  startTime: null,        // Start timestamp
  isSubmitted: false,     // Flag indicating submission
  randomize: true,        // Order shuffle flag
  proctoringArmed: false, // Flag when full-screen/tab-switch detection is active
  violationTriggered: false, // Flag if auto-submitted due to tab switch or blur
  violationReason: '',    // Violation explanation
  reviewFilter: 'all',    // Review filter: all | correct | incorrect | unanswered
  evaluationResults: null // Cached evaluation calculations
};

// DOM Element Selectors
const elements = {
  // Screens
  dashboardScreen: document.getElementById('dashboard-screen'),
  examScreen: document.getElementById('exam-screen'),
  resultsScreen: document.getElementById('results-screen'),
  submitModal: document.getElementById('submit-modal'),

  // Header
  headerStatusPill: document.getElementById('header-status-pill'),
  headerStatusText: document.getElementById('header-status-text'),
  headerTopTimer: document.getElementById('header-top-timer'),
  headerTimerVal: document.getElementById('header-timer-val'),
  themeToggleBtn: document.getElementById('theme-toggle'),

  // Dashboard Controls
  configRandomize: document.getElementById('config-randomize'),
  configDuration: document.getElementById('config-duration'),
  startExamBtn: document.getElementById('start-exam-btn'),

  // Active Exam Toolbar
  currentSectionBadge: document.getElementById('current-section-badge'),
  proctorIndicator: document.getElementById('proctor-indicator'),
  timerDisplay: document.getElementById('timer-display'),
  timeLeftText: document.getElementById('time-left-text'),
  toolbarSubmitBtn: document.getElementById('toolbar-submit-btn'),

  // Active Question Card
  questionIndexBadge: document.getElementById('question-index-badge'),
  questionTypeBadge: document.getElementById('question-type-badge'),
  questionMarksBadge: document.getElementById('question-marks-badge'),
  questionNegBadge: document.getElementById('question-neg-badge'),
  questionTitle: document.getElementById('question-title'),
  questionText: document.getElementById('question-text'),
  instructionText: document.getElementById('instruction-text'),
  optionsContainer: document.getElementById('options-container'),

  // Action Buttons
  markReviewBtn: document.getElementById('mark-review-btn'),
  markReviewText: document.getElementById('mark-review-text'),
  clearAnswerBtn: document.getElementById('clear-answer-btn'),
  prevQuestionBtn: document.getElementById('prev-question-btn'),
  nextQuestionBtn: document.getElementById('next-question-btn'),

  // Palette Elements
  paletteProgress: document.getElementById('palette-progress'),
  paletteGrid: document.getElementById('palette-grid'),
  legendAnsweredCount: document.getElementById('legend-answered-count'),
  legendNotAnsweredCount: document.getElementById('legend-not-answered-count'),
  legendReviewCount: document.getElementById('legend-review-count'),
  legendNotVisitedCount: document.getElementById('legend-not-visited-count'),
  paletteSubmitBtn: document.getElementById('palette-submit-btn'),

  // Submission Modal
  modalAnsweredCount: document.getElementById('modal-answered-count'),
  modalUnansweredCount: document.getElementById('modal-unanswered-count'),
  modalReviewCount: document.getElementById('modal-review-count'),
  modalUnansweredWarning: document.getElementById('modal-unanswered-warning'),
  modalWarningText: document.getElementById('modal-warning-text'),
  modalCancelBtnX: document.getElementById('modal-cancel-btn-x'),
  modalBackBtn: document.getElementById('modal-back-btn'),
  modalConfirmBtn: document.getElementById('modal-confirm-btn'),

  // Results Screen Elements
  resultStatusBadge: document.getElementById('result-status-badge'),
  resultUserSummary: document.getElementById('result-user-summary'),
  resultDateTag: document.getElementById('result-date-tag'),
  resultTimeTakenTag: document.getElementById('result-time-taken-tag'),
  scoreCircleBar: document.getElementById('score-circle-bar'),
  scoreFinalVal: document.getElementById('score-final-val'),
  scorePctText: document.getElementById('score-pct-text'),

  metricMarksEarned: document.getElementById('metric-marks-earned'),
  metricNegativeMarks: document.getElementById('metric-negative-marks'),
  metricCorrectCount: document.getElementById('metric-correct-count'),
  metricIncorrectCount: document.getElementById('metric-incorrect-count'),
  metricUnansweredCount: document.getElementById('metric-unanswered-count'),
  metricAccuracyVal: document.getElementById('metric-accuracy-val'),

  sectionBreakdownTbody: document.getElementById('section-breakdown-tbody'),
  reviewCardsList: document.getElementById('review-cards-list'),
  filterCntCorrect: document.getElementById('filter-cnt-correct'),
  filterCntIncorrect: document.getElementById('filter-cnt-incorrect'),
  filterCntUnanswered: document.getElementById('filter-cnt-unanswered'),
  retakeExamBtn: document.getElementById('retake-exam-btn'),
  printResultBtn: document.getElementById('print-result-btn'),

  // Proctor Violation Banner
  proctorViolationBanner: document.getElementById('proctor-violation-banner'),
  violationReasonText: document.getElementById('violation-reason-text')
};

// --- Initialization ---
function initApp() {
  setupTheme();
  setupEventListeners();
  setupProctoringListeners();
  updatePaletteTabs();
}

// --- Theme Management ---
function setupTheme() {
  const savedTheme = localStorage.getItem('fa2_exam_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }

  elements.themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('fa2_exam_theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('fa2_exam_theme', 'dark');
    }
  });
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  // Start Exam
  elements.startExamBtn.addEventListener('click', startExamination);

  // Exam Navigation
  elements.prevQuestionBtn.addEventListener('click', goToPreviousQuestion);
  elements.nextQuestionBtn.addEventListener('click', goToNextQuestion);
  elements.clearAnswerBtn.addEventListener('click', clearCurrentAnswer);
  elements.markReviewBtn.addEventListener('click', toggleMarkForReview);

  // Submit Triggers
  elements.toolbarSubmitBtn.addEventListener('click', openSubmitModal);
  elements.paletteSubmitBtn.addEventListener('click', openSubmitModal);

  // Modal Controls
  elements.modalCancelBtnX.addEventListener('click', closeSubmitModal);
  elements.modalBackBtn.addEventListener('click', closeSubmitModal);
  elements.modalConfirmBtn.addEventListener('click', () => {
    closeSubmitModal();
    submitExamination(false);
  });

  // Results Controls
  elements.retakeExamBtn.addEventListener('click', resetToDashboard);
  elements.printResultBtn.addEventListener('click', () => window.print());

  // Review Filters
  const filterBtns = document.querySelectorAll('.filter-pill');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.reviewFilter = btn.getAttribute('data-filter');
      renderReviewCards();
    });
  });

  // Palette Section Tabs
  const paletteTabs = document.querySelectorAll('.palette-tab');
  paletteTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      paletteTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const section = tab.getAttribute('data-section');
      filterPaletteButtons(section);
    });
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', handleKeyboardNavigation);
}

// --- Keyboard Navigation ---
function handleKeyboardNavigation(e) {
  if (state.isSubmitted || elements.examScreen.classList.contains('hidden')) {
    return;
  }
  // Ignore inside inputs or modals
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || !elements.submitModal.classList.contains('hidden')) {
    return;
  }

  const q = state.questions[state.currentIndex];
  if (!q) return;

  if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') {
    e.preventDefault();
    goToNextQuestion();
  } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') {
    e.preventDefault();
    goToPreviousQuestion();
  } else if (e.key.toLowerCase() === 'm') {
    e.preventDefault();
    toggleMarkForReview();
  } else if (e.key >= '1' && e.key <= '4') {
    // Select option 1, 2, 3, 4
    const optIndex = parseInt(e.key, 10) - 1;
    if (optIndex < q.options.length) {
      e.preventDefault();
      const optionId = q.options[optIndex].id;
      handleOptionSelect(optionId);
    }
  }
}

// --- Full-Screen Mode Management ---
function requestFullscreenMode() {
  const docEl = document.documentElement;
  try {
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(err => console.log('Fullscreen request intercepted by browser permissions:', err));
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
  } catch (err) {
    console.warn('Fullscreen invocation error:', err);
  }
}

function exitFullscreenMode() {
  try {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.log('Exit fullscreen error:', err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  } catch (err) {
    console.warn('Exit fullscreen invocation error:', err);
  }
}

// --- Anti-Cheating & Proctoring Listeners ---
function setupProctoringListeners() {
  // 1. Detect tab switch or window minimization
  document.addEventListener('visibilitychange', () => {
    if (!state.proctoringArmed || state.isSubmitted || elements.examScreen.classList.contains('hidden')) return;
    if (document.hidden || document.visibilityState === 'hidden') {
      triggerProctorViolation('Tab switch or browser minimization detected.');
    }
  });

  // 2. Detect switching to any other application (Alt+Tab, window blur, external app opened)
  window.addEventListener('blur', () => {
    if (!state.proctoringArmed || state.isSubmitted || elements.examScreen.classList.contains('hidden')) return;
    triggerProctorViolation('Focus lost: Window blurred or switched to another application.');
  });

  // 3. Detect exiting full-screen mode during active test
  const handleFsChange = () => {
    if (!state.proctoringArmed || state.isSubmitted || elements.examScreen.classList.contains('hidden')) return;
    const isStillFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    if (!isStillFullscreen) {
      triggerProctorViolation('Full-screen mode was exited during the active examination.');
    }
  };

  document.addEventListener('fullscreenchange', handleFsChange);
  document.addEventListener('webkitfullscreenchange', handleFsChange);
  document.addEventListener('mozfullscreenchange', handleFsChange);
  document.addEventListener('MSFullscreenChange', handleFsChange);
}

function armProctoring() {
  state.proctoringArmed = false;
  // Grace period of 1.8 seconds to allow full-screen permission transitions
  setTimeout(() => {
    if (!state.isSubmitted && !elements.examScreen.classList.contains('hidden')) {
      state.proctoringArmed = true;
    }
  }, 1800);
}

function triggerProctorViolation(reason) {
  if (state.isSubmitted) return;
  state.proctoringArmed = false;
  state.violationTriggered = true;
  state.violationReason = reason;

  // Exit fullscreen cleanly
  exitFullscreenMode();

  // Auto-submit examination immediately due to security violation
  submitExamination(false, true);
}

// --- Start Examination Workflow ---
function startExamination() {
  state.randomize = elements.configRandomize.checked;
  const durationVal = parseInt(elements.configDuration.value, 10);
  state.totalDuration = durationVal;
  state.remainingSeconds = durationVal;
  state.startTime = new Date();
  state.isSubmitted = false;
  state.violationTriggered = false;
  state.violationReason = '';
  state.currentIndex = 0;
  state.userAnswers = {};
  state.reviewFlags = {};
  state.visitedFlags = {};

  // Request Full-Screen Mode
  requestFullscreenMode();

  // Clone Question Bank
  let preparedQuestions = JSON.parse(JSON.stringify(QUESTION_BANK));

  if (state.randomize) {
    // Shuffle Questions order using Fisher-Yates
    for (let i = preparedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [preparedQuestions[i], preparedQuestions[j]] = [preparedQuestions[j], preparedQuestions[i]];
    }
  }

  state.questions = preparedQuestions;

  // Mark first question as visited
  state.visitedFlags[0] = true;

  // Switch Screens
  elements.dashboardScreen.classList.add('hidden');
  elements.resultsScreen.classList.add('hidden');
  elements.examScreen.classList.remove('hidden');

  // Show Top-Right Header Timer & Update Header Status
  if (elements.headerTopTimer) {
    elements.headerTopTimer.classList.remove('hidden');
  }
  elements.headerStatusText.textContent = "Examination in Progress (Proctored)";
  elements.headerStatusPill.style.borderColor = "var(--primary)";

  // Start Timer
  startTimer();

  // Arm anti-cheating proctoring after initial transition
  armProctoring();

  // Render question & palette
  renderQuestion(0);
  buildPaletteGrid();
  updatePaletteStats();
}

// --- Timer System ---
function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);

  if (state.totalDuration === 0) {
    // Untimed mode
    elements.timeLeftText.textContent = "Untimed";
    if (elements.headerTimerVal) elements.headerTimerVal.textContent = "Untimed";
    elements.timerDisplay.classList.remove('timer-warning');
    if (elements.headerTopTimer) elements.headerTopTimer.classList.remove('timer-warning');
    return;
  }

  updateTimerDisplay();

  state.timerInterval = setInterval(() => {
    state.remainingSeconds--;

    if (state.remainingSeconds <= 0) {
      clearInterval(state.timerInterval);
      state.remainingSeconds = 0;
      updateTimerDisplay();
      alert("Time is up! Your examination will be submitted automatically.");
      submitExamination(true, false);
      return;
    }

    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  if (state.totalDuration === 0) return;

  const minutes = Math.floor(state.remainingSeconds / 60);
  const seconds = state.remainingSeconds % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Update both top-right timer in toolbar and top-right timer in sticky header
  elements.timeLeftText.textContent = timeString;
  if (elements.headerTimerVal) {
    elements.headerTimerVal.textContent = timeString;
  }

  // Warn if under 5 minutes (300 seconds)
  if (state.remainingSeconds <= 300) {
    elements.timerDisplay.classList.add('timer-warning');
    if (elements.headerTopTimer) elements.headerTopTimer.classList.add('timer-warning');
  } else {
    elements.timerDisplay.classList.remove('timer-warning');
    if (elements.headerTopTimer) elements.headerTopTimer.classList.remove('timer-warning');
  }
}

// --- Render Current Question ---
function renderQuestion(index) {
  state.currentIndex = index;
  state.visitedFlags[index] = true;

  const q = state.questions[index];
  if (!q) return;

  // Question Info
  elements.questionIndexBadge.textContent = `Question ${index + 1} of ${state.questions.length}`;
  elements.questionTitle.textContent = `Q${q.id}. ${q.title}`;
  elements.questionText.textContent = q.text;
  elements.currentSectionBadge.textContent = q.section.split(':')[0];

  // Badges
  if (q.type === 'single') {
    elements.questionTypeBadge.textContent = "Single-select (Radio)";
    elements.instructionText.textContent = "Choose exactly one option below.";
  } else {
    elements.questionTypeBadge.textContent = "Multiple-select (Checkboxes)";
    elements.instructionText.textContent = "Select one or both of the available options.";
  }

  elements.questionMarksBadge.textContent = `+${q.marks.toFixed(1)} Mark${q.marks > 1 ? 's' : ''}`;
  elements.questionNegBadge.textContent = `−${q.negativeMarks.toFixed(2)} on wrong`;

  // Render Options
  renderOptions(q, index);

  // Mark for review button state
  const isMarked = !!state.reviewFlags[index];
  if (isMarked) {
    elements.markReviewBtn.classList.add('active');
    elements.markReviewText.textContent = "Marked for Review";
  } else {
    elements.markReviewBtn.classList.remove('active');
    elements.markReviewText.textContent = "Mark for Review";
  }

  // Update Next/Previous buttons
  elements.prevQuestionBtn.disabled = (index === 0);
  if (index === state.questions.length - 1) {
    elements.nextQuestionBtn.innerHTML = `<span>Review & Finish</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
  } else {
    elements.nextQuestionBtn.innerHTML = `<span>Save & Next</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
  }

  // Highlight active button in palette
  updateActivePaletteButton(index);
  updatePaletteStats();
}

// --- Render Question Options ---
function renderOptions(q, questionIndex) {
  elements.optionsContainer.innerHTML = '';
  const currentSelections = state.userAnswers[questionIndex] || [];

  q.options.forEach((opt, idx) => {
    const isSelected = currentSelections.includes(opt.id);
    const optionItem = document.createElement('div');
    optionItem.className = `option-item ${q.type === 'single' ? 'radio' : 'checkbox'} ${isSelected ? 'selected' : ''}`;
    optionItem.setAttribute('data-opt-id', opt.id);
    optionItem.setAttribute('role', q.type === 'single' ? 'radio' : 'checkbox');
    optionItem.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    optionItem.tabIndex = 0;

    // Indicator label (e.g. A, B, C, D)
    const indicator = document.createElement('div');
    indicator.className = 'option-indicator';
    indicator.textContent = opt.id;

    // Option text
    const content = document.createElement('div');
    content.className = 'option-content';
    content.textContent = opt.text;

    optionItem.appendChild(indicator);
    optionItem.appendChild(content);

    // Click handler
    optionItem.addEventListener('click', () => {
      handleOptionSelect(opt.id);
    });

    // Enter/Space key support
    optionItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOptionSelect(opt.id);
      }
    });

    elements.optionsContainer.appendChild(optionItem);
  });
}

// --- Handle Selection ---
function handleOptionSelect(optId) {
  const q = state.questions[state.currentIndex];
  if (!q) return;

  let currentSelections = state.userAnswers[state.currentIndex] ? [...state.userAnswers[state.currentIndex]] : [];

  if (q.type === 'single') {
    // Single-select: radio behavior
    currentSelections = [optId];
  } else {
    // Multiple-select: checkbox toggle
    if (currentSelections.includes(optId)) {
      currentSelections = currentSelections.filter(id => id !== optId);
    } else {
      currentSelections.push(optId);
    }
  }

  state.userAnswers[state.currentIndex] = currentSelections;
  renderOptions(q, state.currentIndex);
  updatePaletteButtonStatus(state.currentIndex);
  updatePaletteStats();
}

// --- Clear Answer ---
function clearCurrentAnswer() {
  delete state.userAnswers[state.currentIndex];
  const q = state.questions[state.currentIndex];
  renderOptions(q, state.currentIndex);
  updatePaletteButtonStatus(state.currentIndex);
  updatePaletteStats();
}

// --- Toggle Mark for Review ---
function toggleMarkForReview() {
  state.reviewFlags[state.currentIndex] = !state.reviewFlags[state.currentIndex];
  const isMarked = state.reviewFlags[state.currentIndex];

  if (isMarked) {
    elements.markReviewBtn.classList.add('active');
    elements.markReviewText.textContent = "Marked for Review";
  } else {
    elements.markReviewBtn.classList.remove('active');
    elements.markReviewText.textContent = "Mark for Review";
  }

  updatePaletteButtonStatus(state.currentIndex);
  updatePaletteStats();
}

// --- Navigation ---
function goToPreviousQuestion() {
  if (state.currentIndex > 0) {
    renderQuestion(state.currentIndex - 1);
  }
}

function goToNextQuestion() {
  if (state.currentIndex < state.questions.length - 1) {
    renderQuestion(state.currentIndex + 1);
  } else {
    openSubmitModal();
  }
}

// --- Palette Grid Construction ---
function buildPaletteGrid() {
  elements.paletteGrid.innerHTML = '';

  state.questions.forEach((q, idx) => {
    const btn = document.createElement('button');
    btn.className = 'palette-btn not-visited';
    btn.id = `palette-btn-${idx}`;
    btn.textContent = idx + 1;
    btn.title = `Q${idx + 1}: ${q.title}`;

    // Tag section for filtering
    let secClass = 'sec-a';
    if (q.marks === 2) secClass = 'sec-b';
    if (q.marks === 3) secClass = 'sec-c';
    btn.setAttribute('data-sec', secClass);

    btn.addEventListener('click', () => {
      renderQuestion(idx);
    });

    elements.paletteGrid.appendChild(btn);
  });

  updatePaletteButtonStatus(0);
}

function updateActivePaletteButton(index) {
  const allBtns = elements.paletteGrid.querySelectorAll('.palette-btn');
  allBtns.forEach(b => b.classList.remove('current'));

  const activeBtn = document.getElementById(`palette-btn-${index}`);
  if (activeBtn) {
    activeBtn.classList.add('current');
    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function updatePaletteButtonStatus(index) {
  const btn = document.getElementById(`palette-btn-${index}`);
  if (!btn) return;

  const isAnswered = state.userAnswers[index] && state.userAnswers[index].length > 0;
  const isMarked = !!state.reviewFlags[index];
  const isVisited = !!state.visitedFlags[index];

  btn.classList.remove('answered', 'not-answered', 'review', 'not-visited');

  if (isMarked) {
    btn.classList.add('review');
  } else if (isAnswered) {
    btn.classList.add('answered');
  } else if (isVisited) {
    btn.classList.add('not-answered');
  } else {
    btn.classList.add('not-visited');
  }
}

function updatePaletteStats() {
  let answered = 0;
  let notAnswered = 0;
  let review = 0;
  let notVisited = 0;

  state.questions.forEach((_, idx) => {
    const isAns = state.userAnswers[idx] && state.userAnswers[idx].length > 0;
    const isRev = !!state.reviewFlags[idx];
    const isVis = !!state.visitedFlags[idx];

    if (isRev) {
      review++;
    } else if (isAns) {
      answered++;
    } else if (isVis) {
      notAnswered++;
    } else {
      notVisited++;
    }
  });

  // Total answered regardless of review
  let totalAttempted = 0;
  Object.keys(state.userAnswers).forEach(k => {
    if (state.userAnswers[k] && state.userAnswers[k].length > 0) totalAttempted++;
  });

  elements.paletteProgress.textContent = `${totalAttempted} of ${state.questions.length} Answered`;
  elements.legendAnsweredCount.textContent = answered;
  elements.legendNotAnsweredCount.textContent = notAnswered;
  elements.legendReviewCount.textContent = review;
  elements.legendNotVisitedCount.textContent = notVisited;
}

function filterPaletteButtons(section) {
  const btns = elements.paletteGrid.querySelectorAll('.palette-btn');
  btns.forEach(btn => {
    if (section === 'all' || btn.getAttribute('data-sec') === section) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  });
}

function updatePaletteTabs() {
  // Setup tabs initially
}

// --- Submit Modal Handling ---
function openSubmitModal() {
  let answered = 0;
  let review = 0;

  state.questions.forEach((_, idx) => {
    if (state.userAnswers[idx] && state.userAnswers[idx].length > 0) answered++;
    if (state.reviewFlags[idx]) review++;
  });

  const unanswered = state.questions.length - answered;

  elements.modalAnsweredCount.textContent = answered;
  elements.modalUnansweredCount.textContent = unanswered;
  elements.modalReviewCount.textContent = review;

  if (unanswered > 0) {
    elements.modalUnansweredWarning.classList.remove('hidden');
    elements.modalWarningText.textContent = `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Unanswered questions score 0 marks with no negative penalty.`;
  } else {
    elements.modalUnansweredWarning.classList.add('hidden');
  }

  elements.submitModal.classList.remove('hidden');
}

function closeSubmitModal() {
  elements.submitModal.classList.add('hidden');
}

// --- Examination Scoring & Submission ---
function submitExamination(isTimeout = false, isViolation = false) {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.isSubmitted = true;
  state.proctoringArmed = false;

  // Exit full screen
  exitFullscreenMode();

  // Hide Top-Right Header Timer
  if (elements.headerTopTimer) {
    elements.headerTopTimer.classList.add('hidden');
  }

  // Calculate elapsed time
  const elapsedSeconds = state.startTime ? Math.floor((new Date() - state.startTime) / 1000) : 0;
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedRemainder = elapsedSeconds % 60;
  const elapsedString = `${elapsedMinutes}m ${elapsedRemainder}s`;

  // Evaluate responses
  const results = evaluateAllResponses();
  state.evaluationResults = results;

  // Render Results Screen
  renderResultsScreen(results, elapsedString, isTimeout, isViolation || state.violationTriggered);

  // Switch Views
  elements.examScreen.classList.add('hidden');
  elements.resultsScreen.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update Header
  if (isViolation || state.violationTriggered) {
    elements.headerStatusText.textContent = "Auto-Submitted (Security Violation)";
    elements.headerStatusPill.style.borderColor = "var(--danger)";
  } else {
    elements.headerStatusText.textContent = "Evaluation Completed";
    elements.headerStatusPill.style.borderColor = "var(--success)";
  }
}

// --- Evaluation Logic Matching FA2 Examination Rules ---
function evaluateAllResponses() {
  let grossMarksEarned = 0;
  let grossNegativeMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const sectionStats = {
    secA: { name: "Section A (1-Mark)", totalQ: 18, maxMarks: 18, correct: 0, incorrect: 0, unanswered: 0, earned: 0, neg: 0 },
    secB: { name: "Section B (2-Marks)", totalQ: 5, maxMarks: 10, correct: 0, incorrect: 0, unanswered: 0, earned: 0, neg: 0 },
    secC: { name: "Section C (3-Marks)", totalQ: 4, maxMarks: 12, correct: 0, incorrect: 0, unanswered: 0, earned: 0, neg: 0 }
  };

  const detailedQuestions = [];

  state.questions.forEach((q, idx) => {
    const userChoice = state.userAnswers[idx] || [];
    const correctChoice = [...q.correct].sort();
    const sortedUserChoice = [...userChoice].sort();

    let status = 'unanswered'; // 'correct' | 'incorrect' | 'unanswered'
    let scoreForQ = 0;
    let earned = 0;
    let penalty = 0;

    // Identify Section key
    let secKey = 'secA';
    if (q.marks === 2) secKey = 'secB';
    if (q.marks === 3) secKey = 'secC';

    if (userChoice.length === 0) {
      // Unanswered question receives 0 marks
      status = 'unanswered';
      unansweredCount++;
      sectionStats[secKey].unanswered++;
    } else {
      // Check correctness:
      // Exact array match for single or multiple select
      const isMatch = (sortedUserChoice.length === correctChoice.length) &&
                      sortedUserChoice.every((val, index) => val === correctChoice[index]);

      if (isMatch) {
        status = 'correct';
        correctCount++;
        earned = q.marks;
        scoreForQ = q.marks;
        grossMarksEarned += q.marks;

        sectionStats[secKey].correct++;
        sectionStats[secKey].earned += q.marks;
      } else {
        // Full negative penalty applied for any wrong combination
        status = 'incorrect';
        incorrectCount++;
        penalty = q.negativeMarks;
        scoreForQ = -q.negativeMarks;
        grossNegativeMarks += q.negativeMarks;

        sectionStats[secKey].incorrect++;
        sectionStats[secKey].neg += q.negativeMarks;
      }
    }

    detailedQuestions.push({
      index: idx,
      originalId: q.id,
      title: q.title,
      text: q.text,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
      options: q.options,
      correct: q.correct,
      userChoice: userChoice,
      explanation: q.explanation,
      status: status,
      scoreForQ: scoreForQ,
      earned: earned,
      penalty: penalty
    });
  });

  // Calculate Net Score: Net = Marks earned - Negative marks
  const rawNetScore = grossMarksEarned - grossNegativeMarks;
  // Score cannot exceed maximum 40 marks; also clamp min at 0 for normalized scale
  const netScore = Math.max(0, Math.min(40, rawNetScore));
  const percentage = (netScore / 40) * 100;
  const isPassed = netScore >= 26; // Benchmark: 65% (26 / 40)

  const attemptedCount = correctCount + incorrectCount;
  const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;

  return {
    maxMarks: 40,
    grossMarksEarned,
    grossNegativeMarks,
    rawNetScore,
    netScore,
    percentage,
    isPassed,
    correctCount,
    incorrectCount,
    unansweredCount,
    attemptedCount,
    accuracy,
    sectionStats,
    detailedQuestions
  };
}

// --- Render Results Screen ---
function renderResultsScreen(results, elapsedString, isTimeout, isViolation = false) {
  // Proctor Violation Alert Banner
  if (isViolation && elements.proctorViolationBanner) {
    elements.proctorViolationBanner.classList.remove('hidden');
    if (elements.violationReasonText && state.violationReason) {
      elements.violationReasonText.textContent = state.violationReason;
    }
  } else if (elements.proctorViolationBanner) {
    elements.proctorViolationBanner.classList.add('hidden');
  }

  // Score Badge
  if (results.isPassed) {
    elements.resultStatusBadge.className = "result-badge passed";
    elements.resultStatusBadge.textContent = "PASSED · BENCHMARK CLEARED (≥65%)";
  } else {
    elements.resultStatusBadge.className = "result-badge failed";
    elements.resultStatusBadge.textContent = "NEEDS PRACTICE · BELOW 65% BENCHMARK";
  }

  // Meta Tags
  elements.resultDateTag.textContent = `Date: ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  elements.resultTimeTakenTag.textContent = `Time Taken: ${elapsedString}${isTimeout ? ' (Timeout)' : ''}`;

  // Summary Text
  elements.resultUserSummary.textContent = results.isPassed
    ? `Outstanding performance! You achieved ${results.netScore.toFixed(2)} out of 40 marks (${results.percentage.toFixed(1)}%), demonstrating high readiness for the Infosys FA2 Cloud certification.`
    : `You achieved ${results.netScore.toFixed(2)} out of 40 marks (${results.percentage.toFixed(1)}%). Review the detailed concept explanations below to strengthen your weak topics before your official exam.`;

  // Score Dial & Progress Ring
  elements.scoreFinalVal.textContent = results.netScore.toFixed(2);
  elements.scorePctText.textContent = `${results.percentage.toFixed(1)}% Score`;

  // Circle animation: circumference = 2 * PI * 52 ≈ 326.72
  const circumference = 326.72;
  const offset = circumference - (results.percentage / 100) * circumference;
  setTimeout(() => {
    elements.scoreCircleBar.style.strokeDashoffset = offset;
    elements.scoreCircleBar.style.stroke = results.isPassed ? "var(--success)" : "var(--primary)";
  }, 100);

  // Key Metrics
  elements.metricMarksEarned.textContent = `+${results.grossMarksEarned.toFixed(2)}`;
  elements.metricNegativeMarks.textContent = `−${results.grossNegativeMarks.toFixed(2)}`;
  elements.metricCorrectCount.textContent = results.correctCount;
  elements.metricIncorrectCount.textContent = results.incorrectCount;
  elements.metricUnansweredCount.textContent = results.unansweredCount;
  elements.metricAccuracyVal.textContent = `${results.accuracy.toFixed(1)}%`;

  // Filter Counts
  elements.filterCntCorrect.textContent = results.correctCount;
  elements.filterCntIncorrect.textContent = results.incorrectCount;
  elements.filterCntUnanswered.textContent = results.unansweredCount;

  // Section Breakdown Table
  renderSectionBreakdownTable(results.sectionStats);

  // Question Solutions Review
  renderReviewCards();
}

// --- Render Section Breakdown Table ---
function renderSectionBreakdownTable(sectionStats) {
  elements.sectionBreakdownTbody.innerHTML = '';

  Object.keys(sectionStats).forEach(key => {
    const sec = sectionStats[key];
    const net = Math.max(0, sec.earned - sec.neg);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${sec.name}</strong></td>
      <td>${sec.totalQ}</td>
      <td>${sec.maxMarks}</td>
      <td><span style="color:var(--success);font-weight:700;">${sec.correct}</span></td>
      <td><span style="color:var(--danger);font-weight:700;">${sec.incorrect}</span></td>
      <td><span style="color:var(--text-muted);">${sec.unanswered}</span></td>
      <td>+${sec.earned.toFixed(2)}</td>
      <td>−${sec.neg.toFixed(2)}</td>
      <td class="net-score-cell">${net.toFixed(2)}</td>
    `;
    elements.sectionBreakdownTbody.appendChild(row);
  });
}

// --- Render Question Solutions Review ---
function renderReviewCards() {
  if (!state.evaluationResults) return;

  elements.reviewCardsList.innerHTML = '';
  const filter = state.reviewFilter; // all | correct | incorrect | unanswered

  const filteredQuestions = state.evaluationResults.detailedQuestions.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  if (filteredQuestions.length === 0) {
    elements.reviewCardsList.innerHTML = `
      <div style="text-align:center;padding:3rem;background:var(--bg-surface);border-radius:var(--radius-lg);border:1px solid var(--border-subtle);">
        <p style="color:var(--text-secondary);font-size:1.1rem;">No questions found under the <strong>${filter}</strong> category.</p>
      </div>
    `;
    return;
  }

  filteredQuestions.forEach((q) => {
    const card = document.createElement('div');
    card.className = `review-card ${q.status}`;

    // Verdict Badge
    let verdictHtml = '';
    if (q.status === 'correct') {
      verdictHtml = `<span class="review-verdict-badge verdict-correct">✓ Correct (+${q.marks.toFixed(1)})</span>`;
    } else if (q.status === 'incorrect') {
      verdictHtml = `<span class="review-verdict-badge verdict-incorrect">✗ Incorrect (−${q.negativeMarks.toFixed(2)})</span>`;
    } else {
      verdictHtml = `<span class="review-verdict-badge verdict-unanswered">○ Unanswered (0.00)</span>`;
    }

    // Build Options List
    let optionsHtml = '';
    q.options.forEach(opt => {
      const isTargetCorrect = q.correct.includes(opt.id);
      const isUserChoice = q.userChoice.includes(opt.id);

      let optionClasses = 'review-option';
      if (isTargetCorrect) optionClasses += ' is-correct-target';
      if (isUserChoice && !isTargetCorrect) optionClasses += ' is-wrong-selection';

      let badgesHtml = '';
      if (isUserChoice) {
        badgesHtml += `<span class="pill-choice-user">Your Choice</span>`;
      }
      if (isTargetCorrect) {
        badgesHtml += `<span class="pill-choice-correct">Official Key</span>`;
      }

      optionsHtml += `
        <div class="${optionClasses}">
          <div class="review-option-left">
            <span class="review-opt-tag">${opt.id}</span>
            <span>${opt.text}</span>
          </div>
          <div class="review-option-badges">
            ${badgesHtml}
          </div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="review-card-header">
        <div class="review-title-box">
          <span class="review-q-index">Question ${q.index + 1} (Originally Q${q.originalId} · ${q.marks} Mark${q.marks > 1 ? 's' : ''})</span>
          <h4 class="review-q-title">${q.title}</h4>
        </div>
        ${verdictHtml}
      </div>

      <p class="review-q-text">${q.text}</p>

      <div class="review-options-list">
        ${optionsHtml}
      </div>

      <div class="review-explanation-box">
        <div class="explanation-heading">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Concept & Solution Explanation
        </div>
        <p>${q.explanation}</p>
      </div>
    `;

    elements.reviewCardsList.appendChild(card);
  });
}

// --- Reset to Dashboard (Retake Exam) ---
function resetToDashboard() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.proctoringArmed = false;
  state.violationTriggered = false;
  state.violationReason = '';

  exitFullscreenMode();

  if (elements.headerTopTimer) {
    elements.headerTopTimer.classList.add('hidden');
  }
  if (elements.proctorViolationBanner) {
    elements.proctorViolationBanner.classList.add('hidden');
  }

  elements.resultsScreen.classList.add('hidden');
  elements.examScreen.classList.add('hidden');
  elements.dashboardScreen.classList.remove('hidden');

  elements.headerStatusText.textContent = "Ready to Start";
  elements.headerStatusPill.style.borderColor = "var(--border-subtle)";

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initApp);
