window.onload = init;
var actual_JSON;
var arr = ["Ký hiệu", "Lớp", "Mã HP", "Phòng", "Sĩ số", "Số tiết", "Thứ", "Tiết bđ", "Tuần học", "Tên học phần", "Tín chỉ"];
// Json file
function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
// -----------------------------------------------------------------------------------
function init() {
    var searchicon = document.getElementsByClassName("fas")[0];
    var form = document.getElementById("form");
    form.addEventListener("keyup", Enterkey);
    searchicon.onclick = getuserInput;

    // json file
    loadJSON(function (response) {
        // Parse JSON string into object
        actual_JSON = JSON.parse(response);
        // console.log(actual_JSON[0].length)
    });
}

// Nhập = phím Enter
function Enterkey(e) {

    if (e.key === "Enter") {
        e.preventDefault();
        getuserInput();

        document.getElementById("form").onkeyup = null;
    }

}

// Kiểm tra mã hp có tồn tại hay không
function check(inputvalue) {
    for (let i = 0; i < actual_JSON.length; i++) {
        if (actual_JSON[i]["Mã HP"] == inputvalue.toUpperCase()) {
            return true;
        }
    }
    return false;
}

// Lấy input từ form
function getuserInput() {

    var form = document.getElementById("form");
    var inputvalue = form.value;
    form.value = "";
    if (!check(inputvalue)) {
        alert("Không tồn tại mã HP này");
    } else {
        var oldchild = document.getElementsByClassName("child");
        var buttonchild = document.getElementsByClassName("childbutton");
        var i=0;
        while (i<oldchild.length){
            oldchild[i].remove();
            
        }
        while (i<buttonchild.length){
            buttonchild[i].remove();
            
        }
        xuli(inputvalue);

    }
}


// Xử lí mã hp
function xuli(inputvalue) {

    for (let i = 0; i < actual_JSON.length; i++) {
        if (inputvalue.toUpperCase() == actual_JSON[i]["Mã HP"]) {
            themvaoDiv(i);
        }
    }
}

// Thêm học phần vào bảng
function themvaoDiv(vitri) {
    for (let i = 0; i < 11; i++) {
        let div = document.createElement("DIV");
        let text = document.createTextNode(actual_JSON[vitri][arr[i]]);
        div.appendChild(text);
        div.className = "child";
        document.getElementById("displayres").appendChild(div);
    }
    var button = document.createElement("BUTTON");
    var buttontext = document.createTextNode("Add");
    button.appendChild(buttontext);
    button.className="childbutton";
    document.getElementById("displayres").appendChild(button);
}
