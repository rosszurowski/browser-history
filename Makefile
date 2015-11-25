
#
# Binaries
#

BIN := ./node_modules/.bin

#
# Variables
#

PORT = 8080

#
# Tasks
#

watch: install
	@budo --port $(PORT) --live index.js -- -t [ babelify --presets [ es2015 ] ] | garnish

db\:generate:
	@find ./db/raw/ -name "*.db" -exec bin/sqlite-to-json {} \;

clean:
	@rm -rf node_modules

#
# Shorthands
#

install: node_modules

#
# Targets
#

node_modules: package.json
	@npm install

#
# Phony
#

.PHONY: watch clean
