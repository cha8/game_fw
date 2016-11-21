var grid = {
    matrix: null,

    init: function() {
        this.matrix = [];

        for(var x=0; x < CONFIG.COLS; x++) {
            this.matrix.push([]);
            for (var y=0; y < CONFIG.ROWS; y++) {
                this.matrix[x].push(CONSTS.EMPTY);
            }
        }
        this.add_fruit();
    },

    set_snake: function(pos) {
        this.matrix[pos.x][pos.y] = CONSTS.SNAKE;
    },

    set_fruit: function(x, y) {
        this.matrix[x][y] = CONSTS.FRUIT;
    },

    set_empty: function(x, y) {
        this.matrix[x][y] = CONSTS.EMPTY;
    },

    get_item: function(x, y) {
        return this.matrix[x][y];
    },

    add_fruit: function() {
        var emptys = [];
        for (var x=0; x < CONFIG.COLS; x++) {
            for (var y=0; y < CONFIG.ROWS; y++) {
                if(this.get_item(x, y) == CONSTS.EMPTY) {
                    emptys.push({x:x, y:y});
                }
            }
        }
        var randpos = emptys[Math.floor(Math.random() * emptys.length)];
        this.set_fruit(randpos.x, randpos.y);
    },

    draw: function() {
        for (var x=0; x < CONFIG.COLS; x++) {
            for (var y=0; y < CONFIG.ROWS; y++) {
                switch(this.get_item(x, y)) {
                    case CONSTS.EMPTY:
                        CHA8_GAME_fw.ctx.fillStyle = CONFIG.EMPTY_COLOR;
                        break;
                    case CONSTS.SNAKE:
                        CHA8_GAME_fw.ctx.fillStyle = CONFIG.SNAKE_COLOR;
                        break;
                    case CONSTS.FRUIT:
                        CHA8_GAME_fw.ctx.fillStyle = CONFIG.FRUIT_COLOR;
                        break;
                }

                CHA8_GAME_fw.ctx.fillRect(
                    x * CACHE.TILE_WIDTH,
                    y * CACHE.TILE_HEIGHT,
                    CACHE.TILE_WIDTH,
                    CACHE.TILE_HEIGHT
                );
            }
        }
    }
};

var snake = {
    direction: null,
    last: null,
    body: null,

    init: function(pos, direction){
        this.direction = direction;
        this.body = [];
        this.insert(pos.x, pos.y);
    },
    insert: function(x, y){
        this.body.unshift({x:x, y:y});
        this.last = this.body[0];
    },
    remove: function(){
        return this.body.pop();
    },

    update: function() {
        var nx = this.last.x;
        var ny = this.last.y;

        switch(this.direction) {
            case CONSTS.LEFT:
                nx--;
                break;
            case CONSTS.UP:
                ny--;
                break;
            case CONSTS.RIGHT:
                nx++;
                break;
            case CONSTS.DOWN:
                ny++;
                break;
        }

        if(this.snake_walls_collision({x: nx, y: ny}) || this.snake_snake_collision({x: nx, y: ny})) {
            return CONFIG.CONTROLLER.reset();
        }

        if(this.snake_fruit_collision({x: nx, y: ny})) {
            var tail = {x: nx, y: ny};
            score.increment();
            grid.add_fruit();
        } else {
            var tail = snake.remove();
            grid.set_empty(tail.x, tail.y);
            tail.x = nx;
            tail.y = ny;
        }

        grid.set_snake({x: tail.x, y: tail.y});
        snake.insert(tail.x, tail.y);
    },

    snake_walls_collision: function(snake_pos) {
        return (
            CACHE.LEFT_WALL > snake_pos.x || snake_pos.x > CACHE.RIGHT_WALL ||
            CACHE.TOP_WALL > snake_pos.y || snake_pos.y > CACHE.BOTTOM_WALL
        );
    },

    snake_snake_collision: function(snake_pos) {
        return grid.get_item(snake_pos.x, snake_pos.y) === CONSTS.SNAKE;
    },

    snake_fruit_collision: function(snake_pos) {
        return grid.get_item(snake_pos.x, snake_pos.y) === CONSTS.FRUIT
    }

};

var score = {
    value: null,

    init: function() {
        this.value = 0;
    },

    increment: function() {
        this.value++;
    },

    draw: function(x, y) {
        CHA8_GAME_fw.ctx.fillStyle = CONFIG.SCORE_COLOR;
        CHA8_GAME_fw.ctx.fillText("SCORE: " + this.value, CACHE.SCORE_POS.x, CACHE.SCORE_POS.y);
    }
};

var CACHE = {};

var CONSTS = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,

    EMPTY: 0,
    SNAKE: 1,
    FRUIT: 2
}

var snake_controller = {
    frame: null,

    initialize: function() {
        CACHE.SNAKE_INITIAL_POS = {
            x: Math.floor(CONFIG.COLS / 2),
            y: CONFIG.ROWS - 1
        };
        CACHE.LEFT_WALL = 0;
        CACHE.TOP_WALL = 0;
        CACHE.RIGHT_WALL = CONFIG.COLS - 1;
        CACHE.BOTTOM_WALL = CONFIG.ROWS - 1;
        CACHE.SCORE_POS = {
            x: 10,
            y: CHA8_GAME_fw.canvas.height - 10
        };
        CACHE.TILE_WIDTH = CHA8_GAME_fw.canvas.width / CONFIG.COLS;
        CACHE.TILE_HEIGHT = CHA8_GAME_fw.canvas.height / CONFIG.ROWS;
    },

    reset: function() {
        this.frame = 0;
        score.init();
        grid.init();

        snake.init(CACHE.SNAKE_INITIAL_POS, CONSTS.UP);
        grid.set_snake(CACHE.SNAKE_INITIAL_POS);
    },

    process_inputs: function() {
        if(CHA8_GAME_fw.KEY[KEY_CODE.LEFT] && snake.direction !== CONSTS.RIGHT) {
            snake.direction = CONSTS.LEFT;
        }
        if(CHA8_GAME_fw.KEY[KEY_CODE.UP] && snake.direction !== CONSTS.DOWN) {
            snake.direction = CONSTS.UP;
        }
        if(CHA8_GAME_fw.KEY[KEY_CODE.RIGHT] && snake.direction !== CONSTS.LEFT) {
            snake.direction = CONSTS.RIGHT;
        }
        if(CHA8_GAME_fw.KEY[KEY_CODE.DOWN] && snake.direction !== CONSTS.UP) {
            snake.direction = CONSTS.DOWN;
        }
    },

    update: function() {
        this.frame++;

        if(this.frame % CONFIG.FRAME_RATE === 0) {
            snake.update();
        }
    },

    draw: function() {
        grid.draw();
        score.draw();
    }
}

var CONFIG = {
    TITLE: "Snakes Game",
    FRAME_RATE: 5,
    COLS: 26,
    ROWS: 26,
    FONT: "12px Helvetica",
    PIXEL_SIZE: 20,
    CONTROLLER: snake_controller,
    EMPTY_COLOR: "#777",
    SNAKE_COLOR: "#000",
    FRUIT_COLOR: "#555",
    SCORE_COLOR: "#FFF"
}

window.onload = CHA8_GAME_fw.start;
