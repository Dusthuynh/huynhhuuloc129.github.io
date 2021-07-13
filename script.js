window.onload = init;
var actual_JSON;
var count = 0;
const arr = ["Ký hiệu", "Lớp", "Mã HP", "Phòng", "Sĩ số", "Số tiết", "Thứ", "Tiết bđ", "Tuần học", "Tên học phần", "Tín chỉ"];
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
        var i = 0;
        count = 0;
        while (i < oldchild.length) {
            oldchild[i].remove();

        }
        while (i < buttonchild.length) {
            buttonchild[i].remove();

        }
        xuli(inputvalue);

    }
}


// Xử lí mã hp lấy từ form
function xuli(inputvalue) {
    count = 0;
    for (let i = 0; i < actual_JSON.length; i++) {
        if (inputvalue.toUpperCase() == actual_JSON[i]["Mã HP"]) {
            count++;
            themvaoDiv(i);
        }
    }
    // Check coi có học phần nào đã add không
    for (let i = 2; i <= 8; i++) {
        var ma = checkhp("t" + i, inputvalue.toUpperCase());
        if (ma != null) {
            var malop = ma.slice(ma.indexOf(" ") + 1, ma.length);
            var childlist = document.getElementsByClassName("child");
            var buttonlist = document.getElementsByClassName("childbutton");
            for (let j = 0; j < buttonlist.length; j++) {
                if (childlist[1 + 11 * j].innerHTML == malop) {
                    buttonlist[j].innerHTML="Delete";
                    buttonlist[j].style.background="grey";
                }
            }
        }
    }
}

// Thêm học phần vào bảng
function themvaoDiv(vitri) {
    for (let i = 0; i < 11; i++) {
        let div = document.createElement("DIV");
        let text = document.createTextNode(actual_JSON[vitri][arr[i]]);
        div.appendChild(text);
        div.className = "child child" + count;
        document.getElementById("displayres").appendChild(div);
    }
    var button = document.createElement("BUTTON");
    var buttontext = document.createTextNode("Add");
    button.appendChild(buttontext);
    button.className = "childbutton childbutton" + count;
    document.getElementById("displayres").appendChild(button);
    buttonclick();
}


// Click vào button
function buttonclick() {
    const buttonlist = document.getElementsByClassName("childbutton");
    for (let i = 0; i < buttonlist.length; i++) {
        buttonlist[i].onclick = xulibutton;
    }
}
function xulibutton() {
    const childlist = document.getElementsByClassName("child");
    const buttonclicked = this;
    var classname = this.className;
    var i = classname.match(/(\d+)/)[0];
    if (buttonclicked.innerHTML == "Add") {
        buttonclicked.innerHTML = "Delete";
        buttonclicked.style.background = "Grey";
        let sotiet = parseInt(childlist[5 + 11 * (i - 1)].innerHTML);
        let thu = parseInt(childlist[6 + 11 * (i - 1)].innerHTML);
        let tietbd = parseInt(childlist[7 + 11 * (i - 1)].innerHTML);
        let mahp = childlist[2 + 11 * (i - 1)].innerHTML;
        let tenlop = childlist[1 + 11 * (i - 1)].innerHTML;
        themvaoTKB(thu, sotiet, tietbd, mahp, tenlop);
    } else {
        let tenlop = childlist[1 + 11 * (i - 1)].innerHTML;
        buttonclicked.innerHTML = "Add";
        buttonclicked.style.background = "None";
        xoakhoiTKB(tenlop);
    }
}


// Them vào tkb khi ấn add
function themvaoTKB(thu, sotiet, tietbd, mahp, tenlop) {
    var thulist = document.getElementsByClassName("t" + thu);
    for (let i = tietbd; i < tietbd + sotiet; i++) {
        if (tietbd < 6)
            thulist[i - 1].innerHTML = mahp + " " + tenlop;
        else thulist[i].innerHTML = mahp + " " + tenlop;
    }
}


// Xóa khỏi tkb khi ấn delete
function xoa(thu, tenlop) {
    var thulist = document.getElementsByClassName(thu);
    for (let i = 0; i < thulist.length; i++) {
        if (thulist[i].innerHTML.indexOf(tenlop) >= 0) {
            thulist[i].innerHTML = "";
        }
    }
}
function xoakhoiTKB(tenlop) {
    for (let i = 2; i <= 8; i++) {
        xoa("t" + i, tenlop)
    }

}


// Kiểm tra môn đó có sẵn trong tkb ko 
function checkhp(thu, mahp) {
    var thulist = document.getElementsByClassName(thu);
    for (let i = 0; i < thulist.length; i++) {
        if (thulist[i].innerHTML.indexOf(mahp) >= 0) {
            return thulist[i].innerHTML;
        }
    }
    return null;
}
