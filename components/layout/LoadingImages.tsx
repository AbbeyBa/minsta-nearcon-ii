const LoadingImages = () => {
  const getArray = (n: number) => {
    return Array.from({ length: n }, (_, i) => i)
  }

  return (
    <div className="container flex flex-row flex-wrap gap-1 sm:gap-4 lg:gap-8 justify-center m-auto">
      {getArray(38).map((index) => (
        <div
          className="bg-gray-100 w-24 h-24 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-cover bg-center bg-no-repeat animate-pulse"
          key={index}
        />
      ))}
    </div>
  )
}

export default LoadingImages
