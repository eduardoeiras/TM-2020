var count = 0;
var index = 0;

function addImg(){
    var content = document.getElementById("contentImgs");
    var url = `https://placeimg.com/250/150/${index}`;

    var newNode = document.createElement("IMG");
    newNode.setAttribute("src",url);
    content.appendChild(newNode);
    count++;
    index++;
    updateLabel();


}

function Remove(){
    var indexToRemove = Math.floor(Math.random() * count);
    var content = document.getElementById("contentImgs");

    content.children[indexToRemove].remove();
    count --;
    updateLabel();
}

function updateLabel() {
    var labelCount = document.getElementById("countNumber");

    labelCount.innerHTML = "" + (count);
}