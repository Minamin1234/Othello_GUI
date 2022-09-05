const canvas = document.getElementById("display");
const display = canvas.getContext("2d");
var W = 600;
var H = 600;

class Vector2D
{
    x;
    y;
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}

//指定したグリッド数で描画します。
function drawgrid(grids)
{
    //display.fillRect(1,1,10,10);
    var dw = W / grids;
    var dh = H / grids;
    //display.fillText(grids.toString(),10,10);
    display.beginPath();
    var cnt = 0;
    for(var h = 0;h <= grids;h++)
    {
        var y = dh * h;
        display.lineTo(0,y);
        display.lineTo(W,y);
        y = dh * (h+1);
        display.moveTo(0,y);
    }

    for(var w = 0;w <= grids;w++)
    {
        var x = dw * w;
        display.lineTo(x,0);
        display.lineTo(x,H);
        x = dw * (w+1);
        display.moveTo(x,0);
    }
    display.stroke();
}

//グリッド位置を取得します。
function GetCursorGridPos(x,y,grid,w,h)
{
    var dw = w / grid;
    var dh = h / grid;

    var pos = new Vector2D(0,0);
    pos.x = x / dw;
    pos.y = y / dh;
    return pos;
}

function display_clicked(e)
{
    var rect = e.target.getBoundingClientRect();
    //display.fillRect(e.clientX-rect.left,e.clientY-rect.top,10,10);
    //var GridPos = GetCursorGridPos(String(e.clientX-rect.left),String(e.clientY-rect.top),10,10);
    display.fillText(String(e.clientX-rect.left) + String(e.clientY-rect.top),10,10);
}

function display_mousedown(e)
{
    //var rect = e.target.getBoundingClientRect();
    //display.fillRect(e.clientX-rect.left,e.clientY-rect.top,10,10);
}

function display_mouseup(e)
{
    //var rect = e.target.getBoundingClientRect();
    //display.fillRect(e.clientX-rect.left,e.clientY-rect.top,10,10);
}

canvas.addEventListener("click",display_clicked,false);
canvas.addEventListener("mousedown",display_mousedown,false);
canvas.addEventListener("mouseup",display_mouseup,false);

drawgrid(8);
//display.font = "12px serif";
//display.fillText("Hello",10,10);
/*
for(var i = 0;i <= 100;i += 10)
{
    display.fillText(i.toString(),10,i);
}
*/