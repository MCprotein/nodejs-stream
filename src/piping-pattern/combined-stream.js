import { createGzip, createGunzip } from 'zlib'
import { createCipheriv, createDecipheriv, scryptSync } from 'crypto'
import { pipeline } from 'stream'

function createKey(password) {
  return scryptSync(password, 'salt', 24)
}

export function createCompressAndEncrypt(password, iv) {
  const key = createKey(password)
  const combinedStream = pipeline(createGzip(), createCipheriv('aes192', key, iv), (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
  combinedStream.iv = iv

  return combinedStream
}

export function createDecryptAndDecompress(password, iv) {
  const key = createKey(password)
  return pipeline(createDecipheriv('aes192', key, iv), createGunzip())
}
