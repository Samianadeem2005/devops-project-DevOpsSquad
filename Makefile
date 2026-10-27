.PHONY: hello deps check build test package clean ci

hello:
	@echo "Hello from Make"

deps: node_modules

node_modules: package.json package-lock.json
	npm ci
	touch node_modules

check:
	npm ls --all

build: deps
	node tools/build.js src out

test: build
	node test/build.test.js

package: test
	npm pack

clean:
	rm -rf out *.tgz

ci: clean deps check test package
	@echo "CI pipeline passed successfully!"
