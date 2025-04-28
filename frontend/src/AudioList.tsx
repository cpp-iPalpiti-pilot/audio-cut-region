// src/AudioList.tsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AudioList() {
  const [audios, setAudios] = useState<string[]>([])

  useEffect(() => {
    fetch('http://localhost:5003/api/audios')
      .then(response => response.json())
      .then(data => setAudios(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Choose an Audio</h1>
      <ul>
        {audios.map((audio, index) => (
          <li key={index}>
            <Link to={`/clip/${encodeURIComponent(audio)}`}>
              {audio}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AudioList
