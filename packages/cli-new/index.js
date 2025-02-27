const fs = require("fs");
const inquirer = require("inquirer");
const prompt = inquirer.prompt;
const { createBackend } = require("@blixi/cli-new-backend");
const { vue } = require("@blixi/cli-new-vue");
const { react } = require("@blixi/cli-new-react");
const {
  store,
  yarn,
  clearConsole,
  logError
} = require('@blixi/core')

// console prompts
const {
  namePrompt,
  defaultOrCustom,
  frontendOptions,
  backend,
  database,
  serverTesting,
  e2e,
  reactTesting,
  vueTesting,
  reactCSS,
  vueCSS,
  linterPrompt
} = require("@blixi/cli-prompts");

const promptPreset = async () => {
  const answer = await prompt([defaultOrCustom])
  if (answer.preset === 'react-default') {
    store.reactType = 'reactRouter-redux'
    store.reactTesting = { enzyme: true }
    store.e2e = 'None'
    store.backend = { backend: true }
    store.serverTesting = 'jest'
    store.database = 'mongo'
    if (!store.skipInstallation) {
      await yarn()
    }
    react()
  } else {
    this.promptFrontend()
  }
}

exports.promptPreset = promptPreset


// prompts user to select frontend type and branches into project specific questions from there
const promptFrontend = async () => {
  const answer = await prompt([frontendOptions]);
  switch (answer.frontend) {
    case "react":
      this.reactProject("react");
      break;
    case "react-router":
      this.reactProject("react-router");
      break;
    case "redux":
      this.reactProject('redux');
      break;
    case "reactRouter-redux":
      this.reactProject("reactRouter-redux")
      break;
    case "vue":
      this.vueProject("vue")
      break;
    case "vue-router":
      this.vueProject("vue-router")
      break;
    case "vuex":
      this.vueProject("vuex")
      break;
    case "vueRouter-vuex":
      this.vueProject("vueRouter-vuex")
      break;
    default:
      this.backendOnly();
      break;
  }
};

exports.promptFrontend = promptFrontend

const reactProject = async reactType => {
  store.reactType = reactType
  let cssOption = await prompt([reactCSS])
  store.reactCSS = cssOption.css
  let linter = await prompt([linterPrompt])
  store.linter = linter.linter
  store.reactTesting = await prompt([reactTesting]);
  store.e2e = await prompt([e2e]);
  store.backend = await prompt([backend]);

  if (store.backend.backend) {
    store.serverTesting = await prompt([serverTesting]);
    store.database = await prompt([database]);
  }
  await yarn()
  react();
};

exports.reactProject = reactProject

const vueProject = async vueType => {
  store.vueType = vueType
  let cssOption = await prompt([vueCSS])
  store.vueCSS = cssOption.css
  let linter = await prompt([linterPrompt])
  store.linter = linter.linter
  store.vueTesting = await prompt([vueTesting])
  store.e2e = await prompt([e2e]);
  store.backend = await prompt([backend]);

  if (store.backend.backend) {
    store.serverTesting = await prompt([serverTesting]);
    store.database = await prompt([database]);
  }
  await yarn()
  vue()
}

exports.vueProject = vueProject

const backendOnly = async () => {
  let linter = await prompt([linterPrompt])
  store.linter = linter.linter
  store.serverTesting = await prompt([serverTesting]);
  store.database = await prompt([database]);
  store.backendType = "api" 
  store.backend = { backend: true }
  await yarn()
  createBackend();
};

exports.backendOnly = backendOnly

const promptForName = async () => {
  let answer = await prompt([namePrompt])
  store.name = answer.name
  this.createProject()
}

exports.promptForName = promptForName

// create project ensures there shouldn't be errors before starting the prompts
const createProject = () => {
  if (!store.name) {
    clearConsole()
    this.promptForName()
    return
  }
  if (fs.existsSync(`./${store.name}`)) {
    logError(`A project named ${store.name} already exists!`)
    this.promptForName()
    return
  }
  this.promptPreset()
};

exports.createProject = createProject