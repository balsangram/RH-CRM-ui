import React from 'react'
import { useLottie } from 'lottie-react'
import loadingAnimation from '../../assets/svg/loading.json'
import loadingSvg from '../../assets/svg/loading.svg'

const LottieLoader = () => {
  const options = {
    animationData: loadingAnimation,
    loop: true,
    autoplay: true,
  }
  const { View } = useLottie(options)
  return <div className="w-full h-full flex items-center justify-center">{View}</div>
}

export const Loader = ({ fullPage = false, size = 'md', message = 'Loading...' }) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }

  const content = (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizeMap[size] || sizeMap.md} flex items-center justify-center overflow-hidden`}>
        {loadingAnimation ? (
          <LottieLoader />
        ) : (
          <img
            src={loadingSvg}
            alt="Loading"
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>
      {message && <p className="text-xs font-semibold text-muted mt-2 tracking-wide animate-pulse">{message}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
        <div className="bg-surface rounded-2xl p-6 shadow-xl border border-border">
          {content}
        </div>
      </div>
    )
  }

  return content
}

export default Loader
