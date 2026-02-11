import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <footer style={{ backgroundColor: 'var(--color-primary)', padding: '2rem 0', textAlign: 'center', marginTop: '4rem' }}>
                <div className="container">
                    <p style={{ color: 'var(--color-text-muted)' }}>&copy; {new Date().getFullYear()} Auto Italia. Tutti i diritti riservati.</p>
                </div>
            </footer>
        </>
    );
};

export default Layout;
