const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black w-full text-white flex justify-between items-center px-4 sm:px-12 py-2 z-20">
      {children}
    </header>
  )
}

export default Header
