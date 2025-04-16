#!/bin/bash
# Install dev dependencies
npm install --save-dev eslint prettier eslint-config-prettier husky

# ESLint script with autofix
npm pkg set scripts.lint="eslint ."
npm pkg set scripts.fix="eslint . --fix"

# Prettier formatting script
npm pkg set scripts.format="prettier --write ."

# Initialize Husky if not already
npx husky install

# Add pre-push hook for lint + format
npx husky add .husky/pre-push "npm run lint && npm run format"
chmod +x .husky/pre-push
