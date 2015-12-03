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

start: node_modules
	@bin/www

watch: node_modules
	@nodemon -x 'bin/www' -q

ssh:
	@ssh 159.203.6.69

dokku\:logs:
	@ssh 159.203.6.69 -tt 'dokku logs browser-history'

deploy:
	@git push production master

clean:
	@rm -rf node_modules

test:
	@echo "No test defined"
	@exit 1

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
