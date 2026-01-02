"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClassSelector } from "@/components/class-selector"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockClasses, mockAttendanceRecords } from "@/lib/mock-data"
import { Scan, Play, StopCircle, UserCheck, UserX, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState(mockClasses[0].id)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [records, setRecords] = useState(mockAttendanceRecords)

  const presentCount = records.filter((r) => r.status === "present").length
  const absentCount = records.filter((r) => r.status === "absent").length
  const lateCount = records.filter((r) => r.status === "late").length

  const handleStatusChange = (studentId: string, newStatus: "present" | "absent" | "late") => {
    setRecords(records.map((r) => (r.studentId === studentId ? { ...r, status: newStatus } : r)))
  }

  return (
    <DashboardLayout title="Attendance Management">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ClassSelector value={selectedClass} onValueChange={setSelectedClass} classes={mockClasses} />

        <div className="flex gap-3">
          {!isSessionActive ? (
            <Button onClick={() => setIsSessionActive(true)} className="gap-2">
              <Play className="h-4 w-4" />
              Start Attendance Session
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => setIsSessionActive(false)} className="gap-2">
              <StopCircle className="h-4 w-4" />
              End Session
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-semibold text-card-foreground">{records.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <UserCheck className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="text-xl font-semibold text-success">{presentCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <UserX className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="text-xl font-semibold text-destructive">{absentCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Late</p>
              <p className="text-xl font-semibold text-warning">{lateCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barcode Scanner Placeholder */}
      {isSessionActive && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Scan className="h-5 w-5" />
              Barcode Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <Scan className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">Scan student ID barcode</p>
              <p className="text-xs text-muted-foreground">Or enter student ID manually below</p>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Student ID"
                  className="rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button size="sm">Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={[
              { key: "studentId", header: "Student ID" },
              { key: "name", header: "Name" },
              {
                key: "status",
                header: "Status",
                render: (item) => (
                  <div className="flex gap-1">
                    {(["present", "late", "absent"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(item.studentId, status)}
                        className={cn(
                          "rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors",
                          item.status === status
                            ? status === "present"
                              ? "bg-success text-success-foreground"
                              : status === "late"
                                ? "bg-warning text-warning-foreground"
                                : "bg-destructive text-destructive-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80",
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                ),
              },
              { key: "time", header: "Time" },
            ]}
            data={records}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
