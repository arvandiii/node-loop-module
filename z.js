const Promise = require('bluebird')
const Redis = require('ioredis')
const { run, init } = require('./index')

const redis = new Redis(6379, 'redis')

const f = async (...params) => {
  const on0 = await redis.get('ono')
  if (Math.random() > 0.8) {
    throw new Error('alaki')
  }
  await Promise.delay(10000)
  const on1 = await redis.incr('ono')
  console.log(...params, on0, on1)
}
init(redis)

run('salam', f, 'daste mane', process.env.pm_id)
