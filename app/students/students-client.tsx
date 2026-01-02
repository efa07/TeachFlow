"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClassSelector } from "@/components/class-selector"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockClasses, mockStudents } from "@/lib/mock-data"
import { Edit, Search, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

type Student = (typeof mockStudents)[0]

export default function StudentsClient() {
  const [selectedClass, setSelectedClass] = useState(mockClasses[0].id)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [students, setStudents] = useState(mockStudents)

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSaveScores = (studentId: string, examAvg: number, assignmentAvg: number) => {
    setStudents(students.map((s) => (s.id === studentId ? { ...s, examAvg, assignmentAvg } : s)))
    setEditingStudent(null)
  }

  const getPerformanceIcon = (value: number) => {
    if (value >= 85) return <TrendingUp className="h-4 w-4 text-success" />
    if (value >= 70) return <Minus className="h-4 w-4 text-warning" />
    return <TrendingDown className="h-4 w-4 text-destructive" />
  }

  const getPerformanceColor = (value: number) => {
    if (value >= 85) return "text-success"
    if (value >= 70) return "text-warning"
    return "text-destructive"
  }

  return (
    <DashboardLayout title="Student Management">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ClassSelector value={selectedClass} onValueChange={setSelectedClass} classes={mockClasses} />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10"
            />
          </div>
        </div>
      </div>

      {/* Student Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Student Roster</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={[
              { key: "id", header: "Student ID" },
              { key: "name", header: "Name" },
              {
                key: "attendancePercent",
                header: "Attendance",
                render: (item) => (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          item.attendancePercent >= 85
                            ? "bg-success"
                            : item.attendancePercent >= 70
                              ? "bg-warning"
                              : "bg-destructive",
                        )}
                        style={{ width: `${item.attendancePercent}%` }}
                      />
                    </div>
                    <span className="text-sm">{item.attendancePercent}%</span>
                  </div>
                ),
              },
              {
                key: "examAvg",
                header: "Exam Avg",
                render: (item) => (
                  <div className="flex items-center gap-2">
                    {getPerformanceIcon(item.examAvg)}
                    <span className={cn("font-medium", getPerformanceColor(item.examAvg))}>{item.examAvg}%</span>
                  </div>
                ),
              },
              {
                key: "assignmentAvg",
                header: "Assignment Avg",
                render: (item) => (
                  <div className="flex items-center gap-2">
                    {getPerformanceIcon(item.assignmentAvg)}
                    <span className={cn("font-medium", getPerformanceColor(item.assignmentAvg))}>
                      {item.assignmentAvg}%
                    </span>
                  </div>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                render: (item) => (
                  <Button variant="ghost" size="sm" onClick={() => setEditingStudent(item)} className="gap-1">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                ),
              },
            ]}
            data={filteredStudents}
          />
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={!!editingStudent} onClose={() => setEditingStudent(null)} title="Edit Student Scores">
        {editingStudent && (
          <EditScoresForm student={editingStudent} onSave={handleSaveScores} onCancel={() => setEditingStudent(null)} />
        )}
      </Modal>
    </DashboardLayout>
  )
}

function EditScoresForm({
  student,
  onSave,
  onCancel,
}: {
  student: Student
  onSave: (id: string, examAvg: number, assignmentAvg: number) => void
  onCancel: () => void
}) {
  const [examAvg, setExamAvg] = useState(student.examAvg.toString())
  const [assignmentAvg, setAssignmentAvg] = useState(student.assignmentAvg.toString())

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="font-medium text-card-foreground">{student.name}</p>
        <p className="text-sm text-muted-foreground">{student.id}</p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="examAvg">Exam Average (%)</Label>
          <Input
            id="examAvg"
            type="number"
            min="0"
            max="100"
            value={examAvg}
            onChange={(e) => setExamAvg(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="assignmentAvg">Assignment Average (%)</Label>
          <Input
            id="assignmentAvg"
            type="number"
            min="0"
            max="100"
            value={assignmentAvg}
            onChange={(e) => setAssignmentAvg(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(student.id, Number(examAvg), Number(assignmentAvg))}>Save Changes</Button>
      </div>
    </div>
  )
}
