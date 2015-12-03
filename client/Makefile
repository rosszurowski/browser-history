
#
# Binaries
#

BIN := ./node_modules/.bin

#
# Variables
#

PORT = 8080

REPO    = rosszurowski/browser-history
DOMAIN  = rosszurowski.github.io/browser-history
BRANCH  = $(shell git rev-parse --abbrev-ref HEAD)

browserify = -t [ babelify --presets [ es2015 ] ]

#
# Tasks
#

build: assets scripts styles

watch: install
	@budo --port $(PORT) --live index.js:bundle.js -- $(browserify) | garnish

db\:generate:
	@find ./db/raw/ -name "*.db" -exec bin/sqlite-to-json {} \;

deploy:
	@echo "Deploying branch \033[0;33m$(BRANCH)\033[0m to Github pages..."
	@make clean
	@NODE_ENV=production make build
	@(cd build && \
		git init -q . && \
		git add . && \
		git commit -q -m "Deployment (auto-commit)" && \
		echo "\033[0;90m" && \
		git push "git@github.com:$(REPO).git" HEAD:gh-pages --force && \
		echo "\033[0m")
	@make clean
	@echo "Deployed to \033[0;32mhttp://$(DOMAIN)/\033[0m"

clean:
	@rm -rf build
clean-deps:
	@rm -rf node_modules

#
# Shorthands
#

install: node_modules
assets: build/index.html build/upload build/favicon.png
scripts: build/bundle.js
styles: build/styles.css

#
# Targets
#

node_modules: package.json
	@npm install

build/%: %
	@mkdir -p $(@D)
	@cp -r $< $@

build/bundle.js: node_modules
	@mkdir -p $(@D)
	@browserify index.js $(browserify) -o $@
	@if [[ "$(NODE_ENV)" == "production" ]]; then uglifyjs $@ -o $@; fi

build/styles.css:
	@mkdir -p $(@D)
	@cp -r styles.css $@


#
# Phony
#

.PHONY: watch clean
