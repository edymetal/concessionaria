import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <span>Auto</span> Italia
                </Link>
                <nav className="nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/inventory" className="nav-link">Veicoli</Link>
                    <Link to="/about" className="nav-link">Chi Siamo</Link>
                    <Link to="/contact" className="nav-link btn btn-primary">Contatti</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
