import { useState, useEffect } from "react";
import {
    getStatsByDepartment,
    getStatsByYear,
    getStatsByHour,
    getStatsByType
} from "../api/accidents";

function StatsPage() {
    const [depData, setDepData] = useState(null)
    const [yearData, setYearData] = useState(null)
    const [hourData, setHourData] = useState(null)
    const [typeData, setTypeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>Statistics</h1>
                <span style={styles.badge}>2020 - 2026</span>
            </div>

            <p>loading: {String(loading)}</p>
            <p>error: {String(error)}</p>
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
}

export default StatsPage