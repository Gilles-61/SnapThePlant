
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
}

const database: Species[] = [
    // --- PLANTS ---
    {
        id: 1, category: 'Plant', name: 'Monstera Deliciosa', scientificName: 'Monstera deliciosa',
        keyInformation: 'A tropical plant famous for its large, glossy, perforated leaves. It is a popular houseplant but toxic to pets.',
        furtherReading: 'https://en.wikipedia.org/wiki/Monstera_deliciosa',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'green', shape: 'lobed', size: 'medium' },
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
        attributes: { color: 'red', shape: 'compound', size: 'small' }
    },
    {
        id: 3, category: 'Plant', name: 'Sunflower', scientificName: 'Helianthus annuus',
        keyInformation: 'A large annual flower known for following the sun. Its seeds are a common food source. Caution: Can cause allergies.',
        furtherReading: 'https://en.wikipedia.org/wiki/Helianthus',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'yellow', shape: 'simple', size: 'large' },
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
        attributes: { color: 'blue', shape: 'simple', size: 'small' }
    },

    // --- TREES ---
    {
        id: 4, category: 'Tree', name: 'Oak Tree', scientificName: 'Quercus',
        keyInformation: 'A keystone species in many ecosystems, known for its strength, acorns, and lobed leaves. Supports a high diversity of wildlife.',
        furtherReading: 'https://en.wikipedia.org/wiki/Oak',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'rough', leaf_shape: 'lobed', has_fruit: 'yes' }
    },
    {
        id: 5, category: 'Tree', name: 'Pine Tree', scientificName: 'Pinus',
        keyInformation: 'An evergreen coniferous tree with characteristic needles and cones. Important for timber and paper production.',
        furtherReading: 'https://en.wikipedia.org/wiki/Pine',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'rough', leaf_shape: 'needle', has_fruit: 'no' }
    },
    {
        id: 6, category: 'Tree', name: 'Paper Birch', scientificName: 'Betula papyrifera',
        keyInformation: 'A deciduous tree known for its thin, white bark that often peels in paper-like layers. Native to North America.',
        furtherReading: 'https://en.wikipedia.org/wiki/Betula_papyrifera',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'peeling', leaf_shape: 'simple', has_fruit: 'no' }
    },
    {
        id: 13, category: 'Tree', name: 'Japanese Maple', scientificName: 'Acer palmatum',
        keyInformation: 'A popular ornamental tree known for its striking leaf shapes and vibrant red or purple colors. Native to Asia.',
        furtherReading: 'https://en.wikipedia.org/wiki/Acer_palmatum',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'smooth', leaf_shape: 'lobed', has_fruit: 'no' }
    },
    
    // --- WEEDS ---
    {
        id: 7, category: 'Weed', name: 'Dandelion', scientificName: 'Taraxacum',
        keyInformation: 'An invasive weed with yellow flowers and a deep taproot. The entire plant is edible and has medicinal uses.',
        furtherReading: 'https://en.wikipedia.org/wiki/Taraxacum',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'yellow', location: 'lawn', leaf_type: 'toothed' }
    },
    {
        id: 8, category: 'Weed', name: 'White Clover', scientificName: 'Trifolium repens',
        keyInformation: 'A common lawn weed that fixes nitrogen in the soil. Its white flowers are attractive to bees. Can be invasive in gardens.',
        furtherReading: 'https://en.wikipedia.org/wiki/Trifolium_repens',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'white', location: 'lawn', leaf_type: 'broad' }
    },
    {
        id: 14, category: 'Weed', name: 'Crabgrass', scientificName: 'Digitaria',
        keyInformation: 'An annual weed that spreads quickly in lawns and gardens, especially in summer heat. It outcompetes desired grasses.',
        furtherReading: 'https://en.wikipedia.org/wiki/Digitaria',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'other', location: 'lawn', leaf_type: 'grassy' }
    },
    {
        id: 15, category: 'Weed', name: 'Canada Thistle', scientificName: 'Cirsium arvense',
        keyInformation: 'A persistent and invasive perennial weed with sharp spines on its leaves and purple flowers. Difficult to remove due to its root system.',
        furtherReading: 'https://en.wikipedia.org/wiki/Cirsium_arvense',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'red', location: 'garden', leaf_type: 'toothed' }
    },

    // --- INSECTS ---
    {
        id: 9, category: 'Insect', name: 'Honey Bee', scientificName: 'Apis mellifera',
        keyInformation: 'A vital pollinator for many crops and wild plants. Social insects living in large colonies. Will sting if threatened.',
        furtherReading: 'https://en.wikipedia.org/wiki/Honey_bee',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'yellow', wings: 'yes', legs: '6' }
    },
    {
        id: 10, category: 'Insect', name: 'Carpenter Ant', scientificName: 'Camponotus',
        keyInformation: 'A common pest that excavates wood to build nests, which can cause structural damage to homes. Does not eat wood.',
        furtherReading: 'https://en.wikipedia.org/wiki/Carpenter_ant',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'other', wings: 'no', legs: '6' }
    },
    {
        id: 11, category: 'Insect', name: 'Garden Spider', scientificName: 'Argiope aurantia',
        keyInformation: 'A common orb-weaver spider, harmless to humans. Known for building large, intricate, circular webs in gardens.',
        furtherReading: 'https://en.wikipedia.org/wiki/Argiope_aurantia',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'yellow', wings: 'no', legs: '8' }
    },
    {
        id: 16, category: 'Insect', name: 'Ladybug', scientificName: 'Coccinellidae',
        keyInformation: 'A well-known beetle, considered a beneficial insect as it preys on aphids and other garden pests. Many cultures consider it a sign of good luck.',
        furtherReading: 'https://en.wikipedia.org/wiki/Coccinellidae',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'red', wings: 'yes', legs: '6' }
    },
    
    // --- CACTI ---
    {
        id: 17, category: 'Cactus', name: 'Saguaro Cactus', scientificName: 'Carnegiea gigantea',
        keyInformation: 'A large, tree-like cactus native to the Sonoran Desert. Famous for its arms that branch out. Can live for over 150 years.',
        furtherReading: 'https://en.wikipedia.org/wiki/Saguaro',
        image: 'https://placehold.co/600x400.png',
        attributes: { shape: 'columnar', flowers: 'yes', color: 'green' }
    }
];

export function filterDatabase(category: Category, attributes: Record<string, string>): Species[] {
    return database.filter(species => {
        if (species.category !== category) {
            return false;
        }

        // If no attributes are provided, return all species in the category (for text search).
        if (Object.keys(attributes).length === 0) {
            return true;
        }

        // Check if all provided attributes match the species' attributes.
        for (const key in attributes) {
            const speciesAttribute = species.attributes[key];
            const requiredAttribute = attributes[key];

            if (speciesAttribute && requiredAttribute && speciesAttribute.toLowerCase() !== requiredAttribute.toLowerCase()) {
                return false; // Mismatch found
            }
        }

        return true; // All attributes matched
    });
}
