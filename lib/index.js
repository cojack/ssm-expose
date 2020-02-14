"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const fs_1 = require("fs");
const dotenv_1 = require("dotenv");
function expose() {
    var _a, _b, _c;
    const projectRootPath = process.cwd();
    const packageInfo = require(`${projectRootPath}/package.json`);
    const nodeEnv = (_c = (_b = (_a = process) === null || _a === void 0 ? void 0 : _a.env) === null || _b === void 0 ? void 0 : _b.NODE_ENV, (_c !== null && _c !== void 0 ? _c : 'development'));
    const secretsManager = new aws_sdk_1.SecretsManager();
    let envs;
    if (fs_1.existsSync(`${projectRootPath}/.env.example`)) {
        envs = dotenv_1.parse(`${projectRootPath}/.env.example`);
    }
    else if (fs_1.existsSync(`${projectRootPath}/.env.schema`)) {
        envs = dotenv_1.parse(`${projectRootPath}/.env.example`);
    }
    const promises = Object.keys(envs).map(env => secretsManager.getSecretValue({
        SecretId: `${nodeEnv}/${packageInfo.name}/${env}`
    }));
    return Promise.all(promises).then((values) => {
        values.forEach(value => {
            value.eachPage((err, data) => {
                if (err) {
                    console.error(err);
                }
                else {
                    process.env[data.Name] = data.SecretString;
                }
                return true;
            });
        });
    });
}
exports.expose = expose;
