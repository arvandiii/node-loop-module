## Node loop module

this module let you run small simple task in a loop only with one instace.

## Quick Start

```javascript
const Promise = require('bluebird')
const Redis = require('ioredis')
const { run, init } = require('./index')

const redis = new Redis(6379, 'redis')

const func = async (...params) => {
  const value0 = await redis.get('loopModule:testKey')
  if (Math.random() > 0.8) {
    throw new Error('random error')
  }
  await Promise.delay(10000)
  const value1 = await redis.incr('loopModule:testKey')
  console.log(...params, value0, value1)
}

init(redis)

run('hello world', func, 'Im running', process.env.pm_id)
```

run this script with pm2 (using multiple instances)

```
pm2 start example.js --no-daemon -i 3
```
