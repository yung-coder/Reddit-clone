import { Alert, AlertIcon, Flex, Icon, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsLink45Deg } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { Post } from "../../src/atoms/postAtom";
import { firestore, storage } from "../../src/firebase/Client";
import useSelectFile from "../../src/hooks/useSelectFile";
import ImageUpload from "./PostForm/ImageUpload";
import TextInput from "./PostForm/TextInput";
import TabItem from "./TabItem";

type NewPostFromProps = {
  user: User;
  communityImageURL?: string;
};

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Videos",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostFrom: React.FC<NewPostFromProps> = ({
  user,
  communityImageURL,
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInupts, setTextInputs] = useState({
    title: "",
    body: "",
  });

  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);

  const handelCreatePost = async () => {
    const { communityId } = router.query;
    const newPost: Post = {
      communityId: communityId as string,
      communityImageURL: communityImageURL || '',
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInupts.title,
      body: textInupts.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    setloading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      router.back();
    } catch (error) {
      console.log(error);
      setError(true);
    }
    setloading(false);
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => {
          return (
            <>
              <TabItem
                key={item.title}
                item={item}
                selcted={item.title === selectedTab}
                setSelectedTab={setSelectedTab}
              />
            </>
          );
        })}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInput
            textInput={textInupts}
            handelCreatePost={handelCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Videos" && (
          <ImageUpload
            seletedFile={selectedFile}
            onselectImage={onSelectFile}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostFrom;
