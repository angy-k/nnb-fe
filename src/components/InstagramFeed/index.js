import React, { useEffect, useState } from 'react';
import Image from 'next/image'

const InstagramPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch the Instagram posts from an API
        const fetchInstagramPosts = async () => {
            try {
                // Example endpoint for an API (Replace with a real endpoint)
                const response = await fetch('https://api.instagram.com/instagram?username=novosadskinocnibazar');
                const data = await response.json();
                
                // Assuming data is an array of posts
                setPosts(data.slice(0, 9)); // Get the first 9 posts
            } catch (error) {
                console.error('Error fetching Instagram posts:', error);
            }
        };

        fetchInstagramPosts();
    }, []);

    return (
        <div className="instagram-grid">
            {posts.map((post, index) => (
                <div key={index} className="instagram-post">
                    <Image src={post.image_url} alt={post.caption} />
                </div>
            ))}
        </div>
    );
};

export default InstagramPosts;