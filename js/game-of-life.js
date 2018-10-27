class gameOfLife {
    constructor(elId) {
        const {width, height} = this.getDimensions();
        this.el = document.getElementById(elId);
        this.height = height;
        this.width = width;
        this.alive = 0;
        this.speed = 1000;
        this.isRunning = false;
        this.showNeighboorsCount = false;
        this.count = 1;
        this.history = [];
        this.matrix = this.matrixGenerator(this.height, this.width, height * width / 2);
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
        document.getElementById('toggle-neighboors-btn').addEventListener('click', this.toggleshowNeighboorsCount.bind(this));
        this.matrixGenerator = this.matrixGenerator.bind(this);

        
    }

    getDimensions() {
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        const headerHeight = document.getElementById('app-header').offsetHeight;
        const footerHeight = document.getElementById('app-footer').offsetHeight;
        // return {innerWidth, innerHeight, headerHeight, footerHeight}
        const width = Math.floor(innerWidth / 4);
        const height = Math.floor((innerHeight - headerHeight - footerHeight - 10) / 4);
        console.log(`w,h: ${width}, ${height}`)
        return {width, height}
    }
    

    matrixGenerator(rows, cols, celsAliveCount) {
        let count = celsAliveCount;
        return Array.apply(null, Array(rows)).map(row => Array.apply(null, Array(cols)).map(cel => {
            const random = Math.round(Math.random());
            this.alive = 0;
            if (count > 0) {
                if (random === 1) {
                    this.alive++;
                    count--;
                }
                return random;
            } else {
                return 0;
            }
        }))
    }

    countNeighboors(matrix, rowNumber, colNumber) {
        debugger;
        let count = 0;
        for (let row = -1; row <= 1; row++) {
            for (let col = -1; col <= 1; col++) {
                if (!(row === 0 && col === 0)) {
                    const rowCandidate = rowNumber + row;
                    const colCandidate = colNumber + col;
                    if (rowCandidate >= 0 && rowCandidate < this.height  && colCandidate >= 0 && colCandidate < this.width) {
                        if(matrix[rowCandidate][colCandidate] === 1) {
                            count++;
                        }
                    }                   
                }
            }
        }
        return count;
    }

    toggleshowNeighboorsCount() {
        this.showNeighboorsCount = !this.showNeighboorsCount;        
        this.drawMatrix();
    }

    toggleCel(el) {
        debugger;
        const elId = el.target.id;
        const matches = elId.match(/(row-)(\d{1,4})(-col-)(\d{1,4})/);
        const row = matches[2]
        const col = matches[4]
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
        this.stop();
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
                    if (this.showNeighboorsCount) {
                        celWrapper.innerHTML = this.countNeighboors(this.matrix, rowIdx, colIdx);
                    }                    
                    rowWrapper.appendChild(celWrapper);
                });
                this.el.appendChild(rowWrapper);
            })     
            
            if (this.alive === 0) {
                this.stop();
            } 
            const historyLastItemIdx = this.history.length - 1;
            if (this.history.length > 1 && (this.history[historyLastItemIdx] === this.history[historyLastItemIdx - 1] || this.history[historyLastItemIdx] === this.history[historyLastItemIdx - 2])) {
                this.stop();
            }
                 
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
                } else {
                    this.matrix[rowIdx][colIdx] = celState;
                }
                if (this.matrix[rowIdx][colIdx]) {
                    this.alive++;
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



const newGame = new gameOfLife('gameOfLife', 200, 420);