import { createServer } from 'http'
import Chance from 'chance'

const chance = new Chance()
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  function generateMore() {
    while (chance.bool({ likelihood: 95 })) {
      const shouldContinue = res.write(`${chance.string({ length: 16 * 1024 - 1 })}\n`)
      if (!shouldContinue) {
        console.log('back-pressure')
        /**
         * .once 는 한 번만 실행되고 리스너가 자동으로 제거된다.
         * 'drain' 이벤트는 현재 버퍼링된 모든 chunk가 빠져나가면 발생하는 이벤트이다.
         */
        return res.once('drain', generateMore)
      }
    }
    res.end('\n\n')
  }
  generateMore()
  res.on('finish', () => console.log('All data sent'))
})
server.listen(8080, () => {
  console.log('listening on http://localhost:8080')
})
