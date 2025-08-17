const { Link, useParams } = ReactRouterDOM
const { useState, useEffect } = React
import { bugService } from '../services/bug.service.js'

export function BugDetails() {
    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        loadBug()
    }, [])

    function loadBug() {
        bugService.getById(bugId)
            .then(setBug)
            .catch(err => {
                console.log('Error is:', err)
            })
    }

    if (!bug) return <div>Loading...</div>
    return (
        <div className="bug-details main-layout">
            <h1>Bug Details 🐛</h1>
            <h2>{bug.title}</h2>
            <h3 style={{ fontWeight: 'bolder' }}>
                Severity:{' '}
                <span className={'severity' + bug.severity}>{bug.severity}</span>
            </h3>
            <h3>
                {bug.labels.join(', ')}
            </h3>
            <h3>
                {new Date(bug.createdAt).toLocaleDateString('he')}
            </h3>
            <p>
                Description: <span>{bug.description}</span>
            </p>
            <Link to="/bug">Back to List</Link>
        </div>
    )
}
