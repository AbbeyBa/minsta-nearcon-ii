// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Bundlr from '@bundlr-network/client'
import { ARWEAVE_KEY } from '../../constants/arweave'
import dataUriToBuffer from 'data-uri-to-buffer'

const bundlr = new Bundlr('http://node1.bundlr.network', 'arweave', ARWEAVE_KEY)

const generateRandomId = (length: number) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

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
    // takes image, uploads it, generates and uploads metadata and return metadata hash
    case 'POST': {
      const { dataUri } = req.body

      const imageBuffer = dataUriToBuffer(dataUri)

      const imageId = await upload(imageBuffer)

      const metadata = {
        media_hash: imageId,
        media: `https://arweave.net/${imageId}`,
        title: generateRandomId(10),
        description: generateRandomId(10),
      }

      const metadataId = await uploadMetadata(
        Buffer.from(JSON.stringify(metadata))
      )

      res.status(200).json({
        id: metadataId,
      })

      break
    }

    default:
      break
  }
}
