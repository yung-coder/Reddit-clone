import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../src/firebase/Client";
import RightContent from "./RightContent/RightContent";
import Searchinput from "./Searchinput";
import Directory from "./Directory/Directory";
import useDirectory from "../../src/hooks/useDirectory";
import { defaultMenuItem } from "../../src/atoms/directoryMenuAtom";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const {onSelectMenuItem} = useDirectory();
  return (
    <Flex
      bg="white"
      height="44px"
      padding="4px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor='pointer'
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        <Image src="/images/redditFace.svg" height="30px" />
        <Image
          src="/images/redditText.svg"
          height="40px"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      {user && <Directory />}
      <Searchinput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
