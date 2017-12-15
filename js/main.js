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
var user = {};
/** 
 * Your thoughtful comment here.
 */

function Stack(){
    this.size = 0;
    this.stack = {};
}

Stack.prototype.push = function(value){
    this.stack[this.count] = value;
    this.count++;
}

Stack.prototype.pop = function(){
    var top = this.stack[this.count];
    delete this.stack[this.count];
    this.count--;
    return top;
}

function emptyStack(stack) {
    while(stack.length > 0) { stack.pop(); }
    console.log(stack);
    
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
        var second = stack.pop();
        stack.push(first+second);
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
    stack.slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });
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
    renderStack(stack);
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

     $("#user-defined-funcs").append('<br></br>');

}
// Whenever the page is finished loading, call this function. 
// See: https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {
    var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);
    
    // Find the "terminal" object and change it to add the HTML that
    // represents the terminal to the end of it.
    $("#terminal").append(terminal.html);

    var stack = [];
    //var user = {};
    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");

    runRepl(terminal, stack);
$('#reset').click(function(){
   //      emptyStack(stack);
//while(stack.length > 0) { stack.pop(); }
emptyStack(stack);
renderStack(stack);
$("#thestack").append("<tr><td>" + "empty" + "</td></tr>");
});
//userbutton(user);
//var $something = $('<input/>').attr({ type: 'button', name:'btn1', value:'am button', click: function(){process(stack, '+', terminal)}});
//$("#user-defined-funcs").append($something);
//var $something;


//$("#thestack").append("<tr><td>" + "empty" + "</td></tr>");
//emptyStack(stack);
});
