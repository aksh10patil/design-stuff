import react from 'react';


const cn = (...classes: string[]) => classes.join(' ');


export const Component = () => {
    return (
        <div
            className={cn(
                'w-full rounded-2x  min-h-100 bg-neutral-200',
                'bg-[radial-gradient(var(--color-neutral-300)_1px,transparent_1px)]',
                'bg-size-[10px_10px]',
                'p-8 flex items-center justify-center group'
            )}
        >
            <div
                className={cn(
                    'size-60 rounded-lg bg-neutral-100 border border-neutral-200',
                    'bg-[radial-gradient(var(--color-neutral-300)_1px,transparent_1px)]',
                    'bg-size-[10px_10px]',
                    'shadow-2xl relative rounded-2xl perspective-distant transform-3d'
                )}
            >

                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className='h-full w-full items-center object-cover
                    transition-transform duration-200 ease-in-out
                     transform rotate-x-40 rotate-y-20 rounded-2xl translate-z-30
                     group-hover:rotate-x-0 group-hover:rotate-y-0 group-hover:rotate-z-0 '></img>
            </div>

        </div>
    );
}