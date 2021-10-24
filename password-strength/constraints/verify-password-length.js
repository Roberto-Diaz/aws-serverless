module.exports = password => {
    if(password < 6){
        return Promise.reject({
            message: 'El password es demasiado cordo'
        })
    }
    return Promise.resolve('El password pasa la validación');
}