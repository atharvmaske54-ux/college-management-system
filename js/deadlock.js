/**
 * College Exam Hall Management System - OS Concept Simulator
 * Module: CO3 Deadlock Detection & Resource Allocation Graph (Vanilla JS)
 */

const DeadlockModule = {
  render() {
    const data = ExamOS.data;
    const isDeadlocked = data.deadlockState.isDeadlocked;

    // Status Banner
    const statusContainer = document.getElementById('deadlock-status-card');
    if (statusContainer) {
      if (isDeadlocked) {
        statusContainer.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.15); border: 2px solid var(--accent-rose); border-radius: 12px; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div style="display:flex; align-items:center; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(239, 68, 68, 0.25); display: flex; align-items: center; justify-content: center; color: var(--accent-rose);">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div>
                <h3 style="color: var(--accent-rose); font-size: 1.2rem; font-weight: 700; font-family: var(--font-mono);">DEADLOCK DETECTED! (CIRCULAR WAIT CYCLE)</h3>
                <p style="color: var(--text-secondary); font-size: 0.85rem;">Four OS Coffman conditions satisfied: Mutual Exclusion, Hold and Wait, No Preemption, Circular Dependency.</p>
              </div>
            </div>
            <button class="btn btn-success font-mono" onclick="DeadlockModule.resolveDeadlock()">
              RESOLVE DEADLOCK (PREEMPT RESOURCE)
            </button>
          </div>
        `;
      } else {
        statusContainer.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.12); border: 2px solid var(--accent-emerald); border-radius: 12px; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div style="display:flex; align-items:center; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); display: flex; align-items: center; justify-content: center; color: var(--accent-emerald);">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div>
                <h3 style="color: var(--accent-emerald); font-size: 1.2rem; font-weight: 700; font-family: var(--font-mono);">SAFE STATE CONFIRMED (NO DEADLOCK)</h3>
                <p style="color: var(--text-secondary); font-size: 0.85rem;">Resource request graph is acyclic. Safe Execution Sequence: <strong>${data.deadlockState.safeSequence.join(' ➔ ')}</strong></p>
              </div>
            </div>
            <button class="btn btn-danger font-mono" onclick="DeadlockModule.induceDeadlock()">
              SIMULATE CIRCULAR DEADLOCK
            </button>
          </div>
        `;
      }
    }

    // RAG Diagram Rendering
    const ragContainer = document.getElementById('rag-diagram-container');
    if (ragContainer) {
      if (isDeadlocked) {
        ragContainer.innerHTML = `
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 1.75rem; text-align: center;">
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--accent-rose); margin-bottom: 1.25rem;">
              CYCLE DETECTED: [Hall H-01] ➔ [Thread I-02] ➔ [Hall H-02] ➔ [Thread I-01] ➔ [Hall H-01]
            </div>

            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; align-items: center; margin: 1.5rem 0;">
              <div style="background: var(--bg-surface); border: 2px solid var(--accent-rose); border-radius: 8px; padding: 1rem;">
                <div style="color: var(--accent-cyan); font-weight: 700;">Hall H-01</div>
                <div style="font-size: 0.75rem; color: var(--accent-amber);">Allocated to B1</div>
                <div style="font-size: 0.75rem; color: var(--accent-rose); font-weight: 600;">Waiting for I-02 ➔</div>
              </div>

              <div style="background: var(--bg-surface); border: 2px solid var(--accent-rose); border-radius: 50px; padding: 1rem;">
                <div style="color: var(--accent-emerald); font-weight: 700;">Proctor I-02</div>
                <div style="font-size: 0.75rem; color: var(--accent-amber);">Assigned to H-02</div>
                <div style="font-size: 0.75rem; color: var(--accent-rose); font-weight: 600;">Waiting for H-02 ➔</div>
              </div>

              <div style="background: var(--bg-surface); border: 2px solid var(--accent-rose); border-radius: 8px; padding: 1rem;">
                <div style="color: var(--accent-cyan); font-weight: 700;">Hall H-02</div>
                <div style="font-size: 0.75rem; color: var(--accent-amber);">Allocated to B2</div>
                <div style="font-size: 0.75rem; color: var(--accent-rose); font-weight: 600;">Waiting for I-01 ➔</div>
              </div>

              <div style="background: var(--bg-surface); border: 2px solid var(--accent-rose); border-radius: 50px; padding: 1rem;">
                <div style="color: var(--accent-emerald); font-weight: 700;">Proctor I-01</div>
                <div style="font-size: 0.75rem; color: var(--accent-amber);">Assigned to H-01</div>
                <div style="font-size: 0.75rem; color: var(--accent-rose); font-weight: 600;">Waiting for H-01 ➔</div>
              </div>
            </div>

            <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 6px;">
              System cannot allocate resources without preemption. Neither Batch B1 nor Batch B2 can commence.
            </div>
          </div>
        `;
      } else {
        ragContainer.innerHTML = `
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 1.75rem; text-align: center;">
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--accent-emerald); margin-bottom: 1.25rem;">
              DIRECTED ACYCLIC GRAPH (DAG) - SAFE ALLOCATION MATRIX
            </div>

            <div style="display: flex; justify-content: space-around; align-items: center; margin: 1.5rem 0; flex-wrap: wrap; gap: 1rem;">
              <div style="background: var(--bg-surface); border: 2px solid var(--accent-emerald); border-radius: 8px; padding: 1rem; min-width: 130px;">
                <div style="color: var(--accent-cyan); font-weight: 700;">Hall H-01</div>
                <div style="font-size: 0.75rem; color: var(--accent-emerald);">Held by Batch A</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Capacity: 60</div>
              </div>

              <div style="color: var(--accent-emerald); font-size: 1.4rem;">➔</div>

              <div style="background: var(--bg-surface); border: 2px solid var(--accent-emerald); border-radius: 50px; padding: 1rem; min-width: 130px;">
                <div style="color: var(--accent-emerald); font-weight: 700;">Thread T01</div>
                <div style="font-size: 0.75rem; color: var(--accent-emerald);">Assigned to H-01</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Priority: 1</div>
              </div>

              <div style="color: var(--accent-emerald); font-size: 1.4rem;">➔</div>

              <div style="background: var(--bg-surface); border: 2px solid var(--accent-emerald); border-radius: 8px; padding: 1rem; min-width: 130px;">
                <div style="color: var(--accent-cyan); font-weight: 700;">Hall H-02</div>
                <div style="font-size: 0.75rem; color: var(--accent-emerald);">Held by Batch B</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Capacity: 55</div>
              </div>

              <div style="color: var(--accent-emerald); font-size: 1.4rem;">➔</div>

              <div style="background: var(--bg-surface); border: 2px solid var(--accent-emerald); border-radius: 50px; padding: 1rem; min-width: 130px;">
                <div style="color: var(--accent-emerald); font-weight: 700;">Thread T02</div>
                <div style="font-size: 0.75rem; color: var(--accent-emerald);">Assigned to H-02</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Priority: 2</div>
              </div>
            </div>

            <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent-emerald); background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: 6px;">
              Safe sequence validated: Batch B1 completes first, releases Hall H-01 & Proctor T01, allowing Batch B2 to execute.
            </div>
          </div>
        `;
      }
    }
  },

  induceDeadlock() {
    ExamOS.data.deadlockState.isDeadlocked = true;
    ExamOS.data.deadlockState.statusText = 'DEADLOCK DETECTED (CIRCULAR WAIT)';
    ExamOS.data.deadlockState.safeSequence = [];
    ExamOS.saveState();
    ExamOS.logAudit('CO3: Deadlock Monitor', 'Simulated circular hold-and-wait dependency between H-01, I-02, H-02, I-01. Deadlock induced!', 'deadlock');
    ExamOS.showToast('Deadlock condition induced! Circular wait detected.', 'danger');
    this.render();
  },

  resolveDeadlock() {
    ExamOS.data.deadlockState.isDeadlocked = false;
    ExamOS.data.deadlockState.statusText = 'SAFE STATE - NO DEADLOCK DETECTED';
    ExamOS.data.deadlockState.safeSequence = ['Batch-CO5K-A', 'Batch-CO5K-B', 'Batch-CO5K-C', 'Batch-IF5K-A'];
    ExamOS.saveState();
    ExamOS.logAudit('CO3: Deadlock Monitor', 'Preempted Proctor I-02 token. Broke circular wait cycle. Restored SAFE state.', 'safe');
    ExamOS.showToast('Resource preemption successful! System returned to SAFE STATE.', 'success');
    this.render();
  },
};

window.DeadlockModule = DeadlockModule;
