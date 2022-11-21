import {
  CheckboxIcon,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React from "react";
import { User } from "firebase/auth";

type SearchinputProps = {
  user?: User | null;
};

const Searchinput: React.FC<SearchinputProps> = ({ user }) => {
  return (
    <Flex flexGrow={1} mr={2} align="center" maxWidth={user ? "auto" : "600px"}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" mb={1} />}
        />
        <Input
          type="text"
          placeholder="Search reddit"
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
          }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          height="34px"
          bg="gray.50"
        />
      </InputGroup>
    </Flex>
  );
};
export default Searchinput;
