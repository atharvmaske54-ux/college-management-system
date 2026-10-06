/**
 * College Exam Hall Management System - OS Concept Simulator
 * Module: CO5 Directory Management - Department-Wise Tree Directory (Vanilla JS)
 */

const DirectoryModule = {
  selectedNode: null,

  render() {
    const data = ExamOS.data;
    const treeRoot = data.directoryTree;

    const treeContainer = document.getElementById('directory-tree-view');
    if (treeContainer) {
      treeContainer.innerHTML = this.buildTreeHTML(treeRoot, '/');
      this.bindTreeEvents();
    }

    // Default select first file if none selected
    if (!this.selectedNode) {
      const firstFile = treeRoot.children[0]?.children[0]?.children[0];
      if (firstFile) this.selectNode(firstFile, '/College_Exam/Computer_Engineering/OS/Seating.txt');
    }
  },

  buildTreeHTML(node, currentPath) {
    const path = currentPath === '/' ? `/${node.name}` : `${currentPath}/${node.name}`;

    if (node.type === 'file') {
      return `
        <div class="tree-node tree-file" data-path="${path}" onclick="DirectoryModule.handleNodeClick(event, this)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span>${node.name}</span>
          <span style="margin-left:auto; font-size:0.7rem; color:var(--text-muted);">${node.size || '4 KB'}</span>
        </div>
      `;
    }

    const isRoot = node.type === 'root';
    const childrenHTML = (node.children || [])
      .map((child) => this.buildTreeHTML(child, path))
      .join('');

    return `
      <div>
        <div class="tree-node tree-folder ${isRoot ? 'tree-root font-mono text-cyan' : ''}" data-path="${path}" onclick="DirectoryModule.handleNodeClick(event, this)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${isRoot ? 'var(--accent-cyan)' : 'var(--accent-amber)'}" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          <strong style="${isRoot ? 'color:var(--accent-cyan);' : ''}">${node.name}</strong>
        </div>
        <div class="tree-children">
          ${childrenHTML}
        </div>
      </div>
    `;
  },

  handleNodeClick(event, element) {
    event.stopPropagation();
    document.querySelectorAll('.tree-node').forEach((n) => n.classList.remove('selected'));
    element.classList.add('selected');

    const path = element.getAttribute('data-path');
    const node = this.findNodeByPath(ExamOS.data.directoryTree, path.split('/').filter(Boolean));
    if (node) {
      this.selectNode(node, path);
    }
  },

  findNodeByPath(root, pathParts) {
    if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === root.name)) {
      return root;
    }

    let current = root;
    for (let i = 1; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (!current.children) return null;
      current = current.children.find((c) => c.name === part);
      if (!current) return null;
    }
    return current;
  },

  selectNode(node, path) {
    this.selectedNode = { node, path };
    const detailsContainer = document.getElementById('directory-file-details');
    if (!detailsContainer) return;

    if (node.type === 'file') {
      detailsContainer.innerHTML = `
        <div class="card" style="border-left: 3px solid var(--accent-cyan);">
          <div class="card-header">
            <div>
              <span class="badge badge-cyan font-mono">${node.permissions || '-rw-r--r--'}</span>
              <h3 class="card-title font-mono" style="margin-top:0.35rem;">${node.name}</h3>
              <p class="card-subtitle font-mono" style="font-size:0.75rem;">${path}</p>
            </div>
            <span class="badge badge-safe font-mono">FILE INODE</span>
          </div>

          <div style="font-family: var(--font-mono); font-size: 0.82rem; display: grid; grid-template-columns: 140px 1fr; gap: 0.4rem; margin-bottom: 1rem; color: var(--text-secondary);">
            <span>File Size:</span> <strong>${node.size || '12 KB'}</strong>
            <span>Allocated Blocks:</span> <strong style="color:var(--accent-cyan);">${node.blocks || 'Consecutive'}</strong>
            <span>File Owner:</span> <strong>${node.owner || 'exam_admin'}</strong>
            <span>Created Timestamp:</span> <strong>${node.date || '2026-10-06'}</strong>
          </div>

          <div style="margin-top: 1rem;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono); margin-bottom:0.35rem; text-transform:uppercase;">
              FILE CONTENT PREVIEW (/bin/cat):
            </div>
            <pre style="background: rgba(15, 23, 42, 0.9); padding: 1rem; border-radius: 6px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.8rem; color: #e2e8f0; white-space: pre-wrap; line-height: 1.6;">${node.content || 'Empty seating record file.'}</pre>
          </div>
        </div>
      `;
    } else {
      detailsContainer.innerHTML = `
        <div class="card" style="border-left: 3px solid var(--accent-amber);">
          <div class="card-header">
            <div>
              <span class="badge badge-amber font-mono">DIRECTORY (d)</span>
              <h3 class="card-title font-mono" style="margin-top:0.35rem;">${node.name}</h3>
              <p class="card-subtitle font-mono" style="font-size:0.75rem;">${path}</p>
            </div>
            <span class="badge badge-amber font-mono">${(node.children || []).length} ENTRIES</span>
          </div>

          <div style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-secondary); line-height: 1.8;">
            <div>Directory Type: <strong>Tree-Structured Department Inode</strong></div>
            <div>Contains: <strong>${(node.children || []).length} subdirectories / exam files</strong></div>
            <div style="margin-top:0.75rem;">Sub-elements:</div>
            <ul style="padding-left:1.5rem; color:var(--accent-cyan);">
              ${(node.children || []).map((c) => `<li>${c.name} (${c.type})</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }
  },

  bindTreeEvents() {
    // Handled inline via onclick
  },
};

window.DirectoryModule = DirectoryModule;
