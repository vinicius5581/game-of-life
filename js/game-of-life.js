class gameOfLife {
    constructor(elId, height, width) {
        this.el = document.getElementById(elId);
        this.height = height;
        this.width = width;
        this.state = Array.apply(null, Array(height)).map(row => Array.apply(null, Array(width)).map(cel => Math.round(Math.random())))
        this.drawMatrix();
        document.getElementById('take-step-btn').addEventListener('click', this.takeStep.bind(this));
    }

    countNeighboors(state, x,y) {
        let count = 0;
        for (let row = -1; row <= 1; row++) {
            for (let col = -1; col <= 1; col++) {
                if (!(row === 0 && col === 0)) {
                    if (x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1) {
                        if(state[x + row][y + col] === 1) {
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
            console.log(this.state);
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
                    celWrapper.innerHTML = this.countNeighboors(this.state, rowIdx, colIdx);
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
                const celState = previousState[rowIdx][colIdx];
                const neighboorsAlive = this.countNeighboors(previousState, rowIdx, colIdx);
                if (celState && (neighboorsAlive >= 3 || neighboorsAlive < 2)) {
                    this.state[rowIdx][colIdx] = 0;
                } else if (!celState && neighboorsAlive === 3) {
                    this.state[rowIdx][colIdx] = 1;
                } else {
                    this.state[rowIdx][colIdx] = celState;
                }
                console.log(`(row, col): ${rowIdx}, ${colIdx} neighB, stateB: ${neighboorsAlive}, ${celState} neighA, stateA: ${this.countNeighboors(this.state, rowIdx, colIdx)}, ${this.state[rowIdx][colIdx]} `);
            }))
            console.log(this.state);
            resolve();
        })
    }
    
    takeStep() {
        this.updateState().then(this.drawMatrix());
    }
}

const newGame = new gameOfLife('gameOfLife', 10, 10);