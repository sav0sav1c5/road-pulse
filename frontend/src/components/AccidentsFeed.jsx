import { useState, useEffect } from 'react'
import { getAccidents, getStatsByDepartment, getStatsByType , getStatsByMunicipality } from '../api/accidents'

function AccidentsFeed() {
    const [accidents, setAccidents] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // State for filters
    const [filters, setFilters] = useState({
        department: '',
        accident_type: '',
        municipality: ''
    })

    // Dropdown options (load them once)
    const [departments, setDepartments] = useState([])
    const [accidentTypes, setAccidentTypes] = useState([])
    const [municipalities, setMunicipalities] = useState([])

    // Load filter options in mount
    useEffect(() => {
        getStatsByDepartment()
            .then(data => setDepartments(data.items.map(i => i.label)))
            .catch(() => {})

        getStatsByType()
            .then(data => setAccidentTypes(data.items.map(i => i.label)))
            .catch(() => {})
        getStatsByMunicipality()
            .then(data => setMunicipalities(data.items.map(i => i.label)))
            .catch(() => {})
    }, [])

    // Load accidents with page or filter changes
    useEffect(() => {
        setLoading(true)
        setError(null)

        getAccidents(page, 8, filters)
            .then(data => {
                setAccidents(data.items)
                setTotal(data.total)
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))

    }, [page, filters]) // run when filter or page change

    // Change of filter triggers reset of first page
    function handleFilterChange(key, value) {
        setPage(1)
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const totalPages = Math.ceil(total / 8)

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <span style={styles.title}>Last accidents</span>
                <span style={styles.count}>{total.toLocaleString('en-US')}</span>
            </div>

            {/* Filters */}
            <div style={styles.filters}>

                {/* Prvi red — departman i tip */}
                <select
                    style={styles.select}
                    value={filters.department}
                    onChange={e => handleFilterChange('department', e.target.value)}
                >
                    <option value="">All departments</option>
                    {   departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>

                <select
                    style={styles.select}
                    value={filters.accident_type}
                    onChange={e => handleFilterChange('accident_type', e.target.value)}
                >
                    <option value="">All types</option>
                        {accidentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                {/* Drugi red — municipality sam, zauzima ceo red */}
                <select
                    style={{ ...styles.select, gridColumn: '1 / -1' }}
                    value={filters.municipality}
                    onChange={e => handleFilterChange('municipality', e.target.value)}
                >
                    <option value="">All municipalities</option>
                        {municipalities.map(m => (
                    <option key={m} value={m}>{m}</option>
                    ))}
                </select>

            </div>

            {/* List */}
            <div style={styles.list}>
                {loading && (
                    <p style={styles.statusText}>Loading...</p>
                )}
                {error && (
                    <p style={styles.errorText}>Error: {error}</p>
                )}
                {!loading && !error && accidents.map(acc => (
                    <AccidentItem key={acc.id} accident={acc} />
                ))}
            </div>

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
                <div style={styles.pagination}>
                    <button
                        style={styles.pageBtn}
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                    >
                        ←
                    </button>
                    <span style={styles.pageInfo}>{page} / {totalPages}</span>
                    <button
                        style={styles.pageBtn}
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === totalPages}
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    )
}

// Small component (one row in list)
function AccidentItem({ accident }) {
    function getSeverityStyle(type) {
        if (!type) return styles.badgeDefault
        const t = type.toLowerCase()
        if (t.includes('pogin')) return styles.badgeDanger
        if (t.includes('povredje')) return styles.badgeWarning
        return styles.badgeDefault
    }

    return (
        <div style={styles.item}>
            <div style={styles.itemTop}>
                <span style={styles.itemMunicipality}>{accident.municipality}</span>
                <span style={getSeverityStyle(accident.accident_type)}>
                    {accident.accident_type}
                </span>
            </div>
            <div style={styles.itemBottom}>
                <span style={styles.itemMeta}>{accident.department}</span>
                <span style={styles.itemMeta}>
                    {new Date(accident.date_time).toLocaleDateString('sr-RS')}
                </span>
            </div>
        </div>
    )
}

const styles = {
    container: {
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        maxHeight: '100%'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--text-secondary)',
    },
    count: {
        fontSize: '12px',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--bg-secondary)',
        padding: '2px 8px',
        borderRadius: '20px',
        border: '1px solid var(--border)',
    },
    filters: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6px',
    },
    select: {
        width: '100%',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '6px 10px',
        fontSize: '12px',
        outline: 'none',
        cursor: 'pointer',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        overflowY: 'auto',    // scroll samo unutar liste
        flex: 1,
        minHeight: 0,
    },
    statusText: {
        color: 'var(--text-muted)',
        fontSize: '13px',
        textAlign: 'center',
        padding: '2rem 0',
    },
    errorText: {
        color: 'var(--danger)',
        fontSize: '13px',
        textAlign: 'center',
    },
    item: {
        padding: '10px 12px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    itemTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '8px',
    },
    itemMunicipality: {
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--text-primary)',
    },
    itemBottom: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    itemMeta: {
        fontSize: '11px',
        color: 'var(--text-muted)',
    },
    badgeDefault: {
        fontSize: '10px',
        padding: '2px 7px',
        borderRadius: '4px',
        backgroundColor: 'rgba(79,142,247,0.15)',
        color: 'var(--accent)',
        whiteSpace: 'nowrap',
    },
    badgeWarning: {
        fontSize: '10px',
        padding: '2px 7px',
        borderRadius: '4px',
        backgroundColor: 'rgba(247,169,79,0.15)',
        color: 'var(--warning)',
        whiteSpace: 'nowrap',
    },
    badgeDanger: {
        fontSize: '10px',
        padding: '2px 7px',
        borderRadius: '4px',
        backgroundColor: 'rgba(247,79,79,0.15)',
        color: 'var(--danger)',
        whiteSpace: 'nowrap',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        paddingTop: '4px',
        borderTop: '1px solid var(--border)',
    },
    pageBtn: {
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '4px 12px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    pageInfo: {
        fontSize: '12px',
        color: 'var(--text-muted)',
    },
}

export default AccidentsFeed