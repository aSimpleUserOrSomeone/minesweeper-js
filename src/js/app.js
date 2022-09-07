const inpWidth = document.querySelector("#inpWidth")
const inpHeight = document.querySelector("#inpHeight")
const inpMines = document.querySelector("#inpMines")
const btnCreate = document.querySelector("#btnCreate")
const inpForm = document.querySelector("#inpForm")

const mineFrame = document.querySelector(".minesweeper-frame")
const mineField = document.querySelector(".minesweeper-field")

const getFromForm = () => {
    const minesWidth = inpWidth.value
    const minesHeight = inpHeight.value
    const minesCount = inpMines.value

    if(minesWidth != "" && minesHeight != "" && minesCount != "") {
        if(minesCount <= (minesHeight-1)*(minesWidth-1)) {
            const results = {
                width: minesWidth,
                height: minesHeight,
                minesCount 
            }
            return results
        } else {
            console.log("To many mines");
            return null
        }
    }
}

const createMinefield = () => {
    //get form data
    const formData = getFromForm()
    if(formData != null) {var leftoverMines = formData.minesCount

        //create minefield
        const arrMinefield = []
        for(let i=0; i < formData.height; i++) {
            arrMinefield.push([])
            for (let j=0; j<formData.width; j++) {
                arrMinefield[i].push(0)
            }
        }
    
        //fill array minefield
        while(leftoverMines != 0) {
            mineX = Math.floor(Math.random() * formData.width)
            mineY = Math.floor(Math.random() * formData.height)
    
            if(arrMinefield[mineY][mineX] == 0) {
                arrMinefield[mineY][mineX] = 1
                leftoverMines--
            }
        }
        
        //project the array as html elements
        
        for (let i = 0; i < arrMinefield.length; i++) {
            const minesweeperRow = document.createElement("div")
            minesweeperRow.classList.add("minesweeper-row")

            for (let j = 0; j < arrMinefield[i].length; j++) {
                const minesweeperCell = document.createElement("div")
                minesweeperCell.classList.add("tile")
                minesweeperCell.classList.add("hidden")
                
                //check for near 
                if(arrMinefield[i][j] == 0) {
                    var nearbyMines = 0;
                    for(let k = -1; i < 2; k++) {
                        for(let l = -1; j < 2; l++) {
                            
                        }
                        
                    }
                }
            }
        }
        
        // arrMinefield.map((arrayRow) => {
        //     const minesweeperRow = document.createElement("div")
        //     minesweeperRow.classList.add("minesweeper-row")
        //     arrayRow.map((arrayCell) => {
        //         const minesweeperCell = document.createElement("div")
        //         minesweeperCell.classList.add("tile")
        //         minesweeperCell.classList.add("hidden")
                
        //         //check for near 
        //         if(arrayCell == 0) {
        //             var nearbyMines = 0;
        //             for(let i = -1; i < 2; i++) {
        //                 for(let j = -1; j < 2; j++) {
                            
        //                 }
                        
        //             }
                    
        //         }

        //         minesweeperRow.appendChild(minesweeperCell)
        //     })
        //     mineField.appendChild(minesweeperRow)
        // })

    }
}



btnCreate.addEventListener("click", createMinefield)
