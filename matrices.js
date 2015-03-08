//constructs a matrix. If the first argment is an array or a matrix, the constructor will copy the values at every index. If it is a number, it will create a matrix of size rows by cols with the value given at each index
function Matrix(array, rows, cols)
{
	if(array == null)
	{
		this.length = 0;
		return;
	}
	if(array.length){
		for(var i = 0; i < array.length; i++)
		{
			this[i] = [];
			for(var x = 0; x < array[0].length; x++)
			{
				this[i][x] = new BigNumber(array[i][x]);
			}
		}
		this.length = array.length;
	}else{
		array = new BigNumber(array);
		this.length = rows;
		for(var i = 0; i<rows; i++){
			this[i] = [];
			for(var x = 0; x<cols; x++){
				this[i][x] = array;
			}
		}
	}
}

//returns an identity matrix of size n by n
Matrix.identity = function(n){
	var result = [];
	var zero = new BigNumber(0);
	var one = new BigNumber(1);
	for(var i = 0; i<n; i++)
	{
		result[i] = [];
		for(var x = 0; x<n; x++)
		{
			result[i][x] = zero;
		}
		result[i][i] = one;
	}
	return new Matrix(result);
};

//returns the psuedo-inverse of the matrix (the transpose times the matrix, inverted, multiplied by the transpose)
Matrix.prototype.pseudoInverse = function() {
	var trans = this.transpose();
	return trans.times(this).inverse().times(trans);
};

Matrix.prototype.pI = Matrix.prototype.pseudoInverse;

Matrix.prototype.multiply = function(other) {
	if(typeof other == "number")
	{
		return this.scalarMultiply(other);
	}
	if(other.length != this[0].length)
	{
		throw "These two matrices cannot be multiplied";
	}
	var result = [];
	for(var i = 0; i<this.length; i++)
	{
		result[i] = [];
		for(var x = 0; x<other[0].length; x++)
		{
			result[i][x] = this.rowColMultiply(other, i, x);
		}
	}
	return new Matrix(result);
};

Matrix.prototype.times = Matrix.prototype.multiply;

Matrix.prototype.scalarMultiply = function(scalar) {
	var result = [];
	for(var i = 0; i<this.length; i++)
	{
		result[i] = [];
		for(var x = 0; x<this[0].length; x++)
		{
			result[i][x] = this[i][x].times(scalar);
		}
	}
	return new Matrix(result);
};

//multiply the row of this matrix with the col of other
Matrix.prototype.rowColMultiply = function(other, row, col) {
	var result = new BigNumber(0);
	for(var i = 0; i<this[row].length; i++)
	{
		result = result.add(this[row][i].times(other[i][col]));
	}
	return result;
};

//returns the transpose of the matrix (swaps rows and columns)
Matrix.prototype.transpose = function() {
	var result = [];
	for(var i = 0; i<this.length; i++)
	{
		result[i] = [];
		for(var x = 0; x<this[0].length; x++)
		{
			result[x][i] = this[i][x];
		}
	}
	return new Matrix(result);
};

//do something with each value in the matrix
Matrix.prototype.each = function(func) {
	this.func = func;
	for(var i = 0; i<this.length; i++)
	{
		for(var x = 0; x<this[0].length; x++)
		{
			this.func(this[i][x], i, x);
		}
	}
	this.func = undefined;
};

//create a new matrix of the same size using each of this matrix
Matrix.prototype.create = function(func) {
	this.func = func;
	var result = [];
	for(var i = 0; i<this.length; i++)
	{
		result[i] = [];
		for(var x = 0; x<this[0].length; x++)
		{
			result[i][x] = func(this[i][x], i, x);
		}
	}
	this.func = undefined;
	return new Matrix(result);
};

//raise to some exponent
Matrix.prototype.pow = function(power) {
	if(!this.isSquare())
	{
		throw "Can't raise a non-square matrix";
	}
	if(power == 0)
	{
		return this.identity();
	}
	var result = this;
	for(var i = 1; i < power; i++)
	{
		result = result.multiply(this);
	}
	return new Matrix(result);
};

Matrix.prototype.raise = Matrix.prototype.pow;

//get an identity matrix of the same size
Matrix.prototype.identity = function(){
	if(!this.isSquare())
	{
		throw "Can't get identity matrix for non-square matrix";
	}
	return Matrix.identity(this.length);
};

Matrix.prototype.add = function(other) {
	if(this.length != other.length || this[0].length != other[0].length)
	{
		throw "Can't add two matrices that aren't the same size";
	}
	var result = [];
	for(var i = 0; i<this.length; i++)
	{
		result[i] = [];
		for(var x = 0; x<this[0].length; x++)
		{
			result[i][x] = this[i][x].plus(other[i][x]);
		}
	}
	return new Matrix(result);
};

Matrix.prototype.plus = Matrix.prototype.add;

Matrix.prototype.subtract = function(other) {
	if(this.length != other.length || this[0].length != other[0].length)
	{
		throw "Can't subtract two matrices that aren't the same size";
	}
	var result = [];
	for(var i = 0; i<this.length; i++)
	{
		result[i] = [];
		for(var x = 0; x<this[0].length; x++)
		{
			result[i][x] = this[i][x].minus(other[i][x]);
		}
	}
	return new Matrix(result);
};

Matrix.prototype.minus = Matrix.prototype.subtract;

//decompositions
Matrix.prototype.luDecomposition = function(){
	return new LUDecomposition(this);
};
function LUDecomposition(matrix){
	if(!matrix.isSquare())
	{
		throw "Can't decompose non-square matrix";
	}
	var l = matrix.identity(); 
	var u = new Matrix(matrix);
	var determinant = new BigNumber(1);
	for(var i = 0; i<matrix.length - 1; i++)
	{
		for(var x = i + 1; x<matrix.length; x++)
		{
			var c = u[x][i].div(l[x - 1][i]);
			u.subtractRows(x, x - 1, c);
			l[x][i] = c;
		}
	}
	for(var i = 0; i < this.length; i++){
		determinant = determinant.times(u[i][i]);
	}
	this.l = l;
	this.u = u;
	this.determinant = determinant;
};
/*Matrix.prototype.eigenvalueDecomposition = function(){
	return new EigenvalueDecomposition(this);
};
Matrix.prototype.diagonalization = Matrix.prototype.eigenvalueDecomposition;*/

//properties
Matrix.prototype.isSquare = function(){
	return this.length == this[0].length;
};

//returns the inverse of the matrix
Matrix.prototype.inverse = function(){
	if(!this.isSquare())
	{
		throw "Can't invert non-square matrix";
	}
	if(this.determinant().equals(0))
	{
		throw "Can't invert matrix: determinant equal to zero";
	}
	var inv = this.identity();
	var temp = new Matrix(this);
	for(var i = 0; i<this[0].length - 1; i++)
	{
		for(var x = i + 1; x<this.length; x++)
		{
			var c = temp[x][i].div(temp[x - 1][i]);
			temp.subtractRows(x, x - 1, c);
			inv.subtractRows(x, x - 1, c);
		}
	}
	inv.scalarMultiplyRow(temp.length - 1, 1/temp[temp.length - 1][temp[0].length-1]);
	temp[temp.length - 1][temp[0].length - 1] = 1;
	for(var i = this[0].length - 1; i > 0; i--)
	{
		for(var x = i - 1; x > -1; x--)
		{
			var c = temp[x][i];
			temp.subtractRows(x, x + 1, c);
			inv.subtractRows(x, x + 1, c);
		}
		var c = new BigNumber(1).div(temp[i][i]);
		inv.scalarMultiplyRow(i, c);
		temp[i][i] = new BigNumber(1);
	}
	return inv;
};

Matrix.prototype.subtractRows = function(r1, r2, c){
	for(var i = 0; i<this[0].length; i++)
	{
		this[r1][i] = this[r1][i].minus(this[r2][i].times(c));
	}
};

Matrix.prototype.scalarMultiplyRow = function(r, c){
	for(var i = 0; i<this[r].length; i++)
	{
		this[r][i] = this[r][i].times(c);
	}
};

Matrix.prototype.toString = function(){
	var s = "<table><tbody>";
	for(var i = 0; i<this.length; i++)
	{
		s += "<tr>"
		for(var x = 0; x<this[i].length; x++)
		{
			s += "<td>" + this[i][x] + "</td>";
		}
		s += "</tr>";
	}
	return s + "</tbody></table>";
};

Matrix.prototype.determinant = function(){
	return this.luDecomposition().determinant;
}

Matrix.prototype.sumNorm = function(){
	var max = 0;
	for(var i = 0; i<this[0].length; i++){
			var n = this.colSumNorm(i);
			if(max.lessThan(n)){
				max = n;
			}
	}
	return max;
};
Matrix.prototype.maxNorm = function(){
	var max = 0;
	for(var i = 0; i<this.length; i++){
			var n = this.rowSumNorm(i);
			if(max.lessThan(n)){
				max = n;
			}
	}
	return max;
};
Matrix.prototype.euclideanNorm = function(){
	var sum = BigDecimal(0);
	for(var i = 0; i<this.length; i++){
		for(var x = 0; x<this[0].length; x++){
			sum = sum.plus(this[i][x].pow(2));
		}
	}
	return sum.sqrt();
};
Matrix.prototype.colSumNorm = function(col){
	var sum = new BigNumber(0);
	for(var i = 0; i<this[0].length; i++){
		sum = sum.plus(this[i][col].abs());
	}
	return sum;
};
Matrix.prototype.rowSumNorm = function(row){
	var sum = new BigNumber(0);
	for(var i = 0; i<this.length; i++){
		sum = sum.plus(this[row][i].abs());
	}
	return sum;
};

function Vector(matrix){
	if(matrix.length == 1 || typeof matrix[0].length == "undefined")
	{
		RowVector.apply(this, arguments);
	}else{
		ColumnVector.apply(this, arguments);
	}
}
Vector.prototype = Matrix.prototype;
Vector.prototype.dotProduct = function(other){
	if(this.length != other.length)
	{
		throw "These two vectors cannot be multiplied";
	}
	var total = 0;
	for(var i = 0; i < this.length; i++)
	{
		total += this.get(i).times(other.get(i));
	}
	return total;
};
Vector.prototype.euclideanNorm = function(){
	var sum = new BigNumber(0);
	for(var i = 0; i<this.length; i++){
		sum = sum.plus(this.get(i).pow(2));
	}
	return sum.sqrt();
};
Vector.prototype.sumNorm = function(){
	var sum = new BigNumber(0);
	for(var i = 0; i<this.length; i++){
		sum = sum.plus(this.get(i).abs());
	}
	return sum;
};
Vector.prototype.maxNorm = function(){
	var max = this.get(0).abs();
	for(var i = 1; i<this.length; i++){
		var abs = this.get(i).abs();
		if(max.lessThan(abs)){
			max = abs;
		}
	}
	return max;
};

function RowVector(matrix){
	var array = matrix[0].length ? matrix[0] : matrix;
	this[0] = [];
	for(var i = 0; i < array.length; i++){
		this[0][i] = new BigNumber(array[i]);
	}
	this.length = this[0].length;
}

RowVector.prototype = Vector.prototype;

RowVector.prototype.get = function(i){
	return this[0][i];
};

function ColumnVector(matrix){
	if(matrix[0].length){
		for(var i = 0; i<matrix.length; i++)
		{
			this[i] = [[new BigNumber(matrix[i][0])]];
		}
		this.length = matrix.length;
	}else{
		for(var i = 0; i<matrix.length; i++)
		{
			this[i] = [[new BigNumber(matrix[i])]];
		}
		this.length = matrix.length;
	}
}

ColumnVector.prototype = Vector.prototype;

ColumnVector.prototype.get = function(i){
	return this[i][0];
};
