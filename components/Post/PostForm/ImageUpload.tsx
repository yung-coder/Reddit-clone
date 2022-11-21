import {
  Button,
  Flex,
  Image,
  Input,
  SelectField,
  Stack,
} from "@chakra-ui/react";
import React, { useRef } from "react";

type ImageUploadProps = {
  seletedFile?: string;
  onselectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  setSelectedFile,
  onselectImage,
  seletedFile,
  setSelectedTab,
}) => {
  const selectedRef = useRef<HTMLInputElement>(null);
  return (
    <Flex justify="center" align="center" width="100%" direction="column">
      {seletedFile ? (
        <>
          <Image src={seletedFile} maxWidth="400px" maxHeight="400px" />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectedTab("Post")}>
              Back to post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Flex
            justify="center"
            align="center"
            p={20}
            border="1px dashed"
            borderColor="gray.200"
            width="100%"
            borderRadius={4}
          >
            <Button
              variant="outline"
              height="20px"
              onClick={() => selectedRef.current?.click()}
            >
              Upload
            </Button>
            <Input
              type="file"
              ref={selectedRef}
              hidden
              onChange={onselectImage}
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};
export default ImageUpload;
