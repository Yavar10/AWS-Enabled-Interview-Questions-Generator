import React from 'react'
import InterviewQuestionGenerator from './comp/InterviewQuestionGenerator'
import { Routes,Route } from 'react-router-dom'
import FaceVerification from './comp/FaceVerification'
const App = () => {
  return (
    <div>
    <Routes>
      <Route path="/" element={<FaceVerification />} />
      <Route path="/interview" element={<InterviewQuestionGenerator />} />
    </Routes>
    </div>
  )
}

export default App