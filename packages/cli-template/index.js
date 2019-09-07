
const { render } = require('mustache')
const { prompt } = require('inquirer')
const { loadTemplate, logCriticalError } = require('@blixi/core')
const questions = []

async function template(cliArgs) {
    console.log('CLI ARGS', cliArgs)
    let file;
    try {
        file = loadTemplate('js/example.js')
    } catch(err) {
        process.exit(1)
    }

    findFields(file)
    
    let answers = await prompt(questions)
    let renderedFile
    try {
        renderedFile = render(file, answers)
    } catch (err) {
        logCriticalError('Error rendering template', err)
    }

    console.log(renderedFile)
}

function findFields(file) {
    let reg = /{{(.*?)}}/g;
    let match = reg.exec(file)
    while (match) {
        let text = match[1].trim()
        matchFound(text)
        // NOTE - this continues the loop and finds the next match
        match = reg.exec(file);
    }
}

function matchFound(text) {
    if (text.charAt(0) === '#') {
        text = text.slice(1)
        let tmpQuestion = {
            name: text,
            type: 'confirm',
            message: `${text}:`
        }
        questions.push(tmpQuestion)
    } else if (text.charAt(0) !== '/' && text.charAt(0) !== '!' && text.charAt(0) !== '^') {
        let tmpQuestion = {
            name: text,
            message: `${text}:`,
            type: 'input'
        }
        questions.push(tmpQuestion)
    }
}

module.exports = {
    template
}