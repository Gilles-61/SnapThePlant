
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
    // Plants
    {
        id: 1, category: 'Plant', name: 'Monstera Deliciosa',
        keyInformation: 'Known for its large, glossy, and uniquely perforated leaves.',
        furtherReading: 'https://en.wikipedia.org/wiki/Monstera_deliciosa',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'green', shape: 'lobed', size: 'medium' }
    },
    {
        id: 2, category: 'Plant', name: 'Rose',
        keyInformation: 'A woody perennial flowering plant of the genus Rosa.',
        furtherReading: 'https://en.wikipedia.org/wiki/Rose',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'red', shape: 'compound', size: 'small' }
    },
    {
        id: 3, category: 'Plant', name: 'Sunflower',
        keyInformation: 'A large annual forb of the genus Helianthus grown as a crop for its edible oil and seeds.',
        furtherReading: 'https://en.wikipedia.org/wiki/Helianthus',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'yellow', shape: 'simple', size: 'medium' }
    },
    // Trees
    {
        id: 4, category: 'Tree', name: 'Oak Tree',
        keyInformation: 'A common tree in the Northern Hemisphere known for its strength, longevity, and acorns.',
        furtherReading: 'https://en.wikipedia.org/wiki/Oak',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'rough', leaf_shape: 'lobed', has_fruit: 'yes' }
    },
    {
        id: 5, category: 'Tree', name: 'Pine Tree',
        keyInformation: 'Coniferous trees in the genus Pinus, in the family Pinaceae.',
        furtherReading: 'https://en.wikipedia.org/wiki/Pine',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'rough', leaf_shape: 'needle', has_fruit: 'no' }
    },
    {
        id: 6, category: 'Tree', name: 'Birch Tree',
        keyInformation: 'A thin-leaved deciduous hardwood tree of the genus Betula.',
        furtherReading: 'https://en.wikipedia.org/wiki/Birch',
        image: 'https://placehold.co/600x400.png',
        attributes: { bark: 'peeling', leaf_shape: 'simple', has_fruit: 'no' }
    },
    // Weeds
    {
        id: 7, category: 'Weed', name: 'Dandelion',
        keyInformation: 'Well-known for their yellow flower heads that turn into round balls of silver-tufted fruits.',
        furtherReading: 'https://en.wikipedia.org/wiki/Taraxacum',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'yellow', location: 'lawn', leaf_type: 'toothed' }
    },
    {
        id: 8, category: 'Weed', name: 'Clover',
        keyInformation: 'Commonly found in lawns, known for its three-leaflet leaves.',
        furtherReading: 'https://en.wikipedia.org/wiki/Clover',
        image: 'https://placehold.co/600x400.png',
        attributes: { flower_color: 'white', location: 'lawn', leaf_type: 'broad' }
    },
    // Insects
    {
        id: 9, category: 'Insect', name: 'Honey Bee',
        keyInformation: 'Social flying insects known for their construction of perennial, colonial nests from wax.',
        furtherReading: 'https://en.wikipedia.org/wiki/Honey_bee',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'yellow', wings: 'yes', legs: '6' }
    },
    {
        id: 10, category: 'Insect', name: 'Ant',
        keyInformation: 'Eusocial insects of the family Formicidae and, along with the related wasps and bees, belong to the order Hymenoptera.',
        furtherReading: 'https://en.wikipedia.org/wiki/Ant',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'other', wings: 'no', legs: '6' }
    },
    {
        id: 11, category: 'Insect', name: 'Spider',
        keyInformation: 'Air-breathing arthropods that have eight legs, chelicerae with fangs generally able to inject venom.',
        furtherReading: 'https://en.wikipedia.org/wiki/Spider',
        image: 'https://placehold.co/600x400.png',
        attributes: { color: 'other', wings: 'no', legs: '8' }
    }
];

export function filterDatabase(category: Category, answers: Answers): Species[] {
    return database.filter(species => {
        if (species.category !== category) {
            return false;
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
