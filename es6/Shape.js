class Shape extends DisplayObject {
    constructor() {
        super();
        this.name = "Shape";
        this._showList = [];
        this._setList = [];
    }

    on() {
        console.error("shape object can't interative event, please add shape to sprite");
    }

    off() {
        console.error("shape object can't interative event, please add shape to sprite");
    }

    show(matrix) {
        let _me = this;
        let showList = _me._showList;
        let isDrew = super.show(matrix);

        if (isDrew) {
            for (let i = 0, len = showList.length; i < len; i++) {
                let showListItem = showList[i];
                if (typeof showListItem == "function") {
                    showListItem();
                }
            }

            if (_me._isSaved) {
                let ctx = _me.ctx || _me.stage.ctx;
                _me._isSaved = false;
                ctx.restore();
            }
        }

        return isDrew;
    }

    lineWidth(thickness) {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.lineWidth = thickness;
        });
    }

    strokeStyle(color) {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.strokeStyle = color;
        });
    }

    stroke() {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.stroke();
        });
    }

    beginPath() {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.beginPath();
        });
    }

    closePath() {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.closePath();
        });
    }

    moveTo(x, y) {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.moveTo(x, y);
        });
    }

    lineTo(x, y) {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.lineTo(x, y);
        });
    }

    clear() {
        let _me = this;
        _me._showList = [];
        _me._setList = [];
    }

    rect(x, y, width, height) {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            _me.stage.ctx.rect(x, y, width, height);
        });

        _me._setList.push({
            type: "rect",
            area: [x, y, width, height]
        });
    }

    fillStyle(color) {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.fillStyle = color;
        });
    }

    fill() {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.fill();
        });
    }

    arc(x, y, r, sAngle, eAngle, direct) {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.arc(x, y, r, sAngle, eAngle, direct);
        });

        _me._setList.push({
            type: "arc",
            area: [x, y, r, sAngle, eAngle, direct]
        });
    }

    drawArc(thickness, lineColor, arcArgs, isFill, color) {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.beginPath();
            ctx.arc(arcArgs[0], arcArgs[1], arcArgs[2], arcArgs[3], arcArgs[4], arcArgs[5]);

            if (isFill) {
                ctx.fillStyle = color;
                ctx.fill();
            }

            ctx.lineWidth = thickness;
            ctx.strokeStyle = lineColor;
            ctx.stroke();
        });

        _me._setList.push({
            type: "arc",
            area: arcArgs
        });
    }

    drawRect(thickness, lineColor, rectArgs, isFill, color) {
        let _me = this;
        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.beginPath();
            ctx.rect(rectArgs[0], rectArgs[1], rectArgs[2], rectArgs[3]);

            if (isFill) {
                ctx.fillStyle = color;
                ctx.fill();
            }

            ctx.lineWidth = thickness;
            ctx.strokeStyle = lineColor;
            ctx.stroke();
        });

        _me._setList.push({
            type: "rect",
            area: rectArgs
        });
    }

    drawVertices(thickness, lineColor, vertices, isFill, color) {
        let _me = this;
        let len = vertices.length;

        if (len < 3) {
            return;
        }

        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.beginPath();
            ctx.moveTo(vertices[0][0], vertices[0][1]);

            for (i = 1; i < len; i++) {
                let pointArr = vertices[i];
                ctx.lineTo(pointArr[0], pointArr[1]);
            }

            ctx.lineTo(vertices[0][0], vertices[0][1]);

            if (isFill) {
                ctx.fillStyle = color;
                ctx.fill();
            }

            ctx.lineWidth = thickness;
            ctx.strokeStyle = lineColor;
            ctx.closePath();
            ctx.stroke();
        });

        _me._setList.push({
            type: "vertices",
            area: vertices
        });
    }

    drawLine(thickness, lineColor, points) {
        let _me = this;

        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.beginPath();
            ctx.moveTo(points[0], points[1]);
            ctx.lineTo(points[2], points[3]);
            ctx.lineWidth = thickness;
            ctx.strokeStyle = lineColor;
            ctx.closePath();
            ctx.stroke();
        });
    }

    lineStyle(thickness, color, alpha) {
        let _me = this;

        if (alpha) {
            _me.alpha = alpha;
        }

        _me._showList.push(function () {
            let ctx = _me.ctx || _me.stage.ctx;
            ctx.lineWidth = thickness;
            ctx.strokeStyle = color;
        });
    }

    add(fn) {
        let _me = this;
        _me._showList.push(function () {
            fn.call(_me);
        });
    }

    isMouseon(cord) {
        let _me = this;
        let vec = new Vec3(cord.x, cord.y, 1);
        let inverse = Matrix3.inverse(_me._matrix);
        vec.multiMatrix3(inverse);

        let setList = _me._setList;
        for (let i = 0, len = setList.length; i < len; i++) {
            let item = setList[i];
            let area = item.area;
            let minRect = {};
            let isOn = false;

            switch (item.type) {
                case "rect":
                    area = [
                        [area[0], area[1]],
                        [area[0] + area[2], area[1]],
                        [area[0] + area[2], area[1] + area[3]],
                        [area[0], area[1] + area[3]]
                    ];
                case "vertices":
                    break;
                case "arc":
                    minRect = _me._computeArcMinRect.apply(_me, area);
                    area = [
                        [minRect.s1v.x, minRect.s1v.y],
                        [minRect.s2v.x, minRect.s2v.y],
                        [minRect.e2v.x, minRect.e2v.y],
                        [minRect.e1v.x, minRect.e1v.y]
                    ];
                    break;
            }

            if (_me._pip([vec.x, vec.y], area)) {
                return true;
            }
        }

        return false;
    }

    getBounds() {
        let _me = this;
        let setList = _me._setList;
        let sx = maxNumber;
        let ex = minNumber;
        let sy = maxNumber;
        let ey = minNumber;

        for (let i = 0, len = setList.length; i < len; i++) {
            let item = setList[i];
            let area = item.area;
            let minRect = {};
            let vec3s = [];

            switch (item.type) {
                case "rect":
                    area = [
                        [area[0], area[1]],
                        [area[0] + area[2], area[1]],
                        [area[0] + area[2], area[1] + area[3]],
                        [area[0], area[1] + area[3]]
                    ];
                case "vertices":
                    vec3s = Util.map(area, (item) => {
                        let vec = new Vec3(item[0], item[1], 1);
                        return vec.multiMatrix3(_me._matrix);
                    });
                    break;
                case "arc":
                    minRect = _me._computeArcMinRect.apply(_me, area);
                    vec3s = Util.map(minRect, (item) => {
                        return item.multiMatrix3(_me._matrix);
                    });
                    break;
            }

            Util.each(vec3s, (item) => {
                sx = item.x < sx ? item.x : sx;
                ex = item.x > ex ? item.x : ex;
                sy = item.y < sy ? item.y : sy;
                ey = item.y > ey ? item.y : ey;
            });
        }

        if (sx == maxNumber || ex == minNumber || sy == maxNumber || ey == minNumber) {
            sx = sy = ex = ey = 0;
        }

        return {
            sv: new Vec3(sx, sy, 1),
            ev: new Vec3(ex, ey, 1)
        }
    }

    _getWidth() {
        let _me = this;
        let bounds = _me.getBounds();
        console.log(bounds);
        return Math.abs(bounds.ev.x - bounds.sv.x);
    }

    _getHeight() {
        let _me = this;
        let bounds = _me.getBounds();
        return Math.abs(bounds.ev.y - bounds.sv.y);
    }

    _computeArcMinRect(ox, oy, r, sAngle, eAngle, direct) {
        let sx = 0;
        let sy = 0;
        let ex = 0;
        let ey = 0;

        sAngle = Util.rad2deg(sAngle);
        eAngle = Util.rad2deg(eAngle);

        if (Math.abs(eAngle - sAngle) / 360 >= 1) {
            return {
                s1v: new Vec3(ox - r, oy - r, 1),
                s2v: new Vec3(ox + r, oy - r, 1),
                e1v: new Vec3(ox - r, oy + r, 1),
                e2v: new Vec3(ox + r, oy + r, 1)
            }
        }

        sAngle = sAngle - Math.floor(sAngle / 360) * 360;
        eAngle = eAngle - Math.floor(eAngle / 360) * 360;

        if (direct) {
            [sAngle, eAngle] = [eAngle, sAngle];
        }

        let rotateAngle = 0;
        if (sAngle < 180 && sAngle >= 90) {
            rotateAngle = 90;
        } else if (sAngle < 270 && sAngle >= 180) {
            rotateAngle = 180;
        } else if (sAngle < 360 && sAngle >= 270) {
            rotateAngle = 270;
        }

        sAngle -= rotateAngle;
        eAngle -= rotateAngle;
        sAngle = sAngle < 0 ? sAngle + 360 : sAngle;
        eAngle = eAngle < 0 ? eAngle + 360 : eAngle;

        let sin = Math.sin;
        let cos = Math.cos;
        let v1 = Vec3.zero();
        let v2 = Vec3.zero();
        if (eAngle < 90 && eAngle > sAngle) {
            let o1 = Util.deg2rad(sAngle);
            let o2 = Util.deg2rad(eAngle);
            v1 = new Vec3(cos(o2) * r, sin(o1) * r, 1);
            v2 = new Vec3(cos(o1) * r, sin(o2) * r, 1);
        } else if (eAngle < 90 && eAngle < sAngle) {
            v1 = new Vec3(-r, -r, 1);
            v2 = new Vec3(r, r, 1);
        } else if (eAngle < 180 && eAngle >= 90) {
            let o = Util.deg2rad(Math.min(180 - eAngle, sAngle));
            let o1 = Util.deg2rad(sAngle);
            let o2 = Util.deg2rad(180 - eAngle);
            v1 = new Vec3(-cos(o2) * r, sin(o) * r, 1);
            v2 = new Vec3(cos(o1) * r, r, 1);
        } else if (eAngle < 270 && eAngle >= 180) {
            let o1 = Util.deg2rad(sAngle);
            let o2 = Util.deg2rad(eAngle - 180);
            v1 = new Vec3(-r, -sin(o2) * r, 1);
            v2 = new Vec3(cos(o1) * r, r, 1);
        } else if (eAngle < 360 && eAngle >= 270) {
            let o = Util.deg2rad(Math.min(360 - eAngle, sAngle));
            v1 = new Vec3(-r, -r, 1);
            v2 = new Vec3(cos(o) * r, r, 1);
        }

        let translateMat = Matrix3.translation(ox, oy);
        let rotateMat = Matrix3.rotation(rotateAngle);
        let mat = translateMat.multi(rotateMat);

        v1.multiMatrix3(mat);
        v2.multiMatrix3(mat);

        if (v1.x < v2.x) {
            [sx, ex] = [v1.x, v2.x];
        } else {
            [sx, ex] = [v2.x, v1.x];
        }

        if (v1.y < v2.y) {
            [sy, ey] = [v1.y, v2.y];
        } else {
            [sy, ey] = [v2.y, v1.y];
        }

        return {
            s1v: new Vec3(sx, sy, 1),
            s2v: new Vec3(ex, sy, 1),
            e1v: new Vec3(sx, ey, 1),
            e2v: new Vec3(ex, ey, 1)
        };
    }

    // ray-casting algorithm
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    _pip(point, vs) {
        let isInside = false;
        let x = point[0],
            y = point[1];

        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i][0],
                yi = vs[i][1];
            let xj = vs[j][0],
                yj = vs[j][1];

            let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                isInside = !isInside;
            }
        }

        return isInside;
    }
}

Moco.Shape = Shape;