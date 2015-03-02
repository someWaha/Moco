/**
 * Shape绘图类
 */

function Shape() {
    DisplayObject.call(this);

    this.name = "Shape";
    this._showList = [];
    this._setList = [];
}

Shape.prototype.show = function (cord) {
    var self = this,
        showList = self._showList,
        len = showList.length;

    if (cord == null) {
        cord = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        };
    }

    DisplayObject.prototype.show.call(this, cord);

    if (len) {
        for (var i = 0; i < len; i++) {
            showList[i](cord);
        }
    }

    if (self._saveFlag) {
        self.stage.ctx.restore();
    }
};

Shape.prototype.lineWidth = function (thickness) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.lineWidth = thickness;
    });
};

Shape.prototype.strokeStyle = function (color) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.strokeStyle = color;
    });
};

Shape.prototype.stroke = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.stroke();
    });
};

Shape.prototype.beginPath = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.beginPath();
    });
};

Shape.prototype.closePath = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.closePath();
    });
};

Shape.prototype.moveTo = function (x, y) {
    var self = this;
    self._showList.push(function (cord) {
        self.stage.ctx.moveTo(x + cord.x, y + cord.y);
    });
};

Shape.prototype.lineTo = function (x, y) {
    var self = this;
    self._showList.push(function (cord) {
        self.stage.ctx.lineTo(x + cord.x, y + cord.y);
    });
};

Shape.prototype.clear = function () {
    var self = this;
    self._showList = [];
    self._setList = [];
};

Shape.prototype.rect = function (x, y, width, height) {
    var self = this,
        ox, oy;

    self._showList.push(function (cord) {
        ox = cord.x + cord.ox / cord.scaleX;
        oy = cord.y + cord.oy / cord.scaleY;

        self.stage.ctx.rect(x + ox, y + oy, width, height);
    });

    self._setList.push({
        type: "rect",
        pos: [x, y, width, height]
    });
};

Shape.prototype.fillStyle = function (color) {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.fillStyle = color;
    });
};

Shape.prototype.fill = function () {
    var self = this;
    self._showList.push(function () {
        self.stage.ctx.fill();
    });
};

Shape.prototype.arc = function (x, y, r, sAngle, eAngle, direct) {
    var self = this,
        ox, oy;

    self._showList.push(function (cord) {
        ox = cord.x + cord.ox / cord.scaleX;
        oy = cord.y + cord.oy / cord.scaleY;
        self.stage.ctx.arc(x + ox, y + oy, r, sAngle, eAngle, direct);
    });

    self._setList.push({
        type: "arc",
        pos: pointArr
    });
};

Shape.prototype.drawArc = function (thickness, lineColor, pointArr, isFill, color) {
    var self = this,
        canvas, ox, oy;

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;
        ox = cord.x + cord.ox / cord.scaleX;
        oy = cord.y + cord.oy / cord.scaleY;

        canvas.beginPath();
        canvas.arc(pointArr[0] + ox, pointArr[1] + oy, pointArr[2], pointArr[3], pointArr[4], pointArr[5]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill();
        }
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.stroke();
    });

    self._setList.push({
        type: "arc",
        pos: pointArr
    });
};

Shape.prototype.drawRect = function (thickness, lineColor, pointArr, isFill, color) {
    var self = this,
        canvas, ox, oy;

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;
        ox = cord.x + cord.ox / cord.scaleX;
        oy = cord.y + cord.oy / cord.scaleY;

        canvas.beginPath();
        canvas.rect(pointArr[0] + ox, pointArr[1] + oy, pointArr[2], pointArr[3]);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill();
        }
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.stroke();
    });

    self._setList.push({
        type: "rect",
        pos: pointArr
    });
};

//TODO:多边形检测需要使用到奇偶规则
Shape.prototype.drawVertices = function (thickness, lineColor, vertices, isFill, color) {
    var self = this,
        length = vertices.length,
        canvas, i, ox, oy;

    if (length < 3) {
        return;
    }

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;
        ox = cord.x + cord.ox / cord.scaleX;
        oy = cord.y + cord.oy / cord.scaleY;

        canvas.beginPath();
        canvas.moveTo(vertices[0][0] + ox, vertices[0][1] + oy);

        for (i = 1; i < length; i++) {
            var pointArr = vertices[i];
            canvas.lineTo(pointArr[0] + ox, pointArr[1] + oy);
        }

        canvas.lineTo(vertices[0][0] + ox, vertices[0][1] + oy);

        if (isFill) {
            canvas.fillStyle = color;
            canvas.fill();
        }

        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.closePath();
        canvas.stroke();
    });
};

Shape.prototype.drawLine = function (thickness, lineColor, pointArr) {
    var self = this,
        canvas, ox, oy;

    self._showList.push(function (cord) {
        canvas = self.stage.ctx;
        ox = cord.x + cord.ox / cord.scaleX;
        oy = cord.y + cord.oy / cord.scaleY;

        canvas.beginPath();
        canvas.moveTo(pointArr[0] + ox, pointArr[1] + oy);
        canvas.lineTo(pointArr[2] + ox, pointArr[3] + oy);
        canvas.lineWidth = thickness;
        canvas.strokeStyle = lineColor;
        canvas.closePath();
        canvas.stroke();
    });
};

Shape.prototype.lineStyle = function (thickness, color, alpha) {
    var self = this,
        canvas;

    if (!color) {
        color = self.color;
    }

    if (!alpha) {
        alpha = self.alpha;
    }

    self.color = color;
    self.alpha = alpha;

    self._showList.push(function () {
        canvas = self.stage.ctx;

        canvas.lineWidth = thickness;
        canvas.strokeStyle = color;
    });
};

Shape.prototype.add = function (fn) {
    var self = this;

    self._showList.push(function (cord) {
        var params = {
            x: cord.x + cord.ox / cord.scaleX,
            y: cord.y + cord.oy / cord.scaleY,
            scaleX: cord.scaleX,
            scaleY: cord.scaleY
        };

        fn.call(self.stage, params);
    });
};

Shape.prototype.isMouseon = function (cord, pos) {
    var self = this,
        i, len, item, ax, ay, ar, ar2;

    pos = DisplayObject.prototype.isMouseon.call(self, cord, pos);

    cord = self._getRotateCord(cord);

    for (i = 0, len = self._setList.length; i < len; i++) {
        item = self._setList[i];

        /*
         * 如果针对rect的ar!=ar2，那么则是被拉伸为了不规则图形，需要使用奇偶规则来检测
         * 但是对于圆来说是判断了ar!=ar2，椭圆和正圆的判断，所以不存在这个问题
         */
        if (
            item.type == "rect" &&
            cord.x >= item.pos[0] * pos.scaleX + pos.x &&
            cord.x <= (item.pos[2] + item.pos[0]) * pos.scaleX + pos.x &&
            cord.y >= item.pos[1] * pos.scaleY + pos.y &&
            cord.y <= (item.pos[3] + item.pos[1]) * pos.scaleY + pos.y
        ) {
            return true;
        }
        else if (item.type == "arc") {
            ax = Math.pow(cord.x - (item.pos[0] * pos.scaleX + pos.x), 2);
            ay = Math.pow(cord.y - (item.pos[1] * pos.scaleY + pos.y), 2);
            ar = Math.pow(item.pos[2] * pos.scaleX, 2);
            ar2 = Math.pow(item.pos[2] * pos.scaleY, 2);

            if (pos.scaleX == pos.scaleY && ax + ay <= ar) {
                return true;
            } else if (pos.scaleX != pos.scaleY && ax / ar + ay / ar2 <= 1) {
                return true;
            }
        }
    }

    return false;
}

Base.inherit(Shape, InteractiveObject);
