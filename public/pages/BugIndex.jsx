const { useState, useEffect } = React

import { bugService } from '../services/bug.service.remote.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { use } from 'react'

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [totalCount, setTotalCount] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
        getTotalCount()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(setBugs)
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function getTotalCount() {
        bugService.getTotalBugs().then((count) => {
            const buttons = []
            buttons.length = count
            buttons.fill({ disabled: false }, 0, count)
            console.log('Total count:', buttons);

            setTotalCount(buttons)
        }).catch(err => showErrorMsg(`Couldn't get total count - ${err}`))

    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?', 'Bug ' + Date.now()),
            severity: +prompt('Bug severity?', 3),
            description: prompt('Bug description?')
        }

        bugService.save(bug)
            .then(savedBug => {
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const bugToSave = { ...bug, severity }

        debugger
        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onChangePage(idx) {
        setFilterBy(prevFilter => {
            return { ...prevFilter, pageIdx: idx }
        })
    }

    function onDownloadBugs() {
        window.open('http://localhost:3030/file/pdf', '_blank')
    }

    return <section className="bug-index main-content">

        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <header>
            <h3>Bug List</h3>
            <button onClick={onAddBug}>Add Bug</button>
        </header>

        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
            onEditBug={onEditBug} />

        <div>
            <button onClick={onDownloadBugs}>Download</button>
        </div>

        {totalCount && <footer>
            <div>
                {totalCount.map((btn, idx) => (
                    <button onClick={() => onChangePage(idx)}
                        key={idx} className={`page-btn ${btn.disabled ? 'disabled' : ''}`}>
                        {idx + 1}
                    </button>
                ))}
            </div>
        </footer>}
    </section>
}
