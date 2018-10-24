class gameOfLife {
    constructor(elId, height, width) {
        this.el = document.getElementById(elId);
        this.height = height;
        this.width = width;
        this.matrix = this.matrixGenerator(this.height, this.width, 300);
        this.speed = 1000;
        this.isRunning = false;
        this.count = 1;
        this.history = [];
        this.drawMatrix();
        this.echoStatus();
        document.getElementById('take-step-btn').addEventListener('click', this.takeStep.bind(this));
        document.getElementById(elId).addEventListener('click', this.toggleCel.bind(this));
        document.getElementById('run-btn').addEventListener('click', this.run.bind(this));
        document.getElementById('go-faster-btn').addEventListener('click', this.goFaster.bind(this));
        document.getElementById('slow-down-btn').addEventListener('click', this.slowDown.bind(this));
        document.getElementById('stop-btn').addEventListener('click', this.stop.bind(this));
        document.getElementById('kill-all-btn').addEventListener('click', this.killAll.bind(this));
        document.getElementById('go-back-btn').addEventListener('click', this.goBack.bind(this));
    }


    matrixGenerator(rows, cols, celsAliveCount) {
        let count = celsAliveCount;
        return Array.apply(null, Array(rows)).map(row => Array.apply(null, Array(cols)).map(cel => {
            const random = Math.round(Math.random());
            if (count > 0) {
                if (random === 1) {
                    count--;
                }
                return random;
            } else {
                return 0;
            }
        }))
    }

    countNeighboors(matrix, rowNumber, colNumber) {
        let count = 0;
        for (let row = -1; row <= 1; row++) {
            for (let col = -1; col <= 1; col++) {
                if (!(row === 0 && col === 0)) {
                    const rowCandidate = rowNumber + row;
                    const colCandidate = colNumber + col;
                    if (rowCandidate >= 0 && rowCandidate < this.width  && colCandidate >= 0 && colCandidate < this.height) {
                        if(matrix[rowCandidate][colCandidate] === 1) {
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

    echoStatus() {
        const el = document.getElementById('status');
        el.innerHTML = `isRunning: ${this.isRunning} | Pace: 1 update / ${this.speed / 1000} Seg | Interactions: ${this.count} | Alive: ${this.alive}`;
    }

    updateMatrix() {
        return new Promise((resolve) => {
            const previousState = JSON.parse(JSON.stringify(this.matrix));    
            this.alive = 0;
            this.history.push(JSON.stringify(this.matrix));        
            previousState.map((row, rowIdx) => row.map((col, colIdx) => {
                const celState = previousState[rowIdx][colIdx];
                const neighboorsAlive = this.countNeighboors(previousState, rowIdx, colIdx);
                if (celState && (neighboorsAlive > 3 || neighboorsAlive < 2)) {
                    this.matrix[rowIdx][colIdx] = 0;
                } else if (!celState && neighboorsAlive === 3) {
                    this.matrix[rowIdx][colIdx] = 1;
                    this.alive++;
                } else {
                    this.matrix[rowIdx][colIdx] = celState;
                }
            }))
            resolve();
        })
    }

    killAll() {
        this.matrix = this.matrixGenerator(this.height, this.width, 0);
        this.count = 0;
        this.drawMatrix();
        this.stop();
        this.echoStatus();
    }
    
    takeStep() {
        this.count++;
        this.updateMatrix().then(this.drawMatrix());        
        this.echoStatus();
    }

    run() {
        this.isRunning = true;
        clearInterval(this.interval);
        this.interval = setInterval(this.takeStep.bind(this), this.speed);
        this.echoStatus();
    }

    goFaster() {
        this.speed = this.speed - 500;
        this.echoStatus();
        if (this.isRunning) {
            this.run();
        }
    }

    slowDown() {
        this.speed = this.speed + 500;
        this.echoStatus();
        if (this.isRunning) {
            this.run();
        }
    }

    stop() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.echoStatus();
    }

    goBack() {
        if (this.history.length) {
            this.matrix = JSON.parse(this.history.pop());
            this.drawMatrix();
            this.count--;
            this.echoStatus();
        }        
    }
}

const newGame = new gameOfLife('gameOfLife', 25, 25);