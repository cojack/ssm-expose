"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
aws_sdk_1.config.update({ region: process.env.AWS_DEFAULT_REGION });
async function expose() {
    var _a, _b, _c;
    try {
        const projectRootPath = process.cwd();
        const packageInfo = require(`${projectRootPath}/package.json`);
        const nodeEnv = (_c = (_b = (_a = process) === null || _a === void 0 ? void 0 : _a.env) === null || _b === void 0 ? void 0 : _b.APP_ENV, (_c !== null && _c !== void 0 ? _c : 'dev'));
        const secretsManager = new aws_sdk_1.SecretsManager({ apiVersion: '2017-10-17' });
        const SecretId = `${nodeEnv}.${packageInfo.name}`.toLowerCase();
        const response = await secretsManager.getSecretValue({ SecretId }).promise();
        const secrets = JSON.parse(response.SecretString);
        Object.keys(secrets).forEach(secret => process.env[secret] = secrets[secret]);
        return secrets;
    }
    catch (err) {
        throw new Error(err.message);
    }
}
exports.expose = expose;
