.DEFAULT_GOAL := help

.PHONY: help lint lint-markdown lint-links tests check

help:
	@printf '%s\n' 'npm ci first; Node 22+ and Lychee 0.24.2 required.' \
	  'make lint   Markdown and local links/fragments' \
	  'make tests  Package validation, release fixtures and isolated installs'

lint: lint-markdown lint-links

lint-markdown:
	npm run lint:markdown

lint-links:
	npm run lint:links

check:
	npm run check

tests: check
	npm test
	npm run test:install
