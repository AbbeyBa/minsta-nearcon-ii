import { RefObject } from 'react'
import { Container, Wrapper, Canvas, Cam } from './styles'
import { AspectRatio } from './types'

const Camera = ({
  refs,
  aspectRatio,
  mirrored,
}: {
  aspectRatio: AspectRatio
  refs: {
    player?: RefObject<HTMLVideoElement>
    canvas?: RefObject<HTMLCanvasElement>
    container?: RefObject<HTMLDivElement>
  }
  mirrored: boolean
}) => {
  const { player, canvas, container } = refs

  return (
    <Container aspectRatio={aspectRatio || 'cover'} ref={container}>
      <Wrapper>
        <Cam
          ref={player}
          id={'video'}
          muted={true}
          autoPlay={true}
          playsInline={true}
          mirrored={mirrored}
        ></Cam>
        <Canvas ref={canvas}></Canvas>
      </Wrapper>
    </Container>
  )
}

export default Camera
