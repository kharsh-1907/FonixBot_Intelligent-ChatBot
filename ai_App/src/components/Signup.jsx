import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Signup = (props) => {
  const [cedentrials, setCedentrials] = useState({ name: "", email: "", password: "" });
  // instead of useHistory this is new updated version of react-dom.
  const navigate = useNavigate();

  const handelsubmit = async (e) => {
    e.preventDefault();
    const result = await fetch("http://localhost:5000/api/auth/createUser", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: cedentrials.name, email: cedentrials.email, password: cedentrials.password }),
    })
    const json = await result.json();
    console.log(json)
    if (json.success) {

      // save to local-Storage & redirect .
      localStorage.setItem('auth-token', json.authtoken);
      // Start a fresh chat session after login
      sessionStorage.removeItem('chat-initialized');

      alert("SignUp successfully done!!", "success");
      navigate('/');
    }
    else {
      alert("Invalid cedentrials!!!", "danger")
    }
  }
  const loginredirection = () => { navigate('/login'); }
  const onChange = (e) => {
    setCedentrials({ ...cedentrials, [e.target.name]: e.target.value })
  }


  return (
    <>
      <main className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md w-full">
          <div
            className="p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-6 dark:bg-neutral-800 dark:border-neutral-700">
            <div className='text-white'>
              <strong className="text-3xl m-auto " style={{ fontFamily: "cursive", alignItems: "center", marginLeft: '2pc' }}>FonixAi</strong><h1 className="text-xl font-semibold">Create an Account</h1>
            </div>

            <form className="space-y-6 mt-10" onSubmit={handelsubmit}>
              <div className="form-group">
                <label htmlFor="name" className="mb-2 text-black font-medium text-sm inline-block dark:text-slate-50" >Name</label>
                <input type="text" className="peer text-white placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" id="name" name='name' value={cedentrials.name} onChange={onChange} aria-describedby="emailHelp" minLength={3} required />
              </div>
              <div>
                <label htmlFor="email"
                  className="mb-2 text-black dark:text-white font-medium text-sm inline-block dark:text-slate-50">Email</label>
                <input type="email" id="email" name="email" value={cedentrials.email} onChange={onChange} placeholder="john@readymadeui.com" required
                  className="peer text-white  placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" />
              </div>
              <div>
                <label htmlFor="password"
                  className="mb-2 text-black font-medium text-sm inline-block dark:text-slate-50">Password</label>
                <input type="password" id="password" value={cedentrials.password} onChange={onChange} name="password" placeholder="••••••••" required
                  className="peer text-white placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" />
              </div>

              <button type="submit"
                className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                Create an account</button>
            </form>

            <div className="mt-6 text-black text-sm text-center dark:text-slate-50">Already have an account? <a onClick={loginredirection}
              className="text-blue-700 hover:underline ml-1 font-medium dark:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded cursor-pointer">
              Login here</a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Signup

/**
      <form className='container m-auto p-4 ' onSubmit={handelsubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" name='name' value={cedentrials.name} onChange={onChange} aria-describedby="emailHelp" minLength={3} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" name='email' value={cedentrials.email} onChange={onChange} aria-describedby="emailHelp" minLength={2} required />
        </div>
        <div className="form-group my-2">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" name='password' value={cedentrials.password} onChange={onChange} id="exampleInputPassword1" minLength={6} required />
        </div>
        <button type="submit" className="btn btn-primary">SignUp</button>
      </form> */