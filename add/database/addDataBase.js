let inquirer = require('inquirer')
let prompt   = inquirer.prompt
const { database } = require('../../new/prompts')
const { addMongooseToScripts } = require('../backend/addMongoDB')
const { addBookshelfToScripts } = require('../backend/addBookshelf')


const addDatabase = async () => {
  let databaseSelection = await prompt([database])
  if (databaseSelection.database === 'mongo') {
    addMongooseToScripts()
  } else if (databaseSelection.database === 'pg') {
    addBookshelfToScripts()
  }
}

module.exports = addDatabase