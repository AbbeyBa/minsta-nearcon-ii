import { ArrowNarrowLeftIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'

const GoBackButton = ({ goPreviousPage }: { goPreviousPage?: boolean }) => {
  const router = useRouter()

  return (
    <div
      className="text-white"
      onClick={() => {
        if (goPreviousPage) {
          router.back()
        } else {
          router.push('/')
        }
      }}
    >
      <ArrowNarrowLeftIcon className="h-5 w-5" />
    </div>
  )
}

export default GoBackButton
