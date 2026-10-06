/**
 * College Exam Hall Management System - OS Concept Simulator
 * Module: CO3 CPU Scheduling - FCFS Hall Allocation & Priority Invigilator Scheduling
 */

const SchedulingModule = {
  renderHalls() {
    const data = ExamOS.data;
    const hallsList = data.halls;
    const batchesQueue = data.batches;

    // Render Hall Cards
    const hallsContainer = document.getElementById('halls-card-container');
    if (hallsContainer) {
      hallsContainer.innerHTML = hallsList
        .map((h) => {
          const occupancyPercent = Math.min(100, Math.round((h.allocatedStudents / h.capacity) * 100));
          const isFull = h.allocatedStudents >= h.capacity;
          const statusBadge = isFull ? 'badge-occupied' : h.allocatedStudents > 0 ? 'badge-amber' : 'badge-safe';

          return `
          <div class="card" style="position:relative; overflow:hidden;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <span class="badge badge-cyan font-mono" style="font-size:0.75rem;">${h.hallId}</span>
                <h4 style="font-size:1.05rem; margin-top:0.35rem; color:#fff;">${h.name}</h4>
                <p style="font-size:0.78rem; color:var(--text-muted);">${h.floor}</p>
              </div>
              <span class="badge ${statusBadge}">${isFull ? 'FULL' : h.allocatedStudents > 0 ? 'PARTIAL' : 'FREE'}</span>
            </div>

            <div style="margin: 0.85rem 0;">
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.35rem;">
                <span style="color:var(--text-secondary);">Occupancy (${h.allocatedStudents}/${h.capacity})</span>
                <strong class="font-mono">${occupancyPercent}%</strong>
              </div>
              <div style="height:8px; background:rgba(255,255,255,0.06); border-radius:4px; overflow:hidden;">
                <div style="width:${occupancyPercent}%; height:100%; background:${isFull ? 'var(--accent-rose)' : occupancyPercent > 70 ? 'var(--accent-amber)' : 'var(--accent-emerald)'}; transition:width 0.3s ease;"></div>
              </div>
            </div>

            <div style="font-size:0.8rem; border-top:1px dashed var(--border-color); padding-top:0.75rem; display:flex; justify-content:space-between; color:var(--text-secondary);">
              <span>Assigned Proctor: <strong class="font-mono text-cyan" style="color:var(--accent-cyan);">${h.invigilatorThread}</strong></span>
              <span>Available Seats: <strong class="font-mono" style="color:${h.capacity - h.allocatedStudents === 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">${Math.max(0, h.capacity - h.allocatedStudents)}</strong></span>
            </div>
          </div>
        `;
        })
        .join('');
    }

    // Render FCFS Batch Queue Table
    const queueTbody = document.getElementById('fcfs-queue-tbody');
    if (queueTbody) {
      queueTbody.innerHTML = batchesQueue
        .map(
          (b, idx) => `
        <tr>
          <td><span class="font-mono" style="font-weight:700; color:var(--accent-cyan);">#${idx + 1}</span></td>
          <td><strong class="font-mono">${b.batchId}</strong></td>
          <td>${b.department}</td>
          <td><span class="font-mono" style="font-weight:600;">${b.studentCount} candidates</span></td>
          <td><span class="font-mono text-muted">${b.arrivalTime}</span></td>
          <td><span class="badge badge-cyan">${b.assignedHall}</span></td>
          <td>
            <span class="badge badge-${b.allocationStatus === 'ALLOCATED' ? 'running' : 'waiting'}">${b.allocationStatus}</span>
          </td>
        </tr>
      `
        )
        .join('');
    }
  },

  runFCFSAllocation() {
    const data = ExamOS.data;
    const unallocatedBatches = data.batches.filter((b) => b.allocationStatus !== 'ALLOCATED');

    if (unallocatedBatches.length === 0) {
      ExamOS.showToast('All batches in the FCFS queue have already been allocated.', 'info');
      return;
    }

    let allocatedCount = 0;

    // FCFS: Process in arrival order (order 1, 2, 3...)
    unallocatedBatches.sort((a, b) => a.queueOrder - b.queueOrder);

    for (const batch of unallocatedBatches) {
      // Find first hall with enough capacity
      const availableHall = data.halls.find((h) => h.capacity - h.allocatedStudents >= batch.studentCount);

      if (availableHall) {
        batch.assignedHall = availableHall.hallId;
        batch.allocationStatus = 'ALLOCATED';
        availableHall.allocatedStudents += batch.studentCount;
        availableHall.availableSeats = availableHall.capacity - availableHall.allocatedStudents;
        availableHall.status = availableHall.availableSeats === 0 ? 'OCCUPIED' : 'PARTIALLY_OCCUPIED';
        allocatedCount++;

        ExamOS.logAudit('CO3: FCFS Scheduler', `FCFS: Allocated ${batch.batchId} (${batch.studentCount} students) to Hall ${availableHall.hallId}`, 'success');
      } else {
        ExamOS.logAudit('CO3: FCFS Scheduler', `FCFS: Batch ${batch.batchId} waiting in queue; insufficient capacity in single hall`, 'warning');
      }
    }

    ExamOS.saveState();
    ExamOS.showToast(`FCFS Hall Allocation completed. ${allocatedCount} batch(es) assigned.`, 'success');
    this.renderHalls();
  },

  handleEnqueueBatch(e) {
    e.preventDefault();
    const form = e.target;
    const batchId = form.batchId.value.trim();
    const department = form.department.value;
    const studentCount = parseInt(form.studentCount.value, 10);

    if (!batchId || !studentCount) {
      ExamOS.showToast('Please enter batch ID and student count.', 'warning');
      return;
    }

    const newBatch = {
      batchId,
      department,
      studentCount,
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      queueOrder: ExamOS.data.batches.length + 1,
      assignedHall: 'Pending',
      allocationStatus: 'WAITING_IN_QUEUE',
    };

    ExamOS.data.batches.push(newBatch);
    ExamOS.saveState();
    ExamOS.logAudit('CO3: FCFS Queue', `Enqueued new batch ${batchId} (${studentCount} candidates) into FIFO arrival queue`, 'info');
    ExamOS.showToast(`Batch ${batchId} enqueued for FCFS scheduling!`, 'success');

    form.reset();
    ExamOS.closeModal('modal-enqueue-batch');
    SchedulingModule.renderHalls();
  },

  // Priority Invigilator Scheduling
  renderScheduling() {
    const data = ExamOS.data;
    const invigilators = [...data.invigilators];

    // Priority scheduling sort: Priority 1 is highest priority
    invigilators.sort((a, b) => a.priority - b.priority);

    const tbody = document.getElementById('priority-scheduling-tbody');
    if (tbody) {
      tbody.innerHTML = invigilators
        .map(
          (inv, idx) => `
        <tr>
          <td><strong class="font-mono text-cyan" style="color:var(--accent-cyan);">#${idx + 1}</strong></td>
          <td><strong class="font-mono">${inv.threadId}</strong></td>
          <td><strong>${inv.name}</strong></td>
          <td><span class="badge badge-amber font-mono" style="font-weight:700;">Priority ${inv.priority} ${inv.priority === 1 ? '(HIGHEST)' : ''}</span></td>
          <td><span class="badge badge-cyan font-mono">${inv.assignedHall}</span></td>
          <td><span class="badge badge-${inv.status.toLowerCase()}">${inv.status}</span></td>
          <td><span style="font-size:0.8rem; color:var(--text-secondary);">${inv.department}</span></td>
        </tr>
      `
        )
        .join('');
    }

    // Gantt / Timeline visualization
    const timelineContainer = document.getElementById('scheduling-timeline');
    if (timelineContainer) {
      timelineContainer.innerHTML = invigilators
        .slice(0, 5)
        .map((inv, idx) => {
          const width = 100 - idx * 15;
          return `
          <div style="margin-bottom:0.75rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:0.25rem;">
              <span><strong>${inv.name}</strong> (${inv.threadId}) - Priority ${inv.priority}</span>
              <span class="font-mono text-muted">Hall ${inv.assignedHall}</span>
            </div>
            <div style="height:12px; background:rgba(255,255,255,0.06); border-radius:6px; overflow:hidden;">
              <div style="width:${width}%; height:100%; background:linear-gradient(90deg, var(--accent-cyan), var(--accent-indigo)); border-radius:6px;"></div>
            </div>
          </div>
        `;
        })
        .join('');
    }
  },

  runPriorityRebalance() {
    const data = ExamOS.data;
    // Sort halls and assign available highest priority invigilators
    const activeStaff = data.invigilators.filter((t) => t.status === 'ACTIVE').sort((a, b) => a.priority - b.priority);

    data.halls.forEach((hall, idx) => {
      if (activeStaff[idx]) {
        hall.invigilatorThread = activeStaff[idx].threadId;
        activeStaff[idx].assignedHall = hall.hallId;
      }
    });

    ExamOS.saveState();
    ExamOS.logAudit('CO3: Priority Dispatch', 'Priority scheduling executed: highest priority proctors assigned to main halls.', 'success');
    ExamOS.showToast('Priority assignment evaluated and dispatched!', 'success');
    this.renderScheduling();
    this.renderHalls();
  },
};

window.SchedulingModule = SchedulingModule;
