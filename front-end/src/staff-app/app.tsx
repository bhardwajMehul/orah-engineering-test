import React from "react"
import { Routes, Route } from "react-router-dom"
import "shared/helpers/load-icons"
import { Header } from "staff-app/components/header/header.component"
import { ActivityPage } from "staff-app/platform/activity.page"
import { HomeBoardPageWithContext } from "./daily-care/daily-staff.context"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="daily-care" element={<HomeBoardPageWithContext />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="*" element={<div>No Match</div>} />
      </Routes>
    </>
  )
}

export default App
