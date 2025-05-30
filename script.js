// DOM Elements
const currentDateEl = document.getElementById('current-date');
const currentTimeEl = document.getElementById('current-time');
const themeToggleBtn = document.getElementById('theme-toggle');
const totalPatientsEl = document.getElementById('total-patients');
const waitingPatientsEl = document.getElementById('waiting-patients');
const inTreatmentEl = document.getElementById('in-treatment');
const completedEl = document.getElementById('completed');
const queueListEl = document.getElementById('queue-list');
const departmentsContainerEl = document.getElementById('departments-container');
const addPatientBtn = document.getElementById('add-patient');
const addPatientModal = document.getElementById('add-patient-modal');
const editPatientModal = document.getElementById('edit-patient-modal');
const closeModalBtn = document.querySelector('.close-modal');
const closeEditModalBtn = document.querySelector('.close-edit-modal');
const cancelAddBtn = document.getElementById('cancel-add');
const cancelEditBtn = document.getElementById('cancel-edit');
const patientForm = document.getElementById('patient-form');
const editPatientForm = document.getElementById('edit-patient-form');

// App State
let patients = [];
let currentEditingPatientId = null;
let departments = [
  { id: 'general', name: 'General Medicine', capacity: 5, currentPatients: 0 },
  { id: 'cardiology', name: 'Cardiology', capacity: 3, currentPatients: 0 },
  { id: 'orthopedics', name: 'Orthopedics', capacity: 4, currentPatients: 0 },
  { id: 'pediatrics', name: 'Pediatrics', capacity: 4, currentPatients: 0 },
  { id: 'neurology', name: 'Neurology', capacity: 2, currentPatients: 0 }
];

// Initialize the app
function init() {
  // Load data from localStorage if available
  loadData();
  
  // Update date and time
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Update wait times
  setInterval(updateWaitTimes, 60000);
  
  // Render initial UI
  renderStats();
  renderQueue();
  renderDepartments();
  
  // Set up event listeners
  setupEventListeners();
  
  // Check for saved theme preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = 'Light Mode';
  }
}

// Load data from localStorage
function loadData() {
  const savedPatients = localStorage.getItem('patients');
  if (savedPatients) {
    patients = JSON.parse(savedPatients);
    
    // Convert string dates back to Date objects
    patients.forEach(patient => {
      patient.arrivalTime = new Date(patient.arrivalTime);
      if (patient.startTime) {
        patient.startTime = new Date(patient.startTime);
      }
      if (patient.endTime) {
        patient.endTime = new Date(patient.endTime);
      }
    });
  } else {
    // Add some mock data if no data exists
    generateMockData();
  }
  
  // Update department counts based on patients
  updateDepartmentCounts();
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('patients', JSON.stringify(patients));
}

// Generate mock data for demonstration
function generateMockData() {
  const mockPatients = [
    {
      id: 1,
      token: 'A001',
      name: 'John Smith',
      age: 45,
      gender: 'male',
      department: 'cardiology',
      priority: 'normal',
      status: 'waiting',
      arrivalTime: new Date(Date.now() - 45 * 60000), // 45 minutes ago
    },
    {
      id: 2,
      token: 'A002',
      name: 'Sarah Johnson',
      age: 32,
      gender: 'female',
      department: 'general',
      priority: 'urgent',
      status: 'in-progress',
      arrivalTime: new Date(Date.now() - 60 * 60000), // 60 minutes ago
      startTime: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    },
    {
      id: 3,
      token: 'A003',
      name: 'Michael Brown',
      age: 28,
      gender: 'male',
      department: 'orthopedics',
      priority: 'normal',
      status: 'completed',
      arrivalTime: new Date(Date.now() - 120 * 60000), // 120 minutes ago
      startTime: new Date(Date.now() - 90 * 60000), // 90 minutes ago
      endTime: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    },
    {
      id: 4,
      token: 'A004',
      name: 'Emily Davis',
      age: 8,
      gender: 'female',
      department: 'pediatrics',
      priority: 'emergency',
      status: 'waiting',
      arrivalTime: new Date(Date.now() - 10 * 60000), // 10 minutes ago
    },
    {
      id: 5,
      token: 'A005',
      name: 'Robert Wilson',
      age: 67,
      gender: 'male',
      department: 'neurology',
      priority: 'normal',
      status: 'waiting',
      arrivalTime: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    }
  ];
  
  patients = mockPatients;
  saveData();
}

// Update department counts based on current patients
function updateDepartmentCounts() {
  // Reset counts
  departments.forEach(dept => {
    dept.currentPatients = 0;
    dept.waitingPatients = 0;
  });
  
  // Count patients by department and status
  patients.forEach(patient => {
    const dept = departments.find(d => d.id === patient.department);
    if (dept) {
      if (patient.status === 'in-progress') {
        dept.currentPatients++;
      } else if (patient.status === 'waiting') {
        dept.waitingPatients = (dept.waitingPatients || 0) + 1;
      }
    }
  });
}

// Set up event listeners
function setupEventListeners() {
  // Theme toggle
  themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Add patient button
  addPatientBtn.addEventListener('click', () => {
    addPatientModal.style.display = 'flex';
  });
  
  // Close modals
  closeModalBtn.addEventListener('click', () => {
    addPatientModal.style.display = 'none';
  });
  
  closeEditModalBtn.addEventListener('click', () => {
    editPatientModal.style.display = 'none';
  });
  
  // Cancel buttons
  cancelAddBtn.addEventListener('click', () => {
    addPatientModal.style.display = 'none';
    patientForm.reset();
  });
  
  cancelEditBtn.addEventListener('click', () => {
    editPatientModal.style.display = 'none';
    editPatientForm.reset();
  });
  
  // Submit forms
  patientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewPatient();
  });
  
  editPatientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updatePatient();
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === addPatientModal) {
      addPatientModal.style.display = 'none';
    }
    if (e.target === editPatientModal) {
      editPatientModal.style.display = 'none';
    }
  });
  
  // Queue item action buttons
  queueListEl.addEventListener('click', handleQueueActions);
}

// Toggle dark/light theme
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  themeToggleBtn.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

// Update date and time display
function updateDateTime() {
  const now = new Date();
  
  // Format date: Monday, January 1, 2023
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateEl.textContent = now.toLocaleDateString('en-US', dateOptions);
  
  // Format time: 12:00:00 PM
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  currentTimeEl.textContent = now.toLocaleTimeString('en-US', timeOptions);
}

// Update wait times for all patients
function updateWaitTimes() {
  renderQueue(); // Re-render to update wait times
}

// Calculate wait time for display
function calculateWaitTime(patient) {
  const now = new Date();
  let waitTime;
  
  if (patient.status === 'waiting') {
    // For waiting patients, calculate time since arrival
    waitTime = Math.floor((now - patient.arrivalTime) / 60000); // in minutes
  } else if (patient.status === 'in-progress') {
    // For in-progress patients, calculate time since treatment started
    waitTime = Math.floor((now - patient.startTime) / 60000); // in minutes
  } else if (patient.status === 'completed') {
    // For completed patients, calculate total treatment time
    waitTime = Math.floor((patient.endTime - patient.startTime) / 60000); // in minutes
  }
  
  // Format the wait time
  if (waitTime < 60) {
    return `${waitTime} min`;
  } else {
    const hours = Math.floor(waitTime / 60);
    const minutes = waitTime % 60;
    return `${hours}h ${minutes}m`;
  }
}

// Render statistics
function renderStats() {
  const total = patients.length;
  const waiting = patients.filter(p => p.status === 'waiting').length;
  const inTreatment = patients.filter(p => p.status === 'in-progress').length;
  const completed = patients.filter(p => p.status === 'completed').length;
  
  totalPatientsEl.textContent = total;
  waitingPatientsEl.textContent = waiting;
  inTreatmentEl.textContent = inTreatment;
  completedEl.textContent = completed;
}

// Render queue
function renderQueue() {
  queueListEl.innerHTML = '';
  
  // Sort patients: emergency first, then urgent, then by arrival time
  const sortedPatients = [...patients].sort((a, b) => {
    if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
    if (a.priority !== 'emergency' && b.priority === 'emergency') return 1;
    if (a.priority === 'urgent' && b.priority !== 'urgent' && b.priority !== 'emergency') return -1;
    if (a.priority !== 'urgent' && a.priority !== 'emergency' && b.priority === 'urgent') return 1;
    return a.arrivalTime - b.arrivalTime;
  });
  
  sortedPatients.forEach(patient => {
    const waitTime = calculateWaitTime(patient);
    const deptName = departments.find(d => d.id === patient.department)?.name || patient.department;
    
    const queueItem = document.createElement('div');
    queueItem.className = `queue-item priority-${patient.priority}`;
    queueItem.dataset.id = patient.id;
    
    queueItem.innerHTML = `
      <div>${patient.token}</div>
      <div>${patient.name}</div>
      <div>${deptName}</div>
      <div>${waitTime}</div>
      <div><span class="status status-${patient.status}">${formatStatus(patient.status)}</span></div>
      <div class="actions">
        ${getActionButtons(patient)}
      </div>
    `;
    
    queueListEl.appendChild(queueItem);
  });
}

// Format status for display
function formatStatus(status) {
  switch (status) {
    case 'waiting': return 'Waiting';
    case 'in-progress': return 'In Progress';
    case 'completed': return 'Completed';
    default: return status;
  }
}

// Get action buttons based on patient status
function getActionButtons(patient) {
  let buttons = `<button class="btn btn-secondary btn-sm edit-btn" data-id="${patient.id}">Edit</button>`;
  
  if (patient.status === 'waiting') {
    buttons += `
      <button class="btn btn-primary btn-sm start-btn" data-id="${patient.id}">Start</button>
      <button class="btn btn-danger btn-sm cancel-btn" data-id="${patient.id}">Cancel</button>
    `;
  } else if (patient.status === 'in-progress') {
    buttons += `
      <button class="btn btn-success btn-sm complete-btn" data-id="${patient.id}">Complete</button>
    `;
  } else {
    buttons += `
      <button class="btn btn-secondary btn-sm remove-btn" data-id="${patient.id}">Remove</button>
    `;
  }
  
  return buttons;
}

// Handle queue action buttons
function handleQueueActions(e) {
  const patientId = e.target.dataset.id;
  
  if (e.target.classList.contains('start-btn')) {
    startTreatment(patientId);
  } else if (e.target.classList.contains('complete-btn')) {
    completeTreatment(patientId);
  } else if (e.target.classList.contains('cancel-btn')) {
    cancelPatient(patientId);
  } else if (e.target.classList.contains('remove-btn')) {
    removePatient(patientId);
  } else if (e.target.classList.contains('edit-btn')) {
    openEditModal(patientId);
  }
}

// Open edit modal and populate with patient data
function openEditModal(patientId) {
  const patient = patients.find(p => p.id == patientId);
  if (!patient) return;
  
  // Set current editing patient ID
  currentEditingPatientId = patientId;
  
  // Populate form fields
  document.getElementById('edit-patient-name').value = patient.name;
  document.getElementById('edit-patient-age').value = patient.age;
  document.getElementById('edit-patient-gender').value = patient.gender;
  document.getElementById('edit-patient-department').value = patient.department;
  document.getElementById('edit-patient-priority').value = patient.priority;
  document.getElementById('edit-patient-status').value = patient.status;
  
  // Show modal
  editPatientModal.style.display = 'flex';
}

// Update patient data
function updatePatient() {
  if (!currentEditingPatientId) return;
  
  const patientIndex = patients.findIndex(p => p.id == currentEditingPatientId);
  if (patientIndex === -1) return;
  
  const patient = patients[patientIndex];
  const oldDepartment = patient.department;
  const oldStatus = patient.status;
  
  // Get form values
  const name = document.getElementById('edit-patient-name').value;
  const age = document.getElementById('edit-patient-age').value;
  const gender = document.getElementById('edit-patient-gender').value;
  const department = document.getElementById('edit-patient-department').value;
  const priority = document.getElementById('edit-patient-priority').value;
  const status = document.getElementById('edit-patient-status').value;
  
  // Update patient object
  patient.name = name;
  patient.age = parseInt(age);
  patient.gender = gender;
  patient.department = department;
  patient.priority = priority;
  
  // Handle status changes
  if (status !== oldStatus) {
    patient.status = status;
    
    if (status === 'in-progress' && !patient.startTime) {
      patient.startTime = new Date();
    } else if (status === 'completed' && !patient.endTime) {
      patient.endTime = new Date();
    }
  }
  
  // Update UI
  updateDepartmentCounts();
  saveData();
  renderStats();
  renderQueue();
  renderDepartments();
  
  // Close modal
  editPatientModal.style.display = 'none';
  editPatientForm.reset();
  currentEditingPatientId = null;
}

// Start treatment for a patient
function startTreatment(patientId) {
  const patient = patients.find(p => p.id == patientId);
  if (patient) {
    patient.status = 'in-progress';
    patient.startTime = new Date();
    
    updateDepartmentCounts();
    saveData();
    renderStats();
    renderQueue();
    renderDepartments();
  }
}

// Complete treatment for a patient
function completeTreatment(patientId) {
  const patient = patients.find(p => p.id == patientId);
  if (patient) {
    patient.status = 'completed';
    patient.endTime = new Date();
    
    updateDepartmentCounts();
    saveData();
    renderStats();
    renderQueue();
    renderDepartments();
  }
}

// Cancel a patient
function cancelPatient(patientId) {
  if (confirm('Are you sure you want to cancel this patient?')) {
    patients = patients.filter(p => p.id != patientId);
    
    updateDepartmentCounts();
    saveData();
    renderStats();
    renderQueue();
    renderDepartments();
  }
}

// Remove a patient from the list
function removePatient(patientId) {
  if (confirm('Are you sure you want to remove this patient from the list?')) {
    patients = patients.filter(p => p.id != patientId);
    
    updateDepartmentCounts();
    saveData();
    renderStats();
    renderQueue();
    renderDepartments();
  }
}

// Render departments
function renderDepartments() {
  departmentsContainerEl.innerHTML = '';
  
  departments.forEach(dept => {
    const status = getDepartmentStatus(dept);
    const currentPatient = patients.find(p => p.department === dept.id && p.status === 'in-progress');
    
    const deptCard = document.createElement('div');
    deptCard.className = 'department-card';
    
    deptCard.innerHTML = `
      <h3>
        ${dept.name}
        <span class="status-indicator status-${status}"></span>
      </h3>
      <div class="queue-count">
        <span>${dept.currentPatients}/${dept.capacity} in treatment</span>
        <span>${dept.waitingPatients || 0} waiting</span>
      </div>
      ${currentPatient ? `
        <div class="current-patient">
          <div><strong>Current:</strong> ${currentPatient.name}</div>
          <div><small>Token: ${currentPatient.token}</small></div>
        </div>
      ` : ''}
    `;
    
    departmentsContainerEl.appendChild(deptCard);
  });
}

// Get department status based on capacity
function getDepartmentStatus(dept) {
  const ratio = dept.currentPatients / dept.capacity;
  if (ratio >= 1) return 'full';
  if (ratio >= 0.5) return 'busy';
  return 'available';
}

// Add a new patient
function addNewPatient() {
  const name = document.getElementById('patient-name').value;
  const age = document.getElementById('patient-age').value;
  const gender = document.getElementById('patient-gender').value;
  const department = document.getElementById('patient-department').value;
  const priority = document.getElementById('patient-priority').value;
  
  // Generate a new token
  const lastToken = patients.length > 0 ? patients[patients.length - 1].token : 'A000';
  const tokenNum = parseInt(lastToken.substring(1)) + 1;
  const token = `A${tokenNum.toString().padStart(3, '0')}`;
  
  // Create new patient object
  const newPatient = {
    id: Date.now(), // Use timestamp as ID
    token,
    name,
    age: parseInt(age),
    gender,
    department,
    priority,
    status: 'waiting',
    arrivalTime: new Date()
  };
  
  // Add to patients array
  patients.push(newPatient);
  
  // Update UI
  updateDepartmentCounts();
  saveData();
  renderStats();
  renderQueue();
  renderDepartments();
  
  // Close modal and reset form
  addPatientModal.style.display = 'none';
  patientForm.reset();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);