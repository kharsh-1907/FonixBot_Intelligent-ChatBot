import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [cedentrials, setCedentrials] = useState({ email: "", password: "" })
    const navigate = useNavigate()
    const handelsubmit = async (e) => {
        e.preventDefault();
        const result = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: cedentrials.email, password: cedentrials.password }),
        })
        const json = await result.json();
        console.log(json)
        if (json.success) {
            // save to local-Storage & redirect .
            localStorage.setItem('auth-token', json.authtoken);
            // Start a fresh chat session after login
            sessionStorage.removeItem('chat-initialized');

            navigate('/')
            alert("LoggedIn Successfully", "success")
        }
        else {
            alert("Invalid cedentrials!!!", "danger")
        }
    }
    const onChange = (e) => {
        // console.log(e.target.value)
        setCedentrials({ ...cedentrials, [e.target.name]: e.target.value })
    }
    const signup = () => { navigate('/signup') }

    return (
        <>
            <form onSubmit={handelsubmit}>
                <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
                    <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                        </div>
                        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

                            <div className="max-w-md mx-auto">
                                <div>
                                    <strong className="text-3xl my-3" style={{ fontFamily: "cursive", alignItems: "center", marginLeft: '2pc' }}>FonixAi</strong><h1 className="text-xl font-semibold">Login</h1>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                        <div className="relative">
                                            <input autocomplete="off" id="email" name="email" type="email" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" value={cedentrials.email} onChange={onChange} />
                                            <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm" >Email Address</label>
                                        </div>
                                        <div className="relative">
                                            <input autocomplete="off" id="password" name="password" type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" value={cedentrials.password} onChange={onChange} />
                                            <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm" >Password</label>
                                        </div>
                                        <div className="relative">
                                            <button className="bg-cyan-500 text-white rounded-md px-2 py-1">Submit</button>
                                        </div>
                                        <div className="mt-6 text-sm text-center text-black">Don't have account? <a onClick={signup}
                                            className="text-blue-700 hover:underline cursor-pointer ml-1 font-medium dark:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                                            SignUp here</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

        </>
    )
}

export default Login

/**<form className='container m-auto p-4 ' onSubmit={handelsubmit} >
                <div className="mb-3 ">
                    <label htmlFor="exampleInputEmail1" className="form-label"><h3>Email</h3></label>
                    <input type="email" className="form-control" name='email' value={cedentrials.email} id="exampleInputEmail1" aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label"><h3>Password</h3></label>
                    <input type="password" className="form-control" name='password' value={cedentrials.password} id="exampleInputPassword1" onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form> */