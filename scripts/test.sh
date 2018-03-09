#!/bin/sh
set -e

if [ -z "$TEST_GREP" ]; then
   TEST_GREP=""
fi

node node_modules/mocha/bin/_mocha `scripts/_get-test-directories.sh` --opts test/mocha.opts --grep "$TEST_GREP"

# Test `mwapi-admin`
cd packages/mwapi-admin
npm run test

# Test `mwapi-plugin-content-manager`
cd ../mwapi-plugin-content-manager
npm run test

# Test `mwapi-plugin-settings-manager`
cd ../mwapi-plugin-settings-manager
npm run test

# Test `mwapi-plugin-content-type-builder`
cd ../mwapi-plugin-content-type-builder
npm run test

# Test `mwapi-plugin-content-type-builder`
cd ../mwapi-plugin-users-permissions
npm run test

# Test `mwapi-plugin-upload`
cd ../mwapi-plugin-upload
npm run test
