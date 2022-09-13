const Footer = ({ children }: { children: React.ReactNode }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black text-center text-white flex items-center justify-between z-20">
      {children}
    </footer>
  )
}

export default Footer
