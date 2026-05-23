import {
    PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from 'recharts'

const PIE_COLORS = ['#4f8ef7', '#4fad72', '#f74f4f']

function AccidentTypePieChart({ title, data }) {
    const total = data.reduce((sum, item) => sum + item.count, 0)

    return (
        <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>{title}</h2>
            <ResponsiveContainer width="100%" height={245}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={85}
                        innerRadius={40}
                    >
                        {data.map((_, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        }}
                        labelStyle={{ color: 'var(--text-primary)' }}
                        formatter={(value, name) => [
                        `${value.toLocaleString('sr-RS')} (${((value / total) * 100).toFixed(1)}%)`,
                        name
                        ]}
                    />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                            {value}
                        </span>
                        )}
                    />
                </PieChart>
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

export default AccidentTypePieChart