import * as Mocha from 'mocha'
import * as path from 'path'
import * as fs from 'fs'

const mocha = new Mocha({
  timeout: 5000,
  reporter: 'spec',
})

const testDir = path.resolve(__dirname, 'spec')
const files = fs.readdirSync(testDir)
const tests = files.filter((file) => file.includes('.spec.'))

tests.forEach((spec) => mocha.addFile(path.join(testDir, spec)))

mocha.run((failures) => process.exitCode = failures ? 1 : 0)
