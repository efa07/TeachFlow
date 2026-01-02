"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClassSelector } from "@/components/class-selector"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockClasses, mockAssignments, mockSubmissions } from "@/lib/mock-data"
import { FileText, Eye, AlertTriangle, CheckCircle, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewMode = "list" | "submissions" | "detail"

export default function AssignmentsPage() {
  const [selectedClass, setSelectedClass] = useState(mockClasses[0].id)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedAssignment, setSelectedAssignment] = useState<(typeof mockAssignments)[0] | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<(typeof mockSubmissions)[0] | null>(null)

  const handleViewSubmissions = (assignment: (typeof mockAssignments)[0]) => {
    setSelectedAssignment(assignment)
    setViewMode("submissions")
  }

  const handleViewDetail = (submission: (typeof mockSubmissions)[0]) => {
    setSelectedSubmission(submission)
    setViewMode("detail")
  }

  const handleBack = () => {
    if (viewMode === "detail") {
      setViewMode("submissions")
      setSelectedSubmission(null)
    } else {
      setViewMode("list")
      setSelectedAssignment(null)
    }
  }

  return (
    <DashboardLayout title="Assignment Management">
      {/* Breadcrumb */}
      {viewMode !== "list" && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <button onClick={() => setViewMode("list")} className="text-muted-foreground hover:text-foreground">
            Assignments
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {selectedAssignment && (
            <>
              <button
                onClick={() => {
                  setViewMode("submissions")
                  setSelectedSubmission(null)
                }}
                className={cn(
                  viewMode === "detail" ? "text-muted-foreground hover:text-foreground" : "text-foreground",
                )}
              >
                {selectedAssignment.name}
              </button>
              {viewMode === "detail" && selectedSubmission && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedSubmission.studentName}</span>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Assignment List View */}
      {viewMode === "list" && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ClassSelector value={selectedClass} onValueChange={setSelectedClass} classes={mockClasses} />
            <Button>Create Assignment</Button>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5" />
                Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={[
                  { key: "name", header: "Assignment" },
                  { key: "class", header: "Class" },
                  { key: "dueDate", header: "Due Date" },
                  {
                    key: "submissions",
                    header: "Submissions",
                    render: (item) => (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(item.submissions / item.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">
                          {item.submissions}/{item.total}
                        </span>
                      </div>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (item) => (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                          item.status === "completed"
                            ? "bg-success/10 text-success"
                            : item.status === "grading"
                              ? "bg-warning/10 text-warning"
                              : "bg-primary/10 text-primary",
                        )}
                      >
                        {item.status}
                      </span>
                    ),
                  },
                  {
                    key: "actions",
                    header: "",
                    render: (item) => (
                      <Button variant="ghost" size="sm" onClick={() => handleViewSubmissions(item)}>
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    ),
                  },
                ]}
                data={mockAssignments}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Submissions View */}
      {viewMode === "submissions" && selectedAssignment && (
        <>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack}>
              ← Back to Assignments
            </Button>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Submissions for {selectedAssignment.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={[
                  { key: "studentName", header: "Student" },
                  { key: "studentId", header: "ID" },
                  { key: "submittedAt", header: "Submitted" },
                  {
                    key: "plagiarismScore",
                    header: "Plagiarism",
                    render: (item) => (
                      <div className="flex items-center gap-2">
                        {item.plagiarismScore > 30 ? (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        ) : item.plagiarismScore > 15 ? (
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                        <span
                          className={cn(
                            "font-medium",
                            item.plagiarismScore > 30
                              ? "text-destructive"
                              : item.plagiarismScore > 15
                                ? "text-warning"
                                : "text-success",
                          )}
                        >
                          {item.plagiarismScore}%
                        </span>
                      </div>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (item) => (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                          item.status === "graded"
                            ? "bg-success/10 text-success"
                            : item.status === "flagged"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {item.status === "graded" && <CheckCircle className="h-3 w-3" />}
                        {item.status === "flagged" && <AlertTriangle className="h-3 w-3" />}
                        {item.status === "pending" && <Clock className="h-3 w-3" />}
                        {item.status}
                        {item.status === "graded" && item.grade && ` (${item.grade}%)`}
                      </span>
                    ),
                  },
                  {
                    key: "actions",
                    header: "",
                    render: (item) => (
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(item)}>
                        Review
                      </Button>
                    ),
                  },
                ]}
                data={mockSubmissions}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Submission Detail View */}
      {viewMode === "detail" && selectedSubmission && (
        <>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack}>
              ← Back to Submissions
            </Button>
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {/* File Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Submission Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-muted/30">
                  <div className="text-center">
                    <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-4 font-medium text-card-foreground">submission_final.pdf</p>
                    <p className="text-sm text-muted-foreground">File preview placeholder</p>
                    <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                      Download File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plagiarism Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle
                    className={cn(
                      "h-5 w-5",
                      selectedSubmission.plagiarismScore > 30
                        ? "text-destructive"
                        : selectedSubmission.plagiarismScore > 15
                          ? "text-warning"
                          : "text-success",
                    )}
                  />
                  Plagiarism Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Similarity Score */}
                <div className="mb-6 text-center">
                  <div className="relative mx-auto h-32 w-32">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3" />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className={cn(
                          selectedSubmission.plagiarismScore > 30
                            ? "stroke-destructive"
                            : selectedSubmission.plagiarismScore > 15
                              ? "stroke-warning"
                              : "stroke-success",
                        )}
                        strokeWidth="3"
                        strokeDasharray={`${(selectedSubmission.plagiarismScore * 100.53) / 100} 100.53`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-card-foreground">
                        {selectedSubmission.plagiarismScore}%
                      </span>
                      <span className="text-xs text-muted-foreground">Similarity</span>
                    </div>
                  </div>
                </div>

                {/* Matching Sections */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-card-foreground">Matching Sections</h4>
                  {[
                    { source: "Wikipedia - Data Structures", match: 8 },
                    { source: "GeeksforGeeks Article", match: 3 },
                    { source: "Previous Student Submission", match: 1 },
                  ].map((match, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-sm text-card-foreground">{match.source}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          match.match > 5 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {match.match}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Highlighted Text Preview */}
                <div className="mt-6">
                  <h4 className="mb-2 text-sm font-medium text-card-foreground">Highlighted Matches</h4>
                  <div className="rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-card-foreground">
                    A binary search tree is a{" "}
                    <span className="rounded bg-warning/30 px-1">data structure that maintains sorted data</span> and
                    allows for efficient insertion, deletion, and lookup operations. The{" "}
                    <span className="rounded bg-warning/30 px-1">time complexity of these operations is O(log n)</span>{" "}
                    in the average case.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
