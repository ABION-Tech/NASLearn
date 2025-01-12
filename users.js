// users.js

export const users = [
    {
        "email": "student1@example.com",
        "password": "$2b$10$VjXs6Z5IgP1eYmnX9OnvGecD9lXbVjO9Pb0VvmGGG7wTtOZ8gf.rO",  // bcrypt hash of "password"
        "course": "Data Analysis",
        "progress": {
            "lessonsCompleted": 3,
            "totalLessons": 10
        }
    },
    {
        "email": "student2@example.com",
        "password": "$2b$10$F5W4R1pd8HLLOtcMOrDbW5Vx1x4DTyWzY5RylOp22mDChzLgfq6fW",  // bcrypt hash of "123"
        "course": "Web Development",
        "progress": {
            "lessonsCompleted": 1,
            "totalLessons": 8
        }
    }
];
