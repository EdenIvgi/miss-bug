const { useState, useEffect, useRef } = React
import { debounce } from '../services/util.service.js'
import { LabelSelector } from './LabelSelect.jsx'

export function BugFilter({ onSetFilter, filterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    
    const onSetFilterDebounce = useRef(debounce(onSetFilter, 400)).current

    const labels = ['critical', 'need-CR', 'dev-branch', 'famous', 'high']

    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? +target.value : target.value
        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            [field]: value,
        }))
    }

    function onLabelChange(selectedLabels) {

        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            labels: selectedLabels,
        }))
    }

    const { severity, txt, label } = filterByToEdit
    return (
        <form className="bug-filter">
            <section className='input-container'>
                <h3>Filter Bugs</h3>

                <input
                    className="filter-input"
                    type="text"
                    id="txt"
                    name="txt"
                    value={txt}
                    placeholder="Enter text here..."
                    onChange={handleChange}
                />
                <input
                    placeholder="Enter severity here.."
                    className="filter-input"
                    type="text"
                    id="severity"
                    name="severity"
                    value={severity}
                    onChange={handleChange}
                />
            </section>

            <LabelSelector labels={labels} onLabelChange={onLabelChange} />
        </form>
    )
}
