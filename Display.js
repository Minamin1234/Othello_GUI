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

class Display
{
    id;
    size;
    canvas;
    context;
    texts;
    text_y;
    constructor(id,size)
    {
        this.id = id;
        this.size = size;
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener("click",this.On_Clicked,false);
        this.canvas.addEventListener("mousedown",this.On_MouseDown,false);
        this.canvas.addEventListener("mouseup",this.On_MouseUp,false);
        this.On_draw();
        this.text_y = 10;
    }

    On_draw()
    {
        this.texts.forEach(i,idx => {
            alert(String(idx));
            this.context.fillText(i,0,this.text_y*idx);
        });
    }


    ClearDisplay()
    {
        this.canvas.clearRect(0,0,this.size.x,this.size.y);
    }

    Draw()
    {
        this.On_draw();
    }

    GetCursorPos(e)
    {

    }

    On_Clicked(e)
    {

    }

    On_MouseDown(e)
    {

    }

    On_MouseUp(e)
    {

    }
    
    PrintString(text)
    {
        
    }
}