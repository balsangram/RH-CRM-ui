import React, { useRef } from 'react'

export const ImageUpload = ({
  images = [],
  onChange,
  maxImages = 12,
  label = 'Package Photos & Gallery',
  hint = 'Select and upload multiple images from your computer (JPG, PNG, WebP).',
}) => {
  const fileInputRef = useRef(null)
  const replaceInputRef = useRef(null)
  const replacingIndexRef = useRef(null)

  // Handle multiple file selection
  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const remainingSlots = maxImages - images.length
    const filesToProcess = files.slice(0, remainingSlots)

    const readers = filesToProcess.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => resolve(event.target.result)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then((newBase64List) => {
      onChange?.([...images, ...newBase64List])
      if (fileInputRef.current) fileInputRef.current.value = ''
    })
  }

  // Handle single file replacement
  const handleReplaceSelected = (e) => {
    const file = e.target.files?.[0]
    const idx = replacingIndexRef.current
    if (!file || idx === null || idx === undefined) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const updated = [...images]
      updated[idx] = event.target.result
      onChange?.(updated)
      if (replaceInputRef.current) replaceInputRef.current.value = ''
    }
    reader.readAsDataURL(file)
  }

  // Set image as primary cover (move to position 0)
  const handleSetCover = (index) => {
    if (index === 0) return
    const target = images[index]
    const remaining = images.filter((_, idx) => idx !== index)
    onChange?.([target, ...remaining])
  }

  // Remove single image
  const handleRemove = (index) => {
    const updated = images.filter((_, idx) => idx !== index)
    onChange?.(updated)
  }

  // Trigger file browser for replace
  const triggerReplace = (index) => {
    replacingIndexRef.current = index
    replaceInputRef.current?.click()
  }

  return (
    <div className="space-y-2.5 font-sans">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-main">
          {label} *
        </label>
        <span className="text-[10px] text-muted font-semibold">
          {images.length} / {maxImages} Photos
        </span>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFilesSelected}
        className="hidden"
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleReplaceSelected}
        className="hidden"
      />

      {/* Upload Dropzone Button */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary/60 bg-slate-50/70 hover:bg-slate-100/70 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 group select-none"
      >
        <div className="w-9 h-9 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <span className="text-xs font-bold text-main group-hover:text-primary transition-colors block">
            Click to Select & Upload Photos
          </span>
          <span className="text-[11px] text-muted block mt-0.5">
            {hint}
          </span>
        </div>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {images.map((imgSrc, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden border bg-slate-100 group shadow-2xs aspect-video ${
                idx === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              }`}
            >
              <img
                src={imgSrc}
                alt={`Uploaded ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Cover badge */}
              {idx === 0 ? (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-primary text-white shadow-xs">
                  ★ Cover
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetCover(idx)}
                  className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/90 text-main shadow-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                  title="Make this the primary cover image"
                >
                  Set Cover
                </button>
              )}

              {/* Action buttons (Replace / Delete) */}
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => triggerReplace(idx)}
                  className="w-5 h-5 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center text-[10px] font-bold shadow-xs cursor-pointer"
                  title="Replace this image"
                >
                  ↻
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-[10px] font-bold shadow-xs cursor-pointer"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>

              {/* Bottom index caption */}
              <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-white/90 drop-shadow">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
