function consoleLogObject(obj, message = ""){
    if(message) console.log(message, JSON.stringify(obj))
    else console.log(JSON.stringify(obj))
}

export { consoleLogObject }