"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var readline = require('readline');
var store = require('./store');
var logSymbols = require('log-symbols');
function logError(msg) {
    console.error(chalk_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{red ", "}"], ["{red ", "}"])), msg));
}
exports.logError = logError;
function logWarning(msg) {
    console.warn(chalk_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{yellow ", "}"], ["{yellow ", "}"])), msg));
}
exports.logWarning = logWarning;
function logTaskStatus(task, status, symbol) {
    var stringToStore = '';
    if (symbol) {
        stringToStore = symbol + " " + task;
    }
    else {
        stringToStore = (logSymbols[status] ? logSymbols[status] : logSymbols.success) + "  " + task;
    }
    store.tasks.push(stringToStore);
    clearConsole();
    store.tasks.forEach(function (task) {
        console.log(task);
    });
}
exports.logTaskStatus = logTaskStatus;
// logger action methods
function logCreate(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["{green create} ", ""], ["{green create} ", ""])), msg));
    }
}
exports.logCreate = logCreate;
function logDeleted(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default(templateObject_4 || (templateObject_4 = __makeTemplateObject(["{red delete} ", ""], ["{red delete} ", ""])), msg));
    }
}
exports.logDeleted = logDeleted;
function logMutate(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default(templateObject_5 || (templateObject_5 = __makeTemplateObject(["{yellow mutate} ", ""], ["{yellow mutate} ", ""])), msg));
    }
}
exports.logMutate = logMutate;
function logInsert(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default(templateObject_6 || (templateObject_6 = __makeTemplateObject(["{cyan insert} ", ""], ["{cyan insert} ", ""])), msg));
    }
}
exports.logInsert = logInsert;
function logAppend(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default(templateObject_7 || (templateObject_7 = __makeTemplateObject(["{cyan append} ", ""], ["{cyan append} ", ""])), msg));
    }
}
exports.logAppend = logAppend;
function logInvoke(msg) {
    if (store.env === 'development' && store.mode !== 'cli') {
        console.log(chalk_1.default(templateObject_8 || (templateObject_8 = __makeTemplateObject(["{blue invoke} ", ""], ["{blue invoke} ", ""])), msg));
    }
}
exports.logInvoke = logInvoke;
function clearConsole(title) {
    if (process.stdout.isTTY) {
        // @ts-ignore
        var blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        if (title) {
            console.log(chalk_1.default.bold.cyan(title));
        }
        else if (store.mode === 'cli' && store.blixVersion) {
            console.log(chalk_1.default.bold.cyan("Blix v" + store.blixVersion));
            console.log();
        }
    }
}
exports.clearConsole = clearConsole;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
