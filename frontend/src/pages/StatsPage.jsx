import { useState, useEffect } from "react";
import {
    getStatsByDepartment,
    getStatsByYear,
    getStatsByHour,
    getStatsByType
} from "../api/accidents";

function StatsPage() {
    const [deptData, setDeptData] = useState(null)
    const [yearData, setYearData] = useState(null)
    const [hourData, setHourData] = useState(null)
    const [typeData, setTypeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    useEffect(() => {
    // Promise.all sends all API calls in same time
    Promise.all([
        getStatsByHour(),
        getStatsByYear(),
        getStatsByType(),
        getStatsByDepartment(),
    ])
        .then(([hour, year, type, dept]) => {
            // Then set returned values
            setHourData(hour)
            setYearData(year)
            setTypeData(type)
            setDeptData(dept)
        })
        .catch(err => {
            setError(err.message)
        })
        .finally(() => {
            // Loading ends however
            setLoading(false)
        })
    }, [])

    // Calculating accident summary values
    const totalAccidents = hourData
        ? hourData.items.reduce((sum, item) => sum + item.count, 0)
        : 0

    const busiestHour = hourData
        ? hourData.items.reduce((max, item) => item.count > max.count ? item : max, hourData.items[0])
        : null

    const topType = typeData
        ? typeData.items[0]
        : null
    
    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>Statistics</h1>
                <span style={styles.badge}>2020 - 2026</span>
            </div>

                {loading && <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>}
                {error   && <p style={{ color: 'var(--danger)' }}>Error: {error}</p>}

                {!loading && !error && (
                <div style={styles.statGrid}>

                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total accidents</div>
                        <div style={styles.statValue}>
                            {totalAccidents.toLocaleString('en-US')}
                        </div>
                        <div style={styles.statSub}>in database</div>
                    </div>

                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Busiest hour</div>
                        <div style={styles.statValue}>
                            {busiestHour ? `${busiestHour.label}h` : '—'}
                        </div>
                        <div style={styles.statSub}>
                            {busiestHour ? `${busiestHour.count.toLocaleString('en-US')} accidents` : ''}
                        </div>
                    </div>

                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Most common type</div>
                        <div style={{ ...styles.statValue, fontSize: '1rem' }}>
                            {topType ? topType.label : '—'}
                        </div>
                        <div style={styles.statSub}>
                            {topType ? `${topType.count.toLocaleString('en-US')} cases` : ''}
                        </div>
                    </div>

                </div>
                )}
        </div>
    );
}

const styles = {
    page: {
        padding: '2rem',
        maxWidth: '1100px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.4rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    badge: {
        fontSize: '12px',
        padding: '3px 10px',
        borderRadius: '20px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
    },
        statGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',  // three columns same width
        gap: '1rem',
        marginBottom: '2rem',
    },
    statCard: {
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '1.25rem',
    },
    statLabel: {
        fontSize: '12px',
        color: 'var(--text-muted)',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
        statValue: {
        fontSize: '1.8rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        lineHeight: '1.2',
    },
        statSub: {
        fontSize: '12px',
        color: 'var(--text-secondary)',
        marginTop: '4px',
    },
}

export default StatsPage