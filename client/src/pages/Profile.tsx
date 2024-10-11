import React from "react";

interface User {
    username: string;
    email: string;
    company: string;
    link: string;
}

const user: User = {
    username: 'BobTest',
    email: 'BobTest@test.com',
    company: 'Test Guys Inc.',
    link: 'https.//aws.amazon.com',
}

const Profile: React.FC = () => {
    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>{user.username}</h1>
                <p>Email: {user.email}</p>
                <p>Company: {user.company}</p>
                <a href={user.link} target="_blank" rel="noopener noreferrer">
                    Visit AWS
                </a>
            </div>
        </div>
    )
}

export default Profile;