# DevOps Lab 05 Report

**Student Name:** Muhammad Taaha  
**Roll Number:** 23-NTU-CS-1193  
**Lab:** Builds, Dependencies and Artifacts

## 1. Objective

To automate Markdown-to-HTML builds using Node.js, manage dependencies with npm, verify reproducibility, test the build process, and create a distributable npm package.

## 2. Dependency Management

- Node.js version: 20.20.2
- npm version: 10.9.3
- Direct dependency: `markdown-it`
- Declared version range: `^15.0.3`
- Installed version: `15.0.3`
- Direct production dependencies: 1
- Direct development dependencies in the final configuration: 0

The caret range `^15.0.3` permits compatible versions from `15.0.3` up to, but not including, `16.0.0`. The `package-lock.json` file records the resolved dependency tree and versions.

The `npm ls --all` output included `uc.micro@3.0.0 deduped`. This means npm reused an existing compatible dependency installation instead of installing a duplicate copy.

## 3. Build Automation

Created `tools/build.js` to convert Markdown files from `src/` into HTML files in `out/`. The tool also supports converting an individual Markdown file to an HTML file.

The Makefile provides targets for dependency installation, dependency checking, building, testing, packaging, cleaning, and CI.

## 4. Testing and Reproducibility

- `npm install`: Passed after restoring the original dependency configuration.
- `npm ci`: Passed with the matching package and lock files.
- `make ci`: Passed; all three build tests passed.
- Reproducibility check: The SHA-256 hash of `package-lock.json` remained `1dc75dcf8b19ea1d740b11c5f0cea0382508b148e3d4655b7b71c21fd10f4cd3` after `npm ci`.
- Mismatch test: `npm ci` rejected the temporary mismatch between `package.json` and `package-lock.json`, as expected.
- Missing dependency test: Moving `markdown-it` temporarily to `devDependencies` caused the consumer test to fail with `Cannot find module 'markdown-it'`.
- Final consumer test: Passed after restoring `markdown-it` to `dependencies`. The command `npx devops-build in.md out.html` generated the expected HTML.

The mismatch and missing-dependency tests were temporary. The final configuration restores `markdown-it` to `dependencies`.

## 5. Version and Artifact

- Package name: `@muhammadtaaha365-arch/devops-pipeline`
- Final package version: `1.1.1`
- Artifact: `muhammadtaaha365-arch-devops-pipeline-1.1.1.tgz`
- CLI command: `devops-build`
- Package contents: `README.md`, `package.json`, and `tools/build.js`

Version `1.1.0` represents a minor release because the build tool gained the capability to convert individual Markdown files to HTML, in addition to processing a source directory.

The `files` field restricts the package contents to the required README and tool files.

## 6. Conclusion

The Markdown build workflow, dependency installation, automated tests, reproducibility checks, and consumer installation test were completed successfully. The final package was built as `muhammadtaaha365-arch-devops-pipeline-1.1.1.tgz`.



## 7. Reproducibility and `npm ci` mismatch

Two SHA-256 checks of `package-lock.json` returned the same hash:

    1956e6a14dc733d1d02394d80a9c8e7590af60d5eda21726be8c443d025ce02d

The lock file records exact resolved package versions and integrity hashes. It also records dependency relationships and package-resolution information not fully specified by `package.json`.

For the mismatch test, `package.json` was changed in a temporary directory to require `markdown-it@^14.0.0`, while the lock file still specified version 15.0.3. `npm ci` refused to install and returned `EUSAGE`, explaining that the two files were not in sync. This is desirable because it prevents inconsistent dependency installations and supports repeatable builds.

## 8. Broken artifact / consumer test

The broken package dependency tree was:

    bad@1.0.0 /tmp/bad
    └── devops-pipeline@1.1.0

The consumer test failed with `Cannot find module 'markdown-it'` because the required runtime dependency was not installed for the consumer. Runtime dependencies must be declared under `dependencies`. In the final package, `markdown-it` is declared under `dependencies`, and the build tests passed.

## 9. Artifact listing

The final archive listing from `tar -tzf` was:

    package/tools/build.js
    package/package.json
    package/README.md

`tools/build.js` contains the executable build logic, `package.json` defines package metadata and dependencies, and `README.md` documents the package. Generated output, tests, and `node_modules` are not included in the published archive.

## 10. GitHub Packages publishing

Published package: `@muhammadtaaha365-arch/devops-pipeline`

Published versions: `1.1.0` and `1.1.1`.

A second attempt to publish version 1.1.0 returned `E409 Conflict`, because an existing package version cannot be overwritten. The version was bumped to 1.1.1 and published successfully.

Package listing: https://github.com/muhammadtaaha365-arch?tab=packages

The required team-owner scope `@samianadeem2005` initially failed with `E403 Permission denied: create_package`, so the package was published under the authenticated user's namespace instead. This differs from the requested owner scope and may require the repository owner or instructor to approve the approach or grant package permissions.

No GitHub Release fallback was used; GitHub Packages publishing succeeded under the personal namespace.

## 11. Conclusion

The Markdown build workflow, dependency installation, reproducibility checks, automated tests, consumer dependency test, artifact generation, and GitHub Packages publishing were completed. The final package version is 1.1.1 and the CI pipeline passed. The package namespace remains a deviation from the team-owner scope specified in the lab.
