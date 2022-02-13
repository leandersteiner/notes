# Starting a Node.js project with typescript

Dev Dependencies:

- `typescript`
- `ts-node`
- `rimraf`
- `nodemon`
- `eslint`
- `@typescript-eslint/eslint-plugin`
- `@typescript-esling/parser`

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
  "bracketSpacing: true
}
```

`.eslintrc`:

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript/eslint"],
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
