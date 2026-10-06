/**
 * College Exam Hall Management System - OS Concept Simulator
 * Module: CO1 System Information & Reports (vanilla JS)
 */

const DashboardModule = {
  render() {
    const data = ExamOS.data;
    const sys = data.systemInfo;

    // 1. Populate System Information Card
    const osTypeEl = document.getElementById('dash-os-type');
    const hostnameEl = document.getElementById('dash-hostname');
    const kernelEl = document.getElementById('dash-kernel');
    const archEl = document.getElementById('dash-arch');
    const classificationEl = document.getElementById('dash-classification');
    const classificationReasonEl = document.getElementById('dash-classification-reason');

    if (osTypeEl) osTypeEl.textContent = sys.osType;
    if (hostnameEl) hostnameEl.textContent = sys.hostname;
    if (kernelEl) kernelEl.textContent = sys.kernelVersion || '6.8.0-POSIX';
    if (archEl) archEl.textContent = sys.architecture;
    if (classificationEl) classificationEl.textContent = sys.classification;
    if (classificationReasonEl) classificationReasonEl.textContent = sys.classificationReason;

    // 2. Metric Counters
    const studentCountEl = document.getElementById('dash-count-students');
    const hallCountEl = document.getElementById('dash-count-halls');
    const invigilatorCountEl = document.getElementById('dash-count-invigilators');
    const memoryFramesEl = document.getElementById('dash-count-frames');
    const diskBlocksEl = document.getElementById('dash-count-blocks');

    if (studentCountEl) studentCountEl.textContent = data.students.length;
    if (hallCountEl) hallCountEl.textContent = data.halls.length;
    if (invigilatorCountEl) invigilatorCountEl.textContent = data.invigilators.length;
    if (memoryFramesEl) memoryFramesEl.textContent = `${data.memory.activeFrames.length}/${data.memory.frameCapacity}`;

    if (diskBlocksEl) {
      const allocated = data.fileSystem.files.reduce((acc, f) => acc + f.length, 0);
      diskBlocksEl.textContent = `${allocated}/${data.fileSystem.totalBlocks} Blocks`;
    }

    // 3. Render Audit Log Table on Dashboard
    this.renderAuditLogs();
  },

  renderAuditLogs() {
    const logTableBody = document.getElementById('dash-audit-logs-body');
    if (!logTableBody) return;

    const logs = ExamOS.data.auditLogs.slice(0, 7);
    if (logs.length === 0) {
      logTableBody.innerHTML = '<tr><td colspan="4" class="text-center">No logs recorded yet.</td></tr>';
      return;
    }

    logTableBody.innerHTML = logs
      .map(
        (log) => `
        <tr>
          <td><span class="font-mono text-muted">${log.time}</span></td>
          <td><span class="badge badge-${log.type === 'deadlock' ? 'deadlock' : log.type === 'safe' ? 'safe' : log.type === 'warning' ? 'amber' : 'cyan'}">${log.module}</span></td>
          <td><span class="text-primary">${log.message}</span></td>
          <td><span class="badge badge-dot badge-${log.type === 'deadlock' ? 'deadlock' : log.type === 'safe' ? 'safe' : 'active'}">${log.type.toUpperCase()}</span></td>
        </tr>
      `
      )
      .join('');
  },

  renderReports() {
    const data = ExamOS.data;
    const totalAllocatedBlocks = data.fileSystem.files.reduce((acc, f) => acc + f.length, 0);
    const hitRate = Math.round((data.memory.pageHits / (data.memory.pageHits + data.memory.pageFaults || 1)) * 100);

    const reportContent = document.getElementById('reports-summary-container');
    if (!reportContent) return;

    reportContent.innerHTML = `
      <div class="card" style="border-top: 3px solid var(--accent-cyan);">
        <div class="card-header">
          <div>
            <h3 class="card-title font-mono">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              ========================================<br>
              COLLEGE EXAM MANAGEMENT SIMULATION SUMMARY<br>
              ========================================
            </h3>
            <p class="card-subtitle font-mono">Generated under Course Outcomes CO1 - CO5 Examination Framework</p>
          </div>
          <button class="btn btn-outline btn-sm font-mono" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            PRINT REPORT
          </button>
        </div>

        <div style="font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.8; background: rgba(15, 23, 42, 0.7); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-color);">
          <div style="color: var(--accent-cyan); font-weight: 700; margin-bottom: 0.5rem;">[1] OVERALL EXAMINATION RESOURCES</div>
          <div style="display: grid; grid-template-columns: 260px 1fr; gap: 0.5rem; margin-bottom: 1rem;">
            <span>Total Student Candidates</span>: <strong>${data.students.length} processes registered</strong><br>
            <span>Total Examination Halls</span>: <strong>${data.halls.length} halls available</strong><br>
            <span>Total Invigilator Staff</span>: <strong>${data.invigilators.length} threads active</strong><br>
          </div>

          <div style="color: var(--accent-amber); font-weight: 700; margin-bottom: 0.5rem;">[2] RESOURCE ALLOCATION & SCHEDULING (CO3)</div>
          <div style="display: grid; grid-template-columns: 260px 1fr; gap: 0.5rem; margin-bottom: 1rem;">
            <span>Hall Allocation Algorithm</span>: <strong>FIRST-COME FIRST-SERVED (FCFS)</strong><br>
            <span>Invigilator Assignment</span>: <strong>PRIORITY SCHEDULING (Priority 1 = Highest)</strong><br>
            <span>Deadlock Condition</span>: <strong style="color: ${data.deadlockState.isDeadlocked ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">${data.deadlockState.statusText}</strong><br>
            <span>Safe Batch Sequence</span>: <strong>${data.deadlockState.safeSequence.length ? data.deadlockState.safeSequence.join(' ➔ ') : 'NONE (LOCKED)'}</strong>
          </div>

          <div style="color: var(--accent-purple); font-weight: 700; margin-bottom: 0.5rem;">[3] VIRTUAL MEMORY PAGING & LRU (CO4)</div>
          <div style="display: grid; grid-template-columns: 260px 1fr; gap: 0.5rem; margin-bottom: 1rem;">
            <span>Total Physical Frames</span>: <strong>${data.memory.frameCapacity} Frames configured</strong><br>
            <span>Replacement Algorithm</span>: <strong>LEAST RECENTLY USED (LRU)</strong><br>
            <span>Page Hits Recorded</span>: <strong style="color: var(--accent-emerald);">${data.memory.pageHits} hits</strong><br>
            <span>Page Faults Recorded</span>: <strong style="color: var(--accent-rose);">${data.memory.pageFaults} faults</strong><br>
            <span>Effective Hit Ratio</span>: <strong>${hitRate}%</strong>
          </div>

          <div style="color: var(--accent-emerald); font-weight: 700; margin-bottom: 0.5rem;">[4] SECONDARY STORAGE & DIRECTORY (CO5)</div>
          <div style="display: grid; grid-template-columns: 260px 1fr; gap: 0.5rem; margin-bottom: 1rem;">
            <span>File Allocation Method</span>: <strong>CONTIGUOUS ALLOCATION (Start Block + Consecutive Length)</strong><br>
            <span>Allocated Disk Blocks</span>: <strong>${totalAllocatedBlocks} / ${data.fileSystem.totalBlocks} Blocks Used (${Math.round((totalAllocatedBlocks/data.fileSystem.totalBlocks)*100)}%)</strong><br>
            <span>Directory Model</span>: <strong>TREE-STRUCTURED DIRECTORY PER DEPARTMENT</strong><br>
          </div>

          <div style="border-top: 1px dashed var(--border-color); padding-top: 1rem; margin-top: 1rem; color: var(--accent-cyan); font-weight: 700;">
            SYSTEM STATUS: EXAM MANAGEMENT SIMULATION ACTIVE & OPERATIONAL
          </div>
        </div>
      </div>
    `;
  },
};

window.DashboardModule = DashboardModule;
