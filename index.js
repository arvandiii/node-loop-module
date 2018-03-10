/* eslint-disable no-await-in-loop */

const { using } = require('bluebird')
const Promise = require('bluebird')
const Redlock = require('redlock')

let redis = null
let redlock = null
const driftFactor = 0.01 // time in ms
const retryCount = 0
const retryDelay = 200 // time in ms
const retryJitter = 200

const setRedis = newRedis => {
  redis = newRedis
}

const getRedis = () => {
  return redis
}

function unlockErrorHandler(err) {
  // console.error(err)
}

const run = async (interval, code, func, ...params) => {
  const resource = `locks:account:${code}`
  while (true) {
    try {
      await using(redlock.disposer(resource, interval, unlockErrorHandler), async lock => {
        let running = true
        const extendLock = async () => {
          while (running) {
            await lock.extend(interval / 5)
            await Promise.delay(interval / 10)
          }
        }
        const runFunc = async () => {
          try {
            await func(code, ...params)
          } catch (error) {
            console.log('loop function error', error)
            throw new Error('func')
          } finally {
            running = false
          }
        }
        await Promise.all([extendLock(), runFunc()])
      })
    } catch (error) {
      if (error.message === 'func') {
        console.log('loop func error')
      }
      await Promise.delay(interval)
    }
  }
}

const init = newRedis => {
  setRedis(newRedis)
  redlock = new Redlock([redis], {
    driftFactor, // time in ms
    retryCount,
    retryDelay, // time in ms
    retryJitter, // time in ms
  })
}

module.exports = { run, init, getRedis }
