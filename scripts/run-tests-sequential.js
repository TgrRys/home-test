// Run tests sequentially
const { execSync } = require('child_process');

// Define the test files to run in sequence
const testFiles = [
  'tests/integration/auth.test.js',
  'tests/integration/profile.test.js'
];

// Run each test file sequentially
testFiles.forEach(testFile => {
  console.log(`Running ${testFile}...`);
  try {
    execSync(`NODE_ENV=test npx jest ${testFile}`, { stdio: 'inherit' });
    console.log(`✓ ${testFile} completed successfully`);
  } catch (error) {
    console.error(`✗ ${testFile} failed with error: ${error}`);
    process.exit(1);
  }
});

console.log('All tests completed successfully!');
