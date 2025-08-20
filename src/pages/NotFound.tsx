import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname)
  }, [location.pathname])

  return (
    <div className='min-h-screen bg-background grid-bg'>
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10'></div>

        <div className='relative z-10 min-h-screen flex items-center justify-center'>
          <div className='text-center p-8 rounded-lg border border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg cyber-frame max-w-md mx-4'>
            <div className='mb-6'>
              <h1 className='text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2'>
                404
              </h1>
              <div className='w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full shadow-glow'></div>
            </div>
            <h2 className='text-2xl font-semibold text-foreground mb-4'>Oops! Page not found</h2>
            <p className='text-muted-foreground mb-6'>
              The page you're looking for doesn't exist or has been moved to another location.
            </p>
            <a
              href='/'
              className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:-translate-y-1 cyber-btn'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 19l-7-7m0 0l7-7m-7 7h18'
                />
              </svg>
              Return to Home
            </a>
            <div className='mt-8 text-xs text-muted-foreground'>
              <p>
                Attempted route:{' '}
                <code className='bg-muted px-2 py-1 rounded text-foreground border border-border'>
                  {location.pathname}
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
