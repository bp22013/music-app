import { memo } from 'react'

type Props = React.PropsWithChildren<{ onClose: () => void }>

export const Modal = memo<Props>(({ children, onClose }) => {
  return (
    <div
      className='fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center overflow-auto bg-gray-900 bg-opacity-50'
      onClick={onClose}
    >
      <div
        className='relative inline-block origin-top-left rounded-lg bg-white p-5 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
})

Modal.displayName = 'Modal'