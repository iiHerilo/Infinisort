function canvas(id) {
    return document.getElementById(id).getContext('2d');
}

function text(id, txt) {
    document.getElementById(id).innerHTML = txt;
}

function setCurrentText(txt) {
    element(ID.current).innerHTML = txt;
}

function element(id) {
    return document.getElementById(id);
}