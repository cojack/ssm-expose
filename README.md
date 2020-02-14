# ssm-expose
Expose AWS SSM Secrets into Environment Variables

## How it works?

This piece of code expose variables from [SSM](https://eu-west-1.console.aws.amazon.com/secretsmanager/home?region=eu-west-1#/home)
to the `process.env` variable as their are.

## Required

#### SSM secrets naming 

Convention: `environment dot project-name`

Example:

* `dev.ssm-expose`
* `stage.ssm-expose`
* `prod.ssm-expose`

`project-name` is taken from field `name` in file `package.json` 

#### Environment variables
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* AWS_DEFAULT_REGION

##### Optional environment variable
* APP_ENV - by default `dev`

Why not `NODE_EVN`?
Because for me this variable is suited for different part of logic, it tells to the NODE ecosystem, in which environment
this current application is running. But your application might be running in different state on production environment.

So my propose here is to use:

* dev
* stage
* prod

## Usage

Because this is asynchronous piece of code, we can not use preload `-r` of modules in cli, so we have to use it in code.

```typescript
import {expose} from 'ssm-expose';

async function dispatch(): Promise<void> { 
    try {
        await expose();
    } catch (err) {
        // your error handling logic
    }
}
```

Method `expose` throws an `Error` because it parse JSON, so JSON might be malformed, or request to AWS might throw an error as well.
