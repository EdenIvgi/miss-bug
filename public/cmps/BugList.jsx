import { authService } from '../services/auth.service.js'
import { BugPreview } from './BugPreview.jsx'
const { Link, useNavigate } = ReactRouterDOM

export function BugList({ bugs, onRemoveBug, pageIdx = 0 }) {
    const navigate = useNavigate()
    const loggedinUser = authService.getLoggedinUser()

    function isCreator(bug) {
        if (!loggedinUser) return false
        if (!bug.creator) return true
        return loggedinUser.isAdmin || bug.creator._id === loggedinUser._id
    }

    return (
        <section className="bug-list grid cards">
            {bugs.map((bug, idx) => (
                <article className="bug-preview card flex center column" key={bug._id}>
                    <BugPreview idx={bug.createdAt % 9 + 1} bug={bug} />
                    <div className="flex space-between">
                        {isCreator(bug) && <Link className="btn" to={`/bug/edit/${bug._id}`}>
                            Edit
                        </Link>}
                        {isCreator(bug) && <button className="btn" onClick={() => onRemoveBug(bug._id)}>
                            Delete
                        </button>}
                        <Link className="btn" to={`/bug/${bug._id}`}>
                            Details
                        </Link>
                    </div>
                </article>
            ))}
        </section>
    )
}
