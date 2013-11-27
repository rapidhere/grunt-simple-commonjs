all: publish

publish: clean _build _test
	echo 'done'

_build:
	node build/build.js

_test:
	grunt lint
	grunt test

clean:
	rm -rf tasks/meta.json dist
