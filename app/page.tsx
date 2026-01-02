"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import { DataTable } from "@/components/data-table"
import { Users, BookOpen, ClipboardList, FileText, TrendingUp, Calendar } from "lucide-react"
import { mockAssignments, mockExams } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const upcomingExams = mockExams.filter((e) => e.status === "upcoming" || e.status === "draft")
  const pendingAssignments = mockAssignments.filter((a) => a.status === "grading" || a.status === "open")

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Classes"
          value={4}
          description="Active this semester"
          icon={BookOpen}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Total Students"
          value={109}
          description="Across all classes"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments.length}
          description="Awaiting review"
          icon={ClipboardList}
        />
        <StatCard title="Upcoming Exams" value={upcomingExams.length} description="Scheduled" icon={FileText} />
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Class Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-lg bg-muted/50">
              <div className="text-center">
                <div className="flex items-end justify-center gap-2">
                  {[65, 78, 82, 74, 88, 92, 85].map((height, i) => (
                    <div key={i} className="w-8 rounded-t bg-primary/80" style={{ height: `${height * 1.8}px` }} />
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Average scores by week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-lg bg-muted/50">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-primary"
                    strokeWidth="3"
                    strokeDasharray={`${(87 * 100.53) / 100} 100.53`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-card-foreground">87%</span>
                  <span className="text-xs text-muted-foreground">Average</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={[
                { key: "name", header: "Assignment" },
                { key: "class", header: "Class" },
                { key: "submissions", header: "Submissions", render: (item) => `${item.submissions}/${item.total}` },
                {
                  key: "status",
                  header: "Status",
                  render: (item) => (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        item.status === "completed"
                          ? "bg-success/10 text-success"
                          : item.status === "grading"
                            ? "bg-warning/10 text-warning"
                            : "bg-primary/10 text-primary"
                      }`}
                    >
                      {item.status}
                    </span>
                  ),
                },
              ]}
              data={mockAssignments.slice(0, 4)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={[
                { key: "name", header: "Exam" },
                { key: "class", header: "Class" },
                { key: "date", header: "Date" },
                {
                  key: "status",
                  header: "Status",
                  render: (item) => (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        item.status === "completed"
                          ? "bg-success/10 text-success"
                          : item.status === "upcoming"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.status}
                    </span>
                  ),
                },
              ]}
              data={mockExams}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
