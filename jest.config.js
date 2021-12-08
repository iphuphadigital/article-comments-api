module.exports = {
  setupFilesAfterEnv: ["<rootDir>/__tests__/config/setup.ts"],
  transform: { "^.+\\.ts?$": "ts-jest" },
  testEnvironment: "node",
  testRegex: "/__tests__/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
}
