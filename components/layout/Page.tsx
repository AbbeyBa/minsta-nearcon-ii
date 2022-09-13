const Page = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-col justify-center items-center bg-black overflow-hidden h-screen">
      {children}
    </div>
  )
}

export default Page
