develop:
	npx webpack serve

install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test

test-watch:
	npm test -- --watch

lint:
	npx eslint .

.PHONY: test
