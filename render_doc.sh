pandoc README.md --latex-engine=xelatex --toc -o Documentation/Project.pdf
pandoc -s --webtex -i -t slidy README.md -o Documentation/Project.html
