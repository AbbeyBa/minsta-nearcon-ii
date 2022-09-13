// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Bundlr from '@bundlr-network/client'
import { ARWEAVE_KEY } from '../../constants/arweave'
import dataUriToBuffer from 'data-uri-to-buffer'

const bundlr = new Bundlr('http://node1.bundlr.network', 'arweave', ARWEAVE_KEY)

const upload = async (buffer: Buffer) => {
  const { data } = await bundlr.uploader.upload(buffer, [
    { name: 'Content-Type', value: 'image/jpeg' },
  ])

  return data.id
}

const uploadMetadata = async (buffer: Buffer) => {
  const { data } = await bundlr.uploader.upload(buffer, [
    { name: 'Content-Type', value: 'application/json' },
  ])

  return data.id
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST': {
      const { dataSrc } = req.body

      const image = await fetch(dataSrc)
      const imageBuffer = Buffer.from(await image.arrayBuffer())

      const imageId = await upload(imageBuffer)

      res.status(200).json({
        id: imageId,
      })

      break
    }

    default:
      break
  }
}
