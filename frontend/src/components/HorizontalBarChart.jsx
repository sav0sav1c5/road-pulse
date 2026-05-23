import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid
} from 'recharts'

function HorizontalBarChart({ title, data }) {
    return (
        <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>{title}</h2>
            <ResponsiveContainer width="100%" height={245}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis
                        type="number"
                        tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={75}
                        interval={0}
                    />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        }}
                        labelStyle={{ color: 'var(--text-primary)' }}
                        itemStyle={{ color: 'var(--accent)' }}
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    />
                    <Bar dataKey="count" fill="var(--accent)" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

const styles = {
    chartCard: {
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '1.25rem',
    },
    chartTitle: {
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--text-secondary)',
        marginBottom: '1rem',
    },
}

export default HorizontalBarChart