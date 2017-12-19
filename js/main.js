// See the following on using objects as key/value dictionaries
// https://stackoverflow.com/questions/1208222/how-to-do-associative-array-hashing-in-javascript
var words = {};
words["+"] = add
words["-"] = sub
words["*"] = mult
words["/"] = div
words["nip"] = nip
words["swap"] = swap
words["over"] = over
words["."] = dot
words["circle"] = circle
var user = {};
/** 
 * Your thoughtful comment here.
 */

function Stack(){
    this.size = 0;
    this.stack = {};
    //console.log(this.stack);
}

Stack.prototype.push = function(value){
    this.stack[this.size] = value;
    this.size++;
}

Stack.prototype.pop = function(){
    var top = this.stack[this.size-1];
    var s = this.size-1;
    delete this.stack[s.toString()];
    this.size--;
    return top;
}

function ObservableStack(){
    this.observer = [];
    
    //Object.create(Stack);
    //new Stack();
}
ObservableStack.prototype = new Stack();
//Object.create(Stack.prototype);
//new Stack();
//Object.create(Stack.prototype)
//new Stack();
//var stack1 = new Stack();
ObservableStack.prototype.registerObserver = function(fn){
    this.observer.push(fn);
}

ObservableStack.prototype.notifyObserver = function(){
    this.observer.forEach(function(fn){
        fn(this.stack);
    }, this);
}
//ObservableStack.prototype = new Stack();
ObservableStack.prototype.push = function(value){
    Stack.prototype.push.call(this, value);
    ObservableStack.prototype.notifyObserver.call(this);

}

ObservableStack.prototype.pop = function(){
    var top = Stack.prototype.pop.call(this);

   ObservableStack.prototype.notifyObserver.call(this);
   return top;
}


function emptyStack(stack) {
    for(var i = Object.keys(stack).length-1; i >= 0; i--){
        stack.pop();
    }
    //while(Object.keys(stack).length > 0) { stack.pop(); }
    /*for(var i = Object.keys(stack).length-1; i >= 0; i--){
        delete stack[i];
    }*/
    console.log(stack);
    
}


function circle(stack)
  {
var canvas = document.getElementById('circle');
//if (canvas.getContext)
//{
var ctx = canvas.getContext('2d'); 
var y =  stack.pop();
var x = stack.pop();
var r = stack.pop();
ctx.canvas.height = Math.max(y,x,r)*3;
ctx.canvas.width =  Math.max(y,x,r)*3;
ctx.beginPath();
ctx.arc(x, y, r, 0, 2 * Math.PI, false);
ctx.lineWidth = 3;
ctx.strokeStyle = '#FF0000';
ctx.stroke();
//}
}
/**
 * Print a string out to the terminal, and update its scroll to the
 * bottom of the screen. You should call this so the screen is
 * properly scrolled.
 * @param {Terminal} terminal - The `terminal` object to write to
 * @param {string}   msg      - The message to print to the terminal
 */
function print(terminal, msg) {
    terminal.print(msg);
    $("#terminal").scrollTop($('#terminal')[0].scrollHeight + 40);
}
function add(stack){
	var first = stack.pop();
    console.log("first " + first);
        var second = stack.pop();
        var plus = first + second;
        stack.push(plus);
}

function dot(stack){
    stack.pop();
}
function sub(stack){
	var first = stack.pop();
        var second = stack.pop();
        stack.push(second-first);
}

function mult(stack){
	var first = stack.pop();
        var second = stack.pop();
        stack.push(first*second);
}

function div(stack){
	var first = stack.pop();
        var second = stack.pop();
        stack.push(first/second);
}

//w1 w2 – w2
function nip(stack){
        var first = stack.pop();
        var second = stack.pop();
        stack.push(first);
}

function swap(stack){
        var first = stack.pop();
        var second = stack.pop();
        stack.push(second);
	stack.push(first);
}

function over(stack){
        var first = stack.pop();
        var second = stack.pop();
        stack.push(second);
	stack.push(first);
	stack.push(second);
}
/** 
 * Sync up the HTML with the stack in memory
 * @param {Array[Number]} The stack to render
 */
function renderStack(stack) {
    $("#thestack").empty();
    console.log("this is the length of the stack in renderStack" + stack.length);
    for(var i = Object.keys(stack).length-1; i >= 0; i--){
   // for(var key in stack){
        $("#thestack").append("<tr><td>" + stack[i] + "</td></tr>");
    }
    
    /*stack.slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });*/
};

/** 
 * Process a user input, update the stack accordingly, write a
 * response out to some terminal.
 * @param {Array[Number]} stack - The stack to work on
 * @param {string} input - The string the user typed
 * @param {Terminal} terminal - The terminal object
 */
function process(stack, input, terminal) {
    // The user typed a number
    var inputarray = input.trim().split(/ +/)
    for(var i = 0; i < inputarray.length; i++){
    if (!(isNaN(Number(inputarray[i])))) {
        print(terminal,"pushing " + Number(inputarray[i]));
        stack.push(Number(inputarray[i]));
    } else if (inputarray[i] === ".s") {
        print(terminal, " <" + stack.length + "> " + stack.slice().join(" "));
    } else if(inputarray[i] in words){
        words[inputarray[i]](stack);
    } else if(inputarray[i] == ":"){
        i++;
        var name = inputarray[i];
        i++;
        var userstr = "";
        while(inputarray[i] != ";"){
            userstr += inputarray[i] + " ";
            i++;
        }
        user[name] = userstr;
        userbutton(stack, name, terminal);
    } else if(inputarray[i] in user){
        
        //userbutton(inputarray[i]);
        process(stack, user[inputarray[i]], terminal);
    }
    /*else if (input === "+") {
        var first = stack.pop();
        var second = stack.pop();
        stack.push(first+second);
    } */
    else {
        print(terminal, ":-( Unrecognized input");
    }
    //renderStack(stack);
    console.log("this is the stack" + " " + stack);
}
};

function runRepl(terminal, stack) {
    terminal.input("Type a forth command:", function(line) {
        print(terminal, "User typed in: " + line);
        process(stack, line, terminal);
        
        runRepl(terminal, stack, user);
    });
};
function createbutton(stack, key, terminal){
    return $('<button/>', {
        text: key,
        id: 'btn_'+key,
        click: function(){process(stack, key, terminal); runRepl(terminal , stack);},
        'class':'btn btn-danger'
    });
}
function userbutton(stack, key, terminal){
     var button='<button class="btn btn-primary">'+createbutton(stack, key, terminal) + '</button>';
     
     $("#user-defined-funcs").append(createbutton(stack, key, terminal));

     //$("#user-defined-funcs").append('<br></br>');

}
// Whenever the page is finished loading, call this function. 
// See: https://learn.jquery.com/using-jquery-core/document-ready/

$(document).ready(function() {
    var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);
    var stack2 = new ObservableStack();
    stack2.registerObserver(renderStack);
    console.log(stack2.size);
    console.log(stack2.stack);
    
    // Find the "terminal" object and change it to add the HTML that
    // represents the terminal to the end of it.
    $("#terminal").append(terminal.html);

    //var stack = [];
    //var user = {};
    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");

    runRepl(terminal, stack2);
$('#reset').click(function(){
   //      emptyStack(stack);
//while(stack.length > 0) { stack.pop(); }
emptyStack(stack2);
//renderStack(stack);
$("#thestack").append("<tr><td>" + "empty" + "</td></tr>");
});
//circle();
//userbutton(user);
//var $something = $('<input/>').attr({ type: 'button', name:'btn1', value:'am button', click: function(){process(stack, '+', terminal)}});
//$("#user-defined-funcs").append($something);
//var $something;


//$("#thestack").append("<tr><td>" + "empty" + "</td></tr>");
//emptyStack(stack);
});
