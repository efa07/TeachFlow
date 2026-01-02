"use client"

import { Suspense } from "react"
import StudentsClient from "./students-client"

export default function StudentsPage() {
  return (
    <Suspense fallback={null}>
      <StudentsClient />
    </Suspense>
  )
}
