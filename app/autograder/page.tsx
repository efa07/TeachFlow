"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClassSelector } from "@/components/class-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockClasses, mockRubricCriteria, mockSubmissions } from "@/lib/mock-data"
import { Sparkles, Plus, Trash2, Save, ChevronRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface RubricCriterion {
  id: string
  name: string
  weight: number
  description: string
}

interface AIScore {
  criterionId: string
  score: number
  maxScore: number
  reasoning: string
}

export default function AutoGraderPage() {
  const [selectedClass, setSelectedClass] = useState(mockClasses[0].id)
  const [rubric, setRubric] = useState<RubricCriterion[]>(mockRubricCriteria)
  const [selectedSubmission, setSelectedSubmission] = useState<(typeof mockSubmissions)[0] | null>(null)
  const [isGrading, setIsGrading] = useState(false)
  const [aiScores, setAiScores] = useState<AIScore[]>([])
  const [feedback, setFeedback] = useState("")
  const [finalScore, setFinalScore] = useState("")

  const totalWeight = rubric.reduce((sum, c) => sum + c.weight, 0)

  const handleAddCriterion = () => {
    const newCriterion: RubricCriterion = {
      id: `RC${Date.now()}`,
      name: "",
      weight: 0,
      description: "",
    }
    setRubric([...rubric, newCriterion])
  }

  const handleUpdateCriterion = (id: string, field: keyof RubricCriterion, value: string | number) => {
    setRubric(rubric.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleDeleteCriterion = (id: string) => {
    setRubric(rubric.filter((c) => c.id !== id))
  }

  const handleAIPreGrade = () => {
    if (!selectedSubmission) return
    setIsGrading(true)

    // Simulate AI grading
    setTimeout(() => {
      const scores: AIScore[] = rubric.map((criterion) => ({
        criterionId: criterion.id,
        score: Math.floor(Math.random() * 30) + 70,
        maxScore: 100,
        reasoning: `The submission demonstrates ${criterion.name.toLowerCase()} with minor areas for improvement. Code structure is well-organized and follows best practices.`,
      }))
      setAiScores(scores)

      // Calculate suggested final score
      const weightedScore = scores.reduce((sum, s) => {
        const criterion = rubric.find((c) => c.id === s.criterionId)
        return sum + (s.score * (criterion?.weight || 0)) / 100
      }, 0)
      setFinalScore(Math.round(weightedScore).toString())

      setFeedback(
        "Overall, this is a solid submission. The code demonstrates good understanding of the concepts. Consider adding more inline comments and improving test coverage for edge cases.",
      )
      setIsGrading(false)
    }, 2500)
  }

  const handleScoreOverride = (criterionId: string, newScore: number) => {
    setAiScores(aiScores.map((s) => (s.criterionId === criterionId ? { ...s, score: newScore } : s)))
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success"
    if (score >= 70) return "text-warning"
    return "text-destructive"
  }

  return (
    <DashboardLayout title="AutoGrader++">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ClassSelector value={selectedClass} onValueChange={setSelectedClass} classes={mockClasses} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Rubric Builder */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Rubric Builder</CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddCriterion} className="bg-transparent">
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {rubric.map((criterion, index) => (
              <div key={criterion.id} className="rounded-lg border border-border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Criterion {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => handleDeleteCriterion(criterion.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  placeholder="Criterion name"
                  value={criterion.name}
                  onChange={(e) => handleUpdateCriterion(criterion.id, "name", e.target.value)}
                  className="mb-2"
                />
                <div className="mb-2 flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Weight"
                    value={criterion.weight || ""}
                    onChange={(e) => handleUpdateCriterion(criterion.id, "weight", Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <Textarea
                  placeholder="Description..."
                  value={criterion.description}
                  onChange={(e) => handleUpdateCriterion(criterion.id, "description", e.target.value)}
                  className="min-h-[60px] text-xs"
                />
              </div>
            ))}

            {/* Weight Total */}
            <div
              className={cn(
                "flex items-center justify-between rounded-lg p-3",
                totalWeight === 100 ? "bg-success/10" : "bg-destructive/10",
              )}
            >
              <span className="text-sm font-medium">Total Weight</span>
              <span className={cn("font-bold", totalWeight === 100 ? "text-success" : "text-destructive")}>
                {totalWeight}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Grading Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">AI-Assisted Grading</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Submission Selector */}
            <div className="mb-6">
              <Label className="mb-2 block">Select Submission to Grade</Label>
              <div className="grid gap-2 md:grid-cols-2">
                {mockSubmissions
                  .filter((s) => s.status === "pending")
                  .map((submission) => (
                    <button
                      key={submission.id}
                      onClick={() => {
                        setSelectedSubmission(submission)
                        setAiScores([])
                        setFeedback("")
                        setFinalScore("")
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-lg border p-3 text-left transition-colors",
                        selectedSubmission?.id === submission.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      <div>
                        <p className="font-medium text-card-foreground">{submission.studentName}</p>
                        <p className="text-xs text-muted-foreground">{submission.studentId}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
              </div>
            </div>

            {selectedSubmission && (
              <>
                {/* AI Pre-Grade Button */}
                <Button onClick={handleAIPreGrade} disabled={isGrading || totalWeight !== 100} className="mb-6 gap-2">
                  <Sparkles className="h-4 w-4" />
                  {isGrading ? "Analyzing Submission..." : "AI Pre-Grade"}
                </Button>

                {/* AI Scores */}
                {aiScores.length > 0 && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-card-foreground">AI Suggested Scores</h4>
                      {aiScores.map((score) => {
                        const criterion = rubric.find((c) => c.id === score.criterionId)
                        if (!criterion) return null
                        return (
                          <div key={score.criterionId} className="rounded-lg border border-border p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <div>
                                <span className="font-medium text-card-foreground">{criterion.name}</span>
                                <span className="ml-2 text-xs text-muted-foreground">({criterion.weight}%)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={score.score}
                                  onChange={(e) => handleScoreOverride(score.criterionId, Number(e.target.value))}
                                  className={cn("w-20 text-center font-bold", getScoreColor(score.score))}
                                />
                                <span className="text-sm text-muted-foreground">/ 100</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{score.reasoning}</p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Feedback */}
                    <div>
                      <Label htmlFor="feedback" className="mb-2 block">
                        Feedback
                      </Label>
                      <Textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="min-h-[100px]"
                        placeholder="AI-generated feedback will appear here. You can edit it."
                      />
                    </div>

                    {/* Final Score */}
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                      <div>
                        <Label htmlFor="finalScore" className="block text-sm font-medium">
                          Final Score Override
                        </Label>
                        <p className="text-xs text-muted-foreground">Enter your final grade decision</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          id="finalScore"
                          type="number"
                          min={0}
                          max={100}
                          value={finalScore}
                          onChange={(e) => setFinalScore(e.target.value)}
                          className={cn("w-24 text-center text-xl font-bold", getScoreColor(Number(finalScore)))}
                        />
                        <span className="text-lg text-muted-foreground">%</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="bg-transparent gap-2"
                        onClick={() => {
                          setAiScores([])
                          setFeedback("")
                          setFinalScore("")
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </Button>
                      <Button className="flex-1 gap-2">
                        <Save className="h-4 w-4" />
                        Save Final Grade
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
