var KEY_CODE = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
}

var CHA8_GAME_fw = {
    canvas: null,
    ctx: null,
    KEY: {},

    start: function() {
        document.title = CONFIG.TITLE;
        CHA8_GAME_fw.canvas = document.createElement("canvas");
        CHA8_GAME_fw.canvas.width = CONFIG.COLS * CONFIG.PIXEL_SIZE;
        CHA8_GAME_fw.canvas.height = CONFIG.ROWS * CONFIG.PIXEL_SIZE;

        CHA8_GAME_fw.canvas.style = "\
            display: block; \
            position: absolute; \
            border: 1px solid #000; \
            margin: auto; \
            top: 0; \
            bottom: 0; \
            right: 0; \
            left: 0;";

        document.body.style = "background: #000";

        CHA8_GAME_fw.ctx = CHA8_GAME_fw.canvas.getContext("2d");
        CHA8_GAME_fw.ctx.font = CONFIG.FONT;

        document.body.appendChild(CHA8_GAME_fw.canvas);

        document.addEventListener("keydown", function(evt){
            CHA8_GAME_fw.KEY[evt.keyCode] = true;
        });

        document.addEventListener("keyup", function(evt){
            delete CHA8_GAME_fw.KEY[evt.keyCode];
        });

        CONFIG.CONTROLLER.initialize();
        CONFIG.CONTROLLER.reset();
        CHA8_GAME_fw.loop();
    },

    loop: function() {
        CONFIG.CONTROLLER.process_inputs();
        CONFIG.CONTROLLER.update();
        CONFIG.CONTROLLER.draw();
        window.requestAnimationFrame(CHA8_GAME_fw.loop, CHA8_GAME_fw.canvas);
    }
};
