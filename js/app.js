/**
 * College Exam Hall Management System - OS Concept Simulator
 * Core Application Framework & State Manager (Vanilla JS)
 */

const STORAGE_PREFIX = 'exam_os_simulator_clean_v2_';

// Clean Initial State - Zero Dummy Records
const DEFAULT_DATA = {
  systemInfo: {
    osType: 'Linux 6.8.0-45-generic (Simulated POSIX Kernel)',
    hostname: 'Exam-Hall-Cluster-Node01',
    systemUptimeHours: 0,
    systemUptimeMinutes: 1,
    systemUptimeSeconds: 0,
    architecture: 'x86_64 / Multicore Batch Controller',
    classification: 'BATCH PROCESSING OS SCENARIO',
    classificationReason:
      'College examinations are processed as batch jobs where candidate batches, hall allocations, and seating pages are scheduled in bulk without per-student interactive intervention.',
    academicYear: '2026–2027',
    subject: 'Operating System (315319)',
    program: 'Diploma in Computer Engineering',
  },

  students: [],

  invigilators: [],

  halls: [
    {
      hallId: 'H-01',
      name: 'Aryabhata Hall (Main Block)',
      capacity: 60,
      allocatedStudents: 0,
      availableSeats: 60,
      status: 'AVAILABLE',
      invigilatorThread: 'Unassigned',
      floor: '1st Floor - Wing A',
      currentExam: 'None',
    },
    {
      hallId: 'H-02',
      name: 'Ramanujan Hall (North Wing)',
      capacity: 55,
      allocatedStudents: 0,
      availableSeats: 55,
      status: 'AVAILABLE',
      invigilatorThread: 'Unassigned',
      floor: '1st Floor - Wing B',
      currentExam: 'None',
    },
    {
      hallId: 'H-03',
      name: 'Alan Turing Center',
      capacity: 58,
      allocatedStudents: 0,
      availableSeats: 58,
      status: 'AVAILABLE',
      invigilatorThread: 'Unassigned',
      floor: '2nd Floor - Wing A',
      currentExam: 'None',
    },
    {
      hallId: 'H-04',
      name: 'Charles Babbage Hall',
      capacity: 40,
      allocatedStudents: 0,
      availableSeats: 40,
      status: 'AVAILABLE',
      invigilatorThread: 'Unassigned',
      floor: '2nd Floor - Wing C',
      currentExam: 'None',
    },
  ],

  batches: [],

  deadlockState: {
    isDeadlocked: false,
    statusText: 'SAFE STATE - NO DEADLOCK DETECTED',
    safeSequence: [],
    cycleNodes: [],
    availableResources: { H1: 1, H2: 1, I1: 1, I2: 1 },
    allocationMatrix: [],
    requestMatrix: [],
  },

  memory: {
    frameCapacity: 4,
    pageHits: 0,
    pageFaults: 0,
    activeFrames: [],
    referenceHistory: [],
    allPages: [
      { pageNumber: 1, hallId: 'H-01', seatRange: 'Seats 01–20' },
      { pageNumber: 2, hallId: 'H-01', seatRange: 'Seats 21–40' },
      { pageNumber: 3, hallId: 'H-02', seatRange: 'Seats 01–20' },
      { pageNumber: 4, hallId: 'H-02', seatRange: 'Seats 21–40' },
      { pageNumber: 5, hallId: 'H-03', seatRange: 'Seats 01–20' },
      { pageNumber: 6, hallId: 'H-03', seatRange: 'Seats 21–40' },
      { pageNumber: 7, hallId: 'H-04', seatRange: 'Seats 01–20' },
      { pageNumber: 8, hallId: 'H-04', seatRange: 'Seats 21–40' },
    ],
  },

  fileSystem: {
    totalBlocks: 64,
    files: [],
  },

  directoryTree: {
    name: 'College_Exam',
    type: 'root',
    children: [
      {
        name: 'Computer_Engineering',
        type: 'directory',
        children: [
          {
            name: 'OS',
            type: 'directory',
            children: [],
          },
          {
            name: 'CN',
            type: 'directory',
            children: [],
          },
        ],
      },
      {
        name: 'Information_Technology',
        type: 'directory',
        children: [
          {
            name: 'OS',
            type: 'directory',
            children: [],
          },
          {
            name: 'DBMS',
            type: 'directory',
            children: [],
          },
        ],
      },
      {
        name: 'Electronics_Engineering',
        type: 'directory',
        children: [
          {
            name: 'Embedded_Systems',
            type: 'directory',
            children: [],
          },
        ],
      },
    ],
  },

  auditLogs: [
    { id: 'LOG-01', time: 'Ready', module: 'CO1: System Kernel', message: 'Simulated POSIX Kernel active. Ready for examination batch & process creation.', type: 'info' },
  ],
};
        length: 4,
        type: 'cn',
        createdDate: '2026-10-06 08:15',
        content: 'Seating plan for 45 students in Hall H-02 for Subject CN (315320).',
      },
      {
        fileName: 'Java_Exam.txt',
        department: 'Computer Engineering',
        startBlock: 35,
        length: 6,
        type: 'java',
        createdDate: '2026-10-06 08:30',
        content: 'Practical examination lab terminals allocation for Java Programming.',
      },
      {
        fileName: 'DBMS_Exam.txt',
        department: 'Information Technology',
        startBlock: 44,
        length: 5,
        type: 'dbms',
        createdDate: '2026-10-06 08:45',
        content: 'Database Management theory exam hall allocation sheet.',
      },
      {
        fileName: 'Seating_H04.txt',
        department: 'Mechanical Engineering',
        startBlock: 2,
        length: 6,
        type: 'seat',
        createdDate: '2026-10-06 08:50',
        content: 'Hall H-04 Applied Maths batch seating arrangement records.',
      },
    ],
  },

  directoryTree: {
    name: 'College_Exam',
    type: 'root',
    children: [
      {
        name: 'Computer_Engineering',
        type: 'directory',
        children: [
          {
            name: 'OS',
            type: 'directory',
            children: [
              {
                name: 'Seating.txt',
                type: 'file',
                size: '18.4 KB',
                blocks: '20..24',
                permissions: '-rw-r--r--',
                owner: 'exam_admin',
                date: '2026-10-06',
                content: '=== Operating System Seating Plan (CO5K) ===\nHall: H-01 (Aryabhata)\nInvigilator: T01 (Prof. R.K. Sharma)\nStudents: 60 Candidates\nSeat Range: 01 to 60\nPaging Map: Page 1 (1-20), Page 2 (21-40), Page 3 (41-60)\nStatus: Ready for exam batch.',
              },
              {
                name: 'Hall.txt',
                type: 'file',
                size: '4.2 KB',
                blocks: '12..13',
                permissions: '-rw-r--r--',
                owner: 'exam_admin',
                date: '2026-10-06',
                content: '=== Hall Configuration: H-01 ===\nCapacity: 60 Seats\nProjector: Enabled\nCCTV: Operational\nEmergency Exit: North Wing 102',
              },
            ],
          },
          {
            name: 'CN',
            type: 'directory',
            children: [
              {
                name: 'Seating.txt',
                type: 'file',
                size: '14.1 KB',
                blocks: '28..31',
                permissions: '-rw-r--r--',
                owner: 'exam_admin',
                date: '2026-10-06',
                content: '=== Computer Networks Seating Plan ===\nHall: H-02 (Ramanujan)\nInvigilator: T02\nCandidates: 45 Active',
              },
            ],
          },
        ],
      },
      {
        name: 'Information_Technology',
        type: 'directory',
        children: [
          {
            name: 'OS',
            type: 'directory',
            children: [
              {
                name: 'Seating.txt',
                type: 'file',
                size: '12.0 KB',
                blocks: '50..52',
                permissions: '-rw-r--r--',
                owner: 'it_hod',
                date: '2026-10-06',
                content: '=== IT Department OS Exam Seating ===\nHall: H-02\nBatch: IF5K-A\nTotal Candidates: 40',
              },
            ],
          },
          {
            name: 'DBMS',
            type: 'directory',
            children: [
              {
                name: 'Seating.txt',
                type: 'file',
                size: '15.8 KB',
                blocks: '44..48',
                permissions: '-rw-r--r--',
                owner: 'it_hod',
                date: '2026-10-06',
                content: '=== DBMS Laboratory Seating Plan ===\nServer: MySQL-Primary\nTerminals Assigned: 45',
              },
            ],
          },
        ],
      },
      {
        name: 'Electronics_Engineering',
        type: 'directory',
        children: [
          {
            name: 'Embedded_Systems',
            type: 'directory',
            children: [
              {
                name: 'Seating.txt',
                type: 'file',
                size: '9.6 KB',
                blocks: '55..57',
                permissions: '-rw-r--r--',
                owner: 'ej_hod',
                date: '2026-10-06',
                content: '=== Embedded Systems Exam Seating ===\nHall: H-03 (Turing Hall)\nBatch: EJ5K-A\nTotal: 30 Candidates',
              },
            ],
          },
        ],
      },
    ],
  },

  auditLogs: [
    { id: 'LOG-01', time: '10:00:12', module: 'CO1: System Kernel', message: 'Simulated POSIX Kernel initialized & Batch Processing mode active.', type: 'info' },
    { id: 'LOG-02', time: '10:01:45', module: 'CO2: Process Subsystem', message: 'Spawned Student Processes P101 through P108 with initial PCB allocations.', type: 'success' },
    { id: 'LOG-03', time: '10:02:10', module: 'CO2: Thread Subsystem', message: 'Created Invigilator Thread Pool (T01 to T06) mapped to Exam Halls.', type: 'success' },
    { id: 'LOG-04', time: '10:03:00', module: 'CO3: FCFS Scheduler', message: 'FCFS Queue allocated Batch CO5K-A (60 students) to Hall H-01.', type: 'info' },
    { id: 'LOG-05', time: '10:04:15', module: 'CO3: Priority Dispatch', message: 'Priority Scheduler assigned high-priority thread T01 (Priority 1) to H-01.', type: 'success' },
    { id: 'LOG-06', time: '10:05:30', module: 'CO3: Deadlock Monitor', message: 'Resource Allocation Graph analyzed: System operating in SAFE STATE.', type: 'safe' },
    { id: 'LOG-07', time: '10:06:55', module: 'CO4: Memory Paging', message: 'Seating pages 1 & 2 for Hall H-01 loaded into Memory Frames 3 & 1.', type: 'info' },
    { id: 'LOG-08', time: '10:08:20', module: 'CO5: File System', message: 'Contiguously allocated blocks 20..24 for file OS_Exam.txt.', type: 'success' },
  ],
};

// Global ExamOS Singleton Controller
const ExamOS = {
  data: {},

  // Initialize data from localStorage or default
  init() {
    this.loadState();
    this.initNavigation();
    this.initUptimeTicker();
    this.initMobileSidebar();
  },

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'state');
      if (saved) {
        this.data = JSON.parse(saved);
      } else {
        this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        this.saveState();
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  },

  saveState() {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'state', JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  },

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.saveState();
    this.showToast('All demonstration data restored to initial default state!', 'success');
    this.logAudit('CO1: System Kernel', 'Reset system state and demonstration tables to default configuration.', 'warning');
    
    // Refresh current view
    this.renderCurrentView();
  },

  logAudit(module, message, type = 'info') {
    const timeStr = new Date().toLocaleTimeString();
    const newLog = {
      id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
      time: timeStr,
      module,
      message,
      type,
    };
    this.data.auditLogs.unshift(newLog);
    if (this.data.auditLogs.length > 50) this.data.auditLogs.pop();
    this.saveState();
  },

  // Toast Notification System
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
    } else if (type === 'danger') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  },

  // Modal Control
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  // Navigation Controller
  initNavigation() {
    const links = document.querySelectorAll('.nav-link[data-view]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = link.getAttribute('data-view');
        this.navigateTo(viewId);
      });
    });

    // Check hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById('view-' + hash)) {
      this.navigateTo(hash);
    } else {
      this.navigateTo('dashboard');
    }

    // Handle hash change
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && document.getElementById('view-' + newHash)) {
        this.navigateTo(newHash);
      }
    });
  },

  navigateTo(viewId) {
    window.location.hash = viewId;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach((link) => {
      if (link.getAttribute('data-view') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update visible view section
    document.querySelectorAll('.view-section').forEach((sec) => {
      sec.classList.remove('active');
    });

    const targetSection = document.getElementById('view-' + viewId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update breadcrumb
    const breadcrumb = document.getElementById('navbar-breadcrumb-current');
    if (breadcrumb) {
      const link = document.querySelector(`.nav-link[data-view="${viewId}"]`);
      if (link) {
        const textNode = link.querySelector('span:not(.nav-co-tag)') || link;
        breadcrumb.textContent = textNode.textContent.trim();
      }
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    // Trigger render handler for that module
    this.renderView(viewId);
  },

  renderCurrentView() {
    const currentHash = window.location.hash.replace('#', '') || 'dashboard';
    this.renderView(currentHash);
  },

  renderView(viewId) {
    if (viewId === 'dashboard' && window.DashboardModule) window.DashboardModule.render();
    if (viewId === 'processes' && window.ProcessManagerModule) window.ProcessManagerModule.renderStudents();
    if (viewId === 'threads' && window.ProcessManagerModule) window.ProcessManagerModule.renderThreads();
    if (viewId === 'halls' && window.SchedulingModule) window.SchedulingModule.renderHalls();
    if (viewId === 'scheduling' && window.SchedulingModule) window.SchedulingModule.renderScheduling();
    if (viewId === 'deadlock' && window.DeadlockModule) window.DeadlockModule.render();
    if (viewId === 'memory' && window.MemoryModule) window.MemoryModule.render();
    if (viewId === 'file-manager' && window.FileManagerModule) window.FileManagerModule.render();
    if (viewId === 'directory' && window.DirectoryModule) window.DirectoryModule.render();
    if (viewId === 'reports' && window.DashboardModule) window.DashboardModule.renderReports();
  },

  // Live Uptime Clock
  initUptimeTicker() {
    const uptimeEl = document.getElementById('nav-uptime-counter');
    let sec = this.data.systemInfo.systemUptimeSeconds || 10;
    let min = this.data.systemInfo.systemUptimeMinutes || 45;
    let hr = this.data.systemInfo.systemUptimeHours || 2;

    setInterval(() => {
      sec++;
      if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 60) {
          min = 0;
          hr++;
        }
      }
      this.data.systemInfo.systemUptimeSeconds = sec;
      this.data.systemInfo.systemUptimeMinutes = min;
      this.data.systemInfo.systemUptimeHours = hr;

      if (uptimeEl) {
        uptimeEl.textContent = `${hr}h ${min}m ${sec < 10 ? '0' : ''}${sec}s`;
      }
    }, 1000);
  },

  initMobileSidebar() {
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const sidebar = document.getElementById('app-sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }
  },
};

// Export to window
window.ExamOS = ExamOS;
