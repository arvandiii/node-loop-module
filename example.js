const Promise = require('bluebird')
const Redis = require('ioredis')
const { run, init } = require('./index')

const redis = new Redis(6379, 'redis')

const f = async (code, key, msg) => {
  const value0 = await redis.get(key)
  if (Math.random() > 0.8) {
    throw new Error('random error')
  }
  await Promise.delay(10000)
  const value1 = await redis.incr(key)
  console.log('\x1b[31m', msg, `(code:${code})`, '\x1b[0m', value0, value1)
}

init(redis)

run('module:loop:testkey1', f, "I'm running")
run('module:loop:testkey2', f, "I'm running with another code")
