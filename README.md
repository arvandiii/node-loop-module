## Node loop module

this module let you run small simple task in a loop only with one instace.

## Quick Start

api methods:

```javascript
init = resid => {}
run = async (code, func, ...params) => {}
```

### yout function must be an async function and it's first argument is the code

simple example:

```javascript
const Promise = require('bluebird')
const Redis = require('ioredis')
const { run, init } = require('./index')

const redis = new Redis(6379, 'redis')

const f = async (...params) => {
  const value0 = await redis.get('loopModule:testKey')
  if (Math.random() > 0.8) {
    throw new Error('random error')
  }
  await Promise.delay(10000)
  const value1 = await redis.incr('loopModule:testKey')
  console.log('\x1b[31m', ...params, '\x1b[0m', value0, value1)
}

init(redis)

run('000', f, "I'm running", process.env.pm_id)
run('001', f, "I'm running with another code", process.env.pm_id)
```

run this script with pm2 (using multiple instances)

```bash
$ pm2 start example.js --no-daemon -i 3
```
