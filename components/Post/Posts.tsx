import { Flex, Stack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Community } from "../../src/atoms/communitiesAtom";
import { Post } from "../../src/atoms/postAtom";
import { auth, firestore } from "../../src/firebase/Client";
import usePosts from "../../src/hooks/usePosts";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [loading, setloading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletPost,
  } = usePosts();
  const getPosts = async () => {
    try {
      setloading(true);
      const postQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));

      console.log(posts);
    } catch (error: any) {
      console.log(error);
    }
    setloading(false);
  };

  useEffect(() => {
    getPosts();
  }, [communityData]);
  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((item) => {
            return (
              <PostItem
                key={item.id}
                post={item}
                userIsCreator={user?.uid === item.creatorId}
                userVotedvalue={
                  postStateValue.postVotes.find((vote) => vote.postId === item.id)
                    ?.voteValue
                }
                onVote={onVote}
                onSelectPost={onSelectPost}
                onDeletPost={onDeletPost}
              />
            );
          })}
        </Stack>
      )}
    </>
  );
};
export default Posts;
