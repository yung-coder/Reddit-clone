import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import About from "../../../components/Community/About";
import PageContent from "../../../components/Layout/PageContent";
import NewPostFrom from "../../../components/Post/NewPostFrom";
import { communityState } from "../../../src/atoms/communitiesAtom";
import { auth } from "../../../src/firebase/Client";
import useCommunityData from "../../../src/hooks/useCommunityData";

const sumbit: React.FC = () => {
  const [user] = useAuthState(auth);
  // const communityStateValue = useRecoilValue(communityState);
  const { CommunityStateValue } = useCommunityData();
  console.log("community", CommunityStateValue);
  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a Post</Text>
        </Box>
        {user && <NewPostFrom user={user} communityImageURL={CommunityStateValue.currentCommunity?.imageURL}/>}
      </>
      <>
        {CommunityStateValue.currentCommunity && (
          <About communityData={CommunityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};
export default sumbit;
