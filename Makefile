all: clean _build

publish: clean _build _test
	npm publish ./
	rm -rf tasks/meta.json
	echo 'done'

_build: clean
	node build/build.js

_test:
	grunt lint
	grunt test
	node dist/index.js

clean:
	rm -rf tasks/meta.json dist
