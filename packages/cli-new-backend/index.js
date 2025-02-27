const {
    addLinter,
    addBookshelfToScripts,
    addMongooseToScripts,
    createCommonFilesAndFolders,
    newProjectInstructions,
    testBackend
} = require("@blixi/cli-new-utils")
const {
    loadFile,
    store,
    mkdirSync,
    writeFile,
    installAllPackages,
    addDependenciesToStore,
    addScriptToPackageJSON,
    appendFile,
    logTaskStatus,
    createMultipleFolders
} = require('@blixi/core')

// load files
const cluster = loadFile('backend/common/cluster.js')
const routes = loadFile('backend/common/routes.js')

exports.createBackend = () => {
    // if api mode need to create common files and folders
    if (store.backendType === 'api') {
        createCommonFilesAndFolders()
    }
    // create folders
    createMultipleFolders([
       'server',
       'server/models',
       'server/controllers',
       'server/helpers' 
    ])

    if (store.backendType !== 'api') {
        mkdirSync(`assets`)
    }

    // create files: routes.js cluster.js
    writeFile(`server/routes.js`, routes)
    writeFile(`server/cluster.js`, cluster)

    if (store.backendType === 'standard') {
        // type when there is a frontend framework and for the most part the backend is a soa but serves some assets and files
        this.standard()
    } else if (store.backendType === 'mvc') {
        // mode for when their is no frontend framework so pug is default (this is a rails style mvc with ssr)
        this.mvcType()
    } else {
        // api mode json only, no views, no cookies
        this.apiType()
    }

    this.addDatabase(store.database)

    // scripts: controller, model, and if pug project view and add their associated commands to the package.json
    this.scripts(store.backendType)

    // packages to install
    this.packages(store.backendType)
    // setup endpoint tests
    testBackend(store.serverTesting)

    //add variables to .env file
    this.envSetup()
    if (store.skipInstallation) {
        return newProjectInstructions()
    }
    installAllPackages()
        .then(() => newProjectInstructions())
        .catch((err) => {
            // TODO log error or raw error depending on env
        })
}

exports.standard = () => {
    let html = loadFile('frontend/other/index.html')
    let server = loadFile('backend/standard/serverWithHotReloading.js')
    let controller = loadFile('backend/standard/home.js')

    // mode for when there is a frontend framework
    mkdirSync(`server/views`)
    mkdirSync(`server/views/home`)
    writeFile(`server/views/home/index.html`, html)
    writeFile(`server/server.js`, server)
    writeFile(`server/controllers/home.js`, controller)
}

exports.mvcType = () => {
    const server = loadFile('backend/mvc/server.js')
    const error = loadFile('backend/mvc/error.pug')
    const layout = loadFile('backend/mvc/layout.pug')
    const pug = loadFile('backend/mvc/index.pug')
    const controller = loadFile('backend/mvc/home.js')

    mkdirSync(`server/views`)
    mkdirSync(`server/views/home`)

    writeFile(`server/views/error.pug`, error)
    writeFile(`server/views/layout.pug`, layout)
    writeFile(`server/views/home/index.pug`, pug)
    writeFile(`server/server.js`, server)
    writeFile('server/controllers/home.js', controller)
}

exports.apiType = () => {
    let server = loadFile('backend/api/server.js')
    let controller = loadFile('backend/api/home.js')

    writeFile(`server/server.js`, server)
    writeFile(`server/controllers/home.js`, controller)
    // only the api type needs the linter, otherwise the frontend will have already asked and added it
    addLinter()
}

exports.addDatabase = databaseSelection => {
    if (databaseSelection.database === 'mongo') {
        addMongooseToScripts()
    } else if (databaseSelection.database === 'pg') {
        addBookshelfToScripts()
    }

    if (databaseSelection['database']) {
        logTaskStatus('Configure database', 'success')
    }
}

exports.scripts = mode => {
    let controller = loadFile('scripts/backend/controller.js')
    let controllerTemplate = loadFile('scripts/backend/templates/controller.js')
    let routesTemplate = loadFile('scripts/backend/templates/routes.js')

    if (mode === 'standard') {
        addScriptToPackageJSON('start', `nodemon --watch server server/cluster.js`)
    } else {
        addScriptToPackageJSON('start', 'nodemon server/cluster.js')
    }
    // controller script
    addScriptToPackageJSON('controller', 'node scripts/controller.js')
    // create files
    writeFile(`scripts/controller.js`, controller)
    writeFile(`scripts/templates/controller.js`, controllerTemplate)
    writeFile(`scripts/templates/routes.js`, routesTemplate)

    logTaskStatus('Blix backend scripts', 'success')
}

exports.packages = mode => {
    if (mode === 'standard') {
        addDependenciesToStore(
            'express nodemon body-parser compression helmet dotenv morgan cookie-parser'
        )
        addDependenciesToStore('webpack-dev-middleware webpack-hot-middleware', 'dev')
    } else if (mode === 'mvc') {
        addDependenciesToStore(
            'express nodemon body-parser compression helmet dotenv morgan cookie-parser pug'
        )
    } else {
        addDependenciesToStore(
            'express nodemon body-parser compression helmet dotenv morgan'
        )
    }
}

exports.envSetup = () => {
    appendFile(`.env`, '\nWORKERS=1')
    logTaskStatus('Added env variables', 'success')
}
