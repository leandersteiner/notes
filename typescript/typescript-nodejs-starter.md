# Starting a Node.js project with typescript

Dev Dependencies:

- `typescript`
- `ts-node`
- `rimraf`
- `nodemon`
- `eslint`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`

`package.json` Scripts:

```json
"scripts": {
  "start:dev": "nodemon",
  "start": "npm run build && node dist/main.js",
  "clean": "rimraf ./dist",
  "build": "npm run clean && tsc",
  "lint": "eslint . --ext .ts"
}
```

Make sure to set the `type` in your `package.json` to `module`.

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "rootDir": "src",
    "outDir": "dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

`nodemon.json`:

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "node --loader ts-node/esm ./src/main.ts"
}
```

`.prettierrc` (preference):

```json
{
  "singleQuote": true,
  "tabWidth": 2,
  "arrowParens": "avoid",
  "bracketSpacing": true
}
```

`.eslintrc`:

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {}
}
```

`.eslintignore`:

```
node_modules
dist
```

```
npm init -y
npm install -D typescript
npm install -D eslint
npx tsc --init
npx eslint --init (problems, esm, none, yes, node, json, yes)

```

tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ES2020",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "moduleResolution": "node"
  },
  "ts-node": {
    "esm": true
  }
}
```

package.json

```json
{
  "name": "node-ts",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon --watch '**/*.ts' --exec 'ts-node' src/index.ts",
    "lint": "eslint src/**/*.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^5.19.0",
    "@typescript-eslint/parser": "^5.19.0",
    "eslint": "^8.13.0",
    "nodemon": "^2.0.15",
    "ts-node": "^10.7.0",
    "typescript": "^4.6.3"
  }
}
```