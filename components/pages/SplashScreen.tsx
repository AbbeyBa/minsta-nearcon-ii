import Page from '../layout/Page'

const SplashScreen = () => {
  return (
    <Page>
      <div className="w-screen h-screen flex flex-col gap-4 items-center justify-center text-white transition ease-out duration-1000">
        <h1 className='flex text-3xl font-extrabold'>Minsta.</h1>
        <p className='flex text-sm'>Offer moments</p>
      </div>
    </Page>
  )
}

export default SplashScreen
