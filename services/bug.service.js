import fs from 'fs'

import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save,
    getEmptyBug,
    getTotalCount
}

const bugs = utilService.readJsonFile('data/bug.json')

const BUGS_PER_PAGE = 4
let totalPages = null

function query(filter, sort, page) {

    let filteredBugs = bugs
    // FILTER
    if (filter.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filter.minSeverity)
    }

    if (filter.txt) {
        const regex = new RegExp(filter.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regex.test(bug.title)
            || regex.test(bug.description)
            || bug.labels.some(label => regex.test(label)))
    }

    if (sort.sortBy) {
        ['severity', 'createdAt'].includes(sort.sortBy)
            ? filteredBugs.sort((a, b) =>
                (a[sort.sortBy] - b[sort.sortBy]) * sort.sortDir)
            : filteredBugs.sort((a, b) =>
                a[sort.sortBy].localeCompare(b[sort.sortBy] * sort.sortDir))

    }


    totalPages = Math.floor(filteredBugs.length / BUGS_PER_PAGE)
    let pageIdx = page.pageIdx

    if (pageIdx < 0) pageIdx = totalPages - 1
    if (pageIdx >= totalPages) pageIdx = 0

    let startIdx = pageIdx * BUGS_PER_PAGE
    const endIdx = startIdx + BUGS_PER_PAGE

    filteredBugs = filteredBugs.slice(startIdx, endIdx)



    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug not found!')
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    console.log('bug: ', bug)
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        // bug.createdAt=bugs[idx].createdAt
        bugs[idx] = { ...bugs[idx], ...bug }
        // bugs[idx] = bug 
    } else {
        bug._id = utilService.makeId()
        // bug.createdAt = Date.now()
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to bugs file', err)
                return reject(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}

function getTotalCount(){
    return Promise.resolve(totalPages)
}

function getEmptyBug({ title, description, severity, labels }) {
    return {

        title: title || '',
        description: description || '',
        severity: severity || '',
        createdAt: Date.now(),
        labels: labels || []
    }

}

