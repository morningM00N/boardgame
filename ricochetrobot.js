let seed = 5;
function pseudo_rand()
{
	seed = seed * 25214903917+ 11;
    seed = seed & 0x7fffffff
	return (seed >> 16) & 0x3fffffff;
}


function resizeCells() {
    const table = document.getElementById('boardTbl');
    const rows = table.rows.length; // 테이블의 행 수
    const cols = table.rows[0].cells.length; // 첫 번째 행의 열 수

    const tableWidth = table.clientWidth; // 테이블 너비
    const tableHeight = table.clientHeight; // 테이블 높이

    // 최소 행 또는 열 수에 따라 정사각형 셀의 크기 계산
    const cellSize = Math.min(tableWidth / cols, tableHeight / rows);

    // 각 셀의 너비와 높이를 설정
    for (let row of table.rows) {
        for (let cell of row.cells) {
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
        }
    }
}

// 페이지가 로드될 때와 창 크기가 변경될 때 셀 크기 조정

function moveRobot(color,direction)
{
    console.log(color,direction)
    let curRow = board.robots[color][1][0]
    let curCol = board.robots[color][1][1]

    board.tiles[curRow][curCol].robot=false

    let RIGHT = 0
    let BOTTOM = 1
    let LEFT = 2
    let TOP = 3
    
    let dr = [0,1,0,-1]
    let dc = [1,0,-1,0]

    let targetRow=curRow
    let targetCol=curCol
    while (true){
        let tmpRow = targetRow + dr[direction]
        let tmpCol = targetCol + dc[direction]
        if (tmpRow<0 || tmpRow>=16 || tmpCol<0 || tmpCol>=16){
            break
        }
        if (board.tiles[targetRow][targetCol].existWall(direction)==true){
            break
        }
        if (board.tiles[tmpRow][tmpCol].robot==true){
            break
        }
        targetRow += dr[direction]
        targetCol += dc[direction]
    }

    let cellSize = board.tiles[0][0].td.getBoundingClientRect().width

    board.tiles[targetRow][targetCol].robot=true
    board.robots[color][0].style.left = (board.tiles[targetRow][targetCol].td.getBoundingClientRect().left+cellSize*0.05)+"px"
    board.robots[color][0].style.top = (board.tiles[targetRow][targetCol].td.getBoundingClientRect().top+cellSize*0.05)+"px"
    board.robots[color][1][0]=targetRow
    board.robots[color][1][1]=targetCol
}
function funcDraw() {
    let boardTbl = document.getElementById('boardTbl');
    for (let i = 0; i < 16; i++) {
        let tr = document.createElement('tr');
        boardTbl.appendChild(tr)
        for (let j = 0; j < 16; j++) {
            let td = document.createElement('td');
            td.id = "boardTile_" + i + "_" + j
            //td.style.backgroundImage='url("bg.png")'
            td.onclick = function () {
                board.tiles[i][j].nextWallState()
            }
            tr.appendChild(td)
        }
    }

    let remoteControlloerTbl = document.getElementById('remoteControlloerTbl');
    for (let i = 0; i < 6; i++) {
        let tr = document.createElement('tr');
        remoteControlloerTbl.appendChild(tr)
        for (let j = 0; j < 9; j++) {
            let td = document.createElement('td');
            td.id = "remoteTile_" + i + "_" + j
            tr.appendChild(td)
        }
    }
    {
        let buttonleft = document.createElement('button')
        buttonleft.className="triangle-button rotate-270"
        let buttonright = document.createElement('button')
        buttonright.className="triangle-button rotate-90"
        let buttontop = document.createElement('button')
        buttontop.className="triangle-button"
        let buttonbottom = document.createElement('button')
        buttonbottom.className="triangle-button rotate-180"
        let tdTemp = document.getElementById('remoteTile_1_1');
        let button = document.createElement('button')
        button.className = "round-button blue-button"
        tdTemp.appendChild(button)
        document.getElementById('remoteTile_1_0').appendChild(buttonleft)
        document.getElementById('remoteTile_1_0').onclick=function(){
            moveRobot("blue",LEFT)
        };
        document.getElementById('remoteTile_1_2').appendChild(buttonright)
        document.getElementById('remoteTile_1_2').onclick=function(){
            moveRobot("blue",RIGHT)
        };
        document.getElementById('remoteTile_0_1').appendChild(buttontop)
        document.getElementById('remoteTile_0_1').onclick=function(){
            moveRobot("blue",TOP)
        };
        document.getElementById('remoteTile_2_1').appendChild(buttonbottom)
        document.getElementById('remoteTile_2_1').onclick=function(){
            moveRobot("blue",BOTTOM)
        };
    }
    {
        let buttonleft = document.createElement('button')
        buttonleft.className="triangle-button rotate-270"
        let buttonright = document.createElement('button')
        buttonright.className="triangle-button rotate-90"
        let buttontop = document.createElement('button')
        buttontop.className="triangle-button"
        let buttonbottom = document.createElement('button')
        buttonbottom.className="triangle-button rotate-180"
        let tdTemp = document.getElementById('remoteTile_1_4');
        let button = document.createElement('button')
        button.className = "round-button red-button"
        tdTemp.appendChild(button)
        document.getElementById('remoteTile_1_3').appendChild(buttonleft)
        document.getElementById('remoteTile_1_3').onclick=function(){
            moveRobot("red",LEFT)
        };
        document.getElementById('remoteTile_1_5').appendChild(buttonright)
        document.getElementById('remoteTile_1_5').onclick=function(){
            moveRobot("red",RIGHT)
        };
        document.getElementById('remoteTile_0_4').appendChild(buttontop)
        document.getElementById('remoteTile_0_4').onclick=function(){
            moveRobot("red",TOP)
        };
        document.getElementById('remoteTile_2_4').appendChild(buttonbottom)
        document.getElementById('remoteTile_2_4').onclick=function(){
            moveRobot("red",BOTTOM)
        };
    }
    {
        let buttonleft = document.createElement('button')
        buttonleft.className="triangle-button rotate-270"
        let buttonright = document.createElement('button')
        buttonright.className="triangle-button rotate-90"
        let buttontop = document.createElement('button')
        buttontop.className="triangle-button"
        let buttonbottom = document.createElement('button')
        buttonbottom.className="triangle-button rotate-180"
        let tdTemp = document.getElementById('remoteTile_1_7');
        let button = document.createElement('button')
        button.className = "round-button gray-button"
        tdTemp.appendChild(button)
        document.getElementById('remoteTile_1_6').appendChild(buttonleft)
        document.getElementById('remoteTile_1_6').onclick=function(){
            moveRobot("gray",LEFT)
        };
        document.getElementById('remoteTile_1_8').appendChild(buttonright)
        document.getElementById('remoteTile_1_8').onclick=function(){
            moveRobot("gray",RIGHT)
        };
        document.getElementById('remoteTile_0_7').appendChild(buttontop)
        document.getElementById('remoteTile_0_7').onclick=function(){
            moveRobot("gray",TOP)
        };
        document.getElementById('remoteTile_2_7').appendChild(buttonbottom)
        document.getElementById('remoteTile_2_7').onclick=function(){
            moveRobot("gray",BOTTOM)
        };
    }
    {
        let buttonleft = document.createElement('button')
        buttonleft.className="triangle-button rotate-270"
        let buttonright = document.createElement('button')
        buttonright.className="triangle-button rotate-90"
        let buttontop = document.createElement('button')
        buttontop.className="triangle-button"
        let buttonbottom = document.createElement('button')
        buttonbottom.className="triangle-button rotate-180"
        let tdTemp = document.getElementById('remoteTile_4_1');
        let button = document.createElement('button')
        button.className = "round-button yellow-button"
        tdTemp.appendChild(button)
        document.getElementById('remoteTile_4_0').appendChild(buttonleft)
        document.getElementById('remoteTile_4_0').onclick=function(){
            moveRobot("yellow",LEFT)
        };
        document.getElementById('remoteTile_4_2').appendChild(buttonright)
        document.getElementById('remoteTile_4_2').onclick=function(){
            moveRobot("yellow",RIGHT)
        };
        document.getElementById('remoteTile_3_1').onclick=function(){
            moveRobot("yellow",TOP)
        };
        document.getElementById('remoteTile_5_1').onclick=function(){
            moveRobot("yellow",BOTTOM)
        };
        document.getElementById('remoteTile_3_1').appendChild(buttontop)
        document.getElementById('remoteTile_5_1').appendChild(buttonbottom)
    }
    {
        let buttonleft = document.createElement('button')
        buttonleft.className="triangle-button rotate-270"
        let buttonright = document.createElement('button')
        buttonright.className="triangle-button rotate-90"
        let buttontop = document.createElement('button')
        buttontop.className="triangle-button"
        let buttonbottom = document.createElement('button')
        buttonbottom.className="triangle-button rotate-180"
        let tdTemp = document.getElementById('remoteTile_4_4');
        let button = document.createElement('button')
        button.className = "round-button green-button"
        tdTemp.appendChild(button)
        document.getElementById('remoteTile_4_3').onclick=function(){
            moveRobot("green",LEFT)
        };
        document.getElementById('remoteTile_4_5').onclick=function(){
            moveRobot("green",RIGHT)
        };
        document.getElementById('remoteTile_3_4').onclick=function(){
            moveRobot("green",TOP)
        };
        document.getElementById('remoteTile_5_4').onclick=function(){
            moveRobot("green",BOTTOM)
        };

        document.getElementById('remoteTile_4_3').appendChild(buttonleft)
        document.getElementById('remoteTile_4_5').appendChild(buttonright)
        document.getElementById('remoteTile_3_4').appendChild(buttontop)
        document.getElementById('remoteTile_5_4').appendChild(buttonbottom)


    }

}

let RIGHT = 0
let BOTTOM = 1
let LEFT = 2
let TOP = 3

let wallStates=[0b0,0b1000,0b1100,0b0100,0b0110,0b0010,0b0011,0b0001,0b1001]

class Tile {
    constructor(row, col) {
        this.wall = [false, false]
        this.adjTiles = [null, null, null, null]
        this.wallState = 0
        this.row = row
        this.col = col
        this.td = document.getElementById("boardTile_"+row+"_"+col)
        this.robot=false
    }
    setWall(dir,value)
    {
        if (dir<2) this.wall[dir]=value
        else{
            console.assert (this.adjTiles[dir]!=null)
            this.adjTiles[dir].wall[(dir+2)%4]=value
        }
    }
    existWall(dir){
        if (dir<2) return this.wall[dir]
        console.assert (this.adjTiles[dir]!=null)
        return this.adjTiles[dir].existWall((dir+2)%4)
    }
}

let colorList=["red","blue","gray","yellow","green"]
class Board {
    constructor() {
        this.tiles = []
        for (let i = 0; i < 16; i++) {
            let arr = []
            this.tiles.push(arr)
            for (let j = 0; j < 16; j++) {
                arr.push(new Tile(i, j))
            }
        }
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let topTile = null
                let bottomTile = null
                let leftTile = null
                let rightTile = null
                if (i > 0) {
                    topTile = this.tiles[i - 1][j]
                }
                if (j > 0) {
                    leftTile = this.tiles[i][j - 1]
                }
                if (i < 15) {
                    bottomTile = this.tiles[i + 1][j]
                }
                if (j < 15) {
                    rightTile = this.tiles[i][j + 1]
                }
                this.tiles[i][j].adjTiles[TOP] = topTile
                this.tiles[i][j].adjTiles[BOTTOM] = bottomTile
                this.tiles[i][j].adjTiles[LEFT] = leftTile
                this.tiles[i][j].adjTiles[RIGHT] = rightTile
            }
        }
        this.robots={}
    }
    init(numOfWall){
        let cellSize = this.tiles[0][0].td.getBoundingClientRect().width
        colorList.forEach(element => {
            this.robots[element]=[]
            let btn = document.createElement("button")
            btn.className="round-button "+element+"-button robot"
            btn.style.width=cellSize*0.9+"px"
            btn.style.height=cellSize*0.9+"px"
            document.getElementById("mainBody").appendChild(btn)
            this.robots[element].push(btn)
            let row = pseudo_rand()%16
            let col = pseudo_rand()%16
            while (this.tiles[row][col].robot==true){
                row = pseudo_rand()%16
                col = pseudo_rand()%16
            }
            this.tiles[row][col].robot=true
            this.robots[element].push([row,col])
            btn.style.left = (this.tiles[row][col].td.getBoundingClientRect().left+cellSize*0.05)+"px"
            btn.style.top = (this.tiles[row][col].td.getBoundingClientRect().top+cellSize*0.05)+"px"
        });
        this.setWall(numOfWall)
    }
    setWall(numOfWall){
        
        for (let i = 0; i < numOfWall; i++) {
            let row=pseudo_rand()%16
            let col=pseudo_rand()%16
            let dir=pseudo_rand()%2
            while (
                (col==15 && dir==RIGHT) ||
                (row==15 && dir==BOTTOM) ||
                this.tiles[row][col].existWall(dir)==true
            ){
                row=pseudo_rand()%16
                col=pseudo_rand()%16
                dir=pseudo_rand()%2
                }
            this.tiles[row][col].setWall(dir,true)
        }
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                if (this.tiles[i][j].wall[BOTTOM]==true){
                    this.tiles[i][j].td.style.borderBottom="2px solid red"
                }
                if (this.tiles[i][j].wall[RIGHT]==true){
                    this.tiles[i][j].td.style.borderRight="2px solid red"
                }
                
            }
        }

        for (let row = 7; row <= 8; row++) {
            for (let col = 7; col <= 8; col++) {
              this.tiles[row][col].robot=true
              this.tiles[row][col].td.style.backgroundColor="black"
            }
            
        }
    }
}
funcDraw()

let board = new Board()
board.init(16)
