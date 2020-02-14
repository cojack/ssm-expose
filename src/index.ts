import {AWSError, Request, SecretsManager} from 'aws-sdk';
import {GetSecretValueResponse} from 'aws-sdk/clients/secretsmanager';
import {existsSync} from 'fs';
import {parse} from 'dotenv';

export function expose(): Promise<void> {
    const projectRootPath = process.cwd();
    const packageInfo = require(`${projectRootPath}/package.json`);

    const nodeEnv = process?.env?.NODE_ENV ?? 'development';
    const secretsManager = new SecretsManager();
    let envs;

    if (existsSync(`${projectRootPath}/.env.example`)) {
        envs = config(`${projectRootPath}/.env.example`);
    } else if (existsSync(`${projectRootPath}/.env.schema`)) {
        envs = config(`${projectRootPath}/.env.example`);
    }

    const promises = Object.keys(envs).map(env => secretsManager.getSecretValue({
        SecretId: `${nodeEnv}/${packageInfo.name}/${env}`
    }));

    return Promise.all(promises).then((values: Request<GetSecretValueResponse, AWSError>[]) => {
        values.forEach(value => {
            value.eachPage((err, data): boolean => {
                if (err) {
                    console.error(err);
                } else {
                    process.env[data.Name] = data.SecretString;
                }
                return true;
            });
        });
    });
}
