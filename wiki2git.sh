exit 1

mkdir -p src/styles

cd ..

wiki2git-commit --site meta.wikimedia.org --repo "global-scripts" -o "src\styles\edit-layout.less"
wiki2git-commit --site meta.wikimedia.org --repo "global-scripts" -o "src\styles\popups-guides.less"
wiki2git-commit --site meta.wikimedia.org --repo "global-scripts" -o "src\styles\tools-icons.less"
wiki2git-commit --site meta.wikimedia.org --repo "global-scripts" -o "src\styles\varia.less"
wiki2git-commit --site meta.wikimedia.org --repo "global-scripts" -o "src\styles\watchlist-mobile.less"
