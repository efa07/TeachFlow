export const mockClasses = [
  { id: "cs101", name: "CS 101 - Introduction to Programming" },
  { id: "cs201", name: "CS 201 - Data Structures" },
  { id: "cs301", name: "CS 301 - Algorithms" },
  { id: "cs401", name: "CS 401 - Machine Learning" },
]

export const mockStudents = [
  {
    id: "STU001",
    name: "Alice Johnson",
    email: "alice@university.edu",
    attendancePercent: 95,
    examAvg: 88,
    assignmentAvg: 92,
  },
  {
    id: "STU002",
    name: "Bob Smith",
    email: "bob@university.edu",
    attendancePercent: 87,
    examAvg: 76,
    assignmentAvg: 84,
  },
  {
    id: "STU003",
    name: "Carol Davis",
    email: "carol@university.edu",
    attendancePercent: 92,
    examAvg: 94,
    assignmentAvg: 96,
  },
  {
    id: "STU004",
    name: "David Wilson",
    email: "david@university.edu",
    attendancePercent: 78,
    examAvg: 72,
    assignmentAvg: 68,
  },
  {
    id: "STU005",
    name: "Emma Brown",
    email: "emma@university.edu",
    attendancePercent: 98,
    examAvg: 91,
    assignmentAvg: 89,
  },
  {
    id: "STU006",
    name: "Frank Miller",
    email: "frank@university.edu",
    attendancePercent: 85,
    examAvg: 82,
    assignmentAvg: 80,
  },
  {
    id: "STU007",
    name: "Grace Lee",
    email: "grace@university.edu",
    attendancePercent: 100,
    examAvg: 97,
    assignmentAvg: 98,
  },
  {
    id: "STU008",
    name: "Henry Taylor",
    email: "henry@university.edu",
    attendancePercent: 72,
    examAvg: 65,
    assignmentAvg: 70,
  },
]

export const mockAttendanceRecords = [
  { studentId: "STU001", name: "Alice Johnson", status: "present" as const, time: "09:02 AM" },
  { studentId: "STU002", name: "Bob Smith", status: "present" as const, time: "09:05 AM" },
  { studentId: "STU003", name: "Carol Davis", status: "late" as const, time: "09:18 AM" },
  { studentId: "STU004", name: "David Wilson", status: "absent" as const, time: "-" },
  { studentId: "STU005", name: "Emma Brown", status: "present" as const, time: "08:58 AM" },
  { studentId: "STU006", name: "Frank Miller", status: "present" as const, time: "09:01 AM" },
  { studentId: "STU007", name: "Grace Lee", status: "present" as const, time: "08:55 AM" },
  { studentId: "STU008", name: "Henry Taylor", status: "absent" as const, time: "-" },
]

export const mockExams = [
  {
    id: "EX001",
    name: "Midterm Exam",
    class: "CS 101",
    date: "2026-02-15",
    questions: 25,
    status: "completed" as const,
  },
  { id: "EX002", name: "Quiz 1", class: "CS 201", date: "2026-01-20", questions: 10, status: "completed" as const },
  { id: "EX003", name: "Final Exam", class: "CS 301", date: "2026-03-10", questions: 40, status: "upcoming" as const },
  { id: "EX004", name: "Pop Quiz", class: "CS 401", date: "2026-01-25", questions: 5, status: "draft" as const },
]

export const mockAssignments = [
  {
    id: "AS001",
    name: "Programming Assignment 1",
    class: "CS 101",
    dueDate: "2026-01-15",
    submissions: 28,
    total: 32,
    status: "grading" as const,
  },
  {
    id: "AS002",
    name: "Lab Report 2",
    class: "CS 201",
    dueDate: "2026-01-18",
    submissions: 25,
    total: 25,
    status: "completed" as const,
  },
  {
    id: "AS003",
    name: "Research Paper",
    class: "CS 301",
    dueDate: "2026-02-01",
    submissions: 15,
    total: 30,
    status: "open" as const,
  },
  {
    id: "AS004",
    name: "ML Project Proposal",
    class: "CS 401",
    dueDate: "2026-01-28",
    submissions: 18,
    total: 22,
    status: "open" as const,
  },
]

export const mockSubmissions = [
  {
    id: "SUB001",
    studentName: "Alice Johnson",
    studentId: "STU001",
    submittedAt: "2026-01-14 11:30 PM",
    plagiarismScore: 12,
    status: "pending" as const,
  },
  {
    id: "SUB002",
    studentName: "Bob Smith",
    studentId: "STU002",
    submittedAt: "2026-01-15 08:45 AM",
    plagiarismScore: 5,
    status: "graded" as const,
    grade: 85,
  },
  {
    id: "SUB003",
    studentName: "Carol Davis",
    studentId: "STU003",
    submittedAt: "2026-01-14 06:22 PM",
    plagiarismScore: 8,
    status: "graded" as const,
    grade: 92,
  },
  {
    id: "SUB004",
    studentName: "David Wilson",
    studentId: "STU004",
    submittedAt: "2026-01-15 11:58 PM",
    plagiarismScore: 45,
    status: "flagged" as const,
  },
  {
    id: "SUB005",
    studentName: "Emma Brown",
    studentId: "STU005",
    submittedAt: "2026-01-13 03:15 PM",
    plagiarismScore: 3,
    status: "graded" as const,
    grade: 95,
  },
]

export const mockRubricCriteria = [
  { id: "RC001", name: "Code Quality", weight: 25, description: "Clean, readable, well-documented code" },
  { id: "RC002", name: "Functionality", weight: 35, description: "All features work as expected" },
  { id: "RC003", name: "Testing", weight: 20, description: "Comprehensive test coverage" },
  { id: "RC004", name: "Documentation", weight: 20, description: "Clear README and inline comments" },
]
