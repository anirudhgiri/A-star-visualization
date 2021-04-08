let rows = 25;
let cols = 25;
let grid = new Array(cols);

let openSet = [];
let closedSet = [];

let start;
let end;

let path = [];

class Spot{
    constructor(x,y){
        this.x = x;
        this.y = y;

        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.neighbors = [];

        this.wall = Math.random() < 0.18;
    }

    show(colour,letter=''){
        let w = width/cols;
        let h = height/rows;
        fill(this.wall ? 0 : colour);
        stroke(0);
        strokeWeight(2);
        rect(this.x*w,this.y*h, w, h);
        textAlign(CENTER);
        text(letter,this.x*w+(w/2), this.y*h+(h/2));
    }

    addNeighbors(grid){
        if(this.x+1 < cols)
            this.neighbors.push(grid[this.x+1][this.y]);

        if(this.x-1 > 0)
            this.neighbors.push(grid[this.x-1][this.y]);

        if(this.y+1 < rows)
            this.neighbors.push(grid[this.x][this.y+1]);

        if(this.y-1 > 0)
            this.neighbors.push(grid[this.x][this.y-1]);

        if(this.x-1 > 0 && this.y-1 > 0)
            this.neighbors.push(grid[this.x-1][this.y-1]);

        if(this.x-1 > 0 && this.y+1 < rows)
            this.neighbors.push(grid[this.x-1][this.y+1]);

        if(this.x+1 < cols && this.y-1 > 0)
            this.neighbors.push(grid[this.x+1][this.y-1]);

        if(this.x+1 < cols && this.y+1 < rows)
            this.neighbors.push(grid[this.x+1][this.y+1]);
            
    }
}

function setup() {
    let head = createElement('h1','A* Algorithm Visualization')
    let desc = createP("A* is being used to find the optimal path from the top right corner to the bottom left corner of the grid, with walls placed randomly in the way.");
    createCanvas(400, 400);
    for(let i = 0; i < cols; i++)
        grid[i] = new Array(rows);

    for(let i = 0; i < cols; i++)
        for(let j = 0; j < rows; j++)
            grid[i][j] = new Spot(i,j);
    
    for(let i = 0; i < cols; i++)
        for(let j = 0; j < rows; j++)
            grid[i][j].addNeighbors(grid);
    
    start = grid[0][0];
    end = grid[cols-1][rows-1];
    start.wall = false;
    end.wall = false;
    openSet.push(start);
}
  
function draw() {
    if(openSet.length > 0){
        let lowest = openSet.reduce((a,b) => a.f < b.f ? a : b);
        //console.log(lowest);
        if(lowest == end){
            path.push(end);
            console.log("Done!");
            noLoop();
        }
        
        closedSet.push(lowest);
        openSet.splice(openSet.indexOf(lowest),1);

        lowest.neighbors.forEach(neighbor => {
            
            if(!closedSet.includes(neighbor) && !neighbor.wall){
                let inc = (lowest.x != neighbor.x && lowest.y != neighbor.y) ? Math.SQRT2 : 1;
                let tentative_g = lowest.g + inc;
                let newPath = false;
                if(openSet.includes(neighbor)){
                    if(tentative_g < neighbor.g){
                        neighbor.g = tentative_g;
                        newPath = true;
                    }
                }
                else{
                    neighbor.g = tentative_g;
                    openSet.push(neighbor);
                    newPath = true;
                }                   
                
                neighbor.h = heuristic(neighbor.x, end.x, neighbor.y, end.y);
                neighbor.f = neighbor.g + neighbor.h;
                if(newPath) neighbor.previous = lowest;
            }
        });

        let temp = lowest;
        path = [];
        path.push(lowest);
        lowest.show(color(0,0,255));
        while(temp.previous){
            path.push(temp.previous);
            temp = temp.previous;
        }
    }
    else{
        console.log("No solution");
        noLoop();
        return;
    }
    
    background(255);

    for(let i = 0; i < cols; i++)
        for(let j = 0; j < rows; j++)
            grid[i][j].show(color(255));
    
    for(let i = 0; i < openSet.length; i++){
        openSet[i].show(color(0,255,0));
    }

    for(let i = 0; i < closedSet.length; i++){
        closedSet[i].show(color(255,0,0));
    }

    path.forEach(spot => spot.show(color(0,0,255)));
}

function heuristic(x1,x2,y1,y2){
    return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
    //return Math.abs(x1-x2) + Math.abs(y1-y2);
}