import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

function ClipEditor() {
  const { audioName } = useParams<{ audioName: string }>()
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<{ start: number; end: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(50)

  
  useEffect(() => {
    if (waveformRef.current && audioName) {
      setIsLoading(true)
      
      // Create WaveSurfer instance
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#2196f3',
        cursorColor: '#333',
        height: 200,
        barWidth: 2,
        // responsive: true,
        normalize: true,
        fillParent: true,
        minPxPerSec: 100, // Ensure waveform is stretched enough
      })
      
      // Load audio file
      wavesurfer.load(`http://localhost:5003/static/${audioName}`)
      
      // Add regions plugin
      const regionsPlugin = wavesurfer.registerPlugin(
        RegionsPlugin.create({
          regions: [],
          dragSelection: {
            slop: 5, // Pixel threshold before drag selection begins
          },
          color: 'rgba(33, 150, 243, 0.3)', // Make region more visible
        }as any)
      )
      
      // Event listeners
      wavesurfer.on('ready', () => {
        setIsLoading(false)
        console.log('WaveSurfer is ready')
        
        // Create an initial default region (optional)
        const duration = wavesurfer.getDuration()
        if (duration) {
          const initialRegion = regionsPlugin.addRegion({
            start: duration * 0.25,
            end: duration * 0.75,
            color: 'rgba(33, 150, 243, 0.3)',
            drag: true,
            resize: true,
          })
          setSelectedRegion({ 
            start: initialRegion.start, 
            end: initialRegion.end 
          })
        }
      })
      
      wavesurfer.on('play', () => setIsPlaying(true))
      wavesurfer.on('pause', () => setIsPlaying(false))
      
      // Region events
      wavesurfer.on('region-created' as any, (region: any) => {
        console.log('Region created:', region)
        
        // Remove any existing regions if you want only one at a time
        const regions = Object.values(regionsPlugin.getRegions())
        if (regions.length > 1) {
          regions.forEach((r) => {
            if (r !== region) {
              r.remove()
            }
          })
        }
        
        setSelectedRegion({ 
          start: region.start, 
          end: region.end 
        })
      })
      
      wavesurfer.on('region-updated' as any, (region: any) => {
        console.log('Region updated:', region)
        setSelectedRegion({ 
          start: region.start, 
          end: region.end 
        })
      })
      
      // Save the wavesurfer instance for cleanup
      wavesurferRef.current = wavesurfer
    }
    
    // Cleanup function
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
      }
    }
  }, [audioName])
  
  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause()
    }
  }
  
  // const handlePlayRegion = () => {
  //   if (wavesurferRef.current && selectedRegion) {
  //     // Play the selected region
  //     wavesurferRef.current.play(selectedRegion.start, selectedRegion.end)
  //   }
  // }
  
  const handlePlayRegion = () => {
    if (wavesurferRef.current && selectedRegion) {
      const regionsPlugin = wavesurferRef.current!.getActivePlugins()[0] as any
      const region = Object.values(regionsPlugin.getRegions())[0] as any
      if (region) {
        region.play()
      }
    }
  }
  
  const handleSubmitClip = async () => {
    if (!selectedRegion || !audioName) return
    
    try {
      const response = await fetch('http://localhost:5003/api/clip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioName,
          start: selectedRegion.start,
          end: selectedRegion.end,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create clip')
      }
      
      const data = await response.json()
      console.log('Clip created:', data)
      alert('Clip created successfully!')
    } catch (error) {
      console.error('Error creating clip:', error)
      alert('Failed to create clip. Please try again.')
    }
  }
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleZoomIn = () => {
    if (wavesurferRef.current) {
      const newZoom = zoomLevel + 20
      wavesurferRef.current.zoom(newZoom)
      setZoomLevel(newZoom)
    }
  }
  
  const handleZoomOut = () => {
    if (wavesurferRef.current) {
      const newZoom = Math.max(10, zoomLevel - 20) // 最小10まで！
      wavesurferRef.current.zoom(newZoom)
      setZoomLevel(newZoom)
    }
  }
  
  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  }
  
  return (
    <div className="clip-editor" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Audio Clip Editor</h1>
      <p style={{ marginBottom: '10px' }}>Selected Audio: {audioName}</p>
      
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading audio waveform...
        </div>
      )}
      
      <div 
        style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px', 
          marginBottom: '20px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <div ref={waveformRef} style={{ width: '100%', height: '200px' }} />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px', 
          marginTop: '15px' 
        }}>
          <button
            onClick={handlePlayPause}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {isPlaying ? 'Pause' : 'Play'} Full Audio
          </button>
          
          {selectedRegion && (
            <button
              onClick={handlePlayRegion}
              style={{
                padding: '8px 16px',
                backgroundColor: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              Play Selection
            </button>
          )}
        </div>
      </div>
      
      {selectedRegion && (
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>Selected Region</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div>
              <strong>Start:</strong> {formatTime(selectedRegion.start)}
            </div>
            <div>
              <strong>End:</strong> {formatTime(selectedRegion.end)}
            </div>
            <div>
              <strong>Duration:</strong> {formatTime(selectedRegion.end - selectedRegion.start)}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
            <button onClick={handleZoomIn} style={buttonStyle}>Zoom In</button>
            <button onClick={handleZoomOut} style={buttonStyle}>Zoom Out</button>
          </div>

          
          <button
            onClick={handleSubmitClip}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#4caf50', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'block',
              width: '100%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Create Clip from Selected Region
          </button>
        </div>
      )}
      
      <div style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
        <p><strong>Instructions:</strong> Click and drag on the waveform to select a region. 
        Use the buttons to play the full audio or just your selection. 
        When you're happy with your selection, click the green button to create your clip.</p>
      </div>
    </div>
  )
}

export default ClipEditor