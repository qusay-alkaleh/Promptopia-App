"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: sesstion } = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${sesstion?.user.id}/posts`);

      const data = await response.json();
      setPosts(data);
    };

    if (sesstion?.user.id) fetchPosts();
  }, []);

  const handleEdit = (post) => {
    router.push(`/prompt-update?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = posts.filter(
          (prevPost) => prevPost._id !== post._id
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error occure when deleting a post!" + error);
      }
    }
  };
  return (
    <Suspense>
      <Profile
        name="My"
        desc="Welcome to your personalized profile page"
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </Suspense>
  );
};

export default MyProfile;
