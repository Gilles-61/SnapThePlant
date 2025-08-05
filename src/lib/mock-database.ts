
import type { Category } from "@/components/category-selector";
import type { Answers } from "@/components/identification-quiz";

export interface Species {
    id: number;
    category: Category;
    name: string;
    keyInformation: string;
    furtherReading: string;
    image: string;
    attributes: Record<string, string>;
}

const database: Species[] = [
    // --- PLANTS ---
    {
        id: 1, category: 'Plant', name: 'Monstera Deliciosa',
        keyInformation: 'A tropical plant famous for its large, glossy, perforated leaves. It is a popular houseplant but toxic to pets.',
        furtherReading: 'https://en.wikipedia.org/wiki/Monstera_deliciosa',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'green', shape: 'lobed', size: 'medium' }
    },
    {
        id: 2, category: 'Plant', name: 'Rose',
        keyInformation: 'A woody perennial with thorny stems. Cultivated for its beautiful and fragrant flowers. Some varieties produce edible rose hips.',
        furtherReading: 'https://en.wikipedia.org/wiki/Rose',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'red', shape: 'compound', size: 'small' }
    },
    {
        id: 3, category: 'Plant', name: 'Sunflower',
        keyInformation: 'A large annual flower known for following the sun. Its seeds are a common food source. Caution: Can cause allergies.',
        furtherReading: 'https://en.wikipedia.org/wiki/Helianthus',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'yellow', shape: 'simple', size: 'large' }
    },
    {
        id: 12, category: 'Plant', name: 'Lavender',
        keyInformation: 'A fragrant herb in the mint family, known for its purple flowers and calming scent. Used in essential oils and culinary arts.',
        furtherReading: 'https://en.wikipedia.org/wiki/Lavandula',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'blue', shape: 'simple', size: 'small' }
    },

    // --- TREES ---
    {
        id: 4, category: 'Tree', name: 'Oak Tree',
        keyInformation: 'A keystone species in many ecosystems, known for its strength, acorns, and lobed leaves. Supports a high diversity of wildlife.',
        furtherReading: 'https://en.wikipedia.org/wiki/Oak',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'rough', leaf_shape: 'lobed', has_fruit: 'yes' }
    },
    {
        id: 5, category: 'Tree', name: 'Pine Tree',
        keyInformation: 'An evergreen coniferous tree with characteristic needles and cones. Important for timber and paper production.',
        furtherReading: 'https://en.wikipedia.org/wiki/Pine',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'rough', leaf_shape: 'needle', has_fruit: 'no' }
    },
    {
        id: 6, category: 'Tree', name: 'Paper Birch',
        keyInformation: 'A deciduous tree known for its thin, white bark that often peels in paper-like layers. Native to North America.',
        furtherReading: 'https://en.wikipedia.org/wiki/Betula_papyrifera',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'peeling', leaf_shape: 'simple', has_fruit: 'no' }
    },
    {
        id: 13, category: 'Tree', name: 'Japanese Maple',
        keyInformation: 'A popular ornamental tree known for its striking leaf shapes and vibrant red or purple colors. Native to Asia.',
        furtherReading: 'https://en.wikipedia.org/wiki/Acer_palmatum',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'smooth', leaf_shape: 'lobed', has_fruit: 'no' }
    },
    
    // --- WEEDS ---
    {
        id: 7, category: 'Weed', name: 'Dandelion',
        keyInformation: 'An invasive weed with yellow flowers and a deep taproot. The entire plant is edible and has medicinal uses.',
        furtherReading: 'https://en.wikipedia.org/wiki/Taraxacum',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'yellow', location: 'lawn', leaf_type: 'toothed' }
    },
    {
        id: 8, category: 'Weed', name: 'White Clover',
        keyInformation: 'A common lawn weed that fixes nitrogen in the soil. Its white flowers are attractive to bees. Can be invasive in gardens.',
        furtherReading: 'https://en.wikipedia.org/wiki/Trifolium_repens',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'white', location: 'lawn', leaf_type: 'broad' }
    },
    {
        id: 14, category: 'Weed', name: 'Crabgrass',
        keyInformation: 'An annual weed that spreads quickly in lawns and gardens, especially in summer heat. It outcompetes desired grasses.',
        furtherReading: 'https://en.wikipedia.org/wiki/Digitaria',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'other', location: 'lawn', leaf_type: 'grassy' }
    },
    {
        id: 15, category: 'Weed', name: 'Canada Thistle',
        keyInformation: 'A persistent and invasive perennial weed with sharp spines on its leaves and purple flowers. Difficult to remove due to its root system.',
        furtherReading: 'https://en.wikipedia.org/wiki/Cirsium_arvense',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'red', location: 'garden', leaf_type: 'toothed' }
    },

    // --- INSECTS ---
    {
        id: 9, category: 'Insect', name: 'Honey Bee',
        keyInformation: 'A vital pollinator for many crops and wild plants. Social insects living in large colonies. Will sting if threatened.',
        furtherReading: 'https://en.wikipedia.org/wiki/Honey_bee',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'yellow', wings: 'yes', legs: '6' }
    },
    {
        id: 10, category: 'Insect', name: 'Carpenter Ant',
        keyInformation: 'A common pest that excavates wood to build nests, which can cause structural damage to homes. Does not eat wood.',
        furtherReading: 'https://en.wikipedia.org/wiki/Carpenter_ant',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'other', wings: 'no', legs: '6' }
    },
    {
        id: 11, category: 'Insect', name: 'Garden Spider',
        keyInformation: 'A common orb-weaver spider, harmless to humans. Known for building large, intricate, circular webs in gardens.',
        furtherReading: 'https://en.wikipedia.org/wiki/Argiope_aurantia',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'yellow', wings: 'no', legs: '8' }
    },
    {
        id: 16, category: 'Insect', name: 'Ladybug',
        keyInformation: 'A well-known beetle, considered a beneficial insect as it preys on aphids and other garden pests. Many cultures consider it a sign of good luck.',
        furtherReading: 'https://en.wikipedia.org/wiki/Coccinellidae',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'red', wings: 'yes', legs: '6' }
    }
];

export function filterDatabase(category: Category, answers: Answers): Species[] {
    return database.filter(species => {
        if (species.category !== category) {
            return false;
        }

        // If no answers are provided, return all species in the category.
        if (Object.keys(answers).length === 0) {
            return true;
        }

        for (const key in answers) {
            const userAnswer = answers[key];
            const speciesAttribute = species.attributes[key];

            if (userAnswer && speciesAttribute && userAnswer !== speciesAttribute) {
                return false;
            }
        }

        return true;
    });
}
