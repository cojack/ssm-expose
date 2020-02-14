import {config, SecretsManager} from 'aws-sdk';

config.update({region: process.env.AWS_DEFAULT_REGION});

export async function expose(): Promise<JSON> {
	try {
		const projectRootPath = process.cwd();
		const packageInfo = require(`${projectRootPath}/package.json`);

		const nodeEnv = process?.env?.APP_ENV ?? 'dev';
		const secretsManager = new SecretsManager({apiVersion: '2017-10-17'});
		const SecretId = `${nodeEnv}.${packageInfo.name}`.toLowerCase();

		const response = await secretsManager.getSecretValue({SecretId}).promise();
		const secrets = JSON.parse(response.SecretString);

		Object.keys(secrets).forEach(secret => process.env[secret] = secrets[secret]);

		return secrets;
	} catch (err) {
		throw new Error(err.message);
	}
}
