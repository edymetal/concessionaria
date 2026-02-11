import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, 'base');
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(publicDir, 'data');
const imagesDir = path.join(publicDir, 'images', 'cars');

// Certificar que diretórios de destino existem
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const vehicles = [];

function parseInfTxt(content) {
    const data = {
        title: '',
        price: 'Sob consulta',
        year: '',
        km: '',
        fuel: '',
        transmission: '',
        engine: '',
        color: '',
        category: 'Altro', // Default
        details: content
    };

    // Tentar extrair informações com Regex
    const titleMatch = content.match(/^(.+?)(?=\sIMMATRICOLAZIONE|KM|MOTORE|$)/i);
    if (titleMatch) data.title = titleMatch[1].trim().replace(/AUTO LEADER PROPONE:|😉/g, '').trim();

    const yearMatch = content.match(/IMMATRICOLAZIONE[:\s]+(\d{2}\/\d{4}|\d{4})/i);
    if (yearMatch) data.year = yearMatch[1];

    const kmMatch = content.match(/KM[:\s]+([\d\.]+)/i);
    if (kmMatch) data.km = kmMatch[1];

    const fuelMatch = content.match(/Alimentazione[:\s]+([^\-]+)/i);
    if (fuelMatch) data.fuel = fuelMatch[1].trim();

    const transmissionMatch = content.match(/Cambio[:\s]+([^\-]+)/i);
    if (transmissionMatch) data.transmission = transmissionMatch[1].trim();

    // Tentar inferir categoria
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('suv') || lowerContent.includes('fuoristrada') || lowerContent.includes('pick-up') || lowerContent.includes('jeep')) data.category = 'SUV & Pick-up';
    else if (lowerContent.includes('sedan') || lowerContent.includes('berlina')) data.category = 'Sedan';
    else if (lowerContent.includes('city car') || lowerContent.includes('utilitaria') || lowerContent.includes('hatch')) data.category = 'City car';
    else if (lowerContent.includes('van') || lowerContent.includes('furgone') || lowerContent.includes('transporter')) data.category = 'Furgoni & Van';
    else if (lowerContent.includes('cabrio') || lowerContent.includes('convertible') || lowerContent.includes('spyder')) data.category = 'Cabrio';
    else if (lowerContent.includes('monovolume') || lowerContent.includes('multispazio')) data.category = 'Monovolume';
    else data.category = 'City car'; // Default fallback mais seguro para carros pequenos comuns

    return data;
}

try {
    const dirs = fs.readdirSync(baseDir, { withFileTypes: true });

    dirs.forEach(dirent => {
        if (dirent.isDirectory()) {
            const dirName = dirent.name;
            const dirPath = path.join(baseDir, dirName);

            const files = fs.readdirSync(dirPath);
            const infFile = files.find(f => f.toLowerCase() === 'inf.txt');
            const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

            if (infFile) {
                const content = fs.readFileSync(path.join(dirPath, infFile), 'utf-8');
                const vehicleData = parseInfTxt(content);

                vehicleData.id = dirName;
                vehicleData.imageCount = imageFiles.length;
                vehicleData.images = [];

                // Copiar imagens
                const carImagesDir = path.join(imagesDir, dirName);
                if (!fs.existsSync(carImagesDir)) fs.mkdirSync(carImagesDir, { recursive: true });

                imageFiles.forEach(img => {
                    const src = path.join(dirPath, img);
                    const dest = path.join(carImagesDir, img);
                    fs.copyFileSync(src, dest);
                    vehicleData.images.push(`/images/cars/${dirName}/${img}`);
                });

                // Imagem principal (thumbnail)
                vehicleData.image = vehicleData.images[0] || '/images/placeholder.jpg';

                vehicles.push(vehicleData);
                console.log(`Processado: ${vehicleData.title || dirName}`);
            }
        }
    });

    const jsonPath = path.join(dataDir, 'vehicles.json');
    fs.writeFileSync(jsonPath, JSON.stringify(vehicles, null, 2));
    console.log(`\nConcluído! ${vehicles.length} veiculos processados e salvos em ${jsonPath}`);

} catch (err) {
    console.error('Erro ao processar dados:', err);
}
