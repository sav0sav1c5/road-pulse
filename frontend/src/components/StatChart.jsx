import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid
} from 'recharts'

function StatChart({ title, data }) {
    return (
        <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>{title}</h2>

            {/* ResponsiveContainer — automatically expands to the width of the parent */}
            <ResponsiveContainer width="100%" height={245}>

                {/* BarChart — knows these are bar graphs, receives an array of objects */}
                <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>

                {/* CartesianGrid — draws horizontal lines in the background */}
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}   // samo horizontalne linije
                />

                {/* XAxis — bottom axis, reads "name" field from each object */}
                <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />

                {/* YAxis — left axis, automatically scales */}
                <YAxis
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />

                 {/* Tooltip — popup displayed on hover */}
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

                {/* Bar — draws the bars themselves, reads the "count" field */}
                <Bar
                    dataKey="count"
                    fill="var(--accent)"
                    radius={[4, 4, 0, 0]}   // zaobljeni gornji uglovi
                    maxBarSize={40}
                />
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

export default StatChart