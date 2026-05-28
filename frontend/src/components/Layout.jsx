import { NavLink } from "react-router-dom";

// Navigation data with path and labels
const NAV_ITEMS = [
    { to: '/',        label: 'Statistics',},
    { to: '/predict', label: 'Prediction'},
    { to: '/map', label: 'Map' },
]

// 'children' param - everything between <Layout> and </Layout> will be available as 'children'
function Layout({ children }) {
    return (
        <div style={styles.shell}>

        <aside style={styles.sidebar}>

            {/* Sidebar header - logo */}
            <div style={styles.sidebarHeader}>
                <h1 style={styles.logo}>Road Pulse</h1>
                <h2 style={styles.logoSub}>Serbia · Accident analytics</h2>
            </div>

            {/* Sidebar navigation */}
            <nav style={styles.nav}>
                {NAV_ITEMS.map(item => (
                    <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    style={({ isActive }) =>
                        isActive ? { ...styles.navItem, ...styles.navItemActive }
                                : styles.navItem
                    }
                    >
                    {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Sidebar footer */}
            <div style={styles.sidebarFooter}>
                <span style={styles.statusDot} />
                <span style={styles.statusText}>Database connected</span>
            </div>

        </aside>

        {/* Main - changes based on routes */}
        <main style={styles.main}>
            {children}
        </main>

        </div>
    )
}

// Styles defined like JS object (all in one place)
const styles = {
    shell: {
        display: 'flex',
        height: '100vh',           // 100% window size
        overflow: 'hidden',
    },
    sidebar: {
        width: '260px',
        minWidth: '220px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',   // elements in column on after another
    },
    sidebarHeader: {
        padding: '20px 16px',
        borderBottom: '1px solid var(--border)',
    },
    logo: {
        fontSize: '24px',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    logoSub: {
        fontSize: '14px',
        color: 'var(--text-muted)',
        marginTop: '3px',
    },
    nav: {
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        borderRadius: '8px',
        textDecoration: 'none',    // remove underline for links
        fontSize: '16px',
        color: 'var(--text-secondary)',
        transition: 'all 0.15s',
    },
    navItemActive: {
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
    },
    navIcon: {
        fontSize: '16px',
        width: '20px',
        textAlign: 'center',
    },
    sidebarFooter: {
        marginTop: 'auto',         // push footer on bottom
        padding: '16px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    statusDot: {
        display: 'inline-block',
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        backgroundColor: 'var(--success)',
    },
    statusText: {
        fontSize: '12px',
        color: 'var(--text-muted)',
    },
    main: {
        flex: 1,                   // takes all left out space
        overflowY: 'hidden',         // scroll just through main, not all page
        backgroundColor: 'var(--bg-primary)',
    },
}

export default Layout