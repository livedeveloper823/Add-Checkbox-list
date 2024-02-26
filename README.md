# Description

There are many tools that need to be set up in a project, linters, formatters and Docker files, which can be a pretty long task. Therefore, the React-Typescript skeleton. The base React-Typescript files were created with [Vitejs](https://vitejs.dev/) and a few extras were added.

# Pre-requisites

- git
- docker

# Add-ons

## ESLint

There are a couple of ways to run ESLint on the project. The first option is to run the following command:

```bash
$ npm run lint
```

The second option doesn't need a command. There are git hooks installed that will lint every `.ts` and `.tsx` file in the project before any commit.

## Prettier

Prettier can also be run in multiple ways. The first option is to use the following command:

```bash
$ npm run format
```

The second option, same as with ESLint, doesn't require any commands, it will automatically run before any commit.

The final option involves making changes in the code editor. For VSCode there is the [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) available. After installation a few more configuration steps are needed:

1. Change the Prettier config path to point to the file that has the configuration options, in this case `.prettierrc`.
2. Check the option to format on save.
3. Set the default formatter to Prettier.

This method will format the file after every save with the configuration rules from the project.

> **Pro tip:** Having auto save on will enhance the experience!

## Docker

In order the avoid writing long commands, they have been simplified with a Makefile.

Steps to develop with Docker:

1. Create the nodemodules volume by running the following command:

```bash
$ make setup
```

2. Install dependencies:

```bash
$ make install
```

3. Start development container:

```bash
$ make dev
```

# How we got here

## ESLint

ESLint was configured with the [Airbnb's style guide](https://github.com/airbnb/javascript). Installation steps:

1. Run the following command for **npm 5+**:

```bash
$ npx install-peerdeps --dev eslint-config-airbnb
```

2. Add "airbnb" to "extends" in the configuration file:

```
module.exports = {
  extends: [
    'airbnb',
  ],
};
```

For more information visit the [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) repository.

Since this is a React project with Typescript a couple more dependencies are required. The [eslint-config-airbnb-typescript](https://github.com/iamturns/eslint-config-airbnb-typescript) configurations will be used. Installation steps:

1. [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) needs to be installed first.
2. Install dependencies:

```bash
$ npm install eslint-config-airbnb-typescript \
            @typescript-eslint/eslint-plugin@^5.13.0 \
            @typescript-eslint/parser@^5.0.0 \
            --save-dev
```

3. The following configurations needs to added to ESLint config file:

```
{
 extends: ['airbnb', 'airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json'
  }
}
```

Finally, a couple more instructions needs to be added to the ESLint configuration file:

```
module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  parserOptions: {
    project: './tsconfig.json'
  },
};
```

`plugin:react-hooks/recommended` and `plugin:react/jsx-runtime` are added so hooks are supported and to avoid getting errors when React hasn't been imported in the file. Setting the React version to `detect` will help find the correct React version running in the project.

## Prettier

To install prettier we need to run the following command:

```bash
$ npm install --save-dev prettier eslint-config-prettier
```

`eslint-config-prettier` is installed so ESLint and Prettier can behave working together. More information can be found in this [StackOverflow question](https://stackoverflow.com/questions/44690308/whats-the-difference-between-prettier-eslint-eslint-plugin-prettier-and-eslint/44690309#44690309).

After installation a Prettier configuration file is required. These are the current Prettier configurations for this project:

```
module.exports = {
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "printWidth": 120,
  "bracketSpacing": true
}

```

Finally, an extra configuration needs to be extended in the ESLint configuration file:

```
module.exports = {
  extends: [
    ...,
    'eslint-config-prettier',
  ],
};
```

As an extra a `.prettierignore` file can be added to avoid running the formatter on every file in the project which can cause some delays if the project is big.

## Git Hooks

1. Installed the following dependencies:

```bash
$ npm install --save-dev husky lint-staged
```

2. Enable Git hooks:

```bash
$ npx husky install
```

3. To enable git hooks automatically after install run this command:

```bash
$ npm pkg set scripts.prepare="husky install"
```

4. Create a hook by running the following commands:

```bash
$ npx husky add .husky/pre-commit "npx lint-staged"

$ git add .husky/pre-commit
```

More information can be found on the [Husky](https://github.com/typicode/husky) and [pretty-quick](https://github.com/azz/pretty-quick) documentation.

## Docker

### Update Vite configurations to develop with Docker

In order to start developing with Docker a few modifications to the config file are required:

This is how the final file should look like:

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // allows the file watching system to work with Docker running on WSL2
    },
    host: true, // makes the server listen on all addresses
    strictPort: true, // avoids trying the next available port if the selected one is being used
    port: 5173, // port that will be mapped with the container's
  },
});
```

### Docker steps

The information here is an extract of this awesome [article](https://medium.com/hackernoon/a-better-way-to-develop-node-js-with-docker-cd29d3a0093), definitely check it out!

Docker provides a way to create an environment to run any application. When using Docker for production purposes this allows a high degree of customization, the environment can be created specifically for the application. On the other hand, when developing an app the only tools necessary are the ones for development and a space where the code can run.

For example, when developing a Node.js app only node is required, since there is no need for a specific environment the node image from Docker Hub should be enough.

1. Create a `docker-compose.yml` file:

```yml
version: '3'

services:
  dev:
    image: node:lts # node image from Docker Hub
    volumes:
      - nodemodules:/app/node_modules # mapping external volume to node_modules
      - .:/app # mounting current directory to app inside the container
    working_dir: /app # let's the container know where the code is being stored
    command: npm run dev # command to start developing
    ports:
      - 5173:5173 # ports to be mapped, 5173 was previously set up
# external volume to store node modules
volumes:
  nodemodules:
    external: true
```

2. Create a `docker-compose.builder.yml` file:

```yml
version: '3'
# base to be extended for executing different commands
x-base: &x-base
  image: node:lts
  volumes:
    - nodemodules:/app/node_modules # mapping external volume to node_modules
    - .:/app
  working_dir: /app
# install services, extended from base, to install dependencies
services:
  install:
    <<: *x-base
    command: npm i
# external volume to store node modules
volumes:
  nodemodules:
    external: true
```

3. Create a Makefile to make typing commands a breeze:

```Makefile
setup:
	docker volume create nodemodules
install:
	docker compose -f docker-compose.builder.yml run --rm install
dev:
	docker compose up
```

What's the main purpose of all this? To create a development environment based on a basic Node.js image. This different approach is much simpler than using a Dockerfile.

First, we need to create the volume to store the node modules. After that, we can run the install service from the builder docker compose file, this will install all dependencies by using the node image from Docker Hub. Finally, the development container can get started!
