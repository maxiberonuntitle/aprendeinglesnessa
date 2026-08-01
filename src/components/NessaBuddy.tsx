import { art } from '../data/art'

type Props = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function NessaBuddy({ size = 'md', className = '' }: Props) {
  return (
    <div className={`nessa-buddy nessa-buddy-${size} ${className}`.trim()} aria-hidden="true">
      <img src={art.nessa} alt="" />
    </div>
  )
}
