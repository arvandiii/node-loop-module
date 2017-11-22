## Node loop module

this module let you run small simple task in a loop only with one instace. each
code is for one function and only one instance is running each code in a
specific time.

## Quick Start

api methods:

init method for initialization input is an ioredis client

```javascript
init(resid)
```

run method will run your code first argument is the function code second
argument is an async function and others are function arguments

```javascript
run(code, func, ...params)
```

#### yout function must be an async function and it's first argument is the code

simple example:

```javascript
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

run('000', f, 'module:loop:testkey1', "I'm running")
run('001', f, 'module:loop:testkey2', "I'm running with another code")
```

run this script with pm2 (using multiple instances)

```bash
$ pm2 start example.js --no-daemon -i 3
```
