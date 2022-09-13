import { useState, useEffect, useRef } from 'react'
import { cg } from './index'

interface useFiltersOptions {
  initialValue?: string
  selectors?: string
}

const useFilters = ({ initialValue = '', selectors }: useFiltersOptions = {}): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    cg.applyFilter(selectors)
  }, [value])

  return [value, setValue]
}

interface useDownloadImageOptions {
  downloadFileName?: string
}

const useDownloadImage = ({
  downloadFileName = 'download',
}: useDownloadImageOptions = {}): {
  imageRef: React.RefObject<HTMLImageElement>
  download: () => void
  getDataUrl: ({ quality }: { quality: number }) => Promise<string>
} => {
  const imageRef = useRef<HTMLImageElement>(null)

  const download = async () => {
    const { current } = imageRef
    if (!current || !(current instanceof HTMLImageElement))
      throw new TypeError('ref must be an image')

    const a = document.createElement('a')
    a.href = await cg.getDataURL(current, {})
    a.download = downloadFileName
    a.click()
  }

  const getDataUrl = async ({ quality }: { quality?: number }) => {
    const { current } = imageRef
    if (!current || !(current instanceof HTMLImageElement))
      throw new TypeError('ref must be an image')

    return await cg.getDataURL(current, {
      type: 'image/jpeg',
      quality: quality || 0.8,
    })
  }

  return { imageRef, download, getDataUrl }
}

export { useDownloadImage, useFilters }
