const { execSync } = require('child_process');

const testFiles = [
    'tests/integration/membership.test.js',
    'tests/integration/information.test.js',
    'tests/integration/transaction.test.js',
];

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
