function randomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function queryPaginationHandler(query){
    let page = (query.page !== undefined) ? Math.max(1, query.page) : 1
    let itemsPerPage = (query.itemsPerPage !== undefined) ? Math.max(1, query.itemsPerPage) : 5
    let sortBy = (query.sortBy !== undefined) ? {[query.sortBy]: (query.sortDesc === "true" ? 1 : -1)} : {"createdAt":-1}

    return {page,itemsPerPage,sortBy}
}

module.exports = {
    randomString,
    queryPaginationHandler
}