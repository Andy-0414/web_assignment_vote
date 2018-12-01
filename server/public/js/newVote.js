var contentList = document.getElementById('contentList');
var addList = document.getElementById('addList')

addList.addEventListener('click',()=>{
    contentList.appendChild(createVoteList())
})

function createVoteList(){
    var tr = document.createElement('tr')
    var td1 = document.createElement('td')
    td1.classList = "mdl-data-table__cell--non-numeric"
    var td2 = document.createElement('td')
    td2.classList = "mdl-data-table__cell--non-numeric"

    var input = document.createElement('div')
    input.classList = "mdl-textfield mdl-js-textfield voteList_text"
    var input_text = document.createElement('input')
    input_text.classList = "mdl-textfield__input"
    input_text.type = "text"
    input_text.name = "list"
    var input_label = document.createElement('label')
    input_label.classList = "mdl-textfield__label"
    input_label.innerHTML = "내용을 입력하세요"
    input.appendChild(input_text)
    input.appendChild(input_label)

    var c_button = document.createElement('button')
    c_button.type = "button"
    c_button.classList = "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
    var icon = document.createElement('i')
    icon.innerHTML = "clear"
    icon.classList = "deleteList material-icons"
    c_button.appendChild(icon)
    c_button.addEventListener('click',()=>{
        contentList.removeChild(tr)
    })

    componentHandler.upgradeElement(input);
    td1.appendChild(input)
    componentHandler.upgradeElement(c_button);
    td2.appendChild(c_button)
    
    tr.appendChild(td1)
    tr.appendChild(td2)

    return tr;
}