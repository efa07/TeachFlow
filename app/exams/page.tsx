"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClassSelector } from "@/components/class-selector"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockClasses, mockExams } from "@/lib/mock-data"
import { Upload, Sparkles, FileText, Edit, Trash2, Plus, GripVertical, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface GeneratedQuestion {
  id: string
  question: string
  type: "multiple-choice" | "short-answer" | "essay"
  points: number
}

export default function ExamsPage() {
  const [selectedClass, setSelectedClass] = useState(mockClasses[0].id)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)

  const handleFileUpload = () => {
    // Simulate file upload
  }

  const handleGenerateExam = () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedQuestions([
        {
          id: "Q1",
          question: "Explain the time complexity of binary search and provide an example.",
          type: "short-answer",
          points: 10,
        },
        {
          id: "Q2",
          question: "Which data structure uses LIFO (Last In First Out) principle?",
          type: "multiple-choice",
          points: 5,
        },
        {
          id: "Q3",
          question: "Compare and contrast arrays and linked lists in terms of memory allocation and access time.",
          type: "essay",
          points: 20,
        },
        {
          id: "Q4",
          question: "What is the worst-case time complexity of quicksort?",
          type: "multiple-choice",
          points: 5,
        },
        {
          id: "Q5",
          question: "Implement a function to reverse a singly linked list.",
          type: "short-answer",
          points: 15,
        },
      ])
      setIsGenerating(false)
    }, 2000)
  }

  const handleDeleteQuestion = (id: string) => {
    setGeneratedQuestions(generatedQuestions.filter((q) => q.id !== id))
  }

  const handleUpdateQuestion = (id: string, newQuestion: string) => {
    setGeneratedQuestions(generatedQuestions.map((q) => (q.id === id ? { ...q, question: newQuestion } : q)))
    setEditingQuestion(null)
  }

  return (
    <DashboardLayout title="Exam Management">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ClassSelector value={selectedClass} onValueChange={setSelectedClass} classes={mockClasses} />
      </div>

      {/* Upload & Generate Section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="h-5 w-5" />
              Upload Source Material
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onClick={handleFileUpload}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary hover:bg-muted/50"
            >
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-card-foreground">Drop your PPT or PDF here</p>
              <p className="mt-1 text-xs text-muted-foreground">Supports PPT, PPTX, PDF up to 50MB</p>
              <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                Browse Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5" />
              AI Exam Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="numQuestions">Number of Questions</Label>
              <Input id="numQuestions" type="number" defaultValue={10} min={1} max={50} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="topics">Focus Topics (optional)</Label>
              <Textarea
                id="topics"
                placeholder="e.g., Data structures, Sorting algorithms, Graph traversal..."
                className="mt-1"
              />
            </div>
            <Button onClick={handleGenerateExam} disabled={isGenerating} className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Exam with AI"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Generated Questions */}
      {generatedQuestions.length > 0 && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Generated Questions</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Question
              </Button>
              <Button size="sm">Save Exam</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedQuestions.map((q, index) => (
                <div key={q.id} className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                  <GripVertical className="mt-1 h-5 w-5 cursor-grab text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Q{index + 1}</span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium",
                              q.type === "multiple-choice"
                                ? "bg-primary/10 text-primary"
                                : q.type === "short-answer"
                                  ? "bg-success/10 text-success"
                                  : "bg-warning/10 text-warning",
                            )}
                          >
                            {q.type}
                          </span>
                          <span className="text-xs text-muted-foreground">{q.points} pts</span>
                        </div>
                        {editingQuestion === q.id ? (
                          <div className="flex gap-2">
                            <Textarea
                              defaultValue={q.question}
                              id={`edit-${q.id}`}
                              className="min-h-[80px]"
                              autoFocus
                            />
                            <div className="flex flex-col gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  const textarea = document.getElementById(`edit-${q.id}`) as HTMLTextAreaElement
                                  handleUpdateQuestion(q.id, textarea.value)
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => setEditingQuestion(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-card-foreground">{q.question}</p>
                        )}
                      </div>
                      {editingQuestion !== q.id && (
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button variant="ghost" size="icon" onClick={() => setEditingQuestion(q.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteQuestion(q.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Exams */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5" />
            Past Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={[
              { key: "name", header: "Exam Name" },
              { key: "class", header: "Class" },
              { key: "date", header: "Date" },
              { key: "questions", header: "Questions" },
              {
                key: "status",
                header: "Status",
                render: (item) => (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                      item.status === "completed"
                        ? "bg-success/10 text-success"
                        : item.status === "upcoming"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {item.status}
                  </span>
                ),
              },
              {
                key: "actions",
                header: "",
                render: () => (
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                ),
              },
            ]}
            data={mockExams}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
