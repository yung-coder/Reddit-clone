import { Flex } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { CgCommunity } from "react-icons/cg";
import { Community, communityState } from "../../../src/atoms/communitiesAtom";
import { firestore } from "../../../src/firebase/Client";
import safeJsonStringify from "safe-json-stringify";
import CommunityNotFound from "../../../components/Community/CommuintyNotFound";
import Header from "../../../components/Community/Header";
import PageContent from "../../../components/Layout/PageContent";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Posts from "../../../components/Post/Posts";
import { useSetRecoilState } from "recoil";
import About from "../../../components/Community/About";

type indexProps = {
  communityData: Community;
};

const CommunityPage: React.FC<indexProps> = ({ communityData }) => {
  console.log(communityData);
  const setCommunityStateValue = useSetRecoilState(communityState);

  if (!communityData) {
    return (
      <>
        <CommunityNotFound />
      </>
    );
  }
  
  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, [communityData]);

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const commuintyDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: commuintyDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: commuintyDoc.id, ...commuintyDoc.data() })
            )
          : "",
      },
    };
  } catch (error) {
    console.log("server side errors", error);
  }
}

export default CommunityPage;
