// 4 or more = die
// dead with 3 live neighboors = come to life
// at least 2 live neighboors = survive
// 0 or 1 neighboors = die


console.log('epa')

const gameOfLife = class gameOfLife {
    constructor(elId, height, width) {
        this.el = document.getElementById(elId);
        this.height = height;
        this.width = width;
        this.state = Array.apply(null, Array(height)).map(row => Array.apply(null, Array(width)).map(cel => Math.round(Math.random())))
        this.drawMatrix();
        this.takeStep();
        // console.log(this.state);
        // console.log(this.getBrowserInnerDimensions().width, this.getBrowserInnerDimensions().height);
    }

    countNeighboors(x,y) {
        let count = 0;
        for (let row = -1; row <= 1; row++) {
            for (let col = -1; col <= 1; col++) {
                if (!(row === 0 && col === 0)) {
                    if (x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1) {
                        if(this.state[x + row][y + col] === 1) {
                            count++;
                        }
                    }                   
                }
            }
        }
        return count;
    }

    drawMatrix() {
        return new Promise((resolve) => {
            this.el.innerHTML = '';
            this.state.map((row, rowIdx) => {
                const rowWrapper = document.createElement('div');
                rowWrapper.setAttribute('id', `row-${rowIdx}`);
                rowWrapper.setAttribute('class', `row`);
                row.map((col, colIdx) => {
                    const celWrapper = document.createElement('div');
                    celWrapper.setAttribute('id', `row-${rowIdx}-col-${colIdx}`)
                    celWrapper.setAttribute('class', `cel`);
                    if (this.state[rowIdx][colIdx]) {
                        celWrapper.classList.remove("dead");
                        celWrapper.classList.add("alive");
                    } else {
                        celWrapper.classList.remove("alive");
                        celWrapper.classList.add("dead");
                    }
                    rowWrapper.appendChild(celWrapper);
                });
                this.el.appendChild(rowWrapper);
            })
            resolve();
        })
    }

    updateState() {
        return new Promise((resolve) => {
            const previousState = [].concat(this.state);
            debugger;
            previousState.map((row, rowIdx) => row.map((col, colIdx) => {
                const celState = previousState[rowIdx, colIdx];
                const neighboorsAlive = this.countNeighboors(rowIdx, colIdx);
                if (celState) {
                    if (neighboorsAlive > 3 || neighboorsAlive < 1) {
                        this.state[rowIdx][colIdx] = 0;
                    }
                } else if (neighboorsAlive >= 3) {
                        this.state[rowIdx][colIdx] = 1;
                } else {
                    this.state[rowIdx][colIdx] = celState;
                }
            }))
            resolve();
        })
    }
    
    takeStep() {
        setInterval(() => {
            this.updateState().then(this.drawMatrix());
        }, 2000);
    }
}

const newGame = new gameOfLife('gameOfLife', 10, 10);