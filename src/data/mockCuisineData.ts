export interface CuisineItem {
    id: string;
    name: string;
    slug: string;
    image: unknown;
    description: string;
    menuItems: MenuItem[];
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    isVegetarian: boolean;
    rating: number;
    prepTime: string;
}

export const mockCuisineData: CuisineItem[] = [
    {
        id: '1',
        name: 'Mini South',
        slug: 'mini-south',
        image: require('@/assets/images/Cuisins/cuisine 1.png'),
        description: 'Authentic South Indian delicacies',
        menuItems: [
            {
                id: 's1',
                name: 'Masala Dosa',
                price: 120,
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
                description: 'Crispy rice crepe filled with spiced potatoes',
                isVegetarian: true,
                rating: 4.5,
                prepTime: '15 mins',
            },
            {
                id: 's2',
                name: 'Idli Sambar',
                price: 80,
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
                description: 'Soft rice cakes with lentil curry',
                isVegetarian: true,
                rating: 4.3,
                prepTime: '10 mins',
            },
            {
                id: 's3',
                name: 'Biryani',
                price: 200,
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
                description: 'Fragrant basmati rice with tender meat',
                isVegetarian: false,
                rating: 4.7,
                prepTime: '25 mins',
            },
        ],
    },
    {
        id: '2',
        name: 'Mo China',
        slug: 'mo-china',
        image: require('@/assets/images/Cuisins/cuisine 2.png'),
        description: 'Authentic Chinese flavors',
        menuItems: [
            {
                id: 'c1',
                name: 'Kung Pao Chicken',
                price: 180,
                image: 'https://images.unsplash.com/photo-1563379091-4e5b5b4b4b4b?w=400',
                description: 'Spicy stir-fried chicken with peanuts',
                isVegetarian: false,
                rating: 4.4,
                prepTime: '20 mins',
            },
            {
                id: 'c2',
                name: 'Vegetable Spring Rolls',
                price: 90,
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
                description: 'Crispy rolls filled with fresh vegetables',
                isVegetarian: true,
                rating: 4.2,
                prepTime: '12 mins',
            },
            {
                id: 'c3',
                name: 'Sweet and Sour Soup',
                price: 110,
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
                description: 'Traditional Chinese soup with vegetables',
                isVegetarian: true,
                rating: 4.1,
                prepTime: '15 mins',
            },
        ],
    },
    {
        id: '3',
        name: 'Italian Delight',
        slug: 'italian-delight',
        image: require('@/assets/images/Cuisins/cuisine 3.png'),
        description: 'Classic Italian cuisine',
        menuItems: [
            {
                id: 'i1',
                name: 'Margherita Pizza',
                price: 220,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
                description: 'Fresh tomato, mozzarella, and basil',
                isVegetarian: true,
                rating: 4.6,
                prepTime: '18 mins',
            },
            {
                id: 'i2',
                name: 'Spaghetti Carbonara',
                price: 190,
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
                description: 'Creamy pasta with eggs and pancetta',
                isVegetarian: false,
                rating: 4.5,
                prepTime: '16 mins',
            },
            {
                id: 'i3',
                name: 'Tiramisu',
                price: 150,
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
                description: 'Classic Italian dessert with coffee',
                isVegetarian: true,
                rating: 4.8,
                prepTime: '8 mins',
            },
        ],
    },
    {
        id: '4',
        name: 'Asian Fusion',
        slug: 'asian-fusion',
        image: require('@/assets/images/Cuisins/cuisine 4.png'),
        description: 'Modern Asian fusion dishes',
        menuItems: [
            {
                id: 'a1',
                name: 'Ramen Bowl',
                price: 160,
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
                description: 'Rich broth with noodles and toppings',
                isVegetarian: false,
                rating: 4.4,
                prepTime: '22 mins',
            },
            {
                id: 'a2',
                name: 'Thai Green Curry',
                price: 170,
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
                description: 'Spicy coconut curry with vegetables',
                isVegetarian: true,
                rating: 4.3,
                prepTime: '20 mins',
            },
        ],
    },
    {
        id: '5',
        name: 'American Classics',
        slug: 'american-classics',
        image: require('@/assets/images/Cuisins/cuisine 5.png'),
        description: 'Traditional American favorites',
        menuItems: [
            {
                id: 'am1',
                name: 'Classic Burger',
                price: 180,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
                description: 'Beef patty with lettuce, tomato, and cheese',
                isVegetarian: false,
                rating: 4.5,
                prepTime: '15 mins',
            },
            {
                id: 'am2',
                name: 'BBQ Ribs',
                price: 280,
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
                description: 'Tender ribs with smoky BBQ sauce',
                isVegetarian: false,
                rating: 4.7,
                prepTime: '30 mins',
            },
            {
                id: 'am3',
                name: 'Mac and Cheese',
                price: 140,
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
                description: 'Creamy pasta with melted cheese',
                isVegetarian: true,
                rating: 4.2,
                prepTime: '12 mins',
            },
        ],
    },
];

export const getAllMenuItems = () => {
    return mockCuisineData.flatMap(cuisine => 
        cuisine.menuItems.map(item => ({
            ...item,
            cuisineId: cuisine.id,
            cuisineName: cuisine.name,
            cuisineSlug: cuisine.slug,
        })),
    );
};

export const getCuisineBySlug = (slug: string) => {
    return mockCuisineData.find(cuisine => cuisine.slug === slug);
};

export const getAllCuisines = () => {
    return mockCuisineData.map(cuisine => ({
        id: cuisine.id,
        name: cuisine.name,
        slug: cuisine.slug,
        image: cuisine.image,
        description: cuisine.description,
    }));
};
