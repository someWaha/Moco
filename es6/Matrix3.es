class Matrix3 {
	constructor(m) {
		this._matrix = m || [
			1.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 0.0, 1.0
		];
	}

	setMatrix(matrix) {
		this._matrix = matrix;
		return this;
	}

	getMatrix() {
		return this._matrix;
	}

	add(matrix3) {
		let matrix = matrix3._matrix;

		this._matrix[0] += matrix[0];
		this._matrix[1] += matrix[1];
		this._matrix[2] += matrix[2];

		this._matrix[3] += matrix[3];
		this._matrix[4] += matrix[4];
		this._matrix[5] += matrix[5];

		this._matrix[6] += matrix[6];
		this._matrix[7] += matrix[7];
		this._matrix[8] += matrix[8];

		return this;
	}

	sub(matrix3) {
		let matrix = matrix3._matrix;

		this._matrix[0] -= matrix[0];
		this._matrix[1] -= matrix[1];
		this._matrix[2] -= matrix[2];

		this._matrix[3] -= matrix[3];
		this._matrix[4] -= matrix[4];
		this._matrix[5] -= matrix[5];

		this._matrix[6] -= matrix[6];
		this._matrix[7] -= matrix[7];
		this._matrix[8] -= matrix[8];

		return this;
	}

	multi(matrix3) {
		let matrix = matrix3._matrix;

		let b00 = matrix[0];
		let b10 = matrix[1];
		let b20 = matrix[2];

		let b01 = matrix[3];
		let b11 = matrix[4];
		let b21 = matrix[5];

		let b02 = matrix[6];
		let b12 = matrix[7];
		let b22 = matrix[8];

		matrix = this._matrix;

		let a00 = matrix[0];
		let a10 = matrix[1];
		let a20 = matrix[2];

		let a01 = matrix[3];
		let a11 = matrix[4];
		let a21 = matrix[5];

		let a02 = matrix[6];
		let a12 = matrix[7];
		let a22 = matrix[8];

		matrix[0] = a00 * b00 + a01 * b10 + a02 * b20;
		matrix[1] = a10 * b00 + a11 * b10 + a12 * b20;
		matrix[2] = a20 * b00 + a21 * b10 + a22 * b20;

		matrix[3] = a00 * b01 + a01 * b11 + a02 * b21;
		matrix[4] = a10 * b01 + a11 * b11 + a12 * b21;
		matrix[5] = a20 * b01 + a21 * b11 + a22 * b21;

		matrix[6] = a00 * b02 + a01 * b12 + a02 * b22;
		matrix[7] = a10 * b02 + a11 * b12 + a12 * b22;
		matrix[8] = a20 * b02 + a21 * b12 + a22 * b22;

		return this;
	}
}

Matrix3.clone = (m) => {
	let matrix = m.getMatrix();
	let tmp = [];

	for (let i = 0, len = matrix.length; i < len; i++) {
		tmp[i] = matrix[i];
	}

	return new Matrix3(tmp);
};

Matrix3.copy = (m1, m2) => {
	let clone = Matrix3.clone(m2);
	m1.setMatrix(clone.getMatrix());
};

Matrix3.zero = () => {
	return new Matrix3([
		0, 0, 0,
		0, 0, 0,
		0, 0, 0
	]);
};

Matrix3.identity = (m) => {
	return new Matrix3([
		1, 0, 0,
		0, 1, 0,
		0, 0, 1
	]);
};

Matrix3.translation = (x, y) => {
	return new Matrix3([
		1, 0, 0,
		0, 1, 0,
		x, y, 1
	]);
};

Matrix3.rotation = (angle) => {
	let cosa = Math.cos(angle * Math.PI / 180);
	let sina = Math.sin(angle * Math.PI / 180);
	return new Matrix3([
		cosa, 	sina, 	0, 
		-sina, 	cosa, 	0,
		0, 		0, 		1
	]);
};

Matrix3.scaling = (scaleX, scaleY) => {
	return new Matrix3([
		scaleX, 0, 		0,
		0, 		scaleY, 0,
		0, 		0, 		1
	]);
};

Matrix3.transpose = (m) => {
	let matrix = m.getMatrix();
	let tmp = null;

	temp = matrix[1];
	matrix[1] = matrix[3];
	matrix[3] = temp;

	temp = matrix[2];
	matrix[2] = matrix[6];
	matrix[6] = temp;

	temp = matrix[5];
	matrix[5] = matrix[7];
	matrix[7] = temp;

	m.setMatrix(matrix);
};

Matrix3.inverse = (m) => {
	let matrix = m.getMatrix();

	let a00 = matrix[0];
	let a01 = matrix[1];
	let a02 = matrix[2];

	let a10 = matrix[3];
	let a11 = matrix[4];
	let a12 = matrix[5];

	let a20 = matrix[6];
	let a21 = matrix[7];
	let a22 = matrix[8];

	let deter = a00 * a11 * a22 + a01 * a12 * a20 - a02 * a10 * a20 - a01 * a10 * a22 - a00 * a12 * a21;

	let c00 = (a11 * a22 - a21 * a12) / deter;
	let c01 = -(a10 * a22 - a20 * a12) / deter;
	let c02 = (a10 * a21 - a20 * a11) / deter;

	let c10 = -(a01 * a22 - a21 * a02) / deter;
	let c11 = (a00 * a22 - a20 * a02) / deter;
	let c12 = -(a00 * a21 - a20 * a01) / deter;

	let c20 = (a01 * a12 - a11 * a02) / deter;
	let c21 = -(a00 * a12 - a10 * a02) / deter;
	let c22 = (a00 * a11 - a10 * a01) / deter;

	return new Matrix3([
		c00, c01, c02,
		c10, c11, c12,
		c20, c21, c22
	]);
};

Moco.Matrix3 = Matrix3;