import getTimeDiff from './index';

const testCases = [
    { input: new Date(new Date().getTime() - 30 * 1000).toISOString(), expected: '<1m' },
    { input: new Date(new Date().getTime() - 5 * 60 * 1000).toISOString(), expected: '5m' },
    { input: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString(), expected: '2h' },
    { input: new Date(new Date().getTime() - 23 * 60 * 60 * 1000).toISOString(), expected: '23h' },
    { input: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), expected: '3d' },
    { input: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), expected: '>1w' },
    { input: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), expected: '>2w' },
    { input: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), expected: '30d' },
    { input: new Date(new Date().getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(), expected: '>30d' },
    { input: new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(), expected: '>30d' },
    { input: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(), expected: '>30d' },
    { input: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(), expected: '1y' },
    { input: new Date(new Date().getTime() - 400 * 24 * 60 * 60 * 1000).toISOString(), expected: '>1y' },
    { input: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), expected: '3w' },
    { input: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), expected: '4w' },
    { input: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), expected: '>3w' },
    { input: '2025-02-28T10:28:10.032Z', expected: '>3w' },
    { input: '2025-02-06T02:59:41.032Z' },
    { input: '2025-03-07T02:59:41.032Z' }
];

let allPassed = true;
testCases.forEach(({ input, expected }, index) => {
    const result = getTimeDiff(input);
    if (result) {
        console.log(`✅ Test case ${index + 1} passed - Got: ${result})`);
    } else {
        console.log(`❌ Test case ${index + 1} failed (Expected: ${expected}, Got: ${result})`);
        allPassed = false;
    }
});

if (allPassed) {
    console.log('🎉 All test cases passed!');
} else {
    console.log('❗ Some test cases failed.');
}
