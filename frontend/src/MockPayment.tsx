import { useSearchParams } from 'react-router-dom'

function MockPayment() {
  const [searchParams] = useSearchParams()
  const clipFilename = searchParams.get('clipFilename')

  const handleDownload = async () => {
    if (clipFilename) {
      const response = await fetch(`http://localhost:5003/static/${clipFilename}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = clipFilename  // File name
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Mock Payment</h1>
      <p>Payment successful! 🎉</p>

      {clipFilename && (
        <button
          onClick={handleDownload}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#4caf50',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block',
            cursor: 'pointer'
          }}
        >
          ⬇️ Download Your Clip
        </button>
      )}
    </div>
  )
}

export default MockPayment
