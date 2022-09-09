//2次元の数値を表すクラス。
class Vector2D
{
    x;
    y;
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }

    GetString()
    {
        var res = "(";
        res += String(this.x);
        res += ",";
        res += String(this.y);
        res += ")";
        return res;
    }
}

//RGBの色情報を表すクラス
class COLORRGB
{
    r;
    g;
    b;
    constructor(r,g,b)
    {
        this.r = r % 256;
        this.g = g % 256;
        this.b = b % 256;
    }

    GetColor()
    {
        var res = "rgb(";
        res += String(this.r) + ",";
        res += String(this.g) + ",";
        res += String(this.b) + ")";
        return res;
    }
}
const canvas = document.getElementById("display");
const display = canvas.getContext("2d");
const W = 600;
const H = 600;

var STONERADIUS = (W / 8)/2 - 5;
const GRID = 8;
const NONE = 0;
const STONE_WHITE = 1;
const STONE_BLACK = 2;

var COLOR_WHITE = new COLORRGB(200,200,200);
var COLOR_BLACK = new COLORRGB(60,60,60);

const DIRECTIONS = 
[
    new Vector2D(-1,-1),new Vector2D(0,-1),new Vector2D(1,-1),
    new Vector2D(-1, 0),                   new Vector2D(1, 0),
    new Vector2D(-1, 1),new Vector2D(0, 1),new Vector2D(1, 1)
];
const UPLEFT = 0;
const UP = 1;
const UPRIGHT = 2;
const LEFT = 3;
const RIGHT = 4;
const DOWNLEFT = 5;
const DOWN = 6;
const DOWNRIGHT = 7;


const Texts_H = 10;

var Player = STONE_WHITE;
var Other = STONE_BLACK;

var Texts = [];
var Table = 
[
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,1,2,0,0,0],
    [0,0,0,2,1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
];

//左上部に文字列を出力します。
function PrintString(text)
{
    Texts.push(String(text));
    On_Reload();
}

function Copy(v1,v2)
{
    v2.x = v1.x;
    v2.y = v1.y;
}

function Copy(v)
{
    var vec = new Vector2D(v.x,v.y);
    return vec;
}

function Equal(v1,v2)
{
    return (v1.x == v2.x && v1.y == v2.y);
}

function Add(vec1,vec2)
{
    vec1.x += vec2.x;
    vec1.y += vec2.y;
}

function GetStoneAt(table,pos)
{
    return table[pos.y][pos.x];
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

//円を描画します。
function DrawCirc(x,y,radius,color,Isfill=true)
{
    display.beginPath();
    display.fillStyle = color.GetColor();
    display.arc(x,y,radius,0,350 * Math.PI/180,false);
    if(Isfill)
    {
        display.fill();
    }
    else
    {
        display.strokeStyle = color.GetColor();
        display.stroke();
    }
}

//盤面データから石を描画します。
function DrawStones(table,grid)
{
    var dw = W / grid;
    var dh = H / grid;
    //dw = dw / 2;
    //dh = dh / 2;
    display.beginPath();
    for(var h = 0;h < grid;h++)
    {
        for(var w = 0;w < grid;w++)
        {
            var x = dw * w + (dw / 2);
            var y = dh * h + (dh / 2);
            //display.fillText(String(Table[h][w]),10+Texts_H*w,10+Texts_H*h)
            if(table[h][w] == STONE_WHITE)
            {
                DrawCirc(x,y,STONERADIUS,COLOR_WHITE);
            }
            else if(table[h][w] == STONE_BLACK)
            {
                DrawCirc(x,y,STONERADIUS,COLOR_BLACK);
            }
        }
    }
}

//画面を全消去します。
function ClearDisplay(w,h)
{
    display.clearRect(0,0,w,h);
}

//画面が描画される際に呼ばれます。
function On_draw()
{
    drawgrid(GRID);
    DrawStones(Table,GRID);

    Texts.forEach(function(item,i)
    {
        display.fillText(String(item),10,Texts_H*i+10);
        //display.fillText(String(Texts_H*i),10,10);
    });
}

//更新される際に呼ばれます。
function On_Reload()
{
    ClearDisplay(W,H);
    On_draw();
}

//指定した場所に石を打ちます。
function PutStone(table,at,newstone)
{
    //PrintString(newstone);
    table[at.y][at.x] = newstone;
    On_Reload();
}

//グリッド位置を取得します。
function GetCursorGridPos(x,y,grid,w,h)
{
    var dw = w / grid;
    var dh = h / grid;

    var pos = new Vector2D(0,0);
    pos.x = Math.floor(x / dw);
    pos.y = Math.floor(y / dh);
    return pos;
}

//グリッド位置を取得します。
function GetCursorGridPos(xy,grid,w,h)
{
    var dw = w / grid;
    var dh = h / grid;
    var res = new Vector2D(xy.x,xy.y);
    res.x /= dw;
    res.y /= dh;
    res.x = Math.floor(res.x);
    res.y = Math.floor(res.y);
    return res;
}

//指定した位置が境界線外かどうかを返します。
function IsBoundAtPosition(pos,grid=8)
{
    if(pos.x < 0 || pos.x >= grid-1) return true;
    else if(pos.y < 0 || pos.y >= grid-1) return true;
    return false;
}

//指定した位置から指定した方向が境界線外かどうかを返します。
function IsBoundAtDirection(pos,direction,grid=8)
{
    pos = Add(pos,direction);
    return IsBoundAtPosition(pos,grid);
}

//盤面の指定した位置に配置した際、裏返せる石があれば全て裏返します。
function FindTurn(table,stone,at)
{
    DIRECTIONS.forEach(function(d,i)
    {
        var pos = Copy(at);
        var IsDiff = false;
        var IsSame = false;
        while(true)
        {
            var current = GetStoneAt(table,pos);
            //PrintString("Pos");
            //PrintString(pos.GetString());
            if(current == NONE) break;
            else if(current == stone)
            {
                IsSame = true;
                break;
            }
            else if(current != stone) IsDiff = true;
            if(IsBoundAtDirection(pos,d)) break;
            Add(pos,d);
            //PrintString("Add:");
            //PrintString(pos.GetString());
        }
        //PrintString(IsDiff);
        if(IsSame && IsDiff)
        {
            var current = Copy(pos);
            while(true)
            {
                PutStone(table,current,stone);
                if(Equal(current,pos)) break;
                Add(current,d);
            }
        }
    })
}

//盤面上で指定した色の石が配置可能な位置を探します。配置可能な位置のリストを返します。
function FindPuttables(table,stone)
{
    var puttables = [];
    for(var y = 0;y < GRID;y++)
    {
        for(var x = 0;x < GRID;x++)
        {

        }
    }
}

function display_clicked(e)
{
    ClearDisplay(W,H);
    var rect = e.target.getBoundingClientRect();
    //display.fillRect(e.clientX-rect.left,e.clientY-rect.top,10,10);
    //var GridPos = GetCursorGridPos(String(e.clientX-rect.left),String(e.clientY-rect.top),10,10);
    var cursor_pos = new Vector2D(e.clientX-rect.left,e.clientY-rect.top);
    var gridpos = GetCursorGridPos(cursor_pos,8,W,H);
    
    //display.fillText(String(cursor_pos.x),10,10);
    //display.fillText(String(cursor_pos.y),10,20);

    PutStone(Table,gridpos,STONE_BLACK);
    PrintString(gridpos.GetString());

    FindTurn(Table,STONE_BLACK,gridpos);
    On_draw();
    //PrintString("Pos");
    //PrintString(cursor_pos.GetString());

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

On_draw();