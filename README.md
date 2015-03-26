Matrices.js
--------------

A small JavaScript library for performing matrix operations that uses BigNumber.js to make calculations more precise. 

# The Matrix Class
The Matrix class and all subclasses are meant to immutable. Since this is JavaScript, I can't enforce that, so consider it more of a guideline than a rule. In fact, there are even methods that do mutate the matrix, but these are helper methods for the constructors and would be private in a language that supported private methods. 
## Instance Variables

### length
The number of rows of in the matrix. 

### The entries
The matrix acts like a two-dimensional array. The rows can be accessed using the [] operator. The rows themselves are actually arrays, so matrix[i][j] returns the entry in the i-th row and j-th column. 

## Constructors
All entries will be converted to BigNumber objects automatically. 

### Matrix(array)
Creates a matrix with entries corresponding to the entries in the provided array. The array must be two-dimensional and rectangular. The parameter can also be another matrix. 

### Matrix(number, rows, cols)
Creates a matrix with rows rows and columns cols with every entry equal to number. 

### Matrix.identity(n)
Creates an n by n identity matrix. 

## Methods

### multiply(other) (alias times)
Returns the result of multiplying the matrix by "other". 

If "other" is another matrix, matrix multiplication will be used. 

If "other" is a scalar, the method will call the scalarMultiply method, passing other as the single parameter to that method. 

### scalarMultiply(scalar)
Returns a new matrix where all entries in the given matrix have been multiplied by the scalar parameter. 

### rowColMultiply(other, row, col)
Returns the dot-product of the row-th row of this matrix and the col-th column of other. Used to make certain calculations more efficient and convenient. 

### pow(power) (alias raise)
Returns the result of multiplying this matrix by itself power times. 

### add(other) (alias plus)
Returns a new matrix with every entry corresponding to the sum of the corresponding entries in this matrix and other. The matrices must be the same size. 

### subtract(other) (alias minus)
Returns a new matrix with every entry corresponding to the difference of the corresponding entries in this matrix and other. The matrices must be the same size. 

### isSquare() 
Returns a boolean value indicating if the matrix is a square matrix (has the same number of rows and columns).

### determinant()
Returns the determinant of the matrix. 

### sumNorm()
Returns the sum norm of the matrix. 

### maxNorm()
Returns the max norm of the matrix. 

### euclidieanNorm()
Returns the Euclidean norm of the matrix. 

### euclidieanNorm()
Returns the Euclidean norm of the matrix. 

### rowSumNorm(row)
Returns the sum norm of the row-th row of the matrix. Used to calculate the max norm of the matrix. 

### colSumNorm(col)
Returns the sum norm of the col-th col of the matrix. Used to calculate the sum norm of the matrix. 

### identity()
Returns an identity matrix of the same size as this matrix. Equivalent to calling Matrix.identity(matrix.length)

### transpose()
Returns the transpose of this matrix (swaps the rows and columns).

### inverse()
Returns the inverse of the matrix. 

### pseudoInverse() (alias pI)
Returns the pseudo-inverse of the matrix (the transpose times the matrix, inverted, multiplied by the transpose).

### luDecomposition()
Returns an LUDecomposition object for the matrix. See the LUDecomposition class for details. 

### each(function, function2)
Iterates through the matrix and calls function on every entry of the matrix. The corresponding row and column numbers are also passed. Calls function2 (optional) at the end of each row of the matrix. The "this" keyword can be used to reference the matrix within the provided functions. 

### create(function)
Creates a new matrix with each entry corresponding to the result of passing the entry of this matrix and the corresponding row and column numbers to the provided function. The "this" keyword can be used to reference the matrix within the provided function. 

### subtractRows(r1, r2, c)
Changes row r1 to to result of subtracting row r2 times c from row r1. This method is used by other methods for performing certain calculations and probably shouldn't be used. 

### scalarMultiplyRow(r, c)
Changes row r to the result of multiplying row r by scalar c. This method is used by other methods for performing certain calculations and probably shouldn't be used. 

### toString()
Returns a string representing an HTML table element (so that the columns line up when the entires vary in length) filled with the entries of the matrix. 

## Vector (subclass)
The vector subclass allows the performance of vector-specific operations on matrices with either one row or one column. All methods of the matrix class are still accessible and behave the same way. 

### Constructors
The vector subclass is, in effect, abstract. It contains only one constructor that takes either a matrix or an array as a parameter and calls the constructor for the appropriate vector subclass (RowVector or ColumnVector) depending on the dimensions of the parameter. 

### Methods

#### get(i)
Returns the i-th element of the vector. Implemented in the subclasses. 

#### dotProduct(other)
Returns the dotProduct of the vector and the "other" parameter. The "other" parameter must be a vector object. 

#### euclideanNorm()
Returns the Euclidean norm of the vector. 

#### sumNorm()
Returns the sum norm of the vector. 

#### maxNorm()
Returns the max norm of the vector. 

### Subclasses

#### RowVector
The RowVector subclass is meant to represent 1 by n matrices. It has one constructor that takes an array or a matrix and creates a corresponding RowVector object. 

#### ColumnVector
The ColumnVector subclass is meant to represent n by 1 matrices. It has one constructor that takes an array or a matrix and creates a corresponding ColumnVector object. 

# The LUDecomposition class
Returns an object with fields corresponding to the objects representing the L/U decomposition of the matrix. 

## Constructors
There is only one constructor, which takes one parameter, which is the matrix that is to be decomposed. 

## Instance Variables

### l
The lower triangle matrix in the L/U decomposition of the matrix passed to the constructor. 

### u
The upper triangle matrix in the L/U decomposition of the matrix passed to the constructor. 

### determinant
The determinant of the matrix passed to the constructor (the product of the entries along the diagonal in u). 
