function saveToLS(key, value){
    const json = JSON.stringify(value)
    localStorage.setItem(key, json)
}

function loadFromLS(key){
    const json = localStorage.getItem(key)
    if(json === null) return null;
    const value = JSON.parse(json);
    return value;
}

export { saveToLS, loadFromLS }