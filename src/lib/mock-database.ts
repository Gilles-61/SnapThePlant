
import type { Category } from "@/lib/categories";

// This is now just a type alias, the logic is in the component.
export type Answers = Record<string, string>;

export interface CareTip {
    title: 'Watering' | 'Sunlight' | 'Soil' | 'Fertilizer' | 'Environment' | 'Extra Tips';
    description: string;
}

export interface Species {
    id: number;
    category: Category;
    name: string;
    scientificName: string;
    keyInformation: string;
    furtherReading: string;
    image: string;
    attributes: Record<string, string>;
    careTips?: CareTip[];
    isPoisonous?: boolean;
    toxicityWarning?: string;
}

export interface ScoredSpecies {
    species: Species;
    score: number;
    confidence: number;
}

export const database: Species[] = [
    // --- PLANTS ---
    {
        id: 1, category: 'Plant', name: 'Monstera Deliciosa', scientificName: 'Monstera deliciosa',
        keyInformation: 'A tropical plant famous for its large, glossy, perforated leaves. It is a popular houseplant but toxic to pets.',
        furtherReading: 'https://en.wikipedia.org/wiki/Monstera_deliciosa',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'green', shape: 'lobed', size: 'medium' },
        isPoisonous: true,
        toxicityWarning: 'Contains calcium oxalate crystals, which are toxic to cats, dogs, and humans if ingested, causing oral irritation, pain and swelling of mouth, tongue and lips, excessive drooling, vomiting, and difficulty swallowing.',
        careTips: [
            { title: 'Watering', description: 'Water every 1-2 weeks, allowing soil to dry out between waterings. Increase frequency with more light.' },
            { title: 'Sunlight', description: 'Thrives in bright to medium indirect light. Not suited for intense, direct sun.' },
            { title: 'Soil', description: 'Use a well-draining peat-based potting mix.'},
            { title: 'Extra Tips', description: 'It is a climbing plant, so providing a stake or trellis will encourage growth.'}
        ]
    },
    {
        id: 2, category: 'Plant', name: 'Rose', scientificName: 'Rosa',
        keyInformation: 'A woody perennial with thorny stems. Cultivated for its beautiful and fragrant flowers. Some varieties produce edible rose hips.',
        furtherReading: 'https://en.wikipedia.org/wiki/Rose',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'red', shape: 'compound', size: 'small' },
        isPoisonous: false,
    },
    {
        id: 3, category: 'Plant', name: 'Sunflower', scientificName: 'Helianthus annuus',
        keyInformation: 'A large annual flower known for following the sun. Its seeds are a common food source. Caution: Can cause allergies.',
        furtherReading: 'https://en.wikipedia.org/wiki/Helianthus',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'yellow', shape: 'simple', size: 'large' },
        isPoisonous: false,
        careTips: [
            { title: 'Watering', description: 'Requires a lot of water, especially during peak growth. Water deeply but infrequently to encourage deep root growth.' },
            { title: 'Sunlight', description: 'Full sun is essential. Needs at least 6-8 hours of direct sunlight per day.' },
            { title: 'Soil', description: 'Prefers well-drained, slightly alkaline soil. Can tolerate a range of soil types.' },
            { title: 'Fertilizer', description: 'Use a slow-release granular fertilizer or feed with a liquid fertilizer every few weeks.' },
            { title: 'Environment', description: 'Protect from strong winds, as tall stalks can break easily. Staking may be necessary.' },
            { title: 'Extra Tips', description: 'Harvest seeds after the flower head droops and the back turns yellow-brown.' },
        ]
    },
    {
        id: 12, category: 'Plant', name: 'Lavender', scientificName: 'Lavandula',
        keyInformation: 'A fragrant herb in the mint family, known for its purple flowers and calming scent. Used in essential oils and culinary arts.',
        furtherReading: 'https://en.wikipedia.org/wiki/Lavandula',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'blue', shape: 'simple', size: 'small' },
        isPoisonous: false,
    },
    {
        id: 18, category: 'Plant', name: 'Snake Plant', scientificName: 'Dracaena trifasciata',
        keyInformation: 'A very hardy and popular houseplant with stiff, upright leaves. Known for its air-purifying qualities and tolerance of low light.',
        furtherReading: 'https://en.wikipedia.org/wiki/Dracaena_trifasciata',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'green', shape: 'simple', size: 'medium' },
        isPoisonous: true,
        toxicityWarning: 'Mildly toxic to pets if ingested, which can cause gastrointestinal issues like nausea, vomiting, and diarrhea.',
        careTips: [
            { title: 'Watering', description: 'Water sparingly. Allow soil to dry out completely between waterings. Overwatering is the most common cause of death.' },
            { title: 'Sunlight', description: 'Prefers indirect light but is highly tolerant of low light conditions. Can also handle some direct sun.' },
            { title: 'Soil', description: 'Use a free-draining cactus or succulent mix to prevent root rot.' },
            { title: 'Extra Tips', description: 'Extremely durable and a great choice for beginners. Can be easily propagated by leaf cuttings.' }
        ]
    },
    {
        id: 22, category: 'Plant', name: 'Pothos', scientificName: 'Epipremnum aureum',
        keyInformation: 'A popular and very hardy houseplant with heart-shaped, waxy leaves. It is a vine that can trail or climb. Toxic to pets if ingested.',
        furtherReading: 'https://en.wikipedia.org/wiki/Epipremnum_aureum',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'green', shape: 'simple', size: 'small' },
        isPoisonous: true,
        toxicityWarning: 'Toxic to cats and dogs if ingested. It can cause oral irritation, vomiting, and difficulty swallowing.',
        careTips: [
            { title: 'Watering', description: 'Water every 1-2 weeks, allowing the soil to dry out between waterings. Tolerant of underwatering.' },
            { title: 'Sunlight', description: 'Thrives in a wide range of lighting conditions, from low to bright indirect light. Avoid direct sun, which can scorch leaves.' },
            { title: 'Soil', description: 'Use a standard, well-draining potting soil.' },
            { title: 'Extra Tips', description: 'Known for its air-purifying abilities. Extremely easy to propagate from stem cuttings in water or soil.' }
        ]
    },


    // --- TREES ---
    {
        id: 4, category: 'Tree', name: 'Oak Tree', scientificName: 'Quercus',
        keyInformation: 'A keystone species in many ecosystems, known for its strength, acorns, and lobed leaves. Supports a high diversity of wildlife.',
        furtherReading: 'https://en.wikipedia.org/wiki/Oak',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'rough', leaf_shape: 'lobed', has_fruit: 'yes' },
        isPoisonous: true,
        toxicityWarning: 'Leaves and acorns are toxic to cattle, horses, sheep, and goats if eaten in large quantities, due to tannic acid.',
    },
    {
        id: 5, category: 'Tree', name: 'Pine Tree', scientificName: 'Pinus',
        keyInformation: 'An evergreen coniferous tree with characteristic needles and cones. Important for timber and paper production.',
        furtherReading: 'https://en.wikipedia.org/wiki/Pine',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'rough', leaf_shape: 'needle', has_fruit: 'no' },
        isPoisonous: false,
    },
    {
        id: 6, category: 'Tree', name: 'Paper Birch', scientificName: 'Betula papyrifera',
        keyInformation: 'A deciduous tree known for its thin, white bark that often peels in paper-like layers. Native to North America.',
        furtherReading: 'https://en.wikipedia.org/wiki/Betula_papyrifera',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'peeling', leaf_shape: 'simple', has_fruit: 'no' },
        isPoisonous: false,
    },
    {
        id: 13, category: 'Tree', name: 'Japanese Maple', scientificName: 'Acer palmatum',
        keyInformation: 'A popular ornamental tree known for its striking leaf shapes and vibrant red or purple colors. Native to Asia.',
        furtherReading: 'https://en.wikipedia.org/wiki/Acer_palmatum',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'smooth', leaf_shape: 'lobed', has_fruit: 'no' },
        isPoisonous: false,
    },
    
    // --- WEEDS ---
    {
        id: 7, category: 'Weed', name: 'Dandelion', scientificName: 'Taraxacum',
        keyInformation: 'An invasive weed with yellow flowers and a deep taproot. The entire plant is edible and has medicinal uses.',
        furtherReading: 'https://en.wikipedia.org/wiki/Taraxacum',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'yellow', location: 'lawn', leaf_type: 'toothed' },
        isPoisonous: false,
    },
    {
        id: 8, category: 'Weed', name: 'White Clover', scientificName: 'Trifolium repens',
        keyInformation: 'A common lawn weed that fixes nitrogen in the soil. Its white flowers are attractive to bees. Can be invasive in gardens.',
        furtherReading: 'https://en.wikipedia.org/wiki/Trifolium_repens',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'white', location: 'lawn', leaf_type: 'broad' },
        isPoisonous: false,
    },
    {
        id: 14, category: 'Weed', name: 'Crabgrass', scientificName: 'Digitaria',
        keyInformation: 'An annual weed that spreads quickly in lawns and gardens, especially in summer heat. It outcompetes desired grasses.',
        furtherReading: 'https://en.wikipedia.org/wiki/Digitaria',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'other', location: 'lawn', leaf_type: 'grassy' },
        isPoisonous: false,
    },
    {
        id: 15, category: 'Weed', name: 'Canada Thistle', scientificName: 'Cirsium arvense',
        keyInformation: 'A persistent and invasive perennial weed with sharp spines on its leaves and purple flowers. Difficult to remove due to its root system.',
        furtherReading: 'https://en.wikipedia.org/wiki/Cirsium_arvense',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'red', location: 'garden', leaf_type: 'toothed' },
        isPoisonous: false, // Spiny, but not toxic
    },

    // --- INSECTS ---
    {
        id: 9, category: 'Insect', name: 'Honey Bee', scientificName: 'Apis mellifera',
        keyInformation: 'A vital pollinator for many crops and wild plants. Social insects living in large colonies. Will sting if threatened.',
        furtherReading: 'https://en.wikipedia.org/wiki/Honey_bee',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'yellow', wings: 'yes', legs: '6' },
        isPoisonous: true,
        toxicityWarning: 'Honey bees can deliver a painful sting that injects venom. For most people this is only painful, but it can cause a life-threatening allergic reaction in some individuals.',
    },
    {
        id: 10, category: 'Insect', name: 'Carpenter Ant', scientificName: 'Camponotus',
        keyInformation: 'A common pest that excavates wood to build nests, which can cause structural damage to homes. Does not eat wood.',
        furtherReading: 'https://en.wikipedia.org/wiki/Carpenter_ant',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'black', wings: 'no', legs: '6' },
        isPoisonous: false,
    },
    {
        id: 11, category: 'Insect', name: 'Garden Spider', scientificName: 'Argiope aurantia',
        keyInformation: 'A common orb-weaver spider, harmless to humans. Known for building large, intricate, circular webs in gardens.',
        furtherReading: 'https://en.wikipedia.org/wiki/Argiope_aurantia',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'yellow', wings: 'no', legs: '8' },
        isPoisonous: false,
    },
    {
        id: 16, category: 'Insect', name: 'Ladybug', scientificName: 'Coccinellidae',
        keyInformation: 'A well-known beetle, considered a beneficial insect as it preys on aphids and other garden pests. Many cultures consider it a sign of good luck.',
        furtherReading: 'https://en.wikipedia.org/wiki/Coccinellidae',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'red', wings: 'yes', legs: '6' },
        isPoisonous: false,
    },
    {
        id: 19, category: 'Insect', name: 'Monarch Butterfly', scientificName: 'Danaus plexippus',
        keyInformation: 'A famous migratory butterfly known for its striking orange and black wings. Its larvae feed exclusively on milkweed plants.',
        furtherReading: 'https://en.wikipedia.org/wiki/Monarch_butterfly',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'orange', wings: 'yes', legs: '6' },
        isPoisonous: true,
        toxicityWarning: 'Monarchs are toxic to predators due to cardenolide chemicals they sequester from their milkweed diet. They are not dangerous to touch.',
    },
    {
        id: 26, category: 'Insect', name: 'Comma Butterfly', scientificName: 'Polygonia c-album',
        keyInformation: 'Known for its ragged-edged wings and a small, white C-shaped mark on the underside of its hindwings. It has a fast, erratic flight.',
        furtherReading: 'https://en.wikipedia.org/wiki/Polygonia_c-album',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'orange', wings: 'yes', legs: '6' },
        isPoisonous: false,
    },
    {
        id: 27, category: 'Insect', name: 'Praying Mantis', scientificName: 'Mantodea',
        keyInformation: 'A large, carnivorous insect known for its distinctive prayer-like posture. They are formidable predators in the garden, feeding on other insects.',
        furtherReading: 'https://en.wikipedia.org/wiki/Mantis',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'green', wings: 'yes', legs: '6' },
        isPoisonous: false,
    },
    {
        id: 28, category: 'Insect', name: 'Dragonfly', scientificName: 'Anisoptera',
        keyInformation: 'An insect known for its large multifaceted eyes, two pairs of strong transparent wings, and an elongated body. They are agile fliers and are generally found near water.',
        furtherReading: 'https://en.wikipedia.org/wiki/Dragonfly',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'blue', wings: 'yes', legs: '6' },
        isPoisonous: false,
    },

    // --- CACTI ---
    {
        id: 17, category: 'Cactus', name: 'Saguaro Cactus', scientificName: 'Carnegiea gigantea',
        keyInformation: 'A large, tree-like cactus native to the Sonoran Desert. Famous for its arms that branch out. Can live for over 150 years.',
        furtherReading: 'https://en.wikipedia.org/wiki/Saguaro',
        image: 'https://placehold.co/600x400.png',
        attributes: { shape: 'columnar', flowers: 'yes', color: 'green' },
        isPoisonous: false,
    },
    {
        id: 20, category: 'Cactus', name: 'Prickly Pear', scientificName: 'Opuntia',
        keyInformation: 'A cactus characterized by its flat, paddle-like stems. Produces edible fruit (tunas) and pads (nopales). Covered in sharp spines and smaller glochids.',
        furtherReading: 'https://en.wikipedia.org/wiki/Opuntia',
        image: 'https://placehold.co/600x400.png',
        attributes: { shape: 'paddles', flowers: 'yes', color: 'green' },
        isPoisonous: false,
    },
    {
        id: 21, category: 'Cactus', name: 'Golden Barrel Cactus', scientificName: 'Echinocactus grusonii',
        keyInformation: 'A popular landscape cactus, nearly spherical in shape. Known for its sharp, yellow spines. Endangered in the wild.',
        furtherReading: 'https://en.wikipedia.org/wiki/Echinocactus_grusonii',
        image: 'https://placehold.co/600x400.png',
        attributes: { shape: 'globular', flowers: 'yes', color: 'green' },
        isPoisonous: false,
    },

    // --- SUCCULENTS ---
    {
        id: 23, category: 'Succulent', name: 'Echeveria', scientificName: 'Echeveria',
        keyInformation: 'A large genus of rosette-forming succulents, popular in arrangements and rock gardens. They come in a wide variety of colors and shapes.',
        furtherReading: 'https://en.wikipedia.org/wiki/Echeveria',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'blue', shape: 'rosette', texture: 'fleshy' },
        isPoisonous: false,
        careTips: [
            { title: 'Watering', description: 'Water thoroughly when soil is completely dry to the touch. Avoid letting water sit in the rosette.' },
            { title: 'Sunlight', description: 'Prefers full sun to light shade. Brighter light brings out more vibrant colors in the leaves.' },
            { title: 'Soil', description: 'Use a well-draining succulent or cactus mix. Good drainage is critical to prevent root rot.' },
            { title: 'Environment', description: 'Protect from frost. Most Echeverias are not cold-hardy.' }
        ]
    },
    {
        id: 24, category: 'Succulent', name: 'Jade Plant', scientificName: 'Crassula ovata',
        keyInformation: 'A very common houseplant with thick, woody stems and glossy, green, fleshy leaves. Often considered a symbol of good luck.',
        furtherReading: 'https://en.wikipedia.org/wiki/Crassula_ovata',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'green', shape: 'oval', texture: 'fleshy' },
        isPoisonous: true,
        toxicityWarning: 'Mildly toxic to cats and dogs. Ingestion may cause vomiting and depression.',
        careTips: [
            { title: 'Watering', description: 'Water when the soil is dry to the touch. Be careful not to overwater, especially in winter.' },
            { title: 'Sunlight', description: 'Needs plenty of light. At least 4 hours of direct sun per day is ideal.' },
            { title: 'Soil', description: 'Use a standard succulent potting mix with excellent drainage.' },
            { title: 'Extra Tips', description: 'Easy to propagate from a single leaf or stem cutting.' }
        ]
    },
    {
        id: 25, category: 'Succulent', name: 'Hens and Chicks', scientificName: 'Sempervivum',
        keyInformation: 'Hardy, rosette-forming succulents that produce numerous offspring (chicks) around the main plant (hen). Extremely drought-tolerant.',
        furtherReading: 'https://en.wikipedia.org/wiki/Sempervivum',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'green', shape: 'rosette', texture: 'fleshy' },
        isPoisonous: false,
        careTips: [
            { title: 'Watering', description: 'Very drought-tolerant. Water only when the soil is completely dry.' },
            { title: 'Sunlight', description: 'Thrives in full sun and well-drained, gritty soil.' },
            { title: 'Soil', description: 'Requires sandy, well-draining soil. Does not tolerate wet conditions.' },
            { title: 'Extra Tips', description: 'The "hen" plant dies after flowering, but the "chicks" will live on and take its place.' }
        ]
    }
];

export function findSpeciesByName(name: string): Species | null {
    const searchTerm = name.toLowerCase();
    const species = database.find(s => s.name.toLowerCase() === searchTerm || s.scientificName.toLowerCase() === searchTerm);
    return species || null;
}

export function searchDatabase(query: string, category: Category | null): Species[] {
    const searchTerm = query.toLowerCase();
    return database.filter(s => {
        const inCategory = category ? s.category === category : true;
        const nameMatch = s.name.toLowerCase().includes(searchTerm);
        const scientificNameMatch = s.scientificName.toLowerCase().includes(searchTerm);
        const idMatch = s.id.toString() === searchTerm;
        return inCategory && (nameMatch || scientificNameMatch || idMatch);
    });
}
