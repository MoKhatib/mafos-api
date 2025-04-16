#!/bin/bash
npx husky install
npx husky add .husky/pre-push "npm run lint"
chmod +x .husky/pre-push
