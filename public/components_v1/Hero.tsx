import React from 'react'

export const Hero = () => {
    return (
        <div className='my-40 w-full flex flex-col items-center justify-center'>
            <h1 className='max-w-2xl bg-linear-to-b from-neutral-50 to bg-neutral-500 bg-clip-text text-center text-7xl leading-tight
        font-bold tracking-tight text-transparent'>
                Unleash the power of intuitive finance
            </h1>
            <p className='mt-10 max-w-2xl mx-auto text-center text-lg text-neutral-500 selection:bg-neutral-400'>
                Track spending, grow savings, and make smarter money moves all from one beautifully simple dashboard.
                No spreadsheets, no guesswork — just clear insights that help you stay ahead of every bill.

            </p>

            <div className='flex items-center justify-center mt-8'>
                <input
                type='text'
                className='mr-6 py-2 rounded-xl border border-neutral-600 placeholder:text-neutral-500 focus:outline-0 focus:ring-2 focus:ring-sky-400 text-white px-4' 
                placeholder='Enter your email'/>

                <button className=' relative hover:bg-sky-400 border border-neutral-500 transition duration-200
                 hover:text-black text-white rounded-xl px-4 py-2 cursor-pointer'>
                    <div className='absolute -bottom-px inset-x-0 w-full h-px bg-linear-to-r from-transparent via-sky-600 to-transparent '></div>

                    Join Waitlist

                </button>

            </div>


        </div>


    )
}
