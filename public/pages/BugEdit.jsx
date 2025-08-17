const { useState, useEffect } = React
const { useParams, useNavigate, useOutletContext } = ReactRouterDOM
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function BugEdit() {
    const { bugId } = useParams()
    const navigate = useNavigate()
    const [bug, setBug] = useState(bugService.getEmptyBug())

    useEffect(() => {
        if (bugId) {
            bugService.getById(bugId).then(setBug)
        }
    }, [bugId])


    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? +target.value : target.value
        setBug(prevBug => ({ ...prevBug, [field]: value }))
    }


    function onSaveBug(ev) {
        ev.preventDefault()
        if (!bug.title || !bug.severity) return
        bugService.save(bug)
            .then(savedBug => {
                showSuccessMsg('Bug Saved!')
            })
            .catch(err => {
                console.log('Cannot save bug', err)
                showErrorMsg('Cannot save bug')
            })
            .finally(() => navigate('/bug'))
    }



    // console.log('bug:', bug)
    return (
        <div className="backdrop" onClick={() => navigate('/bug')}>
            <div className="bug-edit" onClick={ev => ev.stopPropagation()}>
                <form onSubmit={onSaveBug}>
                    <h3>{bugId ? 'Edit Bug' : 'Add New Bug'}</h3>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={bug.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Severity:</label>
                        <input
                            type="number"
                            name="severity"
                            value={bug.severity}
                            onChange={handleChange}
                        />
                    </div>
                    <button className="btn" type="submit">
                        {bugId ? 'Update' : 'Add'}
                    </button>
                </form>
            </div>
        </div>
    )
}
