const BASE_URL = `/api/bug/`

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    downloadBudsPdf,
    getEmptyBug
}

function query(filterBy, sortBy) {
    const filterSortBy = { ...filterBy, ...sortBy }
    return axios.get(BASE_URL, { params: filterSortBy }).then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

function save(bug) {
    const method = bug._id ? 'put' : 'post'
    return axios[method](BASE_URL, bug).then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', severity: '', labels: '', pageIdx: 0 }
}


function getEmptyBug() {
    return { title: '', severity: '' }
}

function downloadBudsPdf() {
    return axios.get(BASE_URL + 'pdf').then(res => res.data)
}
