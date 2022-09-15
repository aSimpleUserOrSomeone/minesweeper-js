const inpWidth = document.querySelector('#inpWidth')
const inpHeight = document.querySelector('#inpHeight')
const inpMines = document.querySelector('#inpMines')
const btnCreate = document.querySelector('#btnCreate')
const inpForm = document.querySelector('#inpForm')

const mineFrame = document.querySelector('.minesweeper-frame')
const mineField = document.querySelector('.minesweeper-field')

var leftoverMines = 0
var arrMinefield = []

const getFromForm = () => {
	const minesWidth = inpWidth.value
	const minesHeight = inpHeight.value
	const minesCount = inpMines.value

	if (minesWidth != '' && minesHeight != '' && minesCount != '') {
		if (minesCount <= (minesHeight - 1) * (minesWidth - 1)) {
			const results = {
				width: minesWidth,
				height: minesHeight,
				minesCount,
			}
			return results
		} else {
			console.log('To many mines')
			return null
		}
	}
}

const createMinefield = () => {
	//get form data
	const formData = getFromForm()
	if (formData == null) return

	//reset playing field
	if (document.querySelectorAll('.minesweeper-field > *')) {
		document
			.querySelectorAll('.minesweeper-field > *')
			.forEach((el) => el.remove())
	}

	leftoverMines = formData.minesCount

	//create minefield
	arrMinefield = []
	for (let i = 0; i < formData.height; i++) {
		arrMinefield.push([])
		for (let j = 0; j < formData.width; j++) {
			arrMinefield[i].push([0, 0])
		}
	}

	//add events to tiles
	arrMinefield.forEach((arrayRow, rowIndex) => {
		const minesweeperRow = document.createElement('div')
		minesweeperRow.classList.add('minesweeper-row')
		arrayRow.forEach((arrayCell, cellIndex) => {
			//customize tile
			const minesweeperCell = document.createElement('div')
			minesweeperCell.classList.add('tile')
			minesweeperCell.classList.add('hidden')
			minesweeperCell.value = [cellIndex, rowIndex]
			//add onclick events
			minesweeperCell.addEventListener(
				'click',
				() => {
					fillMinefield(minesweeperCell)
				},
				{ once: true }
			)
			minesweeperCell.addEventListener(
				'click',
				() => {
					openTiles(minesweeperCell.value)
				},
				{ once: true }
			)
			minesweeperRow.appendChild(minesweeperCell)
		})
		mineField.appendChild(minesweeperRow)
	})
}

const fillMinefield = (minesweeperCell) => {
	//fill with mines
	while (leftoverMines > 0) {
		console.log('Iter')
		const x = Math.floor(Math.random() * arrMinefield[0].length)
		const y = Math.floor(Math.random() * arrMinefield.length)

		if (x !== minesweeperCell.value[0] || y !== minesweeperCell.value[1]) {
			if (arrMinefield[y][x][0] !== 9) {
				arrMinefield[y][x][0] = 9
				leftoverMines--
			}
		}
	}

	//fill with numbers
	arrMinefield.forEach((arrayRow, rowIndex) => {
		arrayRow.forEach((arrayCell, cellIndex) => {
			if (arrayCell[0] === 9) {
				return
			}

			var nearbyMines = 0
			const x = cellIndex
			const y = rowIndex

			var startX = -1
			var maxX = 1
			var startY = -1
			var maxY = 1

			if (x === 0) {
				startX = 0
			} else if (x === arrMinefield[x].length - 1) {
				maxX = 0
			}

			if (y === 0) {
				startY = 0
			} else if (y === arrMinefield.length - 1) {
				maxY = 0
			}

			for (let i = startY; i <= maxY; i++) {
				for (let j = startX; j <= maxX; j++) {
					if (j === 0 && i === 0) continue

					if (arrMinefield[y + i][x + j][0] === 9) {
						nearbyMines++
					}
				}
			}

			arrayCell[0] = nearbyMines
			giveTileNumber(x, y, nearbyMines)
		})
	})

	console.log(arrMinefield)
}

const giveTileNumber = (x, y, n) => {
	tile = document.querySelector(
		`.minesweeper-field > div:nth-child(${y + 1}) > div:nth-child(${x + 1})`
	)
	tile.textContent = n
	tile.classList.add(`n${n}`)
}

const showTile = (x, y) => {
	tile = document.querySelector(
		`.minesweeper-field > div:nth-child(${y + 1}) > div:nth-child(${x + 1})`
	)
	tile.classList.add('shown')
	tile.classList.remove('hidden')
}

const mineClicked = (x, y) => {}

const openTile = (x, y) => {
	if (arrMinefield[y][x][0] === 9) {
		return mineClicked(x, y)
	}

	var toOpen = []

	var startX = -1
	var maxX = 1
	var startY = -1
	var maxY = 1

	if (x === 0) {
		startX = 0
	} else if (x === arrMinefield[x].length - 1) {
		maxX = 0
	}

	if (y === 0) {
		startY = 0
	} else if (y === arrMinefield.length - 1) {
		maxY = 0
	}

	for (let i = startY; i <= maxY; i++) {
		for (let j = startX; j <= maxX; j++) {
			if (j === 0 && i === 0) continue

			if (arrMinefield[y + i][x + j][1] === 0) {
				toOpen.push([x + j, y + i])
			}
		}
	}

	return toOpen
}

const openTiles = (cellValue) => {
	const toBeUncovered = [cellValue]
	console.log('click')

	while (toBeUncovered.length) {
		let nextTile = toBeUncovered.pop()

		//is nextTile hiden
		if (arrMinefield[nextTile[1]][nextTile[0]][1] === 0) {
			//show current tile
			arrMinefield[nextTile[1]][nextTile[0]][1] = 1
			showTile(nextTile[0], nextTile[1])

			//is nexttile blank to open more tiles
			if (arrMinefield[nextTile[1]][nextTile[0]][0] === 0) {
				const extraTiles = openTile(nextTile[0], nextTile[1])
				if (extraTiles.length) toBeUncovered.push(...extraTiles)
			}
		}
	}
}

//currently unused
// const uncoverTile = (minesweeperCell) => {
// 	const currX = minesweeperCell.value[0]
// 	const currY = minesweeperCell.value[1]

// 	if (arrMinefield[currY][currX] === 1) {
// 		return
// 	}

// 	var nearbyMines = 0
// 	var startX = -1
// 	var maxX = 1
// 	var startY = -1
// 	var maxY = 1

// 	if (currX === 0) {
// 		startX = 0
// 	} else if (currX === arrMinefield[currX].length - 1) {
// 		maxX = 0
// 	}

// 	if (currY === 0) {
// 		startY = 0
// 	} else if (currY === arrMinefield.length - 1) {
// 		maxY = 0
// 	}

// 	for (let i = startY; i <= maxY; i++) {
// 		for (let j = startX; j <= maxX; j++) {
// 			if (j === 0 && i === 0) continue

// 			if (arrMinefield[currY + i][currX + j] === 1) {
// 				nearbyMines++
// 			}
// 		}
// 	}
// 	minesweeperCell.textContent = nearbyMines
// 	minesweeperCell.classList.add('shown')
// 	minesweeperCell.classList.remove('hidden')

// 	//czy dany kafelek graniczy z minami
// 	if (nearbyMines) {
// 		minesweeperCell.classList.add(`n${nearbyMines}`)
// 	} else {
// 		minesweeperCell.classList.add('blank')
// 		for (let i = startY; i <= maxY; i++) {
// 			for (let j = startX; j <= maxX; j++) {
// 				if (j === 0 && i === 0) continue

// 				const borderingCell = document.querySelector(
// 					`.minesweeper-field > div:nth-child(${
// 						currY + i + 1
// 					}) > div:nth-child(${currX + j + 1})`
// 				)
// 				if (borderingCell.classList.contains('hidden')) {
// 					borderingCell.click()
// 				}
// 			}
// 		}
// 	}
// }

btnCreate.addEventListener('click', createMinefield)
