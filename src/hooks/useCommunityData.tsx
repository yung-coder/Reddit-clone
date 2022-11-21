import { async } from "@firebase/util";
import { setDefaultResultOrder } from "dns/promises";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/Client";

const useCommunityData = () => {
  const [CommunityStateValue, setCommuintyStatevalue] =
    useRecoilState(communityState);

  const [loading, setlaoding] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const onJoinOrcreateCommunity = (
    communityData: Community,
    isjoined: boolean
  ) => {
    if (!user) {
      setAuthModalState({ open: true, view: "Login" });
      return;
    }
    if (isjoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setlaoding(true);
    try {
      const snippetsDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetsDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommuintyStatevalue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched: true,
      }));
    } catch (error: any) {
      console.log(error);
    }
    setlaoding(false);
  };

  const joinCommunity = async (communityData: Community) => {
    try {
      const batch = writeBatch(firestore);
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator: user?.uid == communityData.creatorId,
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id), {
        numberofMembers: increment(1),
      });

      await batch.commit();

      setCommuintyStatevalue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error) {
      console.log(error);
    }
    setlaoding(false);
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      const batch = writeBatch(firestore);
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      batch.update(doc(firestore, "communities", communityId), {
        numberofMembers: increment(-1),
      });

      await batch.commit();

      setCommuintyStatevalue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log(error);
    }
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId);
      const communityDoc = await getDoc(communityDocRef);

      setCommuintyStatevalue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...(communityDoc.data() as Community),
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      setCommuintyStatevalue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const { communityId } = router.query;

    if (communityId && !CommunityStateValue.currentCommunity) {
      getCommunityData(communityId as string);
    }
  }, [router.query , CommunityStateValue.currentCommunity]);

  return {
    CommunityStateValue,
    onJoinOrcreateCommunity,
    loading,
  };
};

export default useCommunityData;
