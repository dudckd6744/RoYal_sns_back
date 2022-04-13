module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    roots: ['src'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        'src/(.*)': '<rootDir>/src/$1',
    },
};
