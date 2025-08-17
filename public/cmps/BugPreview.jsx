
export function BugPreview({ bug, idx }) {
    
    const imgSrc = `/assets/img/bugs/bug${idx % 9 + 1}.jpg`
    return (
        <section className="bug-preview">
            <h4>{bug.title}</h4>
            <img src={imgSrc} alt={`Bug ${idx % 9 + 1}`} />
            <p>
                Severity: <span>{bug.severity}</span>
            </p>
            <p>
                Owner: <span>{bug.creator.fullname}</span>
            </p>
            <p>
                {new Date(bug.createdAt).toLocaleDateString('he')}
            </p>
        </section>
    )
}
