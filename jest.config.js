module.exports = {
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/tests/config/setup.ts"],
  transform: { "^.+\\.ts?$": "ts-jest" },
  testEnvironment: "node",
  testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
}
