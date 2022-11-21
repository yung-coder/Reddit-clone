import { Stack } from "@chakra-ui/react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { NextPage } from "next";
import { use, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import CreatePostLink from "../components/Community/CreatePostLink";
import Recommendetions from "../components/Community/Recommendetions";
import PageContent from "../components/Layout/PageContent";
import PostItem from "../components/Post/PostItem";
import PostLoader from "../components/Post/PostLoader";
import { communityState } from "../src/atoms/communitiesAtom";
import { Post, PostVote } from "../src/atoms/postAtom";
import { auth, firestore } from "../src/firebase/Client";
import useCommunityData from "../src/hooks/useCommunityData";
import usePosts from "../src/hooks/usePosts";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setloading] = useState(false);
  const {
    setPostStateValue,
    postStateValue,
    onDeletPost,
    onVote,
    onSelectPost,
  } = usePosts();
  const { CommunityStateValue } = useCommunityData();

  const buildUerHomeFeed = async () => {
    setloading(true);
    try {
      if (CommunityStateValue.mySnippets.length) {

        const myCommunityIds = CommunityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );
        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error: any) {
      console.log("getUserHomePosts error", error.message);
    }
    setloading(false);
  };

  const buildNoUserHomeFeed = async () => {
    setloading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("NO USER FEED", posts);

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log(error);
    }
    setloading(false);
  };

  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const postVotesDocs = await getDocs(postVotesQuery);
      const postVotes = postVotesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (CommunityStateValue.snippetsFetched) buildUerHomeFeed();
  }, [CommunityStateValue.snippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();

    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, postStateValue.posts]);

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post: Post) => (
              <PostItem
                key={post.id}
                post={post}
                onVote={onVote}
                onDeletPost={onDeletPost}
                userVotedvalue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                onSelectPost={onSelectPost}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <>
        <Recommendetions />
      </>
    </PageContent>
  );
};

export default Home;
