const inpWidth = document.querySelector('#inpWidth')
const inpHeight = document.querySelector('#inpHeight')
const inpMines = document.querySelector('#inpMines')
const btnCreate = document.querySelector('#btnCreate')
const inpForm = document.querySelector('#inpForm')

const mineFrame = document.querySelector('.minesweeper-frame')
const mineField = document.querySelector('.minesweeper-field')
const stopScreen = document.querySelector('.stop-screen')
const timeP = document.querySelector('.time-counter')
const winText = document.querySelector('.win-text')
const loseText = document.querySelector('.lose-text')

const inpName = document.querySelector('#inpName')
const scoreboardDiv = document.querySelector('.scoreboard')
const scoreboard = document.querySelector('.scores-list')

var hasWon = false
var interval = null
var isTicking = false
var time = 0
var leftoverMines = 0
var arrMinefield = []

const startTimer = () => {
	if (isTicking) return
	isTicking = true
	interval = setInterval(() => {
		time++
		if (time > 99) {
			timeP.textContent = time
		} else if (time > 9) {
			timeP.textContent = '0' + time
		} else {
			timeP.textContent = '00' + time
		}
	}, 1000)
}

const stopTimer = () => {
	if (interval !== null) clearInterval(interval)
	isTicking = false
}

const getFromForm = () => {
	const minesWidth = inpWidth.value
	const minesHeight = inpHeight.value
	const minesCount = inpMines.value

	if (minesWidth != '' && minesHeight != '' && minesCount != '') {
		if (minesCount > 0) {
			if (minesCount <= (minesHeight - 1) * (minesWidth - 1)) {
				const results = {
					width: minesWidth,
					height: minesHeight,
					minesCount,
				}
				return results
			} else {
				alert('To many mines')
				return null
			}
		} else {
			alert('Not enough mines')
			return null
		}
	}
}

const createMinefield = () => {
	//will hide lose screen(filter)
	hideStopScreen()

	//will hide win/lose text
	winText.style.display = 'none'
	loseText.style.display = 'none'

	//will reset timer
	time = 0
	stopTimer()
	timeP.textContent = '000'

	//reset playing field
	if (document.querySelectorAll('.minesweeper-field > *')) {
		document.querySelectorAll('.minesweeper-field > *').forEach((el) => el.remove())
	}

	//get form data
	const formData = getFromForm()
	if (formData == null) {
		mineField.style.display = 'none'
		return
	}

	//show minefield
	mineField.style.display = 'flex'

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
					openTiles(minesweeperCell.value)
				},
				{ once: true }
			)
			minesweeperCell.addEventListener('contextmenu', (ev) => {
				putFlag(ev, minesweeperCell)
			})
			minesweeperRow.appendChild(minesweeperCell)
		})
		mineField.appendChild(minesweeperRow)
	})
}

const fillMinefield = (minesweeperCell) => {
	//fill with mines
	while (leftoverMines > 0) {
		//will start timer on first click
		startTimer()
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
			const x = cellIndex
			const y = rowIndex

			//give mine class
			if (arrayCell[0] === 9) {
				return document
					.querySelector(`.minesweeper-field > div:nth-child(${y + 1}) > div:nth-child(${x + 1})`)
					.classList.add('mine')
			}

			var nearbyMines = 0

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
}

const giveTileNumber = (x, y, n) => {
	tile = document.querySelector(`.minesweeper-field > div:nth-child(${y + 1}) > div:nth-child(${x + 1})`)
	tile.textContent = n
	tile.classList.add(`n${n}`)
}

const showTile = (x, y) => {
	tile = document.querySelector(`.minesweeper-field > div:nth-child(${y + 1}) > div:nth-child(${x + 1})`)
	tile.classList.add('shown')
	tile.classList.remove('hidden')
}

const displayStopScreen = () => {
	stopScreen.style.display = 'block'
	stopScreen.style.width = '100%'
	stopScreen.style.height = '100%'
}

const hideStopScreen = () => {
	stopScreen.style.display = 'none'
}

const mineClicked = (x, y) => {
	document.querySelector(`.minesweeper-field > div:nth-child(${y + 1}) > div:nth-child(${x + 1})`).classList.add('red')

	const mines = document.querySelectorAll('.mine')
	mines.forEach((e) => {
		const x = e.value[0]
		const y = e.value[1]
		showTile(x, y)
	})

	loseText.style.display = 'block'
	displayStopScreen()
	stopTimer()
}

const checkForWin = () => {
	var allGood = true
	arrMinefield.forEach((row) => {
		row.forEach((cell) => {
			//check if non-mine cell is still hidden
			if (cell[1] === 0 && cell[0] !== 9) {
				allGood = false
			}
		})
	})

	//will go on if every non-mine cell is uncovered (meaning win)
	if (!allGood) return

	winText.style.display = 'block'
	displayStopScreen()
	stopTimer()

	setCookie(inpName.value, time)
	showBestScores()
}

const openTile = (x, y) => {
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
	//chack if flag clicked if so do nothing
	const thiCell = document.querySelector(`.minesweeper-field > div:nth-child(${cellValue[1] + 1}) > div:nth-child(${cellValue[0] + 1})`)

	if (thiCell.classList.contains('flag')) return

	//check if mine clicked
	if (arrMinefield[cellValue[1]][cellValue[0]][0] === 9) {
		mineClicked(cellValue[0], cellValue[1])
		return
	}

	const toBeUncovered = [cellValue]

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

	//check if all tiles are uncovered
	checkForWin()
}

const getBestScores = () => {
	var bestScores = getCookies()

	if (bestScores === null) return null
	if (bestScores.length === 1) return bestScores

	const toRemove = document.querySelectorAll('ol > li')
	toRemove.forEach((e) => e.remove())

	bestScores.sort((a, b) => {
		const aTime = parseInt(a.substring(a.indexOf(',') + 1))
		const bTime = parseInt(b.substring(b.indexOf(',') + 1))

		if (aTime > bTime) {
			//a is slower than b
			return 1
		} else {
			return -1
		}
	})

	bestScores = bestScores.slice(0, 10)
	return bestScores
}

const showBestScores = () => {
	const scoresArray = getBestScores()

	if (scoresArray == null) return
	scoresArray.forEach((el) => {
		var name = el.substring(el.indexOf('=') + 1, el.indexOf(','))
		var time = parseInt(el.substring(el.indexOf(',') + 1, el.length))

		time = new Date(time * 1000).toISOString().slice(14, 19)

		const li = document.createElement('li')
		li.textContent = `${name} - ${time}`

		scoreboard.append(li)
	})
}

//unused, not working
const removeCookie = (id) => {
	const delDate = new Date()

	document.cookie = `${id}=${null}; expires=${delDate.getTime() - 1}; path=/`
}

const setCookie = (imie, czas) => {
	const date = new Date()
	date.setTime(date.getTime + 24 * 1000000)
	if (imie == '') imie = 'Anon'

	const cArray = getCookies()
	const cData = [imie, czas]

	var cLength = 0
	if (cArray != null) cLength = cArray.length

	document.cookie = `${cLength}=${cData}; expires=2023; path=/`
}

const getCookies = () => {
	const cDecoded = decodeURIComponent(document.cookie)
	const cArray = cDecoded.split('; ')

	if (cArray[0] == '') return null

	return cArray
}

const putFlag = (ev, tile) => {
	ev.preventDefault()
	if (tile.classList.contains('hidden')) {
		//is tile hidden
		if (tile.classList.contains('flag')) {
			tile.classList.remove('flag')
		} else {
			tile.classList.add('flag')
		}
	}
}

btnCreate.addEventListener('click', createMinefield)
showBestScores()
winText.style.display = 'none'
loseText.style.display = 'none'
