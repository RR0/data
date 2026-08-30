import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    // dist/ holds a compiled copy of every test, and running those too would double every count and
    // fail on the ones vitest cannot read as suites. Only the sources are the tests.
    exclude: ["**/node_modules/**", "**/dist/**"]
  },
  resolve: {
    // This package still resolves its own modules against tsconfig's `baseUrl: "./src"`, so an
    // import reads `Translator.js` or `util/ObjectUtils.js` rather than a relative path. Node has no
    // such notion and neither has vitest, so the root is spelled out here. TypeScript 7 has dropped
    // baseUrl altogether, so these imports will have to become relative eventually — this keeps the
    // test runner working until they do, and changes nothing about how the package is built.
    alias: [{find: /^(?!\.\.?\/|@|node:|vitest)([\w-]+(?:\/.*)?\.js)$/, replacement: path.resolve("src") + "/$1"}]
  }
})