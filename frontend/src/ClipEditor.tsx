// src/ClipEditor.tsx

import { useParams } from 'react-router-dom'

function ClipEditor() {
  const { audioName } = useParams<{ audioName: string }>()

  return (
    <div>
      <h1>Clip Editor</h1>
      <p>Selected Audio: {audioName}</p>
    </div>
  )
}

export default ClipEditor
