import React from "react";
import { ProfileProps } from "../types";

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
    link: 'https://aws.amazon.com',
};

const Profile: React.FC<ProfileProps> = ({ isDarkMode }) => {
    return (
        <div className={`profile-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className={`profile-header ${isDarkMode ? 'dark-mode' : ''}`}>
                <h1>{user.username}</h1>
                <p>Email: {user.email}</p>
                <p>Company: {user.company}</p>
                <a href={user.link} target="_blank" rel="noopener noreferrer">
                    Visit AWS
                </a>
            </div>
        </div>
    );
};

export default Profile;
