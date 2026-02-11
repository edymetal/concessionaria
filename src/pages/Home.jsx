import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Award, Smile } from 'lucide-react';
import './Home.css';

// Componente auxiliar para gerenciar imagem com fallback
const CategoryCard = ({ category, count, onClick, delay }) => {
    // Normaliza o nome da categoria para usar como nome de arquivo (ex: "City car" -> "city-car.jpg")
    const filename = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    const localImage = `/images/categories/${filename}.jpg`;

    // Fallback URLs (Unsplash) - Temáticas "Itália"
    const fallbackImages = {
        'City car': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop', // Fiat 500 Red vintage
        'Sedan': 'https://images.unsplash.com/photo-1563720223185-11003d5169a6?q=80&w=800&auto=format&fit=crop', // Alfa Giulia Red
        'SUV & Pick-up': 'https://images.unsplash.com/photo-1621503926830-588049774619?q=80&w=800&auto=format&fit=crop', // Alfa Stelvio/SUV
        'Furgoni & Van': 'https://images.unsplash.com/photo-1605218427360-36390f855322?q=80&w=800&auto=format&fit=crop', // White Van
        'Cabrio': 'https://images.unsplash.com/photo-1517673516315-9c6a7e94e41e?q=80&w=800&auto=format&fit=crop', // Convertible
        'Monovolume': 'https://images.unsplash.com/photo-1627529452331-bfa900e2381e?q=80&w=800&auto=format&fit=crop', // Family Car
        'Default': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop'
    };

    const [bgImage, setBgImage] = useState(`url(${localImage})`);

    const handleImageError = () => {
        // Se a imagem local falhar, usa o fallback do Unsplash
        setBgImage(`url(${fallbackImages[category] || fallbackImages['Default']})`);
    };

    return (
        <div
            className="category-card"
            onClick={() => onClick(category)}
            style={{ animationDelay: delay }}
        >
            <div
                className="category-image"
                style={{ backgroundImage: bgImage }}
            >
                {/* Imagem oculta apenas para disparar o evento onError se o arquivo local não existir */}
                <img
                    src={localImage}
                    alt={category}
                    style={{ display: 'none' }}
                    onError={handleImageError}
                />
            </div>
            <div className="category-overlay">
                <h3>{category}</h3>
                <span className="btn-text" style={{ fontSize: '0.8rem', opacity: 0.8, color: '#fff', marginBottom: '0.5rem', display: 'block' }}>
                    {count ? `${count} Veicoli` : 'Su Richiesta'}
                </span>
                <span className="btn-text">Vedi Modelli &rarr;</span>
            </div>
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const [vehicleCounts, setVehicleCounts] = useState({});

    const fixedCategories = [
        'City car',
        'Sedan',
        'SUV & Pick-up',
        'Furgoni & Van',
        'Cabrio',
        'Monovolume'
    ];

    const heroImage = 'https://images.unsplash.com/photo-1597687190401-49b8782a3ee5?q=80&w=1920&auto=format&fit=crop';

    useEffect(() => {
        fetch('/data/vehicles.json')
            .then(res => res.json())
            .then(data => {
                const counts = data.reduce((acc, v) => {
                    acc[v.category] = (acc[v.category] || 0) + 1;
                    return acc;
                }, {});
                setVehicleCounts(counts);
            })
            .catch(err => console.error('Erro ao carregar veículos:', err));
    }, []);

    const handleCategoryClick = (category) => {
        navigate(`/inventory?category=${category}`);
    };

    return (
        <div className="home">
            <div
                className="hero"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content container">
                    <h1 className="animate-fade-in">Guidare l'Eccellenza</h1>
                    <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        La migliore selezione di auto premium per chi cerca emozioni su strada.
                    </p>
                    <div className="hero-actions animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/inventory')}>
                            Scopri il Nostro Parco Auto
                        </button>
                    </div>
                </div>
            </div>

            <section className="categories container">
                <h2 className="section-title">Le Nostre Categorie</h2>
                <div className="category-grid">
                    {fixedCategories.map((cat, index) => (
                        <CategoryCard
                            key={cat}
                            category={cat}
                            count={vehicleCounts[cat]}
                            onClick={handleCategoryClick}
                            delay={`${index * 0.1}s`}
                        />
                    ))}
                </div>
            </section>

            <section className="features container">
                <div className="feature-item">
                    <div className="feature-icon"><ShieldCheck size={48} strokeWidth={1} /></div>
                    <h3>Garanzia Totale</h3>
                    <p>Tutti i nostri veicoli sono ispezionati e garantiti.</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon"><Award size={48} strokeWidth={1} /></div>
                    <h3>Qualità Premium</h3>
                    <p>Solo le migliori auto selezionate per i nostri clienti.</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon"><Smile size={48} strokeWidth={1} /></div>
                    <h3>Assistenza Personalizzata</h3>
                    <p>Ti guidiamo in ogni passo verso la tua nuova auto.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
