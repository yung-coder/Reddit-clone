import { Flex } from "@chakra-ui/react";
import React from "react";

type PageContentProps = {
  children: any;
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <Flex  justify="center" p="16px 0px">
      <Flex
        // border="1px solid green"
        justify="center"
        maxWidth="860px"
        width="95%"
      >
        {/* lsh */}
        <Flex
          // border="1px solid blue"
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children[0]}
        </Flex>

        {/* rhs */}
        <Flex
          // border="1px solid pink"
          direction="column"
          display={{ base: "none", md: "flex" }}
          flexGrow={1}
        >
          {children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContent;
