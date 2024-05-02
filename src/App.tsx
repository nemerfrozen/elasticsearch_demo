import { useState } from 'react'
import './App.css'
import { Combobox } from '@headlessui/react'

function App() {

  const [search, setSearch] = useState('')
  const [data, setData] = useState<any>([])

  const fetchSearch = async (value:string) => {
    setSearch(value)
    const body = {
      "query": {
        "match": {
          "RAZON_SOCIAL": value
        }
      },     
      "highlight": {
        "fields": {
          "RAZON_SOCIAL": {}
        },
        "pre_tags": ["<b>"],
        "post_tags": ["</b>"]
      }
    }
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
    const response = await fetch(`http://192.168.31.223:9200/neurona_rm/_search?size=10`, config)
    const data = await response.json()
    console.log(data)
    setData(data.hits)
  }

  const handleChange = (e:any) => {
    setData([])
    console.log(e.target.value) 
    fetchSearch(e.target.value)
  }

  const Selectioned = (value:any) => {
    console.log(value)
    //setSearch(value)
  }

  

  return (
    <>
    <h1>Neurona Buscador de Empresas</h1>
    <br />
    <span>{data.max_score} </span>
    <input type="text" value={search} className='input-autocomplete' onChange={handleChange} />
    <br />
    <div>
      <ul>
      
      {data.hits && data.hits.map((item:any) => (
          <li key={item._id} value={item.highlight.RAZON_SOCIAL} className='liItem'>
          <span dangerouslySetInnerHTML={{__html: item.highlight.RAZON_SOCIAL}} ></span>         
          <span>{item._score}</span>          
          </li>
        ))}

      </ul>
    
    </div>
    </>
  )
}

export default App
