import { createWriteStream } from 'fs'
import { createServer } from 'net'

function demultiplexChannel(source, destinations) {
  let currentChannel = null
  let currentLength = null

  source
    .on('readable', () => {
      let chunk
      if (!currentChannel) {
        chunk = source.read(1)
        currentChannel = chunk && chunk.readUInt8(0)
      }

      if (!currentLength) {
        chunk = source.read(4)
        currentLength = chunk && chunk.readUInt32BE(0)
        if (currentLength === null) {
          return null
        }
      }

      chunk = source.read(currentLength)
      if (!chunk) {
        return null
      }

      console.log(`Received packet from: ${currentChannel}`)
      destinations[currentChannel].write(chunk)
      currentChannel = null
      currentLength = null
    })
    .on('end', () => {
      destinations.forEach((destination) => destination.end())
      console.log('Source channel closed')
    })
}

const server = createServer((socket) => {
  const stdoutStream = createWriteStream('stdout.log')
  const stderrStream = createWriteStream('stderr.log')
  demultiplexChannel(socket, [stdoutStream, stderrStream])
})
server.listen(3000, () => console.log('Server started'))
