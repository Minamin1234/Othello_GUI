//2�����̐��l��\���N���X�B
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

//RGB�̐F����\���N���X
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
var W = 600;
var H = 600;

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

//���㕔�ɕ�������o�͂��܂��B
function PrintString(text)
{
    Texts.push(String(text));
    On_Reload();
}

//�w�肵���O���b�h���ŕ`�悵�܂��B
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

//�~��`�悵�܂��B
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

//�Ֆʃf�[�^����΂�`�悵�܂��B
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
            if(Table[h][w] == STONE_WHITE)
            {
                DrawCirc(x,y,STONERADIUS,COLOR_WHITE);
            }
            else if(Table[h][w] == STONE_BLACK)
            {
                DrawCirc(x,y,STONERADIUS,COLOR_BLACK);
            }
        }
    }
}

//��ʂ�S�������܂��B
function ClearDisplay(w,h)
{
    display.clearRect(0,0,w,h);
}

//��ʂ��`�悳���ۂɌĂ΂�܂��B
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

//�X�V�����ۂɌĂ΂�܂��B
function On_Reload()
{
    ClearDisplay();
    On_draw();
}

//�w�肵���ꏊ�ɐ΂�ł��܂��B
function PutStone(table,at,newstone)
{
    table[at.y][at.x] = newstone;
    On_Reload();
}

//�O���b�h�ʒu���擾���܂��B
function GetCursorGridPos(x,y,grid,w,h)
{
    var dw = w / grid;
    var dh = h / grid;

    var pos = new Vector2D(0,0);
    pos.x = Math.floor(x / dw);
    pos.y = Math.floor(y / dh);
    return pos;
}

//�O���b�h�ʒu���擾���܂��B
function GetCursorGridPos(xy,grid,w,h)
{
    var dw = w / grid;
    var dh = h / grid;

    xy.x /= dw;
    xy.y /= dh;
    xy.x = Math.floor(xy.x);
    xy.y = Math.floor(xy.y);
    return xy;
}

function display_clicked(e)
{
    ClearDisplay(W,H);
    var rect = e.target.getBoundingClientRect();
    //display.fillRect(e.clientX-rect.left,e.clientY-rect.top,10,10);
    //var GridPos = GetCursorGridPos(String(e.clientX-rect.left),String(e.clientY-rect.top),10,10);
    var cursor_pos = new Vector2D(e.clientX-rect.left,e.clientY-rect.top);
    var gridpos = GetCursorGridPos(cursor_pos,8,W,H);
    display.fillText(String(cursor_pos.x),10,10);
    display.fillText(String(cursor_pos.y),10,20);
    On_draw();
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