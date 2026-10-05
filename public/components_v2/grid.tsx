import { BrainIcon, ActivityIcon, ShieldCheckIcon, LayoutGridIcon, SparklesIcon, MessageCircleIcon, InfinityIcon } from 'lucide-react';
import { Manrope } from 'next/font/google';
import React from 'react';

const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const Grid = () => {
  return <div className={`max-w-7xl mx-auto min-h-screen ${manrope.className}`}>



    <div className='grid grid-cols-2 gap-10 py-30'>
      <Card>
        <CardContent>
          <CardHeader>
            <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg  bg-white text-neutral-600'>
              <BrainIcon className='h-4 w-4' />
            </span>
            <CardTitle>Model Selector</CardTitle>
          </CardHeader>
          <CardDescription>
            Route each request to the right model automatically, balancing
            cost, latency and output quality per task.
          </CardDescription>

        </CardContent>
        <CardSkeleton>
          <ModelSelectorMock />
        </CardSkeleton>


      </Card>
      <Card>
        <CardContent>
          <CardHeader>
            <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg  bg-white text-neutral-600'>
              <ActivityIcon className='h-4 w-4' />
            </span>
            <CardTitle>Live Agent Activity</CardTitle>
          </CardHeader>
          <CardDescription>
            Track real-time activity of agents with detailed records of triggers,
            tools used, outcomes and timestamps.
          </CardDescription>
        </CardContent>
        <CardSkeleton> Hello</CardSkeleton>


      </Card>
      <Card className='col-span-2'>
        <CardContent>
          <CardHeader>
            <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg  bg-white text-neutral-600 '>
              <ShieldCheckIcon className='h-4 w-4' />
            </span>
            <CardTitle>Guardrails & Permissions</CardTitle>
          </CardHeader>
          <CardDescription>
            Define exactly what each agent can access — scoped tool
            permissions, memory sources, and approval steps for sensitive actions.
          </CardDescription>
        </CardContent>
        <CardSkeleton> Hello</CardSkeleton>


      </Card>



    </div>





  </div >
}


export const CardSkeleton = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <div className='relative min-h-64 flex-1 w-full overflow-hidden rounded-xl   text-neutral-400 flex items-center justify-center text-sm'>
      <div className='absolute inset-0
        bg-[radial-gradient(var(--color-neutral-300)_1px,transparent_1px)]
        mask-[radial-gradient(ellipse_closest-side_at_center,white,transparent)]
        bg-size-[10px_10px]' />
      <div className='relative z-10 flex h-full w-full items-center justify-center'>
        {children}
      </div>
    </div>
  )

}

const STATUS_STYLES = {
  red: 'border-red-200 bg-red-50 text-red-600',
  green: 'border-green-200 bg-green-50 text-green-600',
  amber: 'border-amber-200 bg-amber-50 text-amber-600',
} as const;

const ModelRow = ({ icon, name, status, color }: {
  icon: React.ReactNode,
  name: string,
  status: string,
  color: keyof typeof STATUS_STYLES,
}) => {
  return (
    <li className='flex items-center gap-2.5 px-4 py-2.5 text-sm'>
      <span className='text-neutral-400'>{icon}</span>
      <span className='text-neutral-700'>{name}</span>
      <span className={`ml-auto rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[color]}`}>
        {status}
      </span>
    </li>
  )
}

export const ModelSelectorMock = () => {
  return (
    <div className='relative h-full w-full text-left -translate-y-28 '>
      <div className='absolute inset-x-4 top-10 rounded-xl shadow-[-8px_0_20px_-10px_rgba(0,0,0,0.15),8px_0_20px_-10px_rgba(0,0,0,0.15)]'>
        <div className='rounded-xl bg-white overflow-hidden mask-[linear-gradient(to_bottom,white_85%,transparent_100%)]'>
          <div className='flex items-center gap-1.5 px-4 py-5 border-b border-neutral-100'>
            <span className='h-2.5 w-2.5 rounded-full bg-red-400' />
            <span className='h-2.5 w-2.5 rounded-full bg-yellow-400' />
            <span className='h-2.5 w-2.5 rounded-full bg-green-400' />
          </div>

          <div className='flex items-center gap-2 px-4 py-3 border-b border-neutral-100 text-sm'>
            <LayoutGridIcon className='h-4 w-4 text-neutral-400' />
            <span className='font-medium text-neutral-700'>All Models</span>
            <span className='ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500'>69,420</span>
          </div>

          <ul className='divide-y divide-neutral-100'>
            <ModelRow icon={<SparklesIcon className='h-4 w-4' />} name='Claude 4 Opus' status='Unavailable' color='red' />
            <ModelRow icon={<MessageCircleIcon className='h-4 w-4' />} name='ChatGPT' status='Connected' color='green' />
            <ModelRow icon={<InfinityIcon className='h-4 w-4' />} name='Llama 3.2' status='Waiting' color='amber' />
          </ul>
        </div>
      </div>

      <div className='absolute top-1 right-2 flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 shadow-sm'>
        <div className='flex items-center gap-2 text-xs'>
          <SparklesIcon className='h-3.5 w-3.5 text-neutral-500' />
          <span className='font-medium text-neutral-700'>Open AI</span>
          <span className='text-neutral-400'>GPT 5</span>
        </div>
        <span className='rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-center text-xs font-medium text-blue-600'>
          Connected
        </span>
      </div>
    </div>
  )
}

export const CardContent = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <div className='flex flex-col gap-2 rounded-xl p-4'>
      {children}
    </div>
  )

}

export const CardHeader = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <div className='flex items-center gap-2.5'>
      {children}
    </div>
  )

}

export const Card = ({ className, children }: {
  className?: string,
  children: React.ReactNode
}) => {
  return <div className={`flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md overflow-hidden
    ${className ?? ''}`}>{children}</div>

}

export const CardTitle = ({ children }: {
  children: React.ReactNode,
}) => {
  return <h2 className='font-semibold text-base text-neutral-900 tracking-tight'>{children}</h2>
}

export const CardDescription = ({ children }: {
  children: React.ReactNode,
}) => {
  return <p className='text-sm text-neutral-500 leading-relaxed'>{children}</p>
}