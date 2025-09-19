import React, { useCallback, useState, useRef } from 'react'

interface FileUploadPanelProps {
  onFileUpload: (file: File) => Promise<void>
}


const FileUploadPanel: React.FC<FileUploadPanelProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 파일 검증
  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv',
    ]
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx?|csv)$/i)) {
      alert('지원되지 않는 파일 형식입니다. Excel(.xlsx, .xls) 또는 CSV 파일만 업로드 가능합니다.')
      return false
    }
    
    if (file.size > maxSize) {
      alert('파일 크기가 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.')
      return false
    }
    
    return true
  }

  // 파일 처리
  const handleFileProcess = useCallback(async (file: File) => {
    if (!validateFile(file)) return

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // 가상의 진행률 업데이트 (실제 WASM 분석은 빠르게 완료됨)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      try {
        await onFileUpload(file)
      } finally {
        clearInterval(progressInterval)
      }
      setUploadProgress(100)
      
      // 완료 후 리셋
      setTimeout(() => {
        setUploadProgress(0)
        setIsUploading(false)
      }, 1000)
      
    } catch (error) {
      console.error('파일 업로드 실패:', error)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [onFileUpload])

  // 드래그 앤 드롭 핸들러
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileProcess(files[0])
    }
  }, [handleFileProcess])

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileProcess(files[0])
    }
    // input 값 리셋 (같은 파일 재선택 가능하도록)
    e.target.value = ''
  }, [handleFileProcess])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div
      className={`
        w-full h-[52vh] min-h-[360px] flex items-center justify-center text-center select-none
        border-2 border-dashed rounded-2xl transition-all duration-200
        ${isDragOver ? 'border-blue-400 bg-blue-500/10' : 'border-white/25 glass'}
        ${isUploading ? 'pointer-events-none opacity-80' : 'cursor-pointer'}
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      {isUploading ? (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <div className="text-white font-medium">분석 중...</div>
            <div className="w-64 mx-auto bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-300">{uploadProgress}% 완료</div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-14 h-14 rounded-full bg-white/15 mx-auto flex items-center justify-center text-2xl">+</div>
          <div className="text-white text-lg font-semibold">여기에 드래그해서 추가</div>
          <div className="text-white/80 text-sm">또는 클릭하여 파일 선택 (.xlsx, .xls, .csv, 최대 10MB)</div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

export default FileUploadPanel
