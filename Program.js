/**2次元の数値を表すクラス */
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

/**RGBの色情報を表すクラス */
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
var STONERADIUS_DEBUG = (W/8)/2 - 15;
const GRID = 8;
const NONE = 0;
const STONE_WHITE = 1;
const STONE_BLACK = 2;
const NAME_WHITE = "WHITE";
const NAME_BLACK = "BLACK";
const RADIOBUTTON_PLAYERSTONE = "RB_PlayerStone";
const CB_ISAUTOENEMY = "CB_IsAutoEnemy";
const T_CURRENTTURN = "T_CurrentTurn";

var COLOR_WHITE = new COLORRGB(200,200,200);
var COLOR_BLACK = new COLORRGB(60,60,60);
var COLOR_GRID = new COLORRGB(0,0,0);

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

const IsDebug = true;
var NoobMode = false;
var IsAutoEnemy = false;
var Locked = false;
var Player = STONE_BLACK;
var Other = STONE_WHITE;
var CurrentTurn = Player;

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

var White_Puttables = [];
var Black_Puttables = [];

/**左上部に文字列を出力します。 */
function PrintString(text)
{
    Texts.push(String(text));
    On_Reload();
}

/**指定した引数からベクトルクラスを返します。 */
function MakeVector(x,y)
{
    var v = new Vector2D(x,y);
    return v;
}

/**RGB値からカラーを作成します。 */
function MakeColor(r,g,b)
{
    var color = new COLORRGB(r,g,b);
    return color;
}

/**指定したベクトルが盤面上で有効かどうかを返します。 */
function IsValid(v,grid=8)
{
    if(v.x < 0 || v.x >= grid) return false;
    else if(v.y < 0 || v.y >= grid) return false;
    return true;
}

/**v1の要素をv2にコピーします。 */
function Copy(v1,v2)
{
    v2.x = v1.x;
    v2.y = v1.y;
}

/**指定したベクタのコピーを返します。 */
function Copy(v)
{
    var vec = new Vector2D(v.x,v.y);
    return vec;
}

/**それぞれが等しいかどうかを返します。 */
function Equal(v1,v2)
{
    return (v1.x == v2.x && v1.y == v2.y);
}

/**vec1にvec2の値をそれぞれ加算します。 */
function Add(vec1,vec2)
{
    vec1.x += vec2.x;
    vec1.y += vec2.y;
}

/**指定した石のカラーコードを返します */
function GetStoneColor(stone)
{
    if(stone == STONE_BLACK) return COLOR_BLACK;
    return COLOR_WHITE;
}

/**指定した石の名称を返します */
function GetStoneName(stone)
{
    if(stone == STONE_BLACK) return NAME_BLACK;
    return NAME_WHITE;
}

/**盤面から指定した位置の石を取得します。 */
function GetStoneAt(table,pos)
{
    return table[pos.y][pos.x];
}

/**プレイヤーの石や対戦モードの設定を決定し試合を開始します。 */
function Start()
{
    if(!Locked)
    {
        Locked = true;
        SetAllDisabled(RADIOBUTTON_PLAYERSTONE,true);
        SetAllDisabled(CB_ISAUTOENEMY,true);
    }
}

/**指定したグリッド数で描画します。 */
function drawgrid(grids,color=MakeColor(0,0,0))
{
    //display.fillRect(1,1,10,10);
    var dw = W / grids;
    var dh = H / grids;
    //display.fillText(grids.toString(),10,10);
    display.beginPath();
    display.strokeStyle = color.GetColor();
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

/**円を描画します。 */
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

/**盤面にリスト内全ての位置に配置可能を示す石を配置します。 */
function DrawGuides(list_pos,stone_color)
{
    list_pos.forEach(function(pos,i)
    {
        var xy = GetPosFromGridPos(pos,GRID,W,H);
        DrawCirc(xy.x,xy.y,STONERADIUS_DEBUG,stone_color,false);
    });
}

//指定した石で配置可能な場所を示す表示を描画させます。
function ShowGuides(stone)
{
    var puttables = FindPuttables(Table,stone);
    DrawGuides(puttables,GetStoneColor(stone));
}

/**現在のターンである石の名前を表示させます */
function ShowCurrentTurn(name)
{
    var txt = document.getElementById(T_CURRENTTURN);
    txt.innerText = name;
}

/**盤面データから石を描画します。 */
function DrawStones(table,grid)
{
    display.beginPath();
    for(var h = 0;h < grid;h++)
    {
        for(var w = 0;w < grid;w++)
        {
           var pos = GetPosFromGridPos(MakeVector(w,h),grid,W,H);
           if(table[h][w] == STONE_WHITE)
           {
                DrawCirc(pos.x,pos.y,STONERADIUS,COLOR_WHITE);
           }
           else if(table[h][w] == STONE_BLACK)
           {
                DrawCirc(pos.x,pos.y,STONERADIUS,COLOR_BLACK);
           }
        }
    }
}

/**初期化処理*/
function On_Initialize()
{
    //Player = GetSelectedValue(RADIOBUTTON_PLAYERSTONE);
    //Other = SwitchStone(Player);
    Player = GetPlayerStone(RADIOBUTTON_PLAYERSTONE);
    Other = SwitchStone(Player);
    CurrentTurn = GetPlayerStone(RADIOBUTTON_PLAYERSTONE);
}

/**画面を全消去します。*/
function ClearDisplay(w,h)
{
    display.clearRect(0,0,w,h);
}

/**画面が描画される際に呼ばれます */
function On_draw()
{
    drawgrid(GRID,COLOR_GRID);
    DrawStones(Table,GRID);
    ShowCurrentTurn(GetStoneName(CurrentTurn));
    if(IsDebug || NoobMode)
    {
        ShowGuides(CurrentTurn);
    }
    Texts.forEach(function(item,i)
    {
        display.fillText(String(item),10,Texts_H*i+10);
        //display.fillText(String(Texts_H*i),10,10);
    });
}

/**更新される際に呼ばれます。 */
function On_Reload()
{
    ClearDisplay(W,H);
    On_draw();
}

/**指定した場所に石を打ちます。 */
function PutStone(table,at,newstone)
{
    table[at.y][at.x] = newstone;
    On_Reload();
}

/**グリッド位置を取得します。 */
function GetCursorGridPos(x,y,grid,w,h)
{
    var dw = w / grid;
    var dh = h / grid;

    var pos = new Vector2D(0,0);
    pos.x = Math.floor(x / dw);
    pos.y = Math.floor(y / dh);
    return pos;
}

/**グリッド位置を取得します。 */
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

/**グリッド位置からディスプレイの絶対位置を取得します。 */
function GetPosFromGridPos(gridpos,grid,w,h)
{
    var dw = w / grid;
    var dh = h / grid;
    var x = dw * gridpos.x + (dw / 2);
    var y = dh * gridpos.y + (dh / 2);

    return MakeVector(x,y);
}

/**複数の要素の無効化を設定します。 */
function SetAllDisabled(name,disable)
{
    var el = document.getElementsByName(name);
    for(var e of el)
    {
        e.disabled = disable;
    }
}

/**指定した石の色の反対色の石を返します。 */
function SwitchStone(current_stone)
{
    if(current_stone == STONE_BLACK) return STONE_WHITE;
    return STONE_BLACK;
}

/**指定したラジオボタン要素で選択されている値を返します。 */
function GetSelectedValue(name)
{
    var el = document.getElementsByName(name);
    for(var i of el)
    {
        if(i.checked) return i.value;
    }
    return "";
}

/**プレイヤーの石選択で選択されている石を取得します。 */
function GetPlayerStone(name)
{
    if(GetSelectedValue(name) == NAME_BLACK) return STONE_BLACK;
    return STONE_WHITE;
}

/**指定した位置が境界線外かどうかを返します。 */
function IsBoundAtPosition(pos,grid=8)
{
    if(pos.x < 0 || pos.x >= grid) return true;
    else if(pos.y < 0 || pos.y >= grid) return true;
    return false;
}

/**指定した位置から指定した方向が境界線外かどうかを返します。 */
function IsBoundAtDirection(pos,direction,grid=8)
{
    var current = Copy(pos);
    Add(current,direction);
    return IsBoundAtPosition(current,grid);
}

/**盤面に指定した位置に石を置いた場合、裏返す事ができるかどうかを返します。 */
function IsTurnable(table,stone,at)
{
    for(let d of DIRECTIONS)
    {
        var pos = Copy(at);
        var IsDiff = false;
        var IsSame = false;
        while(true)
        {
            if(IsBoundAtDirection(pos,d)) break;
            Add(pos,d);
            var current = GetStoneAt(table,pos);
            if(current == NONE) break;
            else if(current == stone)
            {
                IsSame = true;
                break;
            }
            else if(current != stone) IsDiff = true;
        }
        if(IsSame && IsDiff) return true;
    }
    return false;
}

/**盤面の指定した位置に配置した際、裏返せる石があれば全て裏返します。 */
function FindTurn(table,stone,at)
{
    DIRECTIONS.forEach(function(d,i)
    {
        var pos = Copy(at);
        var IsDiff = false;
        var IsSame = false;
        while(true)
        {
            if(IsBoundAtDirection(pos,d)) break;
            Add(pos,d);
            var current = GetStoneAt(table,pos);
            if(current == NONE) break;
            else if(current == stone)
            {
                IsSame = true;
                break;
            }
            else if(current != stone) IsDiff = true;
        }
        if(IsSame && IsDiff)
        {
            var current = Copy(at);
            while(true)
            {
                PutStone(table,current,stone);
                if(Equal(current,pos)) break;
                Add(current,d);
            }
        }
    })
}

/**盤面上で指定した色の石が配置可能な位置を探します。配置可能な位置のリストを返します。 */
function FindPuttables(table,stone)
{
    var puttables = [];
    for(var y = 0;y < GRID;y++)
    {
        for(var x = 0;x < GRID;x++)
        {
            var current = MakeVector(x,y);
            if(GetStoneAt(table,current) != NONE) continue;
            if(IsTurnable(table,stone,current)) puttables.push(current);
        }
    }

    return puttables;
}

/**石が置かれた際に呼ばれます。 */
function On_PutStone(put_stone,at)
{
    PutStone(Table,at,put_stone);
    if(IsDebug)
    {
        PrintString(at.GetString());
    }
    FindTurn(Table,CurrentTurn,at);
    CurrentTurn = SwitchStone(CurrentTurn);
}

/**Canvas内をクリックされた時 */
function display_clicked(e)
{
    Start();
    ClearDisplay(W,H);
    var rect = e.target.getBoundingClientRect();
    var cursor_pos = new Vector2D(e.clientX-rect.left,e.clientY-rect.top);
    var gridpos = GetCursorGridPos(cursor_pos,8,W,H);
    //On_PutStone(CurrentTurn,gridpos);
    /*
    PutStone(Table,gridpos,STONE_WHITE);
    PrintString(gridpos.GetString());

    FindTurn(Table,STONE_WHITE,gridpos);
    PrintString(GetSelectedValue("player_stone"));
    */
    
    PutStone(Table,gridpos,CurrentTurn);
    if(IsDebug)
    {
        PrintString(gridpos.GetString());
    }
    FindTurn(Table,CurrentTurn,gridpos);
    CurrentTurn = SwitchStone(CurrentTurn);
    On_draw();
}

function StoneColor_Clicked()
{
    Player = GetPlayerStone(RADIOBUTTON_PLAYERSTONE);
    Other = SwitchStone(Player);
    CurrentTurn = Player;
    On_Reload();
}

/**Resetボタンが押された時 */
function Reset_Clicked()
{
    document.location.reload();
}

function display_mousedown(e)
{
}

function display_mouseup(e)
{
}

canvas.addEventListener("click",display_clicked,false);
canvas.addEventListener("mousedown",display_mousedown,false);
canvas.addEventListener("mouseup",display_mouseup,false);

On_Initialize();
On_draw();