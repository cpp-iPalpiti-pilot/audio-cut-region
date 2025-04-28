// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AudioList from './AudioList'
import ClipEditor from './ClipEditor' 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AudioList />} />
        <Route path="/clip/:audioName" element={<ClipEditor />} />
      </Routes>
    </Router>
  )
}

export default App


// import { useEffect, useState} from 'react'
// import './App.css'

//   function AudioList() {
//     const [audios, setAudios] = useState<string[]>([])

//   useEffect(()=>{
//     fetch('http://localhost:5003/api/audios')
//     .then(response => response.json())
//     .then(data => setAudios(data))
//     .catch(err => console.error(err))
//   }, [])

//   return (
//     <div>
//       <h1>Choose an Audio</h1>
//       <ul>
//         {audios.map((audio, index) => (
//           <li key={index}>
//             {audio}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// } // end of function

// export default AudioList

