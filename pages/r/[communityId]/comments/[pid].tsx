import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import About from "../../../../components/Community/About";
import PageContent from "../../../../components/Layout/PageContent";
import Comments from "../../../../components/Post/Comments/Comments";
import PostItem from "../../../../components/Post/PostItem";
import { Post } from "../../../../src/atoms/postAtom";
import { auth, firestore } from "../../../../src/firebase/Client";
import useCommunityData from "../../../../src/hooks/useCommunityData";
import usePosts from "../../../../src/hooks/usePosts";

const PostPage: React.FC = () => {
  const { postStateValue, setPostStateValue, onVote, onDeletPost } = usePosts();
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { CommunityStateValue } = useCommunityData();

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postId, ...postDoc.data() } as Post,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);
  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletPost={onDeletPost}
            userVotedvalue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}
        <Comments user={user as  User} selectedPost={postStateValue.selectedPost} communityId={postStateValue.selectedPost?.communityId as string}/>
      </>
      <>
        {CommunityStateValue.currentCommunity && (
          <About communityData={CommunityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};
export default PostPage;
