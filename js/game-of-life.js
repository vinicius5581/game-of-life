class gameOfLife {
    constructor(elId, height, width) {
        this.el = document.getElementById(elId);
        this.height = height;
        this.width = width;
        this.matrix = Array.apply(null, Array(height)).map(row => Array.apply(null, Array(width)).map(cel => Math.round(Math.random())))
        this.drawMatrix();
        document.getElementById('take-step-btn').addEventListener('click', this.takeStep.bind(this));
        document.getElementById(elId).addEventListener('click', this.toggleCel.bind(this));
        document.getElementById('run-btn').addEventListener('click', this.run.bind(this));
        document.getElementById('stop-btn').addEventListener('click', this.stop.bind(this));
    }

    countNeighboors(matrix, x,y) {
        let count = 0;
        for (let row = -1; row <= 1; row++) {
            for (let col = -1; col <= 1; col++) {
                if (!(row === 0 && col === 0)) {
                    if (x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1) {
                        if(matrix[x + row][y + col] === 1) {
                            count++;
                        }
                    }                   
                }
            }
        }
        return count;
    }

    toggleCel(el) {
        const elId = el.target.id;
        const row = parseInt(elId.split('').slice(4,6).join(''));
        const col = parseInt(elId.split('').slice(-2).join(''));
        this.matrix[row][col] === this.matrix[row][col] ? 0 : 1;
        const cel = document.getElementById(elId);
        if (this.matrix[row][col]) {
            this.matrix[row][col] = 0;
            cel.classList.remove("alive");
            cel.classList.add("dead");
        } else {
            this.matrix[row][col] = 1;
            cel.classList.remove("dead");
            cel.classList.add("alive");
        }
    }

    drawMatrix() {
        return new Promise((resolve) => {
            this.el.innerHTML = '';
            this.matrix.map((row, rowIdx) => {
                const rowWrapper = document.createElement('div');
                rowWrapper.setAttribute('id', `row-${rowIdx}`);
                rowWrapper.setAttribute('class', `row`);
                row.map((col, colIdx) => {
                    const celWrapper = document.createElement('div');
                    celWrapper.setAttribute('id', `row-${rowIdx}-col-${colIdx}`)
                    celWrapper.setAttribute('class', `cel`);
                    if (this.matrix[rowIdx][colIdx]) {
                        celWrapper.classList.remove("dead");
                        celWrapper.classList.add("alive");
                    } else {
                        celWrapper.classList.remove("alive");
                        celWrapper.classList.add("dead");
                    }
                    celWrapper.innerHTML = this.countNeighboors(this.matrix, rowIdx, colIdx);
                    rowWrapper.appendChild(celWrapper);
                });
                this.el.appendChild(rowWrapper);
            })            
            resolve();
        })
    }

    updateMatrix() {
        return new Promise((resolve) => {
            const previousState = JSON.parse(JSON.stringify(this.matrix));            
            previousState.map((row, rowIdx) => row.map((col, colIdx) => {
                const celState = previousState[rowIdx][colIdx];
                const neighboorsAlive = this.countNeighboors(previousState, rowIdx, colIdx);
                if (celState && (neighboorsAlive > 3 || neighboorsAlive < 2)) {
                    this.matrix[rowIdx][colIdx] = 0;
                } else if (!celState && neighboorsAlive === 3) {
                    this.matrix[rowIdx][colIdx] = 1;
                } else {
                    this.matrix[rowIdx][colIdx] = celState;
                }
            }))
            resolve();
        })
    }
    
    takeStep() {
        this.updateMatrix().then(this.drawMatrix());
    }

    run() {
        this.interval = setInterval(this.takeStep.bind(this), 1000);
    }

    stop() {
        clearInterval(this.interval);
    }
}

const newGame = new gameOfLife('gameOfLife', 30, 30);