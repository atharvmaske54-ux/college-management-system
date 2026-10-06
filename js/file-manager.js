/**
 * College Exam Hall Management System - OS Concept Simulator
 * Module: CO5 File Management - Contiguous Disk Allocation (Vanilla JS)
 */

const FileManagerModule = {
  render() {
    const data = ExamOS.data;
    const fs = data.fileSystem;

    // 1. Compute Disk Map Array (0 to 63)
    const diskBlocks = new Array(fs.totalBlocks).fill(null);
    fs.files.forEach((file) => {
      for (let i = file.startBlock; i < file.startBlock + file.length; i++) {
        if (i < fs.totalBlocks) {
          diskBlocks[i] = file;
        }
      }
    });

    // 2. Render 64-Block Disk Grid
    const gridContainer = document.getElementById('disk-blocks-grid');
    if (gridContainer) {
      gridContainer.innerHTML = diskBlocks
        .map((allocatedFile, blockIdx) => {
          if (allocatedFile) {
            const classColor =
              allocatedFile.type === 'os'
                ? 'allocated-os'
                : allocatedFile.type === 'cn'
                ? 'allocated-cn'
                : allocatedFile.type === 'java'
                ? 'allocated-java'
                : allocatedFile.type === 'dbms'
                ? 'allocated-dbms'
                : 'allocated-seat';

            return `
            <div class="disk-block ${classColor}" title="Block ${blockIdx}: Allocated to ${allocatedFile.fileName} (${allocatedFile.department})">
              ${blockIdx}
            </div>
          `;
          } else {
            return `
            <div class="disk-block" title="Block ${blockIdx}: Free Disk Block">
              ${blockIdx}
            </div>
          `;
          }
        })
        .join('');
    }

    // 3. Render Metrics
    const usedBlocks = fs.files.reduce((sum, f) => sum + f.length, 0);
    const freeBlocks = fs.totalBlocks - usedBlocks;
    const usedPercent = Math.round((usedBlocks / fs.totalBlocks) * 100);

    const usedEl = document.getElementById('disk-used-blocks');
    const freeEl = document.getElementById('disk-free-blocks');
    const pctEl = document.getElementById('disk-usage-percent');

    if (usedEl) usedEl.textContent = `${usedBlocks} Blocks`;
    if (freeEl) freeEl.textContent = `${freeBlocks} Blocks`;
    if (pctEl) pctEl.textContent = `${usedPercent}%`;

    // 4. Render Files Table
    const tbody = document.getElementById('files-table-tbody');
    if (tbody) {
      if (fs.files.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem; color:var(--text-muted);">No files allocated on disk yet. Click "+ ALLOCATE NEW EXAM FILE" above to allocate contiguous blocks.</td></tr>';
      } else {
        tbody.innerHTML = fs.files
          .map((f) => {
            const blockRange = `${f.startBlock} ➔ ${f.startBlock + f.length - 1} (${f.length} blocks)`;
            return `
            <tr>
              <td><strong class="font-mono text-cyan" style="color:var(--accent-cyan);">${f.fileName}</strong></td>
              <td>${f.department}</td>
              <td><strong class="font-mono">${f.startBlock}</strong></td>
              <td><span class="font-mono">${f.length * 4} KB (${f.length} blocks)</span></td>
              <td><span class="badge badge-cyan font-mono">${blockRange}</span></td>
              <td><span class="badge badge-safe">CONTIGUOUS</span></td>
              <td>
                <button class="btn btn-outline btn-sm text-rose" style="color:var(--accent-rose);" onclick="FileManagerModule.deleteFile('${f.fileName}')">
                  DEALLOCATE
                </button>
              </td>
            </tr>
          `;
          })
          .join('');
      }
    }
  },

  handleCreateFile(e) {
    e.preventDefault();
    const form = e.target;
    const fileName = form.fileName.value.trim();
    const department = form.department.value;
    const length = parseInt(form.fileSize.value, 10);

    if (!fileName || !length) {
      ExamOS.showToast('Please specify valid file name and size.', 'warning');
      return;
    }

    const data = ExamOS.data;
    const fs = data.fileSystem;

    // Check duplicate name
    if (fs.files.some((f) => f.fileName.toLowerCase() === fileName.toLowerCase())) {
      ExamOS.showToast(`File with name ${fileName} already exists!`, 'danger');
      return;
    }

    // Build boolean occupation array
    const occupied = new Array(fs.totalBlocks).fill(false);
    fs.files.forEach((f) => {
      for (let i = f.startBlock; i < f.startBlock + f.length; i++) {
        if (i < fs.totalBlocks) occupied[i] = true;
      }
    });

    // Genuine First-Fit Contiguous Search
    let startBlock = -1;
    let consecutiveCount = 0;

    for (let i = 0; i < fs.totalBlocks; i++) {
      if (!occupied[i]) {
        consecutiveCount++;
        if (consecutiveCount === length) {
          startBlock = i - length + 1;
          break;
        }
      } else {
        consecutiveCount = 0;
      }
    }

    if (startBlock === -1) {
      ExamOS.showToast(
        `Contiguous Allocation Failed: No consecutive run of ${length} free blocks found! (External Fragmentation)`,
        'danger'
      );
      ExamOS.logAudit('CO5: File Allocation', `FAILED to allocate ${fileName}: External fragmentation prevents contiguous allocation of ${length} blocks.`, 'warning');
      return;
    }

    const newFile = {
      fileName,
      department,
      startBlock,
      length,
      type: 'seat',
      createdDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      content: `Seating arrangement and exam register for ${fileName} (${department}).`,
    };

    fs.files.push(newFile);
    ExamOS.saveState();
    ExamOS.logAudit(
      'CO5: File Allocation',
      `Contiguously allocated ${fileName} at Start Block ${startBlock} (Length: ${length} blocks).`,
      'success'
    );
    ExamOS.showToast(`File ${fileName} allocated at starting block ${startBlock}!`, 'success');

    form.reset();
    ExamOS.closeModal('modal-add-file');
    FileManagerModule.render();
  },

  deleteFile(fileName) {
    if (confirm(`Deallocate and release disk blocks for ${fileName}?`)) {
      const file = ExamOS.data.fileSystem.files.find((f) => f.fileName === fileName);
      if (file) {
        ExamOS.data.fileSystem.files = ExamOS.data.fileSystem.files.filter((f) => f.fileName !== fileName);
        ExamOS.saveState();
        ExamOS.logAudit('CO5: File Allocation', `Deallocated file ${fileName} and freed blocks ${file.startBlock}..${file.startBlock + file.length - 1}.`, 'info');
        ExamOS.showToast(`Deallocated ${fileName}. Freed ${file.length} blocks!`, 'success');
        this.render();
      }
    }
  },
};

window.FileManagerModule = FileManagerModule;
