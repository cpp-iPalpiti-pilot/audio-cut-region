import { useEffect, useState} from 'react'
import './App.css'

function App(){
  const [ message, setMessage] = useState<string>('Loading...');

  useEffect(()=>{
    fetch('http://localhost:5003/api/hello')
    .then(response => response.json())
    .then((data: {message: string}) => setMessage(data.message))
    .catch(error => setMessage('Error: '+ error.message))
  }, [])

  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
} // end of function

export default App

