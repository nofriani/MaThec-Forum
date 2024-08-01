import { useState } from "react"

export default function Reset() {
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch(process.env.REACT_APP_API_HOST + '/api/users/forgot-password', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: input })
    })
  }
  return <>
    <div className="d-flex vh-100 vw-100 justify-content-center align-items-center">
      <div className="card">
        <div className="card-body">
          <h6>Reset Password</h6>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label for="exampleFormControlInput1" className="form-label">Email address</label>
              <input type="email" className="form-control" onChange={(e) => setInput(e.target.value)} placeholder="name@example.com" />
            </div>
            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </>

}