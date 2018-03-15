var log = function() {
    console.log.apply(console, arguments)
}

var listTextdo = function(textValue) {
    var t = `
    <div class='mie-list mie-do'>
        <input class='fuck' type='checkbox'>
        <p class='pt'>${textValue}</p>
        <button class='disc' class='todelete'>丢弃</button>
    </div>`
    return t
}

var listTextdone = function(textValue) {
    var t = `
    <div class='mie-list mie-done'>
        <input class='fuck' type='checkbox' checked='checked'>
        <p class='pt'>${textValue}</p>
        <button class='dele' class='todelete'>删除</button>
    </div>
    `
    return t
}

var listTextdele = function(textValue, classname) {
    var t = `
    <div class='mie-list mie-dele'>
        <span> </span>
        <p class='pt'>${textValue}</p>
        <button class='dele' class='todelete'>删除</button>
    </div>
    `
    return t
}

var appendListEnd = function(text, id) {
    var t = document.querySelector(id)
    t.insertAdjacentHTML('beforeEnd', text)
}

// 插入到正在进行后面
var appendTodoEnd = function(text) {
    appendListEnd(text, '#list-todo')
}

// 插入到已完成后面
var appendDoneEnd = function(text) {
    appendListEnd(text, '#list-done')
}

// 插入到垃圾桶后面
var appendDeleEnd = function(text) {
    appendListEnd(text, '#dele-list')
}

var scaler = function(id, sign) {
    var t = document.querySelector(id)
    if (sign == '+') {
        var index = Number(t.innerText) + 1
    }
    else {
        var index = Number(t.innerText) - 1
    }
    t.innerText = index
}

// 点击隐藏or显示
var addDisplay = function(id, disid) {
    var d = document.querySelector(id)
    d.addEventListener('click', function() {
        var c = document.querySelector(disid)
        var index = c.classList.length - 1
        if (c.classList[index] != "mie-yin") {
            c.classList.add("mie-yin")
        }
        else {
            c.classList.remove("mie-yin")
        }
    })
}

// 给logo添加个点击提交功能
var addKomoInput = function() {
    var t = document.querySelector('#title')
    t.addEventListener('click', function(event) {
        komo = document.querySelector('#text')
        value = komo.value
        if (value.length > 0) {
            var text = listTextdo(value)
            appendTodoEnd(text)
            scaler('#todo', '+')
            komo.value = ''
            saveJson()
        }
    })
}

// 给text一个回车提交功能
var addTextInput = function() {
    var t = document.querySelector('#text')
    t.addEventListener('keydown', function(event) {
        code = event.code
        value = event.target.value
        if (code == 'Enter' && value.length > 0) {
            var text = listTextdo(value)
            appendTodoEnd(text)
            scaler('#todo', '+')
            event.target.value = ''
            saveJson()
        }
    })
}

var ifDoneOrDo = function(clalt) {
    //判断处于什么状态
    if (clalt[1] == 'mie-do') {
        return true
    }
    else if(clalt[1] == 'mie-done') {
        return false
    }
}


// 事件委托
var addEventMie = function() {
    var t = document.querySelector('#my-list')
    t.addEventListener('click', function(event) {
        var target = event.target
        var n = target.className
        var p = target.parentElement
        if (n == 'fuck') {
            var clalt = p.classList
            if (ifDoneOrDo(clalt)) {
                var p_text = '<del>' + p.children[1].innerHTML + '</del>'
                var pdone = listTextdone(p_text)
                appendDoneEnd(pdone)
                scaler('#todo', '-')
                scaler('#done', '+')
            }
            else {
                var p_text = p.children[1].innerText
                var ptodo = listTextdo(p_text)
                appendTodoEnd(ptodo)
                scaler('#todo', '+')
                scaler('#done', '-')
            }
            p.remove()
            saveJson()
        }
        else if(n == 'dele') {
            c_n = p.classList[1]
            if (c_n == 'mie-done') {
                scaler('#done', '-')
            }
            else {
                scaler('#dele', '-')
            }
            p.remove()
            saveJson()
        }
        else if(n == 'disc') {
            var p_text = p.children[1].innerHTML
            var pdone = listTextdele(p_text)
            appendDeleEnd(pdone)
            scaler('#todo', '-')
            scaler('#dele', '+')
            p.remove()
            saveJson()
        }
    })
}

var elist = function(classname, lt) {
    var l = document.querySelectorAll(classname)
    for (var i = 0; i < l.length; i++) {
        lt.push(l[i].childNodes[3].innerHTML)
    }
}

var giveNumber = function(id, lt, index){
    var n = document.querySelector(id)
    lt[index] = n.innerText
}

var returnTexts = function() {
    var o = {
        lt_do : [],
        lt_done : [],
        lt_dele : [],
        lt_index : [0, 0, 0,],
        bol : false,
    }
    elist('.mie-do', o.lt_do)
    elist('.mie-done', o.lt_done)
    elist('.mie-dele', o.lt_dele)
    //do
    giveNumber("#todo", o.lt_index, 0)
    giveNumber("#done", o.lt_index, 1)
    giveNumber("#dele", o.lt_index, 2)
    return o
}

var saveJson = function() {
    var lt_do = JSON.stringify(returnTexts())
    localStorage.texts = lt_do
}

var loadTexts = function(t, textfun, apfun) {
    for (var i = 0; i < t.length; i++) {
        var text = textfun(t[i])
        apfun(text)
    }
}

var loadJson = function() {
    if (localStorage.texts){
        var lt = JSON.parse(localStorage.texts)
        loadTexts(lt.lt_do, listTextdo, appendTodoEnd)
        loadTexts(lt.lt_done, listTextdone, appendDoneEnd)
        loadTexts(lt.lt_dele, listTextdele, appendDeleEnd)
        //取出Index
        document.querySelector('#todo').innerText = lt.lt_index[0]
        document.querySelector('#done').innerText = lt.lt_index[1]
        document.querySelector('#dele').innerText = lt.lt_index[2]
    }
}

var addDisclass = function() {
    addDisplay('#todo', '#list-todo')
    addDisplay('#done', '#list-done')
    addDisplay('#dele', '#dele-list')

}

var main = function() {
    loadJson()
    addKomoInput()
    addTextInput()
    addEventMie()
    addDisclass()
}

main()
