import { useState } from 'react'
import { predictSeverity } from '../api/accidents'

const MUNICIPALITIES = [
    'BARAJEVO', 'VOŽDOVAC', 'VRAČAR', 'GROCKA', 'ZVEZDARA', 'ZEMUN',
    'LAZAREVAC', 'MLADENOVAC', 'NOVI BEOGRAD', 'OBRENOVAC', 'PALILULA',
    'RAKOVICA', 'SAVSKI VENAC', 'SOPOT', 'STARI GRAD', 'SURČIN',
    'ČUKARICA', 'ALEKSINAC', 'ARANĐELOVAC', 'BELA PALANKA', 'BLACE',
    'BOJNIK', 'BRUS', 'VRANJE', 'VRNJAČKA BANJA', 'GADŽIN HAN',
    'DIMITROVGRAD', 'DOLJEVAC', 'ŽITORAĐA', 'KNJAŽEVAC', 'KURŠUMLIJA',
    'LEBANE', 'LESKOVAC', 'MEDVEĐA', 'MEROŠINA', 'NIŠ', 'PIROT',
    'PROKUPLJE', 'SURDULICA', 'SVRLJIG', 'TRGOVIŠTE', 'VLADIČIN HAN',
    'VLASOTINCE', 'BABUŠNICA', 'BELA CRKVA', 'VALJEVO', 'ŠABAC',
]

const VEHICLE_TYPES = [
    { value: 'SN SA JEDNIM VOZILOM',                                label: 'Single vehicle' },
    { value: 'SN SA NAJMANjE DVA VOZILA – BEZ SKRETANjA',          label: 'Two+ vehicles – no turn' },
    { value: 'SN SA NAJMANjE DVA VOZILA – SKRETANjE ILI PRELAZAK', label: 'Two+ vehicles – turn/crossing' },
    { value: 'SN SA PARKIRANIM VOZILIMA',                           label: 'Parked vehicles' },
    { value: 'SN SA PEŠACIMA',                                      label: 'Pedestrians' },
]

const INITIAL_FORM = {
    municipality:          '',
    date_time:             '',
    involved_vehicles_num: '',
    longitude:             '',
    latitude:              '',
}

function PredictPage() {
    const [form, setForm]       = useState(INITIAL_FORM)
    const [result, setResult]   = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState(null)

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleSubmit() {
        if (!form.municipality || !form.date_time || !form.involved_vehicles_num
            || !form.longitude || !form.latitude) {
            setError('Please fill in all fields before submitting.')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        // Konvertujemo longitude i latitude u float pre slanja
        predictSeverity({
            ...form,
            longitude: parseFloat(form.longitude),
            latitude:  parseFloat(form.latitude),
        })
            .then(data => setResult(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }

    const isInjured = result?.severity === 'Injured/Dead'
    const pct       = result ? Math.round(result.probability * 100) : 0

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>Accident Severity Prediction</h1>
                <span style={styles.badge}>XGBoost model</span>
            </div>

            <p style={styles.description}>
                Fill in the accident details below to predict whether an accident in these
                conditions is likely to result in <strong>material damage only</strong>, or
                in <strong>injuries or fatalities</strong>. The model was trained on ~200,000
                real traffic accidents recorded in Serbia between 2020 and 2026.
            </p>

            <div style={styles.layout}>
                {/* ── Form ── */}
                <div style={styles.formCard}>
                    <h2 style={styles.sectionTitle}>Accident Parameters</h2>

                    <label style={styles.label}>Municipality</label>
                    <select name="municipality" value={form.municipality}
                        onChange={handleChange} style={styles.select}>
                        <option value="">Select municipality…</option>
                        {MUNICIPALITIES.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <label style={styles.label}>Date and time</label>
                    <input type="datetime-local" name="date_time"
                        value={form.date_time} onChange={handleChange}
                        style={styles.input} />

                    <label style={styles.label}>Vehicle involvement type</label>
                    <select name="involved_vehicles_num" value={form.involved_vehicles_num}
                        onChange={handleChange} style={styles.select}>
                        <option value="">Select type…</option>
                        {VEHICLE_TYPES.map(v => (
                            <option key={v.value} value={v.value}>{v.label}</option>
                        ))}
                    </select>

                    {/* Koordinate — dva polja u jednom redu */}
                    <div style={styles.coordRow}>
                        <div style={styles.coordField}>
                            <label style={styles.label}>Longitude</label>
                            <input type="number" name="longitude" step="any"
                                placeholder="npr. 20.46" value={form.longitude}
                                onChange={handleChange} style={styles.input} />
                        </div>
                        <div style={styles.coordField}>
                            <label style={styles.label}>Latitude</label>
                            <input type="number" name="latitude" step="any"
                                placeholder="npr. 44.80" value={form.latitude}
                                onChange={handleChange} style={styles.input} />
                        </div>
                    </div>

                    <p style={styles.coordHint}>
                        💡 Koordinate možeš pronaći klikom desnim tasterom na Google Maps lokaciju.
                        Srbija: longitude 19–23, latitude 42–46.
                    </p>

                    {error && <p style={styles.errorText}>{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={loading
                            ? { ...styles.button, ...styles.buttonDisabled }
                            : styles.button}
                    >
                        {loading ? 'Predicting…' : 'Predict severity'}
                    </button>
                </div>

                {/* ── Result ── */}
                <div style={styles.resultCard}>
                    <h2 style={styles.sectionTitle}>Prediction Result</h2>

                    {!result && !loading && (
                        <div style={styles.placeholder}>
                            <span style={styles.placeholderIcon}>🔍</span>
                            <p style={styles.placeholderText}>
                                Fill in the form and click <em>Predict severity</em> to see the result.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div style={styles.placeholder}>
                            <p style={styles.placeholderText}>Running model…</p>
                        </div>
                    )}

                    {result && (
                        <div style={styles.resultContent}>
                            <div style={isInjured ? styles.severityBadgeDanger : styles.severityBadgeSafe}>
                                <span style={styles.severityIcon}>{isInjured ? '⚠️' : '✅'}</span>
                                <span style={styles.severityLabel}>{result.severity}</span>
                            </div>

                            <div style={styles.probSection}>
                                <div style={styles.probHeader}>
                                    <span style={styles.probLabel}>Injury/Fatality probability</span>
                                    <span style={isInjured ? styles.probValueDanger : styles.probValueSafe}>
                                        {pct}%
                                    </span>
                                </div>
                                <div style={styles.barTrack}>
                                    <div style={{
                                        ...styles.barFill,
                                        width: `${pct}%`,
                                        backgroundColor: isInjured ? 'var(--danger)' : 'var(--success)',
                                    }} />
                                </div>
                                <div style={styles.barLabels}>
                                    <span>0%</span>
                                    <span style={{ color: 'var(--warning)' }}>45% threshold</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            <div style={styles.contextBox}>
                                <p style={styles.contextText}>
                                    <strong>Decision threshold:</strong> 0.45 — tuned to improve
                                    recall on the minority "Injured/Dead" class.
                                </p>
                                <p style={styles.contextText}>
                                    A probability above 45% is classified as <em>Injured/Dead</em>.
                                    This reduces false negatives — predicting "safe" when the accident
                                    was actually harmful.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const styles = {
    page: {
        padding: '2rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '0.75rem',
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
    description: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        lineHeight: '1.7',
        marginBottom: '2rem',
        maxWidth: '680px',
    },
    layout: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        flex: 1,
    },
    formCard: {
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    resultCard: {
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    sectionTitle: {
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--text-secondary)',
        marginBottom: '0.5rem',
    },
    label: {
        fontSize: '12px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        marginTop: '8px',
    },
    input: {
        width: '100%',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '8px 10px',
        fontSize: '13px',
        outline: 'none',
        colorScheme: 'dark',
    },
    select: {
        width: '100%',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '8px 10px',
        fontSize: '13px',
        outline: 'none',
        cursor: 'pointer',
    },
    coordRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
    },
    coordField: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    coordHint: {
        fontSize: '11px',
        color: 'var(--text-muted)',
        lineHeight: '1.5',
    },
    errorText: {
        color: 'var(--danger)',
        fontSize: '12px',
        marginTop: '4px',
    },
    button: {
        marginTop: '12px',
        padding: '10px 0',
        backgroundColor: 'var(--accent)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
    },
    buttonDisabled: {
        backgroundColor: 'var(--text-muted)',
        cursor: 'not-allowed',
    },
    placeholder: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '3rem 1rem',
        borderRadius: '8px',
        border: '1px dashed var(--border)',
    },
    placeholderIcon: { fontSize: '2rem' },
    placeholderText: {
        fontSize: '13px',
        color: 'var(--text-muted)',
        textAlign: 'center',
        lineHeight: '1.6',
    },
    resultContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    severityBadgeDanger: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'rgba(247,79,79,0.1)',
        border: '1px solid rgba(247,79,79,0.3)',
        borderRadius: '8px',
        padding: '14px 16px',
    },
    severityBadgeSafe: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'rgba(79,173,114,0.1)',
        border: '1px solid rgba(79,173,114,0.3)',
        borderRadius: '8px',
        padding: '14px 16px',
    },
    severityIcon: { fontSize: '1.4rem' },
    severityLabel: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    probSection: { display: 'flex', flexDirection: 'column', gap: '6px' },
    probHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    probLabel:      { fontSize: '12px', color: 'var(--text-muted)' },
    probValueDanger: { fontSize: '18px', fontWeight: '600', color: 'var(--danger)' },
    probValueSafe:   { fontSize: '18px', fontWeight: '600', color: 'var(--success)' },
    barTrack: {
        height: '10px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '5px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
    },
    barFill: {
        height: '100%',
        borderRadius: '5px',
        transition: 'width 0.5s ease',
    },
    barLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: 'var(--text-muted)',
    },
    contextBox: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    contextText: {
        fontSize: '12px',
        color: 'var(--text-secondary)',
        lineHeight: '1.6',
    },
}

export default PredictPage