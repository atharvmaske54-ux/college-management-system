# College Exam Hall Management System – OS Concept Simulator

A web-based interactive Operating System simulator demonstrating core OS resource management concepts applied to a college examination event.

Built strictly using **Pure HTML5, CSS3, and Vanilla JavaScript** (Zero frameworks, Zero external runtime dependencies).

---

## 🎯 Course Outcomes (CO) Mapping

| Course Outcome | OS Concept Simulated | Project Implementation |
|---|---|---|
| **CO1** | Operating System Services & Types | Host OS metrics dashboard & classification as a **Batch Processing OS Scenario**. |
| **CO2** | Process & Multithreading Management | Student exam sessions as **Processes (with PCB)**; Invigilators as **Threads in a Thread Pool**. |
| **CO3** | CPU Scheduling & Deadlock Detection | Exam hall allocation via **FCFS**; Invigilator dispatch via **Priority Scheduling**; Resource Allocation Graph (**RAG**) circular wait cycle detection. |
| **CO4** | Memory Management & Paging | Exam hall seating represented as **Memory Pages** (20 seats/page); working **LRU Page Replacement** with hit/fault counters. |
| **CO5** | File Management & Directory Structure | **Contiguous File Allocation** on a 64-block disk map; department-wise **Tree-Structured Directory** (`/College_Exam`). |

---

## 📁 Project Structure

```text
OSY_MICROPROJECT/
├── index.html                 # Main single-page application & all 10 module views
├── css/
│   └── style.css              # Shared pure CSS3 design system (modern dark slate theme)
├── js/
│   ├── app.js                 # Core state store (localStorage), navigation, toast notifications, modals, audit logger
│   ├── dashboard.js           # CO1 System info, batch processing classification, and summary reports
│   ├── process-manager.js     # CO2 Student processes, state transitions, PCB inspector, invigilator threads
│   ├── scheduling.js          # CO3 FCFS hall allocation and Priority invigilator scheduling
│   ├── deadlock.js            # CO3 Deadlock detection, Resource Allocation Graph (RAG), safe state simulation
│   ├── memory.js              # CO4 Seating plan paging and working LRU page replacement algorithm
│   ├── file-manager.js        # CO5 Contiguous file allocation simulator and 64-block visual disk map
│   └── directory.js           # CO5 Department-wise hierarchical tree directory and file content previewer
├── backup_react_version/      # Safe backup of initial React/Vite scaffolding
└── SRS FOR OSY PBL.pdf        # Project specification document
```

---

## 🚀 How to Run

### Option 1: Double click or open in browser
Simply double-click `index.html` or open it with Google Chrome, Microsoft Edge, or Mozilla Firefox.

### Option 2: Using Python (Recommended)
```bash
python -m http.server 8080
```
Then visit: `http://localhost:8080`

### Option 3: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

---

## 💡 Key Interactive Features

1. **CO1 - System Information**: Live uptime clock, POSIX kernel parameters, and batch processing scenario justification.
2. **CO2 - Student Processes**: Interactive state transitions (`READY` ➔ `RUNNING` ➔ `WAITING` ➔ `COMPLETED`), modal to create processes, and Process Control Block (PCB) inspector.
3. **CO2 - Invigilator Threads**: Multithreading pool model with live status controls (`ACTIVE`, `IDLE`, `BLOCKED`).
4. **CO3 - FCFS Hall Allocation**: First-Come, First-Served queue for exam batches with real-time capacity and occupancy bars.
5. **CO3 - Priority Scheduling**: Priority-based invigilator dispatch (Priority 1 = Highest preference) and Gantt timeline view.
6. **CO3 - Deadlock Detection**: Visual Resource Allocation Graph (RAG), toggle between **SAFE STATE** and **DEADLOCK DETECTED (CIRCULAR WAIT)** with preemption resolution.
7. **CO4 - LRU Page Replacement**: Real, calculated LRU replacement across 4 physical memory frames with page hits, page faults, and reference sequence simulation.
8. **CO5 - Contiguous File Allocation**: 64-block visual disk map with first-fit contiguous block search and external fragmentation detection.
9. **CO5 - Department Directory**: Interactive hierarchical file tree with file metadata, permissions (`-rw-r--r--`), and text previewer.
10. **Reports & Viva Summary**: Complete examination management summary report ready for presentation and viva demonstrations.
