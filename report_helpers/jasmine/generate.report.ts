import * as allureCommandline from 'allure-commandline'

const allureVersion = Number(process.env.allureV)
const commands = ['generate', '-c', `./allure${allureVersion}-results`, '-o', `./allure${allureVersion}-report`]

const reportGenerator = allureCommandline(commands)

reportGenerator.on('exit', function(exitCode) {
  console.log('Generation is finished with code:', exitCode);
  allureCommandline(['open', `./allure${allureVersion}-report`])
});
