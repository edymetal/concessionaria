import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './Inventory.css';

const Inventory = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    const [filters, setFilters] = useState({
        category: categoryFilter || 'All',
        maxKm: '',
        minYear: ''
    });

    useEffect(() => {
        fetch('/data/vehicles.json')
            .then(res => res.json())
            .then(data => {
                setVehicles(data);
                setFilteredVehicles(data);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (categoryFilter) {
            setFilters(prev => ({ ...prev, category: categoryFilter }));
        }
    }, [categoryFilter]);

    useEffect(() => {
        let result = vehicles;

        if (filters.category !== 'All') {
            result = result.filter(v => v.category === filters.category);
        }

        if (filters.maxKm) {
            result = result.filter(v => {
                const km = parseFloat(v.km.replace('.', '').replace(',', '.'));
                return km <= parseFloat(filters.maxKm);
            });
        }

        if (filters.minYear) {
            result = result.filter(v => {
                const year = parseInt(v.year.split('/').pop());
                return year >= parseInt(filters.minYear);
            });
        }

        setFilteredVehicles(result);
    }, [filters, vehicles]);

    const uniqueCategories = ['All', ...new Set(vehicles.map(v => v.category))];

    return (
        <div className="inventory container">
            <aside className="filters">
                <h3>Filtra</h3>

                <div className="filter-group">
                    <label>Categoria</label>
                    <select
                        value={filters.category}
                        onChange={e => setFilters({ ...filters, category: e.target.value })}
                    >
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Anno Minimo</label>
                    <input
                        type="number"
                        placeholder="Es. 2018"
                        value={filters.minYear}
                        onChange={e => setFilters({ ...filters, minYear: e.target.value })}
                    />
                </div>

                <div className="filter-group">
                    <label>Max KM</label>
                    <input
                        type="number"
                        placeholder="Es. 100000"
                        value={filters.maxKm}
                        onChange={e => setFilters({ ...filters, maxKm: e.target.value })}
                    />
                </div>
            </aside>

            <section className="vehicle-list">
                <h2>Inventario ({filteredVehicles.length})</h2>
                <div className="grid">
                    {filteredVehicles.map(vehicle => (
                        <Link to={`/vehicle/${vehicle.id}`} key={vehicle.id} className="vehicle-card card">
                            <div className="vehicle-image">
                                <img src={vehicle.image} alt={vehicle.title} loading="lazy" />
                                <span className="category-tag">{vehicle.category}</span>
                            </div>
                            <div className="vehicle-info">
                                <h3>{vehicle.title}</h3>
                                <div className="vehicle-specs">
                                    <span>{vehicle.year}</span>
                                    <span>{vehicle.km} km</span>
                                    <span>{vehicle.fuel}</span>
                                </div>
                                <div className="vehicle-price">{vehicle.price}</div>
                                <span className="btn btn-sm">Dettagli</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Inventory;
