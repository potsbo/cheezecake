JAVA := java
EXEC := tetris.min.js
SOURCE := tetrimino.js tetris.js 
JSC := compiler.jar
JSCFLAGS := --compilation_level ADVANCED_OPTIMIZATIONS

all: $(EXEC)

$(EXEC): tetrimino.js tetris.js
	$(JAVA) -jar $(JSC) $(JSCFLAGS) --js $(SOURCE) --js_output_file $(EXEC)

clean:
	rm $(EXEC)
