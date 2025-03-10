def print_grid(grid):
    for row in grid:
        print(row)

def find_empty_location(grid):
    for row in range(len(grid)):
        for col in range(len(grid[row])):
            if grid[row][col] == 0:
                return row, col
    return None

def is_safe(grid, row, col, num):
    size = len(grid)
    box_size = int(size ** 0.5)

    # Check if the number is not already in the current row or column
    for i in range(size):
        if grid[row][i] == num or grid[i][col] == num:
            return False

    # Check within the sub-grid
    box_start_row = row - (row % box_size)
    box_start_col = col - (col % box_size)
    for i in range(box_size):
        for j in range(box_size):
            if grid[i + box_start_row][j + box_start_col] == num:
                return False

    return True

def solve_sudoku(grid):
    find = find_empty_location(grid)
    if not find:
        return True  # Solved
    else:
        row, col = find

    size = len(grid)
    for num in range(1, size + 1):
        if is_safe(grid, row, col, num):
            grid[row][col] = num
            print(f'Filled ({row}, {col}) with {num}')  # Print the step
            print_grid(grid)  # Print current state of grid
            print()  # Blank line for clarity

            if solve_sudoku(grid):
                return True
            
            grid[row][col] = 0  # Backtrack

    return False  # No solution

# Define different Sudoku grids
grids = {
    "4x4": [
        [0, 0, 0, 0],
        [0, 0, 3, 0],
        [0, 2, 0, 0],
        [0, 0, 1, 2]
    ],
    "6x6": [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 3, 0],
        [0, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0]
    ],
    "9x9": [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]
}

# Function to solve a specific puzzle type
def solve_puzzle(puzzle_type):
    grid = grids[puzzle_type]
    print(f'Solving {puzzle_type} Sudoku:')
    print_grid(grid)
    print()

    if solve_sudoku(grid):
        print("Sudoku Solved:")
        print_grid(grid)
    else:
        print("No solution exists.")

# Solve each puzzle type
solve_puzzle("4x4")
#solve_puzzle("6x6")
#solve_puzzle("9x9")
