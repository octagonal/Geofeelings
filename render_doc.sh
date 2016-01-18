pandoc README.md --dpi 96 --latex-engine=xelatex --toc -o Documentation/Project.pdf
pandoc README.md --dpi 72 --latex-engine=xelatex --toc -o Documentation/Project.pdf
pandoc README.md --dpi 150 --latex-engine=xelatex --toc -o Documentation/Project.pdf
pandoc -s --webtex -i -t slidy README.md -o Documentation/Project.html
