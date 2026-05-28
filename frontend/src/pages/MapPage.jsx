import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { getMapPoints, getStatsByType, getStatsByMunicipality } from '../api/accidents'

function getColor(accidentType) {
    if (!accidentType) return '#4f8ef7'
    const t = accidentType.toLowerCase()
    if (t.includes('pogin'))    return '#f74f4f'  // crvena — smrtni
    if (t.includes('povredje')) return '#f7a94f'  // narandžasta — povređeni
    return '#4f8ef7'                               // plava — materijalna
}

function MapPage() {
    const [points, setPoints]             = useState([])
    const [loading, setLoading]           = useState(true)
    const [error, setError]               = useState(null)
    const [accidentTypes, setAccidentTypes]   = useState([])
    const [municipalities, setMunicipalities] = useState([])
    const [filters, setFilters] = useState({
        accident_type: '',
        municipality: '',
    })

    // Učitaj filter opcije jednom pri mount-u
    useEffect(() => {
        getStatsByType()
            .then(d => setAccidentTypes(d.items.map(i => i.label)))
            .catch(() => {})

        getStatsByMunicipality()
            .then(d => setMunicipalities(d.items.map(i => i.label)))
            .catch(() => {})
    }, [])

    // Učitaj pinove kad se filteri promene
    useEffect(() => {
        setLoading(true)
        setError(null)

        getMapPoints(filters)
            .then(data => setPoints(data.items))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [filters])

    return (
        <div style={styles.page}>

            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Accident Map</h1>
                <span style={styles.badge}>
                    {loading ? 'Loading…' : `${points.length.toLocaleString('en-US')} shown`}
                </span>
            </div>

            {/* Filter bar */}
            <div style={styles.filterBar}>
                <select
                    style={styles.select}
                    value={filters.accident_type}
                    onChange={e => setFilters(f => ({ ...f, accident_type: e.target.value }))}
                >
                    <option value="">All types</option>
                    {accidentTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                <select
                    style={styles.select}
                    value={filters.municipality}
                    onChange={e => setFilters(f => ({ ...f, municipality: e.target.value }))}
                >
                    <option value="">All municipalities</option>
                    {municipalities.map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>

                {/* Legenda */}
                <div style={styles.legend}>
                    <span style={{ ...styles.dot, backgroundColor: '#f74f4f' }} />
                    <span style={styles.legendLabel}>Fatal</span>
                    <span style={{ ...styles.dot, backgroundColor: '#f7a94f' }} />
                    <span style={styles.legendLabel}>Injured</span>
                    <span style={{ ...styles.dot, backgroundColor: '#4f8ef7' }} />
                    <span style={styles.legendLabel}>Material</span>
                </div>
            </div>

            {error && (
                <p style={styles.errorText}>Error: {error}</p>
            )}

            {/* Mapa wrapper — uvek renderovana, pinovi se menjaju */}
            <div style={styles.mapWrapper}>
                <MapContainer
                    center={[44.0, 21.0]}
                    zoom={8}
                    style={{ height: '100%', width: '100%', borderRadius: '10px' }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                    />

                    {points.map(p => (
                        <CircleMarker
                            key={p.accident_id}
                            center={[p.latitude, p.longitude]}
                            radius={5}
                            pathOptions={{
                                color: 'transparent',
                                fillColor: getColor(p.accident_type),
                                fillOpacity: 0.75,
                            }}
                        >
                            <Popup>
                                <div style={styles.popup}>
                                    <strong style={styles.popupMunicipality}>{p.municipality}</strong>
                                    <span style={styles.popupType}>{p.accident_type}</span>
                                    <span style={styles.popupDate}>
                                        {new Date(p.date_time).toLocaleString('sr-RS')}
                                    </span>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>

                {/* Loading overlay — prikazan preko mape dok učitava */}
                {loading && (
                    <div style={styles.mapOverlay}>
                        <span style={styles.mapOverlayText}>Loading points…</span>
                    </div>
                )}
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
        gap: '1rem',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
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
    filterBar: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
    },
    select: {
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '7px 10px',
        fontSize: '13px',
        outline: 'none',
        cursor: 'pointer',
        minWidth: '180px',
    },
    legend: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginLeft: 'auto',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '6px 12px',
    },
    dot: {
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        marginLeft: '8px',
    },
    legendLabel: {
        fontSize: '12px',
        color: 'var(--text-secondary)',
    },
    errorText: {
        color: 'var(--danger)',
        fontSize: '13px',
        padding: '0.5rem 0',
    },
    mapWrapper: {
        flex: 1,
        position: 'relative',
        minHeight: 0,
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
    },
    mapOverlay: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 17, 23, 0.6)',
        zIndex: 1000,
        borderRadius: '10px',
    },
    mapOverlayText: {
        color: 'var(--text-secondary)',
        fontSize: '14px',
    },
    popup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        minWidth: '150px',
    },
    popupMunicipality: {
        fontSize: '13px',
        color: '#111',
    },
    popupType: {
        fontSize: '12px',
        color: '#444',
    },
    popupDate: {
        fontSize: '11px',
        color: '#888',
        marginTop: '2px',
    },
}

export default MapPage