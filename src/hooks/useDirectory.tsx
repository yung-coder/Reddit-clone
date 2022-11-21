import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FaReddit } from "react-icons/fa";
import { useRecoilState, useRecoilStateLoadable, useRecoilValue } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import {
  DirectoryMenuItem,
  DirectoryMenuState,
} from "../atoms/directoryMenuAtom";

const useDirectory = () => {
  const [directoryState, setDirectoryState] =
    useRecoilState(DirectoryMenuState);
  const router = useRouter();
  const communityStateValue = useRecoilValue(communityState);

  const toogleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }));
  };

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));
    router.push(menuItem.link);
    if (directoryState.isOpen) {
      toogleMenuOpen();
    }
  };

  useEffect(() => {
    const { currentCommunity } = communityStateValue;

    if (currentCommunity) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${currentCommunity.id}`,
          link: `r/${currentCommunity.id}`,
          icon: FaReddit,
          iconColor: "blue.500",
          imageURL: currentCommunity.imageURL,
        },
      }));
    }
  }, [communityStateValue.currentCommunity]);

  return {
    directoryState,
    toogleMenuOpen,
    onSelectMenuItem,
  };
};
export default useDirectory;
