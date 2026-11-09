import { cn } from '@/lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-[14px] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)]',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        'border-b border-[0.5px] border-[#d2d2d7] px-6 pb-3 pt-5',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <h2
      className={cn(
        'font-mono text-[13px] font-medium tracking-[0.04em] text-[#6e6e73]',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return (
    <div className={cn('px-6 py-5', className)} {...props} />
  )
}

export { Card, CardHeader, CardTitle, CardContent }
