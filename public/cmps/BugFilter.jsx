const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, minSeverity } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                <label htmlFor="sortBy">Sort By: </label>
                <select id="sortBy" name="sortBy" onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                    <option value="title">Title</option>
                    <option value="description">Description</option>
                </select>

                <label htmlFor="sortDir">Sort Direction: </label>
                <select id="sortDir" name="sortDir" onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="1">Ascending</option>
                    <option value="-1">Descending</option>
                </select>
            </form>
        </section>
    )
}