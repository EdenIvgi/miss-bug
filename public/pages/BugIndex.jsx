const { useState, useEffect } = React
const { Link, useNavigate } = ReactRouterDOM

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { BugSort } from '../cmps/BugSort.jsx'
import { bugService } from '../services/bug.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [sortBy, setSortBy] = useState({ type: '', desc: 1 })
    const [maxPage, setMaxPage] = useState(null)

    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy])

    function loadBugs() {
        bugService.query(filterBy, sortBy)
            .then(({ bugs, maxPage }) => {
                setBugs(bugs)
                setMaxPage(maxPage)
            })
            .catch(err => {
                console.log('Cannot load bugs:', err)
                showErrorMsg('Cannot load bugs')
            })
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Successfully!')
                setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('from remove bug', err)
                showErrorMsg('Cannot remove bug')
            })
    }


    function onSetSort(sortBy) {
        setSortBy(prevSort => ({ ...prevSort, ...sortBy }))
    }

    function onChangePageIdx(diff) {
        setFilterBy(prevFilter => {
            let newPageIdx = prevFilter.pageIdx + diff
            if (newPageIdx < 0) newPageIdx = 0
            if (newPageIdx >= maxPage) newPageIdx = maxPage - 1
            return { ...prevFilter, pageIdx: newPageIdx }
        })
    }

    function onDownloadBudsPdf() {
        bugService.downloadBudsPdf().then(() => {
            showSuccessMsg(`Bugs PDF download!`)
        })
    }

    return (
        <section className="main-layout">
            <BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
            <BugSort onSetSort={onSetSort} sortBy={sortBy} />
            <Link to="/bug/edit" className="btn">
                Add Bug ⛐
            </Link>
            <button className="btn-download" onClick={onDownloadBudsPdf}>
                Download PDF
            </button>

            <BugList pageIdx={filterBy.pageIdx} bugs={bugs} onRemoveBug={onRemoveBug} />
            <div className="paging flex">
                <button
                    className="btn"
                    onClick={() => onChangePageIdx(-1)}
                >
                    Previous
                </button>
                <span>{filterBy.pageIdx + 1}</span>
                <button
                    className="btn"
                    onClick={() => onChangePageIdx(1)}
                >
                    Next
                </button>
            </div>
        </section>
    )
}
