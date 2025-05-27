run:
	npm run dev

sync:
	git checkout main
	git pull --rebase
	git checkout -
	git merge origin main
	git push