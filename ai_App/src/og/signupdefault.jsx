<main className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center">
    <div className="max-w-md w-full">
        <div
            className="p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-6 dark:bg-neutral-800 dark:border-neutral-700">
            <h1 className="text-slate-900 text-center text-2xl font-bold dark:text-slate-50">Create an account</h1>

            <form className="space-y-6 mt-10" onSubmit={handelsubmit}>
                <div className="form-group">
                    <label htmlFor="name" className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50" >Name</label>
                    <input type="text" className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600" id="name" name='name' value={cedentrials.name} onChange={onChange} aria-describedby="emailHelp" minLength={3} required />
                </div>
                <div>
                    <label htmlFor="email"
                        className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Email</label>
                    <input type="email" id="email" name="email" value={cedentrials.email} onChange={onChange}  placeholder="john@readymadeui.com" required
                        className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600" />
                </div>
                <div>
                    <label htmlFor="password"
                        className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Password</label>
                    <input type="password" id="password"  value={cedentrials.password} onChange={onChange} name="password" placeholder="••••••••" required
                        className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600" />
                </div>

                <button type="submit"
                    className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    Create an account</button>
            </form>

            <div className="mt-6 text-slate-900 text-sm text-center dark:text-slate-50">Already have an account? <a href="#"
                className="text-blue-700 hover:underline ml-1 font-medium dark:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                Login here</a>
            </div>
        </div>
    </div>
</main>