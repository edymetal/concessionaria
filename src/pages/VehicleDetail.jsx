import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Gauge, Fuel, Cog, Phone, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import './VehicleDetail.css';

const VehicleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        fetch('/data/vehicles.json')
            .then(res => res.json())
            .then(data => {
                const found = data.find(v => v.id === id);
                if (found) setVehicle(found);
                else navigate('/inventory');
            })
            .catch(err => console.error(err));
    }, [id, navigate]);

    if (!vehicle) return <div className="loading container">Caricamento...</div>;

    const parseDetails = (text) => {
        const parts = text.split('Equipaggiamenti:');
        const description = parts[0];
        const equipment = parts.length > 1 ? parts[1].split('-').map(item => item.trim()).filter(i => i) : [];
        return { description, equipment };
    };

    const { description, equipment } = parseDetails(vehicle.details);

    return (
        <div className="vehicle-detail container">
            <button className="btn-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Torna indietro
            </button>

            <div className="detail-header">
                <div>
                    <span className="category-badge">{vehicle.category}</span>
                    <h1>{vehicle.title}</h1>
                </div>
                <div className="price-tag">{vehicle.price}</div>
            </div>

            <div className="detail-grid">
                <div className="gallery-section">
                    <div className="main-image">
                        <img src={vehicle.images[activeImage]} alt={vehicle.title} />
                    </div>
                    <div className="thumbnails">
                        {vehicle.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Thumbnail ${idx}`}
                                className={idx === activeImage ? 'active' : ''}
                                onClick={() => setActiveImage(idx)}
                            />
                        ))}
                    </div>
                </div>

                <div className="info-section">
                    <div className="specs-grid card">
                        <div className="spec-item">
                            <span className="spec-icon"><Calendar size={24} /></span>
                            <span className="spec-label">Immatricolazione</span>
                            <span className="spec-value">{vehicle.year}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-icon"><Gauge size={24} /></span>
                            <span className="spec-label">Chilometraggio</span>
                            <span className="spec-value">{vehicle.km} km</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-icon"><Fuel size={24} /></span>
                            <span className="spec-label">Alimentazione</span>
                            <span className="spec-value">{vehicle.fuel}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-icon"><Cog size={24} /></span>
                            <span className="spec-label">Cambio</span>
                            <span className="spec-value">{vehicle.transmission.split(' ')[0]}</span>
                        </div>
                    </div>

                    <div className="cta-box card">
                        <h3>Ti interessa quest'auto?</h3>
                        <p>Contattaci per un test drive o per maggiori informazioni.</p>
                        <div className="cta-buttons">
                            <a href="tel:+393249946200" className="btn btn-primary">
                                <Phone size={18} style={{ marginRight: '8px' }} /> Chiama Ora
                            </a>
                            <a href="mailto:info@autoitalia.it" className="btn">
                                <Mail size={18} style={{ marginRight: '8px' }} /> Invia Email
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detailed-info-section card">
                <div className="tabs">
                    <h3 className="section-title" style={{ textAlign: 'left', margin: '0 0 1rem 0' }}>Descrizione & Accessori</h3>
                </div>

                <div className="info-content">
                    <div className="description-text">
                        <h4>Descrizione Generale</h4>
                        {description.split('\n').filter(line => line.trim().length > 0).map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>

                    {equipment.length > 0 && (
                        <div className="equipment-list">
                            <h4>Equipaggiamento di Serie</h4>
                            <ul>
                                {equipment.map((item, index) => (
                                    <li key={index}>
                                        <CheckCircle size={16} color="var(--color-primary)" style={{ marginRight: '8px', minWidth: '16px' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleDetail;
