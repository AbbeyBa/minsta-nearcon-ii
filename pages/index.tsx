import Head from 'next/head'

import dynamic from 'next/dynamic'
const Feed = dynamic(() => import('../components/pages/Feed'), {
  ssr: false,
})

const Home = () => {
  return (
    <>
      <Head>
        <title>Minsta</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Feed></Feed>
    </>
  )
}

export default Home
