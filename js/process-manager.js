/**
 * College Exam Hall Management System - OS Concept Simulator
 * Module: CO2 Process Management & Invigilator Threads (Vanilla JS)
 */

const ProcessManagerModule = {
  currentStudentFilter: 'ALL',
  currentSearchTerm: '',

  renderStudents() {
    const data = ExamOS.data;
    let list = data.students;

    // Filter by State
    if (this.currentStudentFilter !== 'ALL') {
      list = list.filter((s) => s.state === this.currentStudentFilter);
    }

    // Search by Name, PID, or Student ID
    if (this.currentSearchTerm.trim()) {
      const q = this.currentSearchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.pid.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      );
    }

    // Update state lifecycle count badges
    const counts = {
      READY: data.students.filter((s) => s.state === 'READY').length,
      RUNNING: data.students.filter((s) => s.state === 'RUNNING').length,
      WAITING: data.students.filter((s) => s.state === 'WAITING').length,
      COMPLETED: data.students.filter((s) => s.state === 'COMPLETED').length,
    };

    const countReadyEl = document.getElementById('state-count-ready');
    const countRunningEl = document.getElementById('state-count-running');
    const countWaitingEl = document.getElementById('state-count-waiting');
    const countCompletedEl = document.getElementById('state-count-completed');

    if (countReadyEl) countReadyEl.textContent = counts.READY;
    if (countRunningEl) countRunningEl.textContent = counts.RUNNING;
    if (countWaitingEl) countWaitingEl.textContent = counts.WAITING;
    if (countCompletedEl) countCompletedEl.textContent = counts.COMPLETED;

    // Render Student Processes Table
    const tbody = document.getElementById('students-table-body');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 2rem;">No student processes match the search/filter criteria.</td></tr>';
      return;
    }

    tbody.innerHTML = list
      .map(
        (s) => `
      <tr>
        <td><strong class="font-mono text-cyan" style="color:var(--accent-cyan);">${s.pid}</strong></td>
        <td><span class="font-mono">${s.studentId}</span></td>
        <td><strong>${s.name}</strong></td>
        <td><span style="font-size:0.8rem; color:var(--text-secondary);">${s.department}</span></td>
        <td><span class="badge badge-cyan">${s.hallId || 'Unassigned'}</span></td>
        <td><span class="font-mono" style="font-size:0.78rem;">${s.seatNo || '-'}</span></td>
        <td>
          <span class="badge badge-${s.state.toLowerCase()}">${s.state}</span>
        </td>
        <td>
          <div style="display:flex; gap: 0.35rem; align-items:center;">
            <select class="form-select" style="padding:0.25rem 0.5rem; font-size:0.75rem; width:auto;" onchange="ProcessManagerModule.changeState('${s.pid}', this.value)">
              <option value="READY" ${s.state === 'READY' ? 'selected' : ''}>READY</option>
              <option value="RUNNING" ${s.state === 'RUNNING' ? 'selected' : ''}>RUNNING</option>
              <option value="WAITING" ${s.state === 'WAITING' ? 'selected' : ''}>WAITING</option>
              <option value="COMPLETED" ${s.state === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
            </select>
            <button class="btn btn-outline btn-sm" title="View Process Control Block (PCB)" onclick="ProcessManagerModule.viewPCB('${s.pid}')">
              PCB
            </button>
            <button class="btn btn-outline btn-sm text-rose" style="color:var(--accent-rose);" title="Kill Process" onclick="ProcessManagerModule.deleteStudent('${s.pid}')">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join('');
  },

  changeState(pid, newState) {
    const student = ExamOS.data.students.find((s) => s.pid === pid);
    if (student) {
      student.state = newState;
      ExamOS.saveState();
      ExamOS.logAudit('CO2: Process Subsystem', `Process ${pid} (${student.name}) moved to state ${newState}`, 'info');
      ExamOS.showToast(`Process ${pid} transitioned to ${newState}`, 'info');
      this.renderStudents();
    }
  },

  deleteStudent(pid) {
    if (confirm(`Terminate process ${pid}? This frees allocated seat resources.`)) {
      ExamOS.data.students = ExamOS.data.students.filter((s) => s.pid !== pid);
      ExamOS.saveState();
      ExamOS.logAudit('CO2: Process Subsystem', `Terminated student process ${pid}`, 'warning');
      ExamOS.showToast(`Process ${pid} terminated`, 'warning');
      this.renderStudents();
    }
  },

  viewPCB(pid) {
    const student = ExamOS.data.students.find((s) => s.pid === pid);
    if (!student) return;

    const modalBody = document.getElementById('pcb-modal-content');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.85rem; background: rgba(15, 23, 42, 0.7); padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border-color); line-height: 1.8;">
        <div style="display:flex; justify-content:space-between; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
          <span style="color:var(--accent-cyan); font-weight:700;">PROCESS CONTROL BLOCK (PCB)</span>
          <span class="badge badge-${student.state.toLowerCase()}">${student.state}</span>
        </div>
        <div><strong>Process ID (PID):</strong> ${student.pid}</div>
        <div><strong>Student Reference:</strong> ${student.name} (${student.studentId})</div>
        <div><strong>Academic Department:</strong> ${student.department}</div>
        <div><strong>Examination Subject:</strong> ${student.exam}</div>
        <div><strong>Allocated Hall & Seat:</strong> ${student.hallId} | ${student.seatNo}</div>
        <div><strong>Arrival Timestamp:</strong> ${student.arrivalTime}</div>
        <div><strong>Burst Duration:</strong> ${student.burstMin} minutes</div>
        <div><strong>Scheduling Priority:</strong> Level ${student.priority}</div>
        <div><strong>Simulated Program Counter:</strong> 0x0040${Math.floor(Math.random() * 8999 + 1000)}</div>
        <div><strong>CPU Register State:</strong> EAX: 0x01 | EBX: 0x0F | ESP: 0x7FFF00</div>
        <div><strong>Memory Limits (Paging):</strong> Base: Frame ${(student.pid.slice(1) % 4) + 1} | Limit: 20 Seats</div>
        <div><strong>I/O Status:</strong> Waiting for Exam Paper Hash Verification</div>
      </div>
    `;

    ExamOS.openModal('modal-pcb-inspector');
  },

  handleCreateStudent(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const studentId = form.studentId.value.trim();
    const department = form.department.value;
    const exam = form.exam.value.trim();
    const hallId = form.hallId.value;

    if (!name || !studentId || !exam) {
      ExamOS.showToast('Please fill all required fields.', 'warning');
      return;
    }

    // Check duplicate studentId
    if (ExamOS.data.students.some((s) => s.studentId === studentId)) {
      ExamOS.showToast(`Student with ID ${studentId} is already registered!`, 'danger');
      return;
    }

    // Generate PID
    const maxPidNum = ExamOS.data.students.reduce((max, s) => {
      const num = parseInt(s.pid.replace('P', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 100);

    const newPid = `P${maxPidNum + 1}`;
    const newSeat = `${hallId}-S${Math.floor(Math.random() * 50) + 1}`;

    const newStudent = {
      pid: newPid,
      studentId,
      name,
      department,
      exam,
      hallId,
      seatNo: newSeat,
      state: 'READY',
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      burstMin: 180,
      priority: 2,
    };

    ExamOS.data.students.unshift(newStudent);
    ExamOS.saveState();
    ExamOS.logAudit('CO2: Process Subsystem', `Created process ${newPid} for ${name} (${studentId})`, 'success');
    ExamOS.showToast(`Process ${newPid} created successfully!`, 'success');

    form.reset();
    ExamOS.closeModal('modal-add-student');
    ProcessManagerModule.renderStudents();
  },

  // Invigilator Threads Management
  renderThreads() {
    const list = ExamOS.data.invigilators;
    const tbody = document.getElementById('threads-table-body');
    if (!tbody) return;

    tbody.innerHTML = list
      .map(
        (t) => `
      <tr>
        <td><strong class="font-mono" style="color:var(--accent-cyan);">${t.threadId}</strong></td>
        <td><span class="font-mono text-muted">${t.invigilatorId}</span></td>
        <td><strong>${t.name}</strong></td>
        <td><span class="badge badge-amber">Priority ${t.priority}</span></td>
        <td><span class="badge badge-cyan">${t.assignedHall}</span></td>
        <td><span class="badge badge-${t.status.toLowerCase()}">${t.status}</span></td>
        <td><span style="font-size:0.8rem; color:var(--text-secondary);">${t.role}</span></td>
        <td>
          <div style="display:flex; gap: 0.35rem;">
            <button class="btn btn-outline btn-sm ${t.status === 'ACTIVE' ? 'btn-success' : ''}" onclick="ProcessManagerModule.toggleThreadStatus('${t.threadId}', 'ACTIVE')">
              ACTIVE
            </button>
            <button class="btn btn-outline btn-sm ${t.status === 'IDLE' ? 'btn-secondary' : ''}" onclick="ProcessManagerModule.toggleThreadStatus('${t.threadId}', 'IDLE')">
              IDLE
            </button>
            <button class="btn btn-outline btn-sm ${t.status === 'BLOCKED' ? 'btn-danger' : ''}" onclick="ProcessManagerModule.toggleThreadStatus('${t.threadId}', 'BLOCKED')">
              BLOCKED
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join('');
  },

  toggleThreadStatus(threadId, status) {
    const thread = ExamOS.data.invigilators.find((t) => t.threadId === threadId);
    if (thread) {
      thread.status = status;
      ExamOS.saveState();
      ExamOS.logAudit('CO2: Thread Subsystem', `Invigilator thread ${threadId} state changed to ${status}`, 'info');
      ExamOS.showToast(`Thread ${threadId} marked as ${status}`, 'info');
      this.renderThreads();
    }
  },

  handleCreateThread(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const priority = parseInt(form.priority.value, 10) || 2;
    const assignedHall = form.assignedHall.value;
    const department = form.department.value;
    const role = form.role.value.trim() || 'Exam Hall Proctor Thread';

    if (!name) {
      ExamOS.showToast('Please specify the invigilator name.', 'warning');
      return;
    }

    const nextNum = ExamOS.data.invigilators.length + 1;
    const threadId = `T${nextNum < 10 ? '0' : ''}${nextNum}`;
    const invigilatorId = `INV-${100 + nextNum}`;

    const newInv = {
      threadId,
      invigilatorId,
      name,
      priority,
      assignedHall,
      status: 'ACTIVE',
      shift: 'Morning (09:00 - 12:00)',
      department,
      role,
    };

    ExamOS.data.invigilators.push(newInv);
    ExamOS.saveState();
    ExamOS.logAudit('CO2: Thread Subsystem', `Spawned thread ${threadId} (${name}) with Priority ${priority}`, 'success');
    ExamOS.showToast(`Thread ${threadId} created successfully!`, 'success');

    form.reset();
    ExamOS.closeModal('modal-add-thread');
    ProcessManagerModule.renderThreads();
  },
};

window.ProcessManagerModule = ProcessManagerModule;
