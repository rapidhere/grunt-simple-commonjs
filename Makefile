all: clean _build

publish: clean _build _test
	rm -rf tasks/meta.json
	npm publish ./
	echo 'done'

_build: clean
	node build/build.js

_test:
	grunt lint
	grunt test

clean:
	rm -rf tasks/meta.json dist
