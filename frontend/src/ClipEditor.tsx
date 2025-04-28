// src/ClipEditor.tsx

import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import WaveSurfer from 'wavesurfer.js'

function ClipEditor() {
  const { audioName } = useParams<{ audioName: string }>()
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)

  useEffect(() => {
    if (waveformRef.current && audioName) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#2196f3',
        cursorColor: '#333',
        height: 100,
        url: `http://localhost:5003/static/${audioName}`, // Read mp3 file
        backend: 'MediaElement',
      })
      wavesurferRef.current = wavesurfer
    }

    return () => {
      wavesurferRef.current?.destroy()
    }
  }, [audioName])

  return (
    <div>
      <h1>Clip Editor</h1>
      <p>Selected Audio: {audioName}</p>
      <div ref={waveformRef} />
    </div>
  )
}

export default ClipEditor
