// tested only in Google Chrome
function App(){

    defaults = {
        canvasColor: '#fff',
        canvasHeight: 300,
        canvasWidth: window.innerWidth
    };

    this.init = function () {
        this.addClickListener();
        this.addCustomValidataion();
    };

    this.rectangleRandomColor = function () {
        return'rgb(' + (Math.floor(Math.random() * 255)) + ','
            + (Math.floor(Math.random() * 255)) + ','
            + (Math.floor(Math.random() * 255)) + ')';
    };

    this.addClickListener = function () {
        document.getElementById('submit').addEventListener('click', function (ev) {
            ev.preventDefault();
            this.setRectangles(document.getElementById('number').value);
        }.bind(this),false);
    };

    this.addCustomValidataion = function () {
        document.getElementById('number').addEventListener('change', function () {
            var val = Math.abs(parseInt(this.value, 10) || 1);
            this.value = val > 31 ? 30 : val < 3 ? 3 : val;
        },false);
    };

    //create rectangles coordinates and sizes and set it to localStorage
    this.setRectangles = function (val) {
        var i = 0;
        var rectangles = [];
        var x = 0;
        var height, width;
        for(i; i < val; i++) {
            function getXcoordinates() {
                return x += (rectangles && rectangles[i-1] && rectangles[i-1].width) || 0;
            }
            //those digits are min and max value
            width = Math.floor(Math.random() * (50 - 20)) + 20;
            height = Math.floor(Math.random() * (200 - 20)) + 20;

            rectangles[i] = {
                x : getXcoordinates(),
                y : 300-height,
                width: width,
                height: height
            };
        }
        localStorage.setItem('rectangles', JSON.stringify(rectangles));
        this.buildCanvas();

    };


    // Create canvases and append it to the document body
    this.buildCanvas = function () {
        if(!document.getElementsByTagName('canvas').length) {
            var canvas = document.createElement("canvas");
            canvas.height = defaults.canvasHeight;
            canvas.width = defaults.canvasWidth;
            document.body.appendChild(canvas);
            document.body.appendChild(canvas.cloneNode(true));
            this.fillCanvas();
        } else {
            this.fillCanvas();
        }
        this.drawRectangles();
    };

    this.fillCanvas = function () {
        [].forEach.call(document.body.getElementsByTagName('canvas'), function (item) {
            var ctx = item.getContext("2d");
            ctx.fillStyle = defaults.canvasColor;
            ctx.fillRect(0, 0, defaults.canvasWidth, defaults.canvasHeight);
        });
    };

    this.drawRectangles = function () {
        var rectangles = JSON.parse(localStorage.getItem('rectangles'));
        var c = document.getElementsByTagName('canvas')[0];
        var ctx = c.getContext("2d");
        rectangles.forEach(function (item) {
            this.drawOneRecktangle(item, ctx)
        }.bind(this));
        this.calculateOutPutRectangles();
    };


    this.calculateOutPutRectangles = function () {
        var rectangles = JSON.parse(localStorage.getItem('rectangles'));
        var rectanglesOutPut = [];
        var l = rectangles.length;
        rectangles.forEach(function (val, c) {
            var height = Math.min.apply(Math, rectangles.map(function (o) {return o.height}).filter(Boolean));
            if(height===Infinity) {
                return;
            }
            var index = rectangles.findIndex(x => x.height === height);
            height = rectangles[index].height;
            var y = rectangles[index].y;
            var width = rectangles[index].width;
            var x = rectangles[index].x;
            //go to right side from lowest rectangle
            for(var i = index+1; i < l; i++) {
                if (rectangles[i].height === 0) { break; }
                else if (rectangles[i].height >= height) {
                    rectangles[i].height -= height;
                    width += rectangles[i].width;
                }
            }
            //go to left side from lowest rectangle
            for(var i = index-1; i >= 0; i--) {
                if (rectangles[i].height === 0) { break; }
                else if (rectangles[i].height >= height) {
                    rectangles[i].height -= height;
                    x = rectangles[i] && rectangles[i].x;
                    width += rectangles[i].width;
                }

            }
            rectangles[index].height = 0;
            rectanglesOutPut[c] = {
                x: x,
                y: y,
                width: width,
                height: height
            };
        });
        localStorage.setItem('rectanglesOutPut', JSON.stringify(rectanglesOutPut));
        this.drawOutputRectangles();
    };

    this.drawOutputRectangles = function () {
        var rectanglesOutPut = JSON.parse(localStorage.getItem('rectanglesOutPut'));
        var c = document.getElementsByTagName('canvas')[1];
        var ctx = c.getContext("2d");
        rectanglesOutPut.forEach(function (item) {
            this.drawOneRecktangle(item, ctx)
        }.bind(this));
    };

    this.drawOneRecktangle = function (item, ctx) {
        ctx.fillStyle = this.rectangleRandomColor();
        ctx.fillRect(item.x, item.y, item.width, item.height);
        ctx.save();
    }

}

var a = new App();
a.init();
