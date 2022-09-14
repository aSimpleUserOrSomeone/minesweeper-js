const inpWidth = document.querySelector('#inpWidth')
const inpHeight = document.querySelector('#inpHeight')
const inpMines = document.querySelector('#inpMines')
const btnCreate = document.querySelector('#btnCreate')
const inpForm = document.querySelector('#inpForm')

const mineFrame = document.querySelector('.minesweeper-frame')
const mineField = document.querySelector('.minesweeper-field')

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

	if (document.querySelectorAll('.minesweeper-field > *')) {
		document
			.querySelectorAll('.minesweeper-field > *')
			.forEach((el) => el.remove())
	}

	var leftoverMines = formData.minesCount

	//create minefield
	arrMinefield = []
	for (let i = 0; i < formData.height; i++) {
		arrMinefield.push([])
		for (let j = 0; j < formData.width; j++) {
			arrMinefield[i].push(0)
		}
	}

	//add events to tiles
	arrMinefield.map((arrayRow, rowIndex) => {
		const minesweeperRow = document.createElement('div')
		minesweeperRow.classList.add('minesweeper-row')
		arrayRow.map((arrayCell, cellIndex) => {
			const minesweeperCell = document.createElement('div')
			minesweeperCell.classList.add('tile')
			minesweeperCell.classList.add('hidden')
			minesweeperCell.value = [cellIndex, rowIndex]
			minesweeperCell.addEventListener(
				'click',
				function setMines() {
					while (leftoverMines > 0) {
						const x = Math.floor(Math.random() * arrayRow.length)
						const y = Math.floor(
							Math.random() * arrMinefield.length
						)

						if (
							x !== minesweeperCell.value[0] ||
							y !== minesweeperCell.value[1]
						) {
							if (arrMinefield[y][x] === 0) {
								arrMinefield[y][x] = 1
								leftoverMines--
							}
						}
					}
				},
				{ once: true }
			)
			minesweeperCell.addEventListener(
				'click',
				() => {
					uncoverTile(minesweeperCell)
				},
				{ once: true }
			)
			minesweeperRow.appendChild(minesweeperCell)
		})
		mineField.appendChild(minesweeperRow)
	})
}

const mineClicked = () => {}

const uncoverTile = (minesweeperCell) => {
	const currX = minesweeperCell.value[0]
	const currY = minesweeperCell.value[1]

	if (arrMinefield[currY][currX] === 1) {
		mineClicked()
		return
	}

	var nearbyMines = 0
	var startX = -1
	var maxX = 1
	var startY = -1
	var maxY = 1

	if (currX === 0) {
		startX = 0
	} else if (currX === arrMinefield[currX].length - 1) {
		maxX = 0
	}

	if (currY === 0) {
		startY = 0
	} else if (currY === arrMinefield.length - 1) {
		maxY = 0
	}

	for (let i = startY; i <= maxY; i++) {
		for (let j = startX; j <= maxX; j++) {
			if (j === 0 && i === 0) continue

			if (arrMinefield[currY + i][currX + j] === 1) {
				nearbyMines++
			}
		}
	}
	minesweeperCell.textContent = nearbyMines
	minesweeperCell.classList.add('shown')
	minesweeperCell.classList.remove('hidden')

	//czy dany kafelek graniczy z minami
	if (nearbyMines) {
		minesweeperCell.classList.add(`n${nearbyMines}`)
	} else {
		minesweeperCell.classList.add('blank')
		for (let i = startY; i <= maxY; i++) {
			for (let j = startX; j <= maxX; j++) {
				if (j === 0 && i === 0) continue

				const borderingCell = document.querySelector(
					`.minesweeper-field > div:nth-child(${
						currY + i + 1
					}) > div:nth-child(${currX + j + 1})`
				)
				if (borderingCell.classList.contains('hidden')) {
					borderingCell.click()
				}
			}
		}
	}
}

btnCreate.addEventListener('click', createMinefield)
