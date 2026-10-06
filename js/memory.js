/**
 * College Exam Hall Management System - OS Concept Simulator
 * Module: CO4 Memory Management - Seating Pages & LRU Replacement (Vanilla JS)
 */

const MemoryModule = {
  render() {
    const data = ExamOS.data;
    const mem = data.memory;

    // 1. Frame Cards
    const framesContainer = document.getElementById('memory-frames-grid');
    if (framesContainer) {
      framesContainer.innerHTML = [1, 2, 3, 4]
        .map((frameNum) => {
          const frameData = mem.activeFrames.find((f) => f.frameId === frameNum);
          if (frameData) {
            return `
            <div class="frame-slot-card occupied">
              <div class="frame-slot-badge">FRAME 0${frameNum}</div>
              <div class="frame-page-id">Page ${frameData.pageNumber}</div>
              <div class="frame-seat-range">
                <strong>${frameData.hallId}</strong> &bull; ${frameData.seatRange}
              </div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:0.35rem; font-family:var(--font-mono);">
                Last Access: t=${frameData.lastAccessTime}
              </div>
            </div>
          `;
          } else {
            return `
            <div class="frame-slot-card">
              <div class="frame-slot-badge" style="color:var(--text-muted);">FRAME 0${frameNum}</div>
              <div class="frame-page-id" style="color:var(--text-muted); font-size:1rem;">EMPTY</div>
              <div class="frame-seat-range" style="color:var(--text-muted);">Unallocated</div>
            </div>
          `;
          }
        })
        .join('');
    }

    // 2. Metrics & Hit Ratio
    const hitsEl = document.getElementById('mem-hits-count');
    const faultsEl = document.getElementById('mem-faults-count');
    const ratioEl = document.getElementById('mem-hit-ratio');
    const totalRequests = mem.pageHits + mem.pageFaults;
    const ratio = totalRequests > 0 ? Math.round((mem.pageHits / totalRequests) * 100) : 0;

    if (hitsEl) hitsEl.textContent = mem.pageHits;
    if (faultsEl) faultsEl.textContent = mem.pageFaults;
    if (ratioEl) ratioEl.textContent = `${ratio}%`;

    // 3. Reference String Stream
    const streamEl = document.getElementById('mem-reference-stream');
    if (streamEl) {
      streamEl.innerHTML = mem.referenceHistory
        .map((pNum) => `<span class="badge badge-cyan font-mono" style="font-size:0.8rem; padding:0.25rem 0.5rem;">P${pNum}</span>`)
        .join(' ');
    }

    // 4. Seating Plan Paging Table
    const tbody = document.getElementById('seating-pages-tbody');
    if (tbody) {
      tbody.innerHTML = mem.allPages
        .map((p) => {
          const loadedFrame = mem.activeFrames.find((f) => f.pageNumber === p.pageNumber);
          const isLoaded = !!loadedFrame;
          return `
          <tr>
            <td><strong class="font-mono text-cyan" style="color:var(--accent-cyan);">Page ${p.pageNumber}</strong></td>
            <td><span class="badge badge-cyan">${p.hallId}</span></td>
            <td><span class="font-mono">${p.seatRange}</span></td>
            <td>
              <span class="badge ${isLoaded ? 'badge-running' : 'badge-completed'}">
                ${isLoaded ? `LOADED IN FRAME ${loadedFrame.frameId}` : 'SECONDARY DISK STORAGE'}
              </span>
            </td>
            <td>
              <button class="btn btn-outline btn-sm font-mono" onclick="MemoryModule.requestPage(${p.pageNumber})">
                REQUEST PAGE ${p.pageNumber}
              </button>
            </td>
          </tr>
        `;
        })
        .join('');
    }
  },

  // Genuine LRU Algorithm Implementation
  requestPage(pageNumber) {
    const data = ExamOS.data;
    const mem = data.memory;
    const currentTime = Date.now() % 100000;

    const pageMeta = mem.allPages.find((p) => p.pageNumber === pageNumber) || {
      pageNumber,
      hallId: `H-0${(pageNumber % 3) + 1}`,
      seatRange: `Seats ${(pageNumber - 1) * 20 + 1}–${pageNumber * 20}`,
    };

    // Check if page already exists in one of the active frames (HIT)
    const existingFrame = mem.activeFrames.find((f) => f.pageNumber === pageNumber);

    if (existingFrame) {
      mem.pageHits++;
      existingFrame.lastAccessTime = currentTime;
      ExamOS.logAudit('CO4: Memory Paging', `Page ${pageNumber} accessed ➔ PAGE HIT in Frame ${existingFrame.frameId}`, 'success');
      ExamOS.showToast(`Page ${pageNumber} accessed: PAGE HIT in Frame ${existingFrame.frameId}!`, 'success');
    } else {
      // PAGE FAULT
      mem.pageFaults++;

      if (mem.activeFrames.length < mem.frameCapacity) {
        // Free frame available
        const nextFrameId = mem.activeFrames.length + 1;
        mem.activeFrames.push({
          frameId: nextFrameId,
          pageNumber,
          hallId: pageMeta.hallId,
          seatRange: pageMeta.seatRange,
          lastAccessTime: currentTime,
        });

        ExamOS.logAudit('CO4: Memory Paging', `Page ${pageNumber} loaded into empty Frame ${nextFrameId} ➔ PAGE FAULT`, 'warning');
        ExamOS.showToast(`Page ${pageNumber} loaded into Frame ${nextFrameId} (Page Fault)`, 'warning');
      } else {
        // Frames are full: Apply Least Recently Used (LRU)
        // Find victim frame with minimum lastAccessTime
        let victimIndex = 0;
        let minAccess = mem.activeFrames[0].lastAccessTime;

        for (let i = 1; i < mem.activeFrames.length; i++) {
          if (mem.activeFrames[i].lastAccessTime < minAccess) {
            minAccess = mem.activeFrames[i].lastAccessTime;
            victimIndex = i;
          }
        }

        const victim = mem.activeFrames[victimIndex];
        const replacedPageNum = victim.pageNumber;

        // Replace victim with requested page
        victim.pageNumber = pageNumber;
        victim.hallId = pageMeta.hallId;
        victim.seatRange = pageMeta.seatRange;
        victim.lastAccessTime = currentTime;

        ExamOS.logAudit(
          'CO4: Memory Paging',
          `PAGE FAULT: LRU evicted Page ${replacedPageNum} from Frame ${victim.frameId}; Loaded Page ${pageNumber}`,
          'warning'
        );
        ExamOS.showToast(`LRU Evicted Page ${replacedPageNum} from Frame ${victim.frameId}. Loaded Page ${pageNumber}!`, 'warning');
      }
    }

    mem.referenceHistory.push(pageNumber);
    if (mem.referenceHistory.length > 14) mem.referenceHistory.shift();

    ExamOS.saveState();
    this.render();
  },

  handleSimulateSequence(e) {
    e.preventDefault();
    const input = document.getElementById('lru-sequence-input');
    if (!input || !input.value.trim()) return;

    const sequence = input.value
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    if (sequence.length === 0) {
      ExamOS.showToast('Please enter valid comma-separated page numbers (e.g. 1, 2, 3, 2, 5).', 'warning');
      return;
    }

    ExamOS.showToast(`Simulating LRU reference sequence with ${sequence.length} requests...`, 'info');
    sequence.forEach((pNum) => {
      this.requestPage(pNum);
    });
  },

  resetCounters() {
    ExamOS.data.memory.pageHits = 0;
    ExamOS.data.memory.pageFaults = 0;
    ExamOS.data.memory.referenceHistory = [];
    ExamOS.saveState();
    ExamOS.showToast('Memory page hit and fault counters reset.', 'info');
    this.render();
  },
};

window.MemoryModule = MemoryModule;
