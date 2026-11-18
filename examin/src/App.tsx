import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import style from './App.module.css'

const API = 'https://6ab43676217e43658831ade8.mockapi.io/users2'

function App() {
  const [user, setUser] = useState([])
  const [name, setName] = useState('')
  const [foto, setFoto] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [infoUser, setInfoUser] = useState<any>(null)

  async function getData() {
    try {
      const data = await axios.get(API)
      setUser(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  function resetForm() {
    setOpen(false)
    setEditId(null)
    setName('')
    setFoto('')
    setEmail('')
    setCountry('')
    setPhone('')
  }

  async function addUser(e: FormEvent) {
    e.preventDefault()
    try {
      await axios.post(API, { name, avatar: foto, email, country, phone })
      resetForm()
      getData()
    } catch (error) {
      console.log(error)
    }
  }

  async function editUser(e: FormEvent) {
    e.preventDefault()
    try {
      await axios.put(`${API}/${editId}`, { name, avatar: foto, email, country, phone })
      resetForm()
      getData()
    } catch (error) {
      console.log(error)
    }
  }

  async function delUser(id: any) {
    try {
      await axios.delete(`${API}/${id}`)
      getData()
    } catch (error) {
      console.log(error)
    }
  }

  function openEdit(elem: any) {
    setEditId(elem.id)
    setName(elem.name)
    setFoto(elem.avatar)
    setEmail(elem.email)
    setCountry(elem.country)
    setPhone(elem.phone)
    setOpen(true)
  }

  function openAdd() {
    resetForm()
    setOpen(true)
  }

  return (
    <div>
      <button className={style.add} onClick={openAdd}>Add New User +</button>
      <input type="text" placeholder='Search..' onChange={(e)=>{
      const search = e.target.value.toLowerCase()
      const filteredUser = user.filter((elem:any) =>
      elem.name.toLowerCase().includes(search)
     )
     setUser(filteredUser)
      }}/>

      {open && (
        <div className={style.addDialog}>
          <form className={style.addForm} onSubmit={editId !== null ? editUser : addUser}>
            <input type="text" name="addName" placeholder="Name..." value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" name="addFoto" placeholder="Foto..." value={foto} onChange={(e) => setFoto(e.target.value)} required />
            <input type="email" name="addEmail" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="text" name="addCountry" placeholder="Country..." value={country} onChange={(e) => setCountry(e.target.value)} required />
            <input type="text" name="addPhone" placeholder="Phone..." value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <button type="button" onClick={resetForm}>Cancel</button>
            <button type="submit">Save</button>
          </form>
        </div>
      )}

      {infoUser && (
        <div className={style.addDialog} onClick={() => setInfoUser(null)}>
          <div className={style.infoBox} onClick={(e) => e.stopPropagation()}>
            <img src={infoUser.avatar} className={style.infoFoto} alt={infoUser.name} />
            <h2>{infoUser.name}</h2>
            <p><b>Email:</b> {infoUser.email}</p>
            <p><b>Country:</b> {infoUser.country}</p>
            <p><b>Phone:</b> {infoUser.phone}</p>
            <button className={style.infoClose} onClick={() => setInfoUser(null)}>Close</button>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Name</th>
            <th>Email</th>
            <th>Country</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody className={style.div}>
          {user.map((elem: any) => (
            <tr className={style.box} key={elem.id}>
              <td>
                <img src={elem.avatar} className={style.foto} alt={elem.name} />
              </td>
              <td className={style.name}>{elem.name}</td>
              <td>{elem.email}</td>
              <td>{elem.country}</td>
              <td>{elem.phone}</td>

              <td className={style.divBTN}>
                <button className={style.btnDel} onClick={() => delUser(elem.id)}>Delete</button>
                <button className={style.btnEdit} onClick={() => openEdit(elem)}>Edit</button>
                <button className={style.btnInfo} onClick={() => setInfoUser(elem)}>Info</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App